const WebSocket = require('ws');
const redis = require('redis');

const wss = new WebSocket.Server({ port: 8080 });
const redisSubscriber = redis.createClient({ 
  socket: { host: 'localhost', port: 6379 } 
});

// Connect to Redis
redisSubscriber.connect().then(() => {
  console.log('Redis subscriber connected');
  redisSubscriber.subscribe('test_channel', (message) => {
    console.log('Redis ->', message);
    // Broadcast to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });
});

wss.on('connection', (ws) => {
  console.log('New dashboard client connected');
});