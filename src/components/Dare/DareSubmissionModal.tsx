import React, { useState } from 'react';
import { X, Coins } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface DareSubmissionModalProps {
  streamId: string;
  onClose: () => void;
}

export const DareSubmissionModal: React.FC<DareSubmissionModalProps> = ({ streamId, onClose }) => {
  const { user } = useAuthStore();
  const [dare, setDare] = useState({
    title: '',
    description: '',
    reward: 50,
    category: 'physical',
  });

  const categories = [
    { value: 'physical', label: 'Physical Challenge', difficulty: 'wild' },
    { value: 'mental', label: 'Mental Challenge', difficulty: 'mild' },
    { value: 'creative', label: 'Creative Challenge', difficulty: 'mild' },
    { value: 'food', label: 'Food Challenge', difficulty: 'wild' },
    { value: 'extreme', label: 'Extreme Challenge', difficulty: 'extreme' },
  ];

  const difficultyTiers = [
    { value: 'mild', label: 'Mild', minTokens: 25, color: 'text-green-400' },
    { value: 'wild', label: 'Wild', minTokens: 100, color: 'text-orange-400' },
    { value: 'extreme', label: 'Extreme', minTokens: 250, color: 'text-red-400' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.coins < dare.reward) {
      alert('Insufficient tokens!');
      return;
    }

    console.log('Submitting dare:', { ...dare, streamId });
    // In a real app, this would submit to Supabase and deduct tokens
    onClose();
  };

  const canAfford = user && user.coins >= dare.reward;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Submit a Dare</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Dare Title
            </label>
            <input
              type="text"
              value={dare.title}
              onChange={(e) => setDare({ ...dare, title: e.target.value })}
              placeholder="e.g., Ice bucket challenge"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={dare.description}
              onChange={(e) => setDare({ ...dare, description: e.target.value })}
              placeholder="Describe the challenge in detail..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={dare.category}
              onChange={(e) => setDare({ ...dare, category: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {difficultyTiers.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setDare({ 
                    ...dare, 
                    difficulty: tier.value as any,
                    reward: Math.max(dare.reward, tier.minTokens)
                  })}
                  className={`p-3 rounded-lg border-2 transition-colors text-center ${
                    dare.difficulty === tier.value
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={`font-bold ${tier.color}`}>{tier.label}</div>
                  <div className="text-xs text-gray-400">{tier.minTokens}+ tokens</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Time Limit (optional)
            </label>
            <select
              value={dare.time_limit || ''}
              onChange={(e) => setDare({ ...dare, time_limit: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">No time limit</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Reward (tokens)
            </label>
            <div className="text-xs text-gray-400 mb-2">
              Minimum for {dare.difficulty || 'mild'}: {
                difficultyTiers.find(t => t.value === (dare.difficulty || 'mild'))?.minTokens || 25
              } tokens
            </div>
            <div className="flex space-x-2 mb-3">
              {[25, 50, 100, 250, 500].filter(amount => 
                amount >= (difficultyTiers.find(t => t.value === (dare.difficulty || 'mild'))?.minTokens || 25)
              ).map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setDare({ ...dare, reward: amount })}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    dare.reward === amount
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={difficultyTiers.find(t => t.value === (dare.difficulty || 'mild'))?.minTokens || 25}
              max="1000"
              value={dare.reward}
              onChange={(e) => {
                const minTokens = difficultyTiers.find(t => t.value === (dare.difficulty || 'mild'))?.minTokens || 25;
                setDare({ ...dare, reward: Math.max(parseInt(e.target.value) || minTokens, minTokens) });
              }}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* User Balance */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-300 text-sm">Your Balance:</span>
              </div>
              <span className="text-white font-medium">{user?.coins || 0} tokens</span>
            </div>
            
            {!canAfford && (
              <div className="mt-2 text-red-400 text-sm">
                Insufficient tokens! You need {dare.reward - (user?.coins || 0)} more tokens.
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={!canAfford}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                canAfford
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Dare ({dare.reward} tokens)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};