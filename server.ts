import { serve, Server, ServerWebSocket } from "bun";

// In-memory store for the current state
interface BeerItem {
  id: string;
  name: string;
  currentPrice: number;
  basePrice: number;
  priceHistory: { timestamp: number; price: number }[];
  purchases: number;
  pendingPurchases: number;
  lastPurchased: number | null;
}

interface BeerState {
  beers: BeerItem[];
  lastUpdate: number;
}

// Initial state
let currentState: BeerState = {
  beers: [],
  lastUpdate: Date.now(),
};

// Type definitions for WebSocket messages
type WebSocketMessage = {
  type: 'stateUpdate' | 'action' | 'initialState';
  data: BeerState | string;
};

// Store connected clients
const clients = new Set<ServerWebSocket<{ id: string }>>();

// Create the server
const server = serve({
  port: Number(process.env.PORT) || 3001,
  fetch(req: Request, server: Server) {
    // Handle WebSocket connections
    const success = server.upgrade(req, {
      data: { id: crypto.randomUUID() }
    });

    if (success) {
      // WebSocket connection established
      return undefined;
    }

    // Return a simple response for HTTP requests
    return new Response("Beer Stock WebSocket Server", {
      headers: { "Content-Type": "text/plain" }
    });
  },
  websocket: {
    open(ws: ServerWebSocket<{ id: string }>) {
      // Add client to the set
      clients.add(ws);
      console.log(`Client connected: ${ws.data.id}`);
      
      // Send the current state to the new client
      ws.send(JSON.stringify({
        type: "initialState",
        data: currentState
      }));
    },
    message(ws: ServerWebSocket<{ id: string }>, message: string | Buffer) {
      try {
        // Parse the message
        const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
        
        if (parsedMessage.type === "stateUpdate") {
          // Update the current state
          currentState = parsedMessage.data as BeerState;
          console.log("State update received");
          
          // Broadcast to all other clients
          for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "stateUpdate",
                data: currentState
              }));
            }
          }
        } else if (parsedMessage.type === "action") {
          console.log("Action received:", parsedMessage.data);
          
          // Broadcast the action to all other clients
          for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "action",
                data: parsedMessage.data
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
    close(ws: ServerWebSocket<{ id: string }>) {
      // Remove client from the set
      clients.delete(ws);
      console.log(`Client disconnected: ${ws.data.id}`);
    }
  }
});

console.log(`WebSocket server running at http://localhost:${server.port}`); 