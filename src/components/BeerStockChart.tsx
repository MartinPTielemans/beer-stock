"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useBeerStore } from "@/lib/db";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { useRegularPriceUpdate } from "@/hooks/useRegularPriceUpdate";

// Define types for the tooltip data
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-md">
        <p className="text-gray-500 dark:text-gray-300">
          {formatDateTime(label || 0)}
        </p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            style={{ color: entry.color }}
            className="font-medium"
          >
            {entry.name}: {formatPrice(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function BeerStockChart() {
  // Use the regular price update hook
  useRegularPriceUpdate();

  // Get beers from store
  const beers = useBeerStore((state) => state.beers);

  // Prepare data for the chart
  const chartData = useMemo(() => {
    if (beers.length === 0) return [];

    // Get all unique timestamps across all beers
    const allTimestamps = new Set<number>();
    beers.forEach((beer) => {
      beer.priceHistory.forEach((point) => {
        allTimestamps.add(point.timestamp);
      });
    });

    // Sort timestamps chronologically
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    // Create chart data points
    return sortedTimestamps.map((timestamp) => {
      const dataPoint: Record<string, number> = { timestamp };

      beers.forEach((beer) => {
        // Find the price at this timestamp, or use the most recent price before it
        const pricePoint = beer.priceHistory
          .filter((point) => point.timestamp <= timestamp)
          .sort((a, b) => b.timestamp - a.timestamp)[0];

        if (pricePoint) {
          dataPoint[beer.name] = pricePoint.price;
        }
      });

      return dataPoint;
    });
  }, [beers]);

  // Generate random colors for each beer
  const beerColors = useMemo(() => {
    return beers.reduce((colors, beer) => {
      // Generate a different color for each beer
      colors[beer.name] = `hsl(${Math.floor(Math.random() * 360)}, 80%, 45%)`;
      return colors;
    }, {} as Record<string, string>);
  }, [beers.map((beer) => beer.id).join(",")]);

  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          No beer data available
        </p>
      </div>
    );
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDateTime}
            minTickGap={60}
          />
          <YAxis
            tickFormatter={(value) => formatPrice(value).replace("$", "")}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {beers.map((beer) => (
            <Line
              key={beer.id}
              type="monotone"
              dataKey={beer.name}
              stroke={beerColors[beer.name]}
              dot={false}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
