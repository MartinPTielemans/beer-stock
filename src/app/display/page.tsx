"use client";

import { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart, Clock } from "lucide-react";
import { CompactPriceChart } from "@/components/CompactPriceChart";

// Chart colors for different categories
const categoryColors = {
  beer: "#4f46e5", // Indigo
  wine: "#b91c1c", // Red
  cocktail: "#0369a1", // Blue
  shot: "#15803d", // Green
  "non-alcoholic": "#c2410c", // Orange
};

export default function Display() {
  const { products, priceHistory } = useProducts();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  // Get categories in a specific order
  const categories = [
    "beer",
    "wine",
    "cocktail",
    "shot",
    "non-alcoholic",
  ].filter((cat) => productsByCategory[cat]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-3">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Today&apos;s Prices</h1>
          </div>
          <div className="flex items-center text-xl">
            <Clock className="mr-2 h-5 w-5" />
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div key={category} className="mb-4">
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-medium capitalize text-blue-700">
                  {category}
                </h3>
                <Separator className="ml-4 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {productsByCategory[category].map((product) => {
                  // Calculate price change percentage
                  const priceChange =
                    ((product.currentPrice - product.basePrice) /
                      product.basePrice) *
                    100;
                  const priceChangeClass =
                    priceChange > 0
                      ? "text-green-600"
                      : priceChange < 0
                      ? "text-red-600"
                      : "text-gray-500";

                  // Get product's price history
                  const history = priceHistory[product.id] || [];
                  const hasHistory = history.length > 1;

                  // Get color for this category
                  const chartColor =
                    categoryColors[category as keyof typeof categoryColors] ||
                    "#8884d8";

                  return (
                    <Card
                      key={product.id}
                      className="overflow-hidden border border-gray-200"
                    >
                      <CardContent className="p-3">
                        <div className="mb-1 flex justify-between items-baseline">
                          <h4 className="font-medium text-sm">
                            {product.name}
                          </h4>
                          <span className={`text-xs ${priceChangeClass}`}>
                            {priceChange > 0 ? "+" : ""}
                            {priceChange.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <p className="text-2xl font-bold">
                            ${product.currentPrice.toFixed(2)}
                          </p>
                          <div className="text-xs text-gray-500">
                            ${product.basePrice.toFixed(2)}
                          </div>
                        </div>

                        {hasHistory && (
                          <div className="mt-2">
                            <CompactPriceChart
                              priceHistory={history}
                              color={chartColor}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-4 right-4 flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/history">
              <BarChart className="mr-2 h-4 w-4" />
              Price History
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/bartender">Staff Portal</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
