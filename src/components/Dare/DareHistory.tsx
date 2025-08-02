import React, { useState, useEffect } from 'react';
import { Calendar, Eye, MessageSquare, Heart, Clock, Trophy, TrendingUp, Filter } from 'lucide-react';
import { Dare } from '../../types';

interface DareHistoryProps {
  streamerId: string;
}

export const DareHistory: React.FC<DareHistoryProps> = ({ streamerId }) => {
  const [dares, setDares] = useState<Dare[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data for demonstration
  useEffect(() => {
    const mockCompletedDares: Dare[] = [
      {
        id: '1',
        title: 'Ice Bath Challenge',
        description: 'Stay in ice bath for 5 minutes straight',
        difficulty: 'extreme',
        cost: 500,
        votes: 45,
        status: 'completed',
        created_by: 'user1',
        created_by_username: 'DareKing',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        completed_at: new Date(Date.now() - 82800000).toISOString(),
        completion_time: 300, // 5 minutes
        category: 'physical',
        total_contributions: 750,
        engagement_stats: {
          views: 2847,
          reactions: 156,
          chat_messages: 892
        }
      },
      {
        id: '2',
        title: 'Spicy Noodle Challenge',
        description: 'Eat the spiciest ramen without drinking anything',
        difficulty: 'wild',
        cost: 250,
        votes: 32,
        status: 'completed',
        created_by: 'user2',
        created_by_username: 'HeatLover',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        completed_at: new Date(Date.now() - 172200000).toISOString(),
        completion_time: 180, // 3 minutes
        category: 'food',
        total_contributions: 350,
        engagement_stats: {
          views: 1923,
          reactions: 89,
          chat_messages: 445
        }
      },
      {
        id: '3',
        title: 'Memory Challenge',
        description: 'Memorize and recite 50 random words',
        difficulty: 'mild',
        cost: 150,
        votes: 28,
        status: 'completed',
        created_by: 'user3',
        created_by_username: 'BrainPower',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        completed_at: new Date(Date.now() - 258600000).toISOString(),
        completion_time: 420, // 7 minutes
        category: 'mental',
        total_contributions: 200,
        engagement_stats: {
          views: 1456,
          reactions: 67,
          chat_messages: 234
        }
      }
    ];
    setDares(mockCompletedDares);
  }, [streamerId]);

  const periods = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'earnings', label: 'Highest Earnings' },
    { value: 'engagement', label: 'Best Engagement' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'mild': return 'text-green-400 bg-green-400/10';
      case 'wild': return 'text-orange-400 bg-orange-400/10';
      case 'extreme': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredAndSortedDares = dares
    .filter(dare => {
      if (selectedPeriod === 'all') return true;
      const dareDate = new Date(dare.completed_at || dare.created_at);
      const now = new Date();
      
      switch (selectedPeriod) {
        case 'week':
          return dareDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return dareDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case 'year':
          return dareDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime();
        case 'popular':
          return b.votes - a.votes;
        case 'earnings':
          return (b.total_contributions || 0) - (a.total_contributions || 0);
        case 'engagement':
          return (b.engagement_stats?.views || 0) - (a.engagement_stats?.views || 0);
        default:
          return 0;
      }
    });

  // Calculate stats
  const totalEarnings = dares.reduce((sum, dare) => sum + (dare.total_contributions || 0), 0);
  const totalViews = dares.reduce((sum, dare) => sum + (dare.engagement_stats?.views || 0), 0);
  const averageCompletion = dares.length > 0 
    ? dares.reduce((sum, dare) => sum + (dare.completion_time || 0), 0) / dares.length 
    : 0;

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-white">Dare History</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{dares.length}</div>
          <div className="text-sm text-gray-400">Completed Dares</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{totalEarnings.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Earnings</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{totalViews.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Views</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{formatDuration(Math.round(averageCompletion))}</div>
          <div className="text-sm text-gray-400">Avg. Completion</div>
        </div>
      </div>

      {/* Dare List */}
      <div className="space-y-4">
        {filteredAndSortedDares.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <div className="text-lg mb-2">No completed dares</div>
            <p className="text-sm">Complete some dares to see your history here!</p>
          </div>
        ) : (
          filteredAndSortedDares.map(dare => (
            <div key={dare.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-bold text-lg">{dare.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(dare.difficulty)}`}>
                      {dare.difficulty.toUpperCase()}
                    </span>
                    <div className="flex items-center text-green-400 text-sm">
                      <Trophy className="w-4 h-4 mr-1" />
                      COMPLETED
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3">{dare.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {dare.completed_at && new Date(dare.completed_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {dare.completion_time && formatDuration(dare.completion_time)}
                    </div>
                    <span>By {dare.created_by_username}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-yellow-400 mb-1">
                    {dare.total_contributions?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs text-gray-400">tokens earned</div>
                </div>
              </div>

              {/* Engagement Stats */}
              {dare.engagement_stats && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {dare.engagement_stats.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {dare.engagement_stats.reactions} reactions
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {dare.engagement_stats.chat_messages} messages
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {dare.votes} votes
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};