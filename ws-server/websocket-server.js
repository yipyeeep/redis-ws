const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('listening', () => {
  console.log('Server started on ws://localhost:8080');
});

wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send('Hello from WebSocket!');
  });
});

console.log('Attempting to start...');