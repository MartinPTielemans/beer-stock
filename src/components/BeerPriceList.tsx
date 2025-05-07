"use client";

import { useBeerStore } from "@/lib/db";
import {
  formatPrice,
  formatPercentage,
  calculateChange,
  getPriceChangeColor,
  formatDateTime,
} from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MinusIcon,
  ClockIcon,
  PlusCircleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BeerPriceList() {
  const beers = useBeerStore((state) => state.beers);

  if (beers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No beers available</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>
        Current beer prices and purchases updated every 15 seconds
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Beer</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>Base Price</TableHead>
          <TableHead>Last Purchased</TableHead>
          <TableHead>Pending</TableHead>
          <TableHead className="text-right">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {beers.map((beer) => {
          const priceChange = calculateChange(
            beer.currentPrice,
            beer.basePrice
          );
          const changeColor = getPriceChangeColor(priceChange);

          // Calculate potential new price after pending purchases
          let projectedPrice = beer.currentPrice;
          if (beer.pendingPurchases > 0) {
            for (let i = 0; i < beer.pendingPurchases; i++) {
              projectedPrice = Math.min(
                projectedPrice * 1.05, // 5% increase per purchase
                beer.basePrice * 2.0 // Max 200% of base price
              );
            }
          } else {
            // If no pending purchases, it will drop by 2%
            projectedPrice = Math.max(
              projectedPrice * 0.98, // 2% decrease
              beer.basePrice * 0.5 // Min 50% of base price
            );
          }

          const projectedChange = calculateChange(
            projectedPrice,
            beer.currentPrice
          );
          const projectedColor = getPriceChangeColor(projectedChange);

          return (
            <TableRow key={beer.id}>
              <TableCell className="font-medium">{beer.name}</TableCell>
              <TableCell>{formatPrice(beer.currentPrice)}</TableCell>
              <TableCell>{formatPrice(beer.basePrice)}</TableCell>
              <TableCell>
                {beer.lastPurchased ? (
                  <div className="flex items-center gap-1 text-sm">
                    <ClockIcon className="h-3 w-3" />
                    {formatDateTime(beer.lastPurchased)}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Never</span>
                )}
              </TableCell>
              <TableCell>
                {beer.pendingPurchases > 0 ? (
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1"
                    >
                      <PlusCircleIcon className="h-3 w-3" />
                      {beer.pendingPurchases}
                      <span className={`ml-1 ${projectedColor}`}>
                        ({formatPercentage(Math.abs(projectedChange))})
                      </span>
                    </Badge>
                  </div>
                ) : null}
              </TableCell>
              <TableCell
                className={`text-right ${changeColor} flex items-center justify-end`}
              >
                {priceChange > 0 && <ArrowUpIcon className="mr-1 h-4 w-4" />}
                {priceChange < 0 && <ArrowDownIcon className="mr-1 h-4 w-4" />}
                {priceChange === 0 && <MinusIcon className="mr-1 h-4 w-4" />}
                {formatPercentage(Math.abs(priceChange))}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
