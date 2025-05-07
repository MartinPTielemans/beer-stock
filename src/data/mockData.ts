import { Product } from "../models/Product";

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Pilsner",
    basePrice: 5.00,
    currentPrice: 5.00,
    salesCount: 0,
    category: "beer",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "2",
    name: "IPA",
    basePrice: 6.50,
    currentPrice: 6.50,
    salesCount: 0,
    category: "beer",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "3",
    name: "Stout",
    basePrice: 7.00,
    currentPrice: 7.00,
    salesCount: 0,
    category: "beer",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "4",
    name: "House Wine",
    basePrice: 8.00,
    currentPrice: 8.00,
    salesCount: 0,
    category: "wine",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "5",
    name: "Margarita",
    basePrice: 10.00,
    currentPrice: 10.00,
    salesCount: 0,
    category: "cocktail",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "6",
    name: "Whiskey Shot",
    basePrice: 7.50,
    currentPrice: 7.50,
    salesCount: 0,
    category: "shot",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "7",
    name: "Soda",
    basePrice: 3.00,
    currentPrice: 3.00,
    salesCount: 0,
    category: "non-alcoholic",
    lastUpdated: new Date().toISOString()
  }
]; 