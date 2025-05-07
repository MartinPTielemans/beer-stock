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
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PriceChartProps {
  productName: string;
  priceHistory: PriceHistoryPoint[];
}

export function PriceChart({ productName, priceHistory }: PriceChartProps) {
  // Format the data for Recharts
  const chartData = priceHistory.map((point) => ({
    // Use timestamp directly since it's now a formatted string
    time: point.timestamp,
    price: point.price,
    sales: point.salesVolume,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{productName} Price Chart</CardTitle>
        <CardDescription>Price and sales volume over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                label={{
                  value: "Time",
                  position: "insideBottomRight",
                  offset: -10,
                }}
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Price ($)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Sales Volume",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                name="Price"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sales"
                stroke="#82ca9d"
                name="Sales Volume"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
