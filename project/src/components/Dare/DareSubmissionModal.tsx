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
    { value: 'physical', label: 'Physical Challenge' },
    { value: 'mental', label: 'Mental Challenge' },
    { value: 'creative', label: 'Creative Challenge' },
    { value: 'food', label: 'Food Challenge' },
    { value: 'extreme', label: 'Extreme Challenge' },
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
              Reward (tokens)
            </label>
            <div className="flex space-x-2 mb-3">
              {[25, 50, 100, 250, 500].map((amount) => (
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
              min="10"
              max="1000"
              value={dare.reward}
              onChange={(e) => setDare({ ...dare, reward: parseInt(e.target.value) || 10 })}
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