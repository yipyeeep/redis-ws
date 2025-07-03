"use client"

import Image from "next/image";
import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  // pages/index.js
  useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080'); // ← Match your server port

  ws.onopen = () => {
    console.log('Connected to WebSocket server!');
    ws.send('Hello from browser');
  };

  ws.onmessage = (e) => {
    console.log('Message from server:', e.data);
    setMessage(e.data);
  };

  ws.onerror = (e) => console.error('WebSocket error:', e);
}, []);

  return (
    <div>
      <h1>WebSocket Test</h1>
      <p>Last message: {message}</p>
    </div>
  );
}

