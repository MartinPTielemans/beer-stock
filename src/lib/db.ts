import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { websocketSync } from './websocket-sync';

export interface BeerItem {
  id: string;
  name: string;
  currentPrice: number;
  basePrice: number;
  priceHistory: PricePoint[];
  purchases: number;
  pendingPurchases: number; // Track purchases since last update
  lastPurchased: number | null; // Track when this item was last purchased
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

// Predefined beer items
export const PREDEFINED_ITEMS = [
  { name: 'Grøn', basePrice: 15 },
  { name: 'Classic', basePrice: 18 },
  { name: 'Drink', basePrice: 25 },
  { name: 'Sodavand', basePrice: 12 },
  { name: 'Drinkskande', basePrice: 80 },
  { name: 'Shot', basePrice: 10 }
];

interface BeerStockState {
  beers: BeerItem[];
  lastUpdate: number;
  initializePredefinedItems: () => void;
  removeBeer: (id: string) => void;
  recordPurchase: (id: string) => void;
  updatePrices: () => void;
  resetPrices: () => void;
  [key: string]: unknown; // Add index signature to satisfy BeerState
}

// Price adjustment constants
const PRICE_DECAY_RATE = 0.98; // 2% decrease when not purchased
const PRICE_INCREASE_RATE = 1.05; // 5% increase when purchased
const MIN_PRICE_FACTOR = 0.5; // Minimum price is 50% of base price
const MAX_PRICE_FACTOR = 2.0; // Maximum price is 200% of base price

export const useBeerStore = create<BeerStockState>()(
  persist(
    (set, get) => {
      // Store the updatePrices function reference
      let updatePricesFn: (() => void) | null = null;
      
      // Initialize WebSocket sync
      if (typeof window !== 'undefined') {
        // Listen for state updates from other clients
        websocketSync.onStateUpdate((state) => {
          set({
            beers: state.beers,
            lastUpdate: state.lastUpdate
          });
        });
        
        // Listen for actions from other clients
        websocketSync.onAction((action) => {
          if (action === 'UPDATE_PRICES' && updatePricesFn) {
            updatePricesFn();
          }
        });
      }
      
      const state = {
        beers: [],
        lastUpdate: Date.now(),
        
        initializePredefinedItems: () => set((state: BeerStockState) => {
          // Only add items that don't already exist (by name)
          const existingNames = new Set(state.beers.map(beer => beer.name));
          const now = Date.now();
          const newBeers = PREDEFINED_ITEMS
            .filter(item => !existingNames.has(item.name))
            .map(item => ({
              id: crypto.randomUUID(),
              name: item.name,
              currentPrice: item.basePrice,
              basePrice: item.basePrice,
              priceHistory: [{ timestamp: now, price: item.basePrice }],
              purchases: 0,
              pendingPurchases: 0,
              lastPurchased: null,
            }));

          const result = { 
            beers: [...state.beers, ...newBeers],
            lastUpdate: now
          };
          
          // Broadcast state to other clients
          if (typeof window !== 'undefined') {
            setTimeout(() => websocketSync.sendStateUpdate(get()), 0);
          }
          
          return result;
        }),
        
        removeBeer: (id: string) => set((state: BeerStockState) => {
          const result = {
            beers: state.beers.filter((beer) => beer.id !== id),
          };
          
          // Broadcast state to other clients
          if (typeof window !== 'undefined') {
            setTimeout(() => websocketSync.sendStateUpdate(get()), 0);
          }
          
          return result;
        }),
        
        // Only track purchases, don't update prices immediately
        recordPurchase: (id: string) => set((state: BeerStockState) => {
          const now = Date.now();
          
          const result = {
            beers: state.beers.map((beer) => {
              if (beer.id === id) {
                return {
                  ...beer,
                  pendingPurchases: beer.pendingPurchases + 1,
                  lastPurchased: now,
                };
              }
              return beer;
            })
          };
          
          // Broadcast state to other clients
          if (typeof window !== 'undefined') {
            setTimeout(() => websocketSync.sendStateUpdate(get()), 0);
          }
          
          return result;
        }),
        
        // Update prices on timer, applying all pending purchases
        updatePrices: () => set((state: BeerStockState) => {
          const now = Date.now();
          
          const result = {
            lastUpdate: now,
            beers: state.beers.map((beer) => {
              let newPrice = beer.currentPrice;
              
              // Apply price increase for any pending purchases
              if (beer.pendingPurchases > 0) {
                // Apply price increase multiplier for each pending purchase
                for (let i = 0; i < beer.pendingPurchases; i++) {
                  newPrice = Math.min(
                    newPrice * PRICE_INCREASE_RATE,
                    beer.basePrice * MAX_PRICE_FACTOR
                  );
                }
              } else {
                // Decrease price if no pending purchases
                newPrice = Math.max(
                  newPrice * PRICE_DECAY_RATE,
                  beer.basePrice * MIN_PRICE_FACTOR
                );
              }
              
              return {
                ...beer,
                currentPrice: newPrice,
                purchases: beer.purchases + beer.pendingPurchases,
                pendingPurchases: 0, // Reset pending purchases
                priceHistory: [
                  ...beer.priceHistory,
                  { timestamp: now, price: newPrice }
                ]
              };
            })
          };
          
          // Broadcast state to other clients
          if (typeof window !== 'undefined') {
            setTimeout(() => websocketSync.sendStateUpdate(get()), 0);
          }
          
          return result;
        }),

        resetPrices: () => set((state: BeerStockState) => {
          const now = Date.now();
          
          const result = {
            lastUpdate: now,
            beers: state.beers.map((beer) => {
              return {
                ...beer,
                currentPrice: beer.basePrice,
                purchases: 0,
                pendingPurchases: 0,
                lastPurchased: null,
                priceHistory: [
                  ...beer.priceHistory,
                  { timestamp: now, price: beer.basePrice }
                ]
              };
            })
          };
          
          // Broadcast state to other clients
          if (typeof window !== 'undefined') {
            setTimeout(() => websocketSync.sendStateUpdate(get()), 0);
          }
          
          return result;
        }),
      };
      
      // Save reference to updatePrices
      updatePricesFn = state.updatePrices;
      
      return state;
    },
    {
      name: 'beer-stock-storage',
    }
  )
); 