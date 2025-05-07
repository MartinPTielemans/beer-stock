import { BeerItem } from './db';

// Types for WebSocket messages
interface WebSocketMessage {
  type: 'stateUpdate' | 'action' | 'initialState';
  data: BeerState | string;
}

// State interface
export interface BeerState {
  beers: BeerItem[];
  lastUpdate: number;
}

// Callbacks for handling state changes and actions
type StateUpdateCallback = (state: BeerState) => void;
type ActionCallback = (action: string) => void;

// WebSocket client singleton
class WebSocketSyncClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private reconnectTimeout: number | null = null;
  private stateUpdateCallbacks: StateUpdateCallback[] = [];
  private actionCallbacks: ActionCallback[] = [];
  private isConnected: boolean = false;

  constructor(url: string = 'ws://localhost:3001', reconnectInterval: number = 3000) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
  }

  // Connect to the WebSocket server
  connect() {
    if (this.ws) {
      return; // Already connected
    }

    try {
      console.log('Connecting to WebSocket server...');
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.isConnected = true;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          this.handleMessage(message);
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnected = false;
        this.ws = null;

        // Schedule reconnect
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = window.setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
          }, this.reconnectInterval);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.close();
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  // Close the WebSocket connection
  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  // Schedule a reconnect attempt
  private scheduleReconnect() {
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = window.setTimeout(() => {
        this.reconnectTimeout = null;
        this.connect();
      }, this.reconnectInterval);
    }
  }

  // Handle received messages
  private handleMessage(message: WebSocketMessage) {
    if (message.type === 'stateUpdate' || message.type === 'initialState') {
      const state = message.data as BeerState;
      this.stateUpdateCallbacks.forEach(callback => callback(state));
    } else if (message.type === 'action') {
      const action = message.data as string;
      this.actionCallbacks.forEach(callback => callback(action));
    }
  }

  // Send a state update to the server
  sendStateUpdate(state: BeerState) {
    if (!this.isConnected || !this.ws) {
      this.connect();
      setTimeout(() => this.sendStateUpdate(state), 500);
      return;
    }

    try {
      this.ws.send(JSON.stringify({
        type: 'stateUpdate',
        data: state
      }));
    } catch (error) {
      console.error('Error sending state update:', error);
    }
  }

  // Send an action to the server
  sendAction(action: string) {
    if (!this.isConnected || !this.ws) {
      this.connect();
      setTimeout(() => this.sendAction(action), 500);
      return;
    }

    try {
      this.ws.send(JSON.stringify({
        type: 'action',
        data: action
      }));
    } catch (error) {
      console.error('Error sending action:', error);
    }
  }

  // Register a callback for state updates
  onStateUpdate(callback: StateUpdateCallback) {
    this.stateUpdateCallbacks.push(callback);
  }

  // Register a callback for actions
  onAction(callback: ActionCallback) {
    this.actionCallbacks.push(callback);
  }
}

// Create a singleton instance
export const websocketSync = new WebSocketSyncClient();

// Initialize when in browser
if (typeof window !== 'undefined') {
  // Connect on load
  window.addEventListener('load', () => {
    websocketSync.connect();
  });

  // Reconnect on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      websocketSync.connect();
    }
  });
} 