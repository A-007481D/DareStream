import React, { useState, useRef, useEffect } from 'react';
import { Send, Skull } from 'lucide-react';
import { ChatMessage } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useStreamStore } from '../../store/useStreamStore';

interface ChatBoxProps {
  streamId: string;
  messages: ChatMessage[];
}

export const ChatBox: React.FC<ChatBoxProps> = ({ streamId, messages }) => {
  const [message, setMessage] = useState('');
  const [isPressuring, setIsPressuring] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { pressureMeter, increasePressure } = useStreamStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    // In a real app, this would send to Supabase
    console.log('Sending message:', message);
    setMessage('');
  };

  const handlePressure = () => {
    if (isPressuring) return;
    
    setIsPressuring(true);
    increasePressure();
    
    setTimeout(() => {
      setIsPressuring(false);
    }, 1000);
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'tip': return 'text-yellow-400';
      case 'pressure': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg h-96 flex flex-col">
      {/* Pressure Meter */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-medium">Pressure Meter</span>
          <span className="text-red-400 text-sm font-bold">{pressureMeter}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${pressureMeter}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm">
            <span className="text-blue-400 font-medium">{msg.username}:</span>
            <span className={`ml-2 ${getMessageTypeColor(msg.type)}`}>
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {user && (
        <div className="p-3 border-t border-gray-700">
          <div className="flex space-x-2 mb-2">
            <button
              onClick={handlePressure}
              disabled={isPressuring}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isPressuring 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                <Skull className="w-4 h-4" />
                <span>PRESSURE</span>
              </div>
            </button>
          </div>
          
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};