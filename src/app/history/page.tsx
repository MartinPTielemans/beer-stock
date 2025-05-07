"use client";

import { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import Link from "next/link";
import { PriceChart } from "@/components/PriceChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, HomeIcon, Clock } from "lucide-react";

// Helper function to format timestamp strings
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString();
}

export default function History() {
  const { products, priceHistory } = useProducts();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-3">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Price History</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-xl">
              <Clock className="mr-2 h-5 w-5" />
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="flex gap-2">
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
              <Button
                variant="outline"
                asChild
                className="text-white border-white hover:bg-blue-600"
              >
                <Link href="/bartender">Staff Portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => {
            const history = priceHistory[product.id] || [];
            const hasHistory = history.length > 1; // More than just the initial record

            return (
              <Card key={product.id} className="mb-4">
                <CardHeader className="pb-3 bg-blue-50">
                  <CardTitle className="text-lg text-blue-700">
                    {product.name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Base price: ${product.basePrice.toFixed(2)} | Current price:
                    ${product.currentPrice.toFixed(2)} | Total sales:{" "}
                    {product.salesCount}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {hasHistory ? (
                    <div className="space-y-4">
                      <PriceChart
                        productName={product.name}
                        priceHistory={history}
                      />

                      <Separator />

                      <div className="rounded-md border max-h-60 overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Time</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Sales Volume</TableHead>
                              <TableHead>Change</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {history.map((point, index) => {
                              // Calculate price change from previous point
                              const prevPoint =
                                index > 0 ? history[index - 1] : null;
                              const change = prevPoint
                                ? ((point.price - prevPoint.price) /
                                    prevPoint.price) *
                                  100
                                : 0;
                              const changeClass =
                                change > 0
                                  ? "text-green-600"
                                  : change < 0
                                  ? "text-red-600"
                                  : "text-muted-foreground";

                              // Determine if this was a market fluctuation or a sale
                              const isMarketFluctuation =
                                !point.timestamp.startsWith("Sales:");

                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    {formatTime(point.timestamp)}
                                  </TableCell>
                                  <TableCell>
                                    ${point.price.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {isMarketFluctuation ? (
                                      <span className="text-blue-500 text-xs italic">
                                        Market Fluctuation
                                      </span>
                                    ) : (
                                      point.salesVolume
                                    )}
                                  </TableCell>
                                  <TableCell className={changeClass}>
                                    {change !== 0 && (
                                      <span className="flex items-center">
                                        {change > 0 ? (
                                          <ArrowUp className="mr-1 h-4 w-4" />
                                        ) : (
                                          <ArrowDown className="mr-1 h-4 w-4" />
                                        )}
                                        {Math.abs(change).toFixed(2)}%
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-muted-foreground italic">
                      No price changes recorded yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
