import { useEffect, useRef } from 'react';
import { useBeerStore } from '@/lib/db';
import { websocketSync } from '@/lib/websocket-sync';

// Regular update interval
const UPDATE_INTERVAL = 15 * 1000; // 15 seconds

export function useRegularPriceUpdate() {
  const updatePrices = useBeerStore((state) => state.updatePrices);
  const lastUpdate = useBeerStore((state) => state.lastUpdate);
  const regularTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to update prices on this instance and all others
  const updateAllInstances = () => {
    // Update prices locally first
    updatePrices();
    
    // Send action to other clients
    websocketSync.sendAction('UPDATE_PRICES');
  };

  // Setup the regular timer that updates regardless of activity
  useEffect(() => {
    // Check if an update is due immediately
    const now = Date.now();
    if (now - lastUpdate >= UPDATE_INTERVAL) {
      updateAllInstances();
    }

    // Calculate time until next update
    const timeUntilNextUpdate = UPDATE_INTERVAL - ((now - lastUpdate) % UPDATE_INTERVAL);
    
    // Set up timer for the next update
    regularTimerRef.current = setTimeout(() => {
      updateAllInstances();
      
      // Set up regular interval for subsequent updates
      regularTimerRef.current = setInterval(updateAllInstances, UPDATE_INTERVAL);
    }, timeUntilNextUpdate);

    // Cleanup function
    return () => {
      if (regularTimerRef.current) {
        clearTimeout(regularTimerRef.current);
        clearInterval(regularTimerRef.current);
      }
    };
  }, [lastUpdate, updatePrices]);
} 