import React from 'react';
import { Trophy, Medal, Award, TrendingUp, Zap, Users } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const topPerformers = [
    {
      id: '1',
      username: 'DareDevil99',
      avatar: '🔥',
      completedDares: 127,
      totalEarnings: 2450,
      rank: 1,
      streak: 15,
    },
    {
      id: '2',
      username: 'ChallengeKing',
      avatar: '👑',
      completedDares: 98,
      totalEarnings: 1890,
      rank: 2,
      streak: 8,
    },
    {
      id: '3',
      username: 'FearlessStreamer',
      avatar: '⚡',
      completedDares: 89,
      totalEarnings: 1650,
      rank: 3,
      streak: 12,
    },
    {
      id: '4',
      username: 'ExtremeMaster',
      avatar: '🎯',
      completedDares: 76,
      totalEarnings: 1420,
      rank: 4,
      streak: 6,
    },
    {
      id: '5',
      username: 'WildCard',
      avatar: '🃏',
      completedDares: 65,
      totalEarnings: 1200,
      rank: 5,
      streak: 9,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{rank}</div>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-600/20 to-gray-500/20 border-gray-500/30';
      case 3:
        return 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-500/30';
      default:
        return 'bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-gray-400 text-lg">Top performers who conquered the most dares</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">15,247</h3>
            <p className="text-gray-400">Total Dares</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">3,892</h3>
            <p className="text-gray-400">Active Streamers</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <Zap className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">89%</h3>
            <p className="text-gray-400">Success Rate</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-black font-bold">
              $
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">$127K</h3>
            <p className="text-gray-400">Total Rewards</p>
          </div>
        </div>

        {/* Leaderboard Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="bg-red-600 text-white px-6 py-2 rounded-full font-medium">
            All Time
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            This Month
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            This Week
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            Today
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 2nd Place */}
          <div className="order-1 md:order-1">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 text-center border border-gray-600 h-64 flex flex-col justify-end">
              <div className="text-4xl mb-3">{topPerformers[1].avatar}</div>
              <h3 className="text-xl font-bold text-white mb-2">{topPerformers[1].username}</h3>
              <div className="flex items-center justify-center mb-2">
                <Medal className="w-6 h-6 text-gray-400 mr-2" />
                <span className="text-gray-300 font-semibold">2nd Place</span>
              </div>
              <p className="text-gray-400">${topPerformers[1].totalEarnings} earned</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="order-2 md:order-2">
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-500/20 rounded-lg p-6 text-center border border-yellow-500/30 h-80 flex flex-col justify-end">
              <div className="text-6xl mb-4">{topPerformers[0].avatar}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{topPerformers[0].username}</h3>
              <div className="flex items-center justify-center mb-3">
                <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
                <span className="text-yellow-400 font-bold text-lg">Champion</span>
              </div>
              <p className="text-gray-300 text-lg font-semibold">${topPerformers[0].totalEarnings} earned</p>
              <p className="text-yellow-400 text-sm">{topPerformers[0].streak} dare streak!</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 md:order-3">
            <div className="bg-gradient-to-br from-orange-700 to-orange-800 rounded-lg p-6 text-center border border-orange-600 h-64 flex flex-col justify-end">
              <div className="text-4xl mb-3">{topPerformers[2].avatar}</div>
              <h3 className="text-xl font-bold text-white mb-2">{topPerformers[2].username}</h3>
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-orange-600 mr-2" />
                <span className="text-orange-300 font-semibold">3rd Place</span>
              </div>
              <p className="text-gray-400">${topPerformers[2].totalEarnings} earned</p>
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Top Performers</h2>
          </div>
          
          <div className="divide-y divide-gray-700">
            {topPerformers.map((performer) => (
              <div
                key={performer.id}
                className={`px-6 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors ${getRankBg(performer.rank)} border-l-4`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(performer.rank)}
                    <div className="text-3xl">{performer.avatar}</div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white">{performer.username}</h3>
                    <p className="text-gray-400 text-sm">{performer.completedDares} dares completed</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-white">${performer.totalEarnings}</div>
                  <div className="text-sm text-gray-400">{performer.streak} streak</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};