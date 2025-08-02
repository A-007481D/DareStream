import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Clock, Users, Vote, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';

export const DareRoulette: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      // Allow viewing but show login prompts for interaction
    }
  }, [user]);

  // Mock pending dares data
  const pendingDares = [
    {
      id: '1',
      title: 'Ice Bath Marathon',
      description: 'Stay in ice bath for 10 minutes straight',
      reward: 500,
      submittedBy: 'DareKing',
      timeLeft: '2h 15m',
      category: 'Physical',
      votes: 23,
      reactions: ['🔥', '💀', '😱'],
      multiplier: 1.5
    },
    {
      id: '2',
      title: 'Spicy Noodle Challenge',
      description: 'Eat the spiciest ramen without drinking anything',
      reward: 250,
      submittedBy: 'HeatLover',
      timeLeft: '45m',
      category: 'Food',
      votes: 18,
      reactions: ['🌶️', '😵', '🔥'],
      multiplier: 1.2
    },
    {
      id: '3',
      title: 'Memory Master',
      description: 'Memorize and recite 50 random words in order',
      reward: 300,
      submittedBy: 'BrainPower',
      timeLeft: '1h 30m',
      category: 'Mental',
      votes: 31,
      reactions: ['🧠', '💯', '🤯'],
      multiplier: 2.0
    },
  ];

  const [votedDares, setVotedDares] = useState<Set<string>>(new Set());
  const [contributedDares, setContributedDares] = useState<Set<string>>(new Set());

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Dare Roulette</h1>
          <p className="text-gray-400 text-lg">
            Submit dares for streamers to attempt and earn rewards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <Zap className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">1,247</h3>
            <p className="text-gray-400">Active Dares</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">89%</h3>
            <p className="text-gray-400">Success Rate</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-black font-bold">
              $
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">$25K</h3>
            <p className="text-gray-400">Total Rewards</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">3,892</h3>
            <p className="text-gray-400">Participants</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-900 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How Dare Submission Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Buy Tokens</h3>
              <p className="text-gray-400 text-sm">
                Purchase tokens to submit dares and tip streamers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Submit Dare</h3>
              <p className="text-gray-400 text-sm">
                Create custom challenges with token rewards for streamers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Watch & Win</h3>
              <p className="text-gray-400 text-sm">
                Watch streamers attempt your dare and earn bonus rewards
              </p>
            </div>
          </div>
        </div>

        {/* Pending Dares */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Pending Dares</h2>
          
          <div className="space-y-4">
            {pendingDares.map((dare) => (
              <div key={dare.id} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-bold text-lg">{dare.title}</h3>
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {dare.category}
                      </span>
                      {dare.multiplier > 1 && (
                        <span className="bg-yellow-600 text-black px-2 py-1 rounded text-xs font-bold">
                          {dare.multiplier}x MULTIPLIER
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-3">{dare.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>By {dare.submittedBy}</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {dare.timeLeft} left
                      </div>
                      <div className="flex items-center">
                        <Vote className="w-4 h-4 mr-1" />
                        {dare.votes} votes
                      </div>
                    </div>
                    
                    {/* Reactions */}
                    {dare.reactions && (
                      <div className="flex items-center space-x-2 mt-2">
                        {dare.reactions.map((emoji, index) => (
                          <span key={index} className="text-lg">{emoji}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">
                      {Math.round(dare.reward * (dare.multiplier || 1))} tokens
                    </div>
                    {dare.reward !== Math.round(dare.reward * (dare.multiplier || 1)) && (
                      <div className="text-xs text-gray-400 mb-2">
                        Base: {dare.reward} tokens
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Button size="sm" className="w-full text-xs">
                        Watch Stream
                      </Button>
                      
                      {user && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (!votedDares.has(dare.id)) {
                                setVotedDares(prev => new Set([...prev, dare.id]));
                              }
                            }}
                            disabled={votedDares.has(dare.id)}
                            className="flex-1 text-xs"
                          >
                            <Vote className="w-3 h-3 mr-1" />
                            {votedDares.has(dare.id) ? 'Voted' : 'Vote'}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (!contributedDares.has(dare.id)) {
                                setContributedDares(prev => new Set([...prev, dare.id]));
                              }
                            }}
                            className="flex-1 text-xs bg-yellow-600/10 border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            +Tokens
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token Purchase CTA */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Submit Your Dare?</h2>
          <p className="text-white/90 mb-6 text-lg">
            {user 
              ? 'Purchase tokens to submit custom challenges and tip your favorite streamers'
              : 'Sign up to submit custom challenges and tip your favorite streamers'
            }
          </p>
          {user ? (
            <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Buy Tokens
            </button>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup"
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-white/20 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/30 transition-colors"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};