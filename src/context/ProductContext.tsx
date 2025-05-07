"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product, PriceHistoryPoint } from "../models/Product";
import { initialProducts } from "../data/mockData";
import {
  updateProductPrice,
  generateRandomFluctuation,
} from "../utils/pricingAlgorithm";

type ProductContextType = {
  products: Product[];
  recordSale: (productId: string) => void;
  resetSales: () => void;
  priceHistory: Record<string, PriceHistoryPoint[]>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [priceHistory, setPriceHistory] = useState<
    Record<string, PriceHistoryPoint[]>
  >({});

  // Initialize price history
  useEffect(() => {
    const initialHistory: Record<string, PriceHistoryPoint[]> = {};
    products.forEach((product) => {
      initialHistory[product.id] = [
        {
          timestamp: `Sales: ${product.salesCount}`,
          price: product.currentPrice,
          salesVolume: 0,
        },
      ];
    });
    setPriceHistory(initialHistory);
  }, []);

  // Automatic price fluctuations
  useEffect(() => {
    // Create random fluctuations every 15-30 seconds
    const fluctuationInterval = setInterval(() => {
      // Select a random product to update
      const randomIndex = Math.floor(Math.random() * products.length);

      // Apply random fluctuation
      setProducts((prevProducts) => {
        return prevProducts.map((product, index) => {
          if (index === randomIndex) {
            const updatedProduct = generateRandomFluctuation(product);

            // Record price history for the fluctuation
            setPriceHistory((prevHistory) => {
              const productHistory = prevHistory[product.id] || [];
              return {
                ...prevHistory,
                [product.id]: [
                  ...productHistory,
                  {
                    timestamp: updatedProduct.lastUpdated,
                    price: updatedProduct.currentPrice,
                    salesVolume: updatedProduct.salesCount,
                  },
                ],
              };
            });

            return updatedProduct;
          }
          return product;
        });
      });
    }, Math.random() * 1000); // Random time between 15-30 seconds

    return () => clearInterval(fluctuationInterval);
  }, []); // Empty dependency array to run only once

  function recordSale(productId: string) {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id === productId) {
          // Increment sales count
          const updatedProduct = {
            ...product,
            salesCount: product.salesCount + 1,
          };

          // Update price based on the new sales count
          const newProduct = updateProductPrice(updatedProduct);

          // Record price history
          setPriceHistory((prevHistory) => {
            const productHistory = prevHistory[productId] || [];
            return {
              ...prevHistory,
              [productId]: [
                ...productHistory,
                {
                  timestamp: newProduct.lastUpdated,
                  price: newProduct.currentPrice,
                  salesVolume: newProduct.salesCount,
                },
              ],
            };
          });

          return newProduct;
        }
        return product;
      });
    });
  }

  function resetSales() {
    setProducts(initialProducts);

    // Reset price history
    const initialHistory: Record<string, PriceHistoryPoint[]> = {};
    initialProducts.forEach((product) => {
      initialHistory[product.id] = [
        {
          timestamp: `Sales: ${product.salesCount}`,
          price: product.currentPrice,
          salesVolume: 0,
        },
      ];
    });
    setPriceHistory(initialHistory);
  }

  return (
    <ProductContext.Provider
      value={{ products, recordSale, resetSales, priceHistory }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
