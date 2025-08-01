import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Smile } from 'lucide-react';
import { ChatMessage } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useStreamStore } from '../../store/useStreamStore';
import { Link } from 'react-router-dom';

interface ChatBoxProps {
  messages: ChatMessage[];
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const [message, setMessage] = useState('');
  const [isPressuring, setIsPressuring] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { pressureMeter, increasePressure } = useStreamStore();

  const quickEmojis = ['💀', '🔥', '😱', '💯', '⚡', '🤯', '👏', '❤️', '😂', '🙌'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

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

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'tip': return 'text-yellow-400';
      case 'pressure': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg h-[600px] flex flex-col relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-medium">Live Chat</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-400 text-sm">Pressure Level</span>
          <span className="text-red-400 text-sm font-bold">{pressureMeter}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${pressureMeter}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-red-400 font-medium text-xs">
                {msg.username}:
              </span>
              <span className={`${getMessageTypeColor(msg.type)} flex-1`}>
                {msg.message}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {user ? (
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handlePressure}
            disabled={isPressuring}
            className={`w-full mb-3 py-3 px-4 rounded-lg font-medium transition-colors ${
              isPressuring 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>ADD PRESSURE</span>
            </div>
          </button>
          
          {/* Quick Emoji Reactions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickEmojis.slice(0, 5).map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="text-lg hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex space-x-2 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 text-white px-3 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-4 bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-700 z-10">
              <div className="grid grid-cols-5 gap-2">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="text-lg hover:bg-gray-700 p-1 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm mb-3">Join the conversation!</p>
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};