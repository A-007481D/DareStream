import React, { useState, useEffect } from 'react';
import { Target, Zap, TrendingUp, Gift, Plus, Edit3, Trash2 } from 'lucide-react';
import { StreamGoal } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';

interface StreamGoalsProps {
  streamId: string;
  isStreamer?: boolean;
}

export const StreamGoals: React.FC<StreamGoalsProps> = ({ streamId, isStreamer = false }) => {
  const { user } = useAuthStore();
  const [goals, setGoals] = useState<StreamGoal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target_amount: 1000,
    reward_description: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockGoals: StreamGoal[] = [
      {
        id: '1',
        stream_id: streamId,
        title: 'Hair Dye Challenge',
        description: 'If we reach 1000 tokens, I\'ll dye my hair pink!',
        target_amount: 1000,
        current_amount: 750,
        status: 'active',
        reward_description: 'Pink hair for a week',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        stream_id: streamId,
        title: 'Extreme Workout',
        description: 'Unlock the ultimate fitness challenge',
        target_amount: 2500,
        current_amount: 1200,
        status: 'active',
        reward_description: '2-hour intense workout stream',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        stream_id: streamId,
        title: 'Cooking Disaster',
        description: 'Attempt to cook a 5-course meal blindfolded',
        target_amount: 500,
        current_amount: 500,
        status: 'completed',
        reward_description: 'Blindfolded cooking stream',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        completed_at: new Date().toISOString()
      }
    ];
    setGoals(mockGoals);
  }, [streamId]);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStreamer) return;

    const goal: StreamGoal = {
      id: Date.now().toString(),
      stream_id: streamId,
      ...newGoal,
      current_amount: 0,
      status: 'active',
      created_at: new Date().toISOString()
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', description: '', target_amount: 1000, reward_description: '' });
    setShowCreateModal(false);
  };

  const handleContribute = (goalId: string, amount: number) => {
    if (!user) return;

    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.current_amount + amount;
        return {
          ...goal,
          current_amount: newAmount,
          status: newAmount >= goal.target_amount ? 'completed' : 'active',
          completed_at: newAmount >= goal.target_amount ? new Date().toISOString() : undefined
        };
      }
      return goal;
    }));
  };

  const getProgressPercentage = (goal: StreamGoal) => {
    return Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="h-full flex flex-col p-3 sm:p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Stream Goals</h2>
        </div>
        {isStreamer && (
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="text-xs px-2 py-1"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Add Goal</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </div>

      {/* Active Goals */}
      <div className="flex-1 overflow-y-auto min-h-0">
      {activeGoals.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Active Goals</h3>
          <div className="space-y-3 sm:space-y-4">
            {activeGoals.map(goal => (
              <div key={goal.id} className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm sm:text-lg mb-1">{goal.title}</h4>
                    <p className="text-gray-300 text-xs sm:text-sm mb-2">{goal.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Reward: {goal.reward_description}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-lg font-bold text-white">
                      {goal.current_amount} / {goal.target_amount}
                    </div>
                    <div className="text-xs text-gray-400">tokens</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">
                      {getProgressPercentage(goal).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(goal)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {goal.target_amount - goal.current_amount} tokens remaining
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {user && !isStreamer && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContribute(goal.id, 50)}
                          className="text-xs px-2 py-1 bg-yellow-600/10 border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          +50
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContribute(goal.id, 100)}
                          className="text-xs px-2 py-1 bg-yellow-600/10 border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          +100
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContribute(goal.id, 250)}
                          className="text-xs px-2 py-1 bg-yellow-600/10 border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          +250
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {isStreamer && (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button size="sm" variant="ghost" className="text-xs px-2 py-1">
                        <Edit3 className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs px-2 py-1 text-red-400">
                        <Trash2 className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
            Completed Goals
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {completedGoals.map(goal => (
              <div key={goal.id} className="bg-gray-800/50 rounded-lg p-2 sm:p-3 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-sm sm:text-base">{goal.title}</h4>
                    <p className="text-green-400 text-xs sm:text-sm">✓ {goal.reward_description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-sm sm:text-base">
                      {goal.target_amount} tokens
                    </div>
                    <div className="text-xs text-gray-400">
                      Completed {goal.completed_at && new Date(goal.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Empty State */}
      {activeGoals.length === 0 && completedGoals.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-gray-400 flex-1 flex flex-col justify-center">
          <Target className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-600" />
          <div className="text-base sm:text-lg mb-2">No stream goals yet</div>
          <p className="text-xs sm:text-sm">
            {isStreamer 
              ? 'Create your first goal to engage your audience!'
              : 'The streamer hasn\'t set any goals yet.'
            }
          </p>
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && isStreamer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full">
            <div className="p-4 sm:p-6 border-b border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold text-white">Create Stream Goal</h3>
            </div>
            
            <form onSubmit={handleCreateGoal} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Hair Dye Challenge"
                  className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Describe what happens when the goal is reached..."
                  className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-16 sm:h-20 resize-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                  Target Amount (tokens)
                </label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={newGoal.target_amount}
                  onChange={(e) => setNewGoal({ ...newGoal, target_amount: parseInt(e.target.value) || 100 })}
                  className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                  Reward Description
                </label>
                <input
                  type="text"
                  value={newGoal.reward_description}
                  onChange={(e) => setNewGoal({ ...newGoal, reward_description: e.target.value })}
                  placeholder="e.g., Pink hair for a week"
                  className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                <Button type="submit" className="flex-1">
                  Create Goal
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};