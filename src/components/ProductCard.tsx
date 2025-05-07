"use client";

import { Product } from "../models/Product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Calculate price change percentage
  const priceChange =
    ((product.currentPrice - product.basePrice) / product.basePrice) * 100;
  const priceChangeFormatted = priceChange.toFixed(2);

  // Determine CSS class based on price change
  const priceChangeClass =
    priceChange > 0
      ? "text-green-600"
      : priceChange < 0
      ? "text-red-600"
      : "text-gray-500";

  const PriceIcon =
    priceChange > 0 ? ArrowUp : priceChange < 0 ? ArrowDown : Minus;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 uppercase">
            {product.category}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex justify-between items-baseline mt-2">
          <div>
            <p className="text-2xl font-bold">
              ${product.currentPrice.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              Base: ${product.basePrice.toFixed(2)}
            </p>
          </div>

          <div
            className={cn("text-sm flex items-center gap-1", priceChangeClass)}
          >
            <PriceIcon className="h-4 w-4" />
            <span>{Math.abs(parseFloat(priceChangeFormatted))}%</span>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">
            Sales: {product.salesCount}
          </p>
          <p className="text-xs text-muted-foreground">
            Updates: {product.salesCount} sales recorded
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
