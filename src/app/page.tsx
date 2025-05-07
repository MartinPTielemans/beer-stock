"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BeerStockChart } from "@/components/BeerStockChart";
import { BeerPriceList } from "@/components/BeerPriceList";
import { UpdateTimer } from "@/components/UpdateTimer";
import { Button } from "@/components/ui/button";
import { useBeerStore } from "@/lib/db";

export default function Home() {
  const initializePredefinedItems = useBeerStore(
    (state) => state.initializePredefinedItems
  );

  // Initialize predefined items on first load
  useEffect(() => {
    initializePredefinedItems();
  }, [initializePredefinedItems]);

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Beer Stock Market</h1>
        <Link href="/bartender">
          <Button variant="outline">Bartender View</Button>
        </Link>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <UpdateTimer />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Live Beer Prices</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <BeerStockChart />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Current Prices</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <BeerPriceList />
        </div>
      </div>
    </main>
  );
}
