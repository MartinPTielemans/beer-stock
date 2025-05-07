import { Product } from "../models/Product";

/**
 * Calculates a new price based on recent sales volume
 * @param product The product to calculate new price for
 * @param recentSales Number of recent sales
 * @returns New calculated price
 */
export function calculateNewPrice(product: Product, recentSales: number): number {
  // Base volatility - how much the price can change
  const volatility = 0.1; // 10% maximum change
  
  // Calculate demand factor (-1 to 1 range)
  // Higher sales = positive value, lower sales = negative value
  const averageSalesThreshold = 5; // Threshold for what's considered "average" sales
  const demandFactor = Math.min(
    Math.max((recentSales - averageSalesThreshold) / averageSalesThreshold, -1), 
    1
  );
  
  // Calculate price adjustment percentage
  const priceAdjustment = demandFactor * volatility;
  
  // Calculate new price
  const newPrice = product.currentPrice * (1 + priceAdjustment);
  
  // Ensure price doesn't go below 50% or above 200% of base price
  const minPrice = product.basePrice * 0.5;
  const maxPrice = product.basePrice * 2.0;
  
  return Math.max(Math.min(newPrice, maxPrice), minPrice);
}

/**
 * Updates a product's price based on its sales count
 */
export function updateProductPrice(product: Product): Product {
  const newPrice = calculateNewPrice(product, product.salesCount);
  
  return {
    ...product,
    currentPrice: Number(newPrice.toFixed(2)),
    // Use a stable string that doesn't depend on runtime execution time
    lastUpdated: `Sales: ${product.salesCount}`,
  };
}

/**
 * Generates a random price fluctuation for market simulation
 * @param product The product to calculate random fluctuation for
 * @returns Product with updated price
 */
export function generateRandomFluctuation(product: Product): Product {
  // Different volatility based on product category
  let volatility = 0.04; // Default 4% maximum change
  
  // Make some categories more volatile than others
  switch (product.category) {
    case 'beer':
      volatility = 0.03; // Less volatile
      break;
    case 'cocktail':
      volatility = 0.05; // More volatile
      break;
    case 'shot':
      volatility = 0.07; // Most volatile
      break;
  }
  
  // Random fluctuation between -volatility and +volatility
  const randomFactor = (Math.random() * 2 - 1) * volatility;
  
  // Calculate new price
  let newPrice = product.currentPrice * (1 + randomFactor);
  
  // Ensure price doesn't go below 50% or above 200% of base price
  const minPrice = product.basePrice * 0.5;
  const maxPrice = product.basePrice * 2.0;
  newPrice = Math.max(Math.min(newPrice, maxPrice), minPrice);
  
  return {
    ...product,
    currentPrice: Number(newPrice.toFixed(2)),
    lastUpdated: new Date().toISOString(),
  };
} 