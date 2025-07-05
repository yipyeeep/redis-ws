const WebSocket = require('ws');
const redis = require('redis');

const wss = new WebSocket.Server({ port: 8080 });
const redisClient = redis.createClient();

// Connect to Redis
redisClient.connect().then(() => {
  console.log('Connected to Redis');
  redisClient.subscribe('kg_quiz', (message) => {
    // Broadcast Redis messages to all WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

wss.on('connection', (ws) => {
  console.log('New dashboard client connected');
});