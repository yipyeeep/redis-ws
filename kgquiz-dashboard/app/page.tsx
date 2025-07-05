"use client"
import { useEffect, useState } from 'react';

type QuizEvent = {
  type: string;
  question?: string;
  answer?: string;
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
      
      {event?.type === 'QUESTION' && (
        <div>
          <h3>Current Question:</h3>
          <p>{event.question}</p>
          <p>Answer: {event.answer}</p>
        </div>
      )}

      {event?.type === 'ANSWER_ATTEMPT' && (
        <div>
          <p>{event.user} guessed: {event.answer}</p>
        </div>
      )}
    </div>
  );
}