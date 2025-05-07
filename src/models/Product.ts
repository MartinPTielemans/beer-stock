export type Product = {
  id: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  salesCount: number;
  category: 'beer' | 'wine' | 'cocktail' | 'shot' | 'non-alcoholic';
  lastUpdated: string;
};

export type PriceHistoryPoint = {
  timestamp: string;
  price: number;
  salesVolume: number;
};

export type ProductWithHistory = Product & {
  priceHistory: PriceHistoryPoint[];
}; 