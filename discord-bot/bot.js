require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const redis = require('redis');

// Redis setup - Use environment variable for containerized deployment
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis error:', err));

// Quiz questions about KG
const KG_QUIZ = [
  { question: "What's KG's favorite movie?", answer: "Inception" },
  { question: "Where was KG born?", answer: "Berlin" }
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await redisClient.connect();
  console.log('Connected to Redis!');
});

client.on('messageCreate', async (message) => {
  // Debug: Log all messages to see what we're receiving
  console.log(`Received message: "${message.content}" from ${message.author.username}`);
  
  if (message.content === 'ping' || 'Ping' ) {
    console.log('Processing ping command...');
    await redisClient.publish('test_channel', JSON.stringify({
      type: 'PONG',
      message: 'PONG!',
      timestamp: Date.now()
    }));
    console.log('Published PONG to Redis');
  }

  // Command: !quiz - Post random question
  if (message.content === '!quiz') {
    const q = KG_QUIZ[Math.floor(Math.random() * KG_QUIZ.length)];
    message.reply(`**Quiz**: ${q.question}`);
    
    // Publish to Redis
    await redisClient.publish('test_channel', JSON.stringify({
      type: 'QUESTION',
      question: q.question,
      answer: q.answer
    }));
  }

  // Check answers
  if (message.content.startsWith('!answer')) {
    const userAnswer = message.content.split(' ')[1];
    
    // (Add answer validation later)
    await redisClient.publish('test_channel', JSON.stringify({
      type: 'ANSWER_ATTEMPT',
      user: message.author.username,
      answer: userAnswer
    }));
  }
});

client.login(process.env.BOT_TOKEN);