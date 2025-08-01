import React, { useState, useEffect } from 'react';
import { Plus, Zap, TrendingUp } from 'lucide-react';
import { DareCard } from '../components/Dare/DareCard';
import { useStreamStore } from '../store/useStreamStore';
import { useAuthStore } from '../store/useAuthStore';

export const DareRoulette: React.FC = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newDare, setNewDare] = useState({
    title: '',
    description: '',
    difficulty: 'easy' as const,
    cost: 1,
  });

  const { dares, fetchTopDares } = useStreamStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTopDares();
  }, [fetchTopDares]);

  const handleVote = (dareId: string) => {
    console.log('Voting for dare:', dareId);
    // In a real app, this would update the vote count in Supabase
  };

  const handleSubmitDare = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting dare:', newDare);
    // In a real app, this would submit to Supabase
    setShowSubmitForm(false);
    setNewDare({ title: '', description: '', difficulty: 'easy', cost: 1 });
  };

  // Mock data for demo
  const mockDares = [
    {
      id: '1',
      title: 'Ice Bucket Challenge 2.0',
      description: 'Fill a bucket with ice water and dump it over your head while doing jumping jacks',
      difficulty: 'medium' as const,
      cost: 5,
      votes: 234,
      status: 'pending' as const,
      created_by: 'user1',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Spicy Food Marathon',
      description: 'Eat 5 different spicy foods in under 2 minutes',
      difficulty: 'hard' as const,
      cost: 8,
      votes: 189,
      status: 'pending' as const,
      created_by: 'user2',
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Dance Battle Freestyle',
      description: 'Perform a 3-minute freestyle dance to a random song',
      difficulty: 'easy' as const,
      cost: 3,
      votes: 156,
      status: 'pending' as const,
      created_by: 'user3',
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Blindfolded Obstacle Course',
      description: 'Navigate through a simple obstacle course while blindfolded',
      difficulty: 'extreme' as const,
      cost: 12,
      votes: 98,
      status: 'pending' as const,
      created_by: 'user4',
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dare Roulette</h1>
            <p className="text-gray-400">Submit and vote on the most epic challenges</p>
          </div>
          
          {user && (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Submit Dare</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="text-2xl font-bold text-white">1,247</h3>
                <p className="text-gray-400">Active Dares</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-2xl font-bold text-white">89%</h3>
                <p className="text-gray-400">Completion Rate</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                $
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">$25,430</h3>
                <p className="text-gray-400">Total Rewards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dare Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="bg-red-600 text-white px-6 py-2 rounded-full font-medium">
            All Dares
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            Easy
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            Medium
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            Hard
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            Extreme
          </button>
        </div>

        {/* Dares List */}
        <div className="space-y-6">
          {mockDares.map((dare) => (
            <DareCard key={dare.id} dare={dare} onVote={handleVote} />
          ))}
        </div>

        {/* Submit Dare Modal */}
        {showSubmitForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-6">Submit New Dare</h2>
              
              <form onSubmit={handleSubmitDare} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newDare.title}
                    onChange={(e) => setNewDare({ ...newDare, title: e.target.value })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={newDare.description}
                    onChange={(e) => setNewDare({ ...newDare, description: e.target.value })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-24"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Difficulty
                  </label>
                  <select
                    value={newDare.difficulty}
                    onChange={(e) => setNewDare({ ...newDare, difficulty: e.target.value as any })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newDare.cost}
                    onChange={(e) => setNewDare({ ...newDare, cost: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Submit Dare
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmitForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};