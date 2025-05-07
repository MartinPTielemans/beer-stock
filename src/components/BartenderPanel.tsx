"use client";

import { useBeerStore, PREDEFINED_ITEMS } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCwIcon, BeerIcon, TrashIcon, ZapIcon } from "lucide-react";
import { websocketSync } from "@/lib/websocket-sync";

export function BartenderPanel() {
  const {
    beers,
    initializePredefinedItems,
    recordPurchase,
    removeBeer,
    resetPrices,
    updatePrices,
  } = useBeerStore();

  // Function to force price update on all instances
  const handleForceUpdate = () => {
    // Update prices locally first
    updatePrices();

    // Broadcast action to update prices on all clients
    websocketSync.sendAction("UPDATE_PRICES");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Items</CardTitle>
          <CardDescription>
            Initialize or reset the predefined items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm mb-4">
            <p>
              Predefined items:{" "}
              {PREDEFINED_ITEMS.map((item) => item.name).join(", ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={initializePredefinedItems}>
              Initialize Predefined Items
            </Button>
            <Button onClick={resetPrices} variant="outline">
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Reset All Prices
            </Button>
            <Button onClick={handleForceUpdate} variant="default">
              <ZapIcon className="mr-2 h-4 w-4" />
              Force Update Prices
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Record Purchases</CardTitle>
          <CardDescription>
            Record purchases that will be processed and affect prices on the
            next 15-second update
          </CardDescription>
        </CardHeader>
        <CardContent>
          {beers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No items available. Please initialize the predefined items.
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>
                Purchases are stockpiled and processed every 15 seconds when the
                timer completes
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Total Purchases</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beers.map((beer) => (
                  <TableRow key={beer.id}>
                    <TableCell className="font-medium">{beer.name}</TableCell>
                    <TableCell>{formatPrice(beer.currentPrice)}</TableCell>
                    <TableCell>{formatPrice(beer.basePrice)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{beer.purchases}</Badge>
                    </TableCell>
                    <TableCell>
                      {beer.pendingPurchases > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        >
                          +{beer.pendingPurchases}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => recordPurchase(beer.id)}
                      >
                        <BeerIcon className="h-4 w-4 mr-1" />
                        Purchase
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeBeer(beer.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
