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
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { pressureMeter, increasePressure } = useStreamStore();

  const quickEmojis = ['💀', '🔥', '😱', '💯', '⚡', '🤯', '👏', '❤️', '😂', '🙌'];
  const dareReactions = ['🔥', '💀', '😱', '💯', '⚡', '🤯', '👏', '❤️'];

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

  const handleDareReaction = (emoji: string) => {
    if (!user) return;
    
    setSelectedReaction(emoji);
    console.log('Dare reaction:', emoji);
    
    // Reset after animation
    setTimeout(() => {
      setSelectedReaction(null);
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
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-700 flex-shrink-0">
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

      {/* Dare Reactions */}
      <div className="p-3 sm:p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300 text-xs sm:text-sm font-medium">Quick Reactions</span>
          <span className="text-xs text-gray-500 hidden sm:inline">React to dare</span>
        </div>
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {dareReactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleDareReaction(emoji)}
              disabled={!user}
              className={`p-1 sm:p-2 rounded-lg text-lg sm:text-xl transition-all hover:scale-110 ${
                selectedReaction === emoji 
                  ? 'bg-red-600 scale-110' 
                  : user 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-800 opacity-50 cursor-not-allowed'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 min-h-0">
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
        <div className="p-3 sm:p-4 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={handlePressure}
            disabled={isPressuring}
            className={`w-full mb-2 sm:mb-3 py-2 sm:py-3 px-4 rounded-lg font-medium transition-colors ${
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
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
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
          
          <form onSubmit={handleSendMessage} className="flex space-x-1 sm:space-x-2 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 text-white px-2 sm:px-3 py-2 pr-8 sm:pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </form>
          
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 sm:bottom-20 right-2 sm:right-4 bg-gray-800 rounded-lg p-2 sm:p-3 shadow-lg border border-gray-700 z-10">
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
        <div className="p-3 sm:p-4 border-t border-gray-700 text-center flex-shrink-0">
          <p className="text-gray-400 text-sm mb-3">Join the conversation!</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Link
              to="/login"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors text-center"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};