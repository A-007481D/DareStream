import React, { useState } from 'react';
import { X, Coins } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useStreamStore } from '../../store/useStreamStore';

interface DareSubmissionModalProps {
  streamId: string;
  onClose: () => void;
}

export const DareSubmissionModal: React.FC<DareSubmissionModalProps> = ({ streamId, onClose }) => {
  const { user } = useAuthStore();
  const { submitDare } = useStreamStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dare, setDare] = useState({
    title: '',
    description: '',
    cost: 50,
    category: 'physical',
    difficulty: 'mild' as 'mild' | 'wild' | 'extreme',
    time_limit: undefined as number | undefined,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || (user.tokens || 0) < dare.cost) {
      alert('Insufficient tokens!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await submitDare({
        ...dare,
        stream_id: streamId,
        created_by: user.id,
        created_by_username: user.username,
      });
      
      if (success) {
        alert('Dare submitted successfully! It will be reviewed by the streamer.');
        onClose();
      } else {
        alert('Failed to submit dare. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting dare:', error);
      alert('Failed to submit dare. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAfford = user && (user.tokens || 0) >= dare.cost;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-white">Submit a Dare</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
              Dare Title
            </label>
            <input
              type="text"
              value={dare.title}
              onChange={(e) => setDare({ ...dare, title: e.target.value })}
              placeholder="e.g., Ice bucket challenge"
              className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={dare.description}
              onChange={(e) => setDare({ ...dare, description: e.target.value })}
              placeholder="Describe the challenge in detail..."
              className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-20 sm:h-24 resize-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={dare.category}
              onChange={(e) => setDare({ ...dare, category: e.target.value })}
              className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3">
              {difficultyTiers.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setDare({ 
                    ...dare, 
                    difficulty: tier.value as any,
                    cost: Math.max(dare.cost, tier.minTokens)
                  })}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-colors text-center ${
                    dare.difficulty === tier.value
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={`font-bold text-sm sm:text-base ${tier.color}`}>{tier.label}</div>
                  <div className="text-xs text-gray-400">{tier.minTokens}+ tokens</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
              Time Limit (optional)
            </label>
            <select
              value={dare.time_limit || ''}
              onChange={(e) => setDare({ ...dare, time_limit: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
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
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
              Cost (tokens)
            </label>
            <div className="text-xs text-gray-400 mb-2">
              Minimum for {dare.difficulty || 'mild'}: {
                difficultyTiers.find(t => t.value === (dare.difficulty || 'mild'))?.minTokens || 25
              } tokens
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
              {[25, 50, 100, 250, 500].filter(amount => 
                amount >= (difficultyTiers.find(t => t.value === (dare.difficulty || 'mild'))?.minTokens || 25)
              ).map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setDare({ ...dare, cost: amount })}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    dare.cost === amount
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
              value={dare.cost}
              onChange={(e) => {
                const minTokens = difficultyTiers.find(t => t.value === (dare.difficulty || 'mild'))?.minTokens || 25;
                setDare({ ...dare, cost: Math.max(parseInt(e.target.value) || minTokens, minTokens) });
              }}
              className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>

          {/* User Balance */}
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                <span className="text-gray-300 text-xs sm:text-sm">Your Balance:</span>
              </div>
              <span className="text-white font-medium text-sm sm:text-base">{user?.tokens || 0} tokens</span>
            </div>
            
            {!canAfford && (
              <div className="mt-2 text-red-400 text-xs sm:text-sm">
                Insufficient tokens! You need {dare.cost - (user?.tokens || 0)} more tokens.
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="submit"
              disabled={!canAfford || isSubmitting}
              className={`flex-1 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm ${
                canAfford && !isSubmitting
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : `Submit Dare (${dare.cost} tokens)`}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};