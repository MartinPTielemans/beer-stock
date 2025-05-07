"use client";

import { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HomeIcon, RefreshCcw, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Bartender() {
  const { products, recordSale, resetSales } = useProducts();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // State to track recently sold items
  const [recentSales, setRecentSales] = useState<
    Array<{ id: string; name: string; time: Date }>
  >([]);

  // Handle recording a sale
  const handleSale = (productId: string, productName: string) => {
    recordSale(productId);

    // Add to recent sales list
    setRecentSales((prev) => [
      { id: productId, name: productName, time: new Date() },
      ...prev.slice(0, 9), // Keep only last 10 sales
    ]);
  };

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
            <h1 className="text-3xl font-bold">Staff Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-xl">
              <Clock className="mr-2 h-5 w-5" />
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <Button
              variant="outline"
              asChild
              className="text-white border-white hover:bg-blue-600"
            >
              <Link href="/display">
                <HomeIcon className="mr-2 h-4 w-4" />
                Customer View
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {categories.map((category) => (
              <div
                key={category}
                className="mb-4 bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center mb-3">
                  <h3 className="text-xl font-medium capitalize text-blue-700">
                    {category}
                  </h3>
                  <Separator className="ml-4 flex-1" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {productsByCategory[category].map((product) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      size="lg"
                      className="h-auto py-3 flex flex-col items-center justify-center text-center hover:bg-blue-50"
                      onClick={() => handleSale(product.id, product.name)}
                    >
                      <span className="font-semibold">{product.name}</span>
                      <span className="text-sm mt-1">
                        ${product.currentPrice.toFixed(2)}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2 bg-blue-50">
                <CardTitle className="text-lg text-blue-700">
                  Recent Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {recentSales.length > 0 ? (
                  <div className="space-y-2">
                    {recentSales.map((sale, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <span>{sale.name}</span>
                        <Badge variant="outline">
                          {sale.time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No recent sales recorded
                  </p>
                )}

                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={resetSales}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset All Prices
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
