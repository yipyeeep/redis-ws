"use client"
import { useEffect, useState } from 'react';

type QuizEvent = {
  type: string;
  message?: string;
  timestamp?: string;
  user?: string;
};

export default function Home() {
  const [event, setEvent] = useState<QuizEvent | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (e) => {
      setEvent(JSON.parse(e.data));
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h1>KG Quiz Live Dashboard</h1>
      
      {event?.type === 'PONG' && (
        <div>
          <h3>Current Message:</h3>
          <p>{event.message}</p>
          <p>Timestamp: {event.timestamp}</p>
        </div>
      )}

      {event?.type === 'ANSWER_TIME' && (
        <div>
          <p>{event.user} guessed: {event.timestamp}</p>
        </div>
      )}
    </div>
  );
}