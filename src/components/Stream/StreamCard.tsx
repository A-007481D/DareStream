import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Users, Clock } from 'lucide-react';
import { Stream } from '../../types';

interface StreamCardProps {
  stream: Stream;
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  const getDifficultyColor = (mode: string) => {
    switch (mode) {
      case 'solo': return 'bg-blue-600';
      case 'battle': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Link to={`/stream/${stream.id}`} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500 transition-all duration-200">
        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">🎥</div>
          </div>
          
          {stream.status === 'live' && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
              LIVE
            </div>
          )}
          
          <div className={`absolute top-3 right-3 ${getDifficultyColor(stream.mode)} text-white px-2 py-1 rounded text-xs font-bold uppercase`}>
            {stream.mode}
          </div>
          
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{stream.viewer_count}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-red-400 transition-colors">
            {stream.title}
          </h3>
          
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{stream.viewer_count} viewers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(stream.created_at).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};