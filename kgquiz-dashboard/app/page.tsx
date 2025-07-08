"use client";
import { useEffect, useState } from 'react';
import  io, { Socket }  from 'socket.io-client';

type QuizEvent = {
  type: string;
  message?: string;
  question?: string;
  answer?: string;
  user?: string;
  timestamp?: number;
};

export default function Home() {
  const [event, setEvent] = useState<QuizEvent | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [wsMessages, setWsMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<typeof Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io('http://localhost:8080', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
      setConnectionStatus('Connected');
      setWsMessages(prev => [...prev, 'Socket.IO connected']);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setConnectionStatus('Disconnected');
      setWsMessages(prev => [...prev, 'Socket.IO disconnected']);
    });

    newSocket.on('connect_error', (err: Error) => {
      console.error('Socket.IO error:', err);
      setConnectionStatus(`Error: ${err.message}`);
      setWsMessages(prev => [...prev, `Error: ${err.message}`]);
    });

    // Main event listener
    newSocket.on('quiz_event', (data: QuizEvent) => {
      console.log('Socket.IO message:', data);
      setEvent(data);
      setWsMessages(prev => [...prev, `Received: ${JSON.stringify(data)}`]);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>KG Quiz Live Dashboard</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Connection Status: {connectionStatus}</h3>
        {socket && (
          <p>Socket ID: {socket.id || 'Not connected'}</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px' }}>
          <h2>Current Event</h2>
          {event ? (
            <div>
              <pre>{JSON.stringify(event, null, 2)}</pre>
              {event.type === 'PONG' && (
                <div>
                  <h3>PONG Received!</h3>
                  <p>Message: {event.message}</p>
                  <p>Timestamp: {new Date(event.timestamp || 0).toLocaleString()}</p>
                </div>
              )}
              {event.type === 'QUESTION' && (
                <div>
                  <h3>New Question:</h3>
                  <p>{event.question}</p>
                  <p>Answer: {event.answer}</p>
                </div>
              )}
              {event.type === 'ANSWER_ATTEMPT' && (
                <div>
                  <h3>Answer Attempt:</h3>
                  <p>User: {event.user}</p>
                  <p>Answer: {event.answer}</p>
                </div>
              )}
            </div>
          ) : (
            <p>No events received yet</p>
          )}
        </div>

        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', maxHeight: '400px', overflowY: 'auto' }}>
          <h2>Socket.IO Messages</h2>
          {wsMessages.length > 0 ? (
            <ul>
              {wsMessages.map((msg, i) => (
                <li key={i} style={{ marginBottom: '5px', wordBreak: 'break-all' }}>
                  {msg}
                </li>
              ))}
            </ul>
          ) : (
            <p>No messages received yet</p>
          )}
        </div>
      </div>
    </div>
  );
}