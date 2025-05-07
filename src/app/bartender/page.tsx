"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BartenderPanel } from "@/components/BartenderPanel";
import { UpdateTimer } from "@/components/UpdateTimer";
import { useRegularPriceUpdate } from "@/hooks/useRegularPriceUpdate";

export default function BartenderPage() {
  // Use the regular price update hook to ensure updates happen on this page
  useRegularPriceUpdate();

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Beer Stock Market - Bartender View
        </h1>
        <Link href="/">
          <Button variant="outline">Customer View</Button>
        </Link>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <UpdateTimer />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <BartenderPanel />
      </div>
    </main>
  );
}
