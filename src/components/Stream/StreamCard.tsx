import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, Play } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface StreamCardProps {
  stream: {
    id: string;
    title: string;
    performer_id: string;
    performer_name?: string;
    status: 'live' | 'waiting' | 'ended';
    viewer_count: number;
    created_at: string;
    mode: 'solo' | 'battle';
    thumbnail?: string;
    current_dare?: string;
    dare_amount?: number;
  };
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  return (
    <Link to={`/stream/${stream.id}`} className="group block cursor-pointer">
      <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-all duration-200 relative">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={stream.thumbnail}
            alt={stream.title}
            className="w-full h-full object-cover"
          />
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-3">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
          
          {/* Live indicator */}
          {stream.status === 'live' && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              LIVE
            </div>
          )}
          
          {/* Viewer count */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {stream.viewer_count.toLocaleString()}
          </div>
          
          {/* Dare amount */}
          {stream.dare_amount && (
            <div className="absolute bottom-2 right-2 bg-yellow-600 text-black px-2 py-1 rounded text-xs font-bold">
              ${stream.dare_amount}
            </div>
          )}
          
          {/* Mode indicator */}
          <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
            stream.mode === 'battle' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            {stream.mode.toUpperCase()}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
            {stream.title}
          </h3>
          
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span className="font-medium">{stream.performer_name || `User ${stream.performer_id}`}</span>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(stream.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          {stream.current_dare && (
            <div className="mt-2 text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded">
              💀 {stream.current_dare}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};