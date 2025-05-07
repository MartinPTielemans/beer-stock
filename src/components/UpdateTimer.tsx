"use client";

import { useState, useEffect } from "react";
import { useBeerStore } from "@/lib/db";
import { Progress } from "@/components/ui/progress";

// Regular update interval
const UPDATE_INTERVAL = 15 * 1000; // 15 seconds

export function UpdateTimer() {
  const lastUpdate = useBeerStore((state) => state.lastUpdate);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  // Update the regular timer
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - lastUpdate;
      const remaining = Math.max(
        0,
        UPDATE_INTERVAL - (elapsed % UPDATE_INTERVAL)
      );

      setTimeLeft(Math.ceil(remaining / 1000));
      setProgress(((UPDATE_INTERVAL - remaining) / UPDATE_INTERVAL) * 100);
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [lastUpdate]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Next price update in:</span>
        <span className="font-medium">{timeLeft} seconds</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
