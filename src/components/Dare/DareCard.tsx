import React from 'react';
import { ArrowUp, Coins, Flame } from 'lucide-react';
import { Dare } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';

interface DareCardProps {
  dare: Dare;
  onVote: (dareId: string) => void;
}

export const DareCard: React.FC<DareCardProps> = ({ dare, onVote }) => {
  const { user } = useAuthStore();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-orange-600';
      case 'extreme': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : difficulty === 'hard' ? 3 : 4;
    return Array.from({ length: count }, (_, i) => (
      <Flame key={i} className="w-3 h-3 text-orange-500" />
    ));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-2">{dare.title}</h3>
          <p className="text-gray-300 text-sm mb-3">{dare.description}</p>
        </div>
        
        <div className={`${getDifficultyColor(dare.difficulty)} text-white px-3 py-1 rounded-full text-xs font-bold uppercase ml-4`}>
          {dare.difficulty}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-white font-semibold">${dare.cost}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {getDifficultyIcon(dare.difficulty)}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-gray-400">
            <ArrowUp className="w-4 h-4" />
            <span className="font-semibold">{dare.votes}</span>
          </div>
          
          {user && (
            <button
              onClick={() => onVote(dare.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Vote</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};