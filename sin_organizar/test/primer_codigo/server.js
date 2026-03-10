const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// Create an HTTP server that both Express and the WebSocket server can use
const server = http.createServer(app);

// Initialize the WebSocket server with the same HTTP server instance
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', ws => {
  console.log('Client connected (WebSocket)');

  // Listen for messages from clients
  ws.on('message', message => {
    console.log(`Received message: ${message}`);
    // Echo the message back to the client
    ws.send(`Server received: ${message}`);
  });

  // Handle disconnections
  ws.on('close', () => {
    console.log('Client disconnected (WebSocket)');
  });
});

// Middleware and RESTful routes (from Step 2)
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'Running with WS support',
    timestamp: new Date().toISOString()
  });
});

// Start the combined server (Express and WS)
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

