import React, { useState, useEffect } from 'react';

interface Reaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
}

export const StreamReactions: React.FC = () => {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const emojis = ['💀', '🔥', '😱', '💯', '⚡', '🤯', '👏', '❤️'];

  const addReaction = (emoji: string) => {
    const newReaction: Reaction = {
      id: Math.random().toString(36).substr(2, 9),
      emoji,
      x: Math.random() * 80 + 10, // 10% to 90% from left
      y: Math.random() * 60 + 20, // 20% to 80% from top
      timestamp: Date.now(),
    };

    setReactions(prev => [...prev, newReaction]);

    // Remove reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);
  };

  // Simulate random reactions for demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 2 seconds
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        addReaction(randomEmoji);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {reactions.map((reaction) => (
        <div
          key={reaction.id}
          className="absolute text-3xl animate-bounce"
          style={{
            left: `${reaction.x}%`,
            top: `${reaction.y}%`,
            animation: 'float-up 3s ease-out forwards',
          }}
        >
          {reaction.emoji}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};