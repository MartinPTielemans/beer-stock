const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// In-memory store for the current state
let currentState = {
  beers: [],
  lastUpdate: Date.now(),
};

app.prepare().then(() => {
  const expressApp = express();
  const server = http.createServer(expressApp);

  // Create Socket.io server with CORS enabled
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Send current state to newly connected clients
    socket.emit("initialState", currentState);

    // Handle state updates from clients
    socket.on("stateUpdate", (data) => {
      console.log("State update received");
      currentState = data;
      // Broadcast to all clients except sender
      socket.broadcast.emit("stateUpdate", data);
    });

    // Handle action broadcasts
    socket.on("action", (action) => {
      console.log("Action received:", action);
      // Broadcast the action to all clients except sender
      socket.broadcast.emit("action", action);
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Handle Next.js requests
  expressApp.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
