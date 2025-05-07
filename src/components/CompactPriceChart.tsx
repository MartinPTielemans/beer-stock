"use client";

import { PriceHistoryPoint } from "@/models/Product";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CompactPriceChartProps {
  priceHistory: PriceHistoryPoint[];
  color?: string;
}

export function CompactPriceChart({
  priceHistory,
  color = "#8884d8",
}: CompactPriceChartProps) {
  // Filter to just the last 10 points to keep charts clean
  const chartData = priceHistory.slice(-10).map((point) => ({
    time:
      typeof point.timestamp === "string"
        ? point.timestamp.startsWith("Sales:")
          ? `Sale ${point.salesVolume}`
          : new Date(point.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
        : "",
    price: point.price,
  }));

  return (
    <div className="h-[150px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            interval={chartData.length > 5 ? 1 : 0}
            height={30}
          />
          <YAxis
            hide={false}
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
            tick={{ fontSize: 10 }}
            width={30}
          />
          <Tooltip
            contentStyle={{ fontSize: "12px" }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
