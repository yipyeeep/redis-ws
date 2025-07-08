"use client"
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('Connected');
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setEvent(data);
        setWsMessages(prev => [...prev, `Received: ${e.data}`]);
        console.log('WebSocket message:', data);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
        setWsMessages(prev => [...prev, `Error: ${e.data}`]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('Disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>KG Quiz Live Dashboard</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Connection Status: {connectionStatus}</h3>
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
          <h2>WebSocket Messages</h2>
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