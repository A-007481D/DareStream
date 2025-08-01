import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Zap, Users, Crown } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');

  const topPerformers = [
    {
      id: '1',
      username: 'DareDevil99',
      completedDares: 127,
      totalEarnings: 24500,
      rank: 1,
      streak: 15,
      successRate: 94,
    },
    {
      id: '2',
      username: 'ChallengeKing',
      completedDares: 98,
      totalEarnings: 18900,
      rank: 2,
      streak: 8,
      successRate: 91,
    },
    {
      id: '3',
      username: 'FearlessStreamer',
      completedDares: 89,
      totalEarnings: 16500,
      rank: 3,
      streak: 12,
      successRate: 88,
    },
    {
      id: '4',
      username: 'ExtremeMaster',
      completedDares: 76,
      totalEarnings: 14200,
      rank: 4,
      streak: 6,
      successRate: 85,
    },
    {
      id: '5',
      username: 'WildCard',
      completedDares: 65,
      totalEarnings: 12000,
      rank: 5,
      streak: 9,
      successRate: 82,
    },
  ];

  const periods = [
    { value: 'all-time', label: 'All Time' },
    { value: 'monthly', label: 'This Month' },
    { value: 'weekly', label: 'This Week' },
    { value: 'daily', label: 'Today' },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return (
          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {rank}
          </div>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 border-l-yellow-500';
      case 2:
        return 'bg-gradient-to-r from-gray-600/10 to-gray-500/10 border-l-gray-400';
      case 3:
        return 'bg-gradient-to-r from-orange-600/10 to-orange-500/10 border-l-orange-500';
      default:
        return 'bg-gray-900 border-l-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-gray-400 text-lg">Top performers who conquered the most dares</p>
        </div>

        {/* Period Selection */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-900 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">15,247</h3>
            <p className="text-gray-400">Total Dares</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">3,892</h3>
            <p className="text-gray-400">Active Streamers</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <Zap className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">89%</h3>
            <p className="text-gray-400">Success Rate</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-black font-bold">
              $
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">$2.1M</h3>
            <p className="text-gray-400">Total Rewards</p>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 2nd Place */}
          <div className="order-1 md:order-1">
            <div className="bg-gray-900 rounded-lg p-6 text-center border border-gray-700 h-64 flex flex-col justify-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Medal className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{topPerformers[1].username}</h3>
              <div className="text-gray-300 font-semibold mb-1">2nd Place</div>
              <p className="text-gray-400">${topPerformers[1].totalEarnings.toLocaleString()} earned</p>
              <p className="text-gray-500 text-sm">{topPerformers[1].completedDares} dares completed</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="order-2 md:order-2">
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-500/20 rounded-lg p-6 text-center border border-yellow-500/30 h-80 flex flex-col justify-center">
              <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{topPerformers[0].username}</h3>
              <div className="text-yellow-400 font-bold text-lg mb-2">Champion</div>
              <p className="text-white text-lg font-semibold mb-1">
                ${topPerformers[0].totalEarnings.toLocaleString()} earned
              </p>
              <p className="text-yellow-400 text-sm">{topPerformers[0].streak} dare streak!</p>
              <p className="text-gray-300 text-sm">{topPerformers[0].completedDares} dares completed</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 md:order-3">
            <div className="bg-gray-900 rounded-lg p-6 text-center border border-gray-700 h-64 flex flex-col justify-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{topPerformers[2].username}</h3>
              <div className="text-orange-300 font-semibold mb-1">3rd Place</div>
              <p className="text-gray-400">${topPerformers[2].totalEarnings.toLocaleString()} earned</p>
              <p className="text-gray-500 text-sm">{topPerformers[2].completedDares} dares completed</p>
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Top Performers</h2>
          </div>
          
          <div className="divide-y divide-gray-700">
            {topPerformers.map((performer) => (
              <div
                key={performer.id}
                className={`px-6 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors ${getRankBg(performer.rank)} border-l-4`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(performer.rank)}
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <div className="text-white font-bold">
                        {performer.username[0]}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white">{performer.username}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{performer.completedDares} dares</span>
                      <span>{performer.successRate}% success</span>
                      <span>{performer.streak} streak</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    ${performer.totalEarnings.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};