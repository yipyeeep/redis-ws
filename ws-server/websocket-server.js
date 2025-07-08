const { Server } = require('socket.io');
const redis = require('redis');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"]
  }
});

const redisSubscriber = redis.createClient({ 
  socket: { host: 'localhost', port: 6379 } 
});

// Connect to Redis
redisSubscriber.connect().then(() => {
  console.log('Redis subscriber connected');

  redisSubscriber.subscribe('test_channel', (message) => {
    console.log('Redis ->', message);
    
    // Broadcast to all Socket.IO clients in 'dashboard' namespace
    io.emit('quiz_event', message);
  });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`New dashboard client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server (default to port 8080 or your preferred port)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});