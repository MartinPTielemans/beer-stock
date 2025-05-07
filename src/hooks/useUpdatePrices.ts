import { useEffect, useRef } from 'react';
import { useBeerStore } from '@/lib/db';

// Update interval in milliseconds (15 seconds for debugging)
const UPDATE_INTERVAL = 15 * 1000; // 15 seconds instead of 15 minutes

export function useUpdatePrices() {
  const updatePrices = useBeerStore((state) => state.updatePrices);
  const lastUpdate = useBeerStore((state) => state.lastUpdate);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if an update is due immediately (e.g. when returning after browser was closed)
    const now = Date.now();
    if (now - lastUpdate >= UPDATE_INTERVAL) {
      updatePrices();
    }

    // Calculate time until next update
    const timeUntilNextUpdate = UPDATE_INTERVAL - ((now - lastUpdate) % UPDATE_INTERVAL);
    
    // Set up timer for the next update
    timerRef.current = setTimeout(() => {
      updatePrices();
      
      // Set up regular interval for subsequent updates
      timerRef.current = setInterval(updatePrices, UPDATE_INTERVAL);
    }, timeUntilNextUpdate);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        clearInterval(timerRef.current);
      }
    };
  }, [lastUpdate, updatePrices]);
} 