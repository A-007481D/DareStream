import React, { useState } from 'react';
import { X, Video, Zap, Clock, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLiveStreamStore } from '../../store/useLiveStreamStore';
import { useAuthStore } from '../../store/useAuthStore';

interface GoLiveModalProps {
  onClose: () => void;
}

export const GoLiveModal: React.FC<GoLiveModalProps> = ({ onClose }) => {
  const { user } = useAuthStore();
  const { startStream } = useLiveStreamStore();
  const [isStarting, setIsStarting] = useState(false);
  const [streamData, setStreamData] = useState({
    title: '',
    challenge: '',
    duration: 30, // minutes
    category: 'physical'
  });

  const categories = [
    { value: 'physical', label: 'Physical Challenge', icon: '💪' },
    { value: 'mental', label: 'Mental Challenge', icon: '🧠' },
    { value: 'creative', label: 'Creative Challenge', icon: '🎨' },
    { value: 'food', label: 'Food Challenge', icon: '🍕' },
    { value: 'extreme', label: 'Extreme Challenge', icon: '🔥' }
  ];

  const handleStartStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !streamData.title.trim()) return;

    setIsStarting(true);
    try {
      const success = await startStream(streamData.title, streamData.challenge);
      if (success) {
        onClose();
      } else {
        alert('Failed to start stream. Please check your camera permissions and try again.');
      }
    } catch (error) {
      console.error('Error starting stream:', error);
      alert('Failed to start stream. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Go Live</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleStartStream} className="p-6 space-y-6">
          {/* Stream Title */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Stream Title *
            </label>
            <input
              type="text"
              value={streamData.title}
              onChange={(e) => setStreamData({ ...streamData, title: e.target.value })}
              placeholder="e.g., Ice Bath Challenge - 5 Minutes!"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Challenge Description */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Challenge Description
            </label>
            <textarea
              value={streamData.challenge}
              onChange={(e) => setStreamData({ ...streamData, challenge: e.target.value })}
              placeholder="Describe what you'll be doing..."
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-20 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setStreamData({ ...streamData, category: category.value })}
                  className={`p-3 rounded-lg border-2 transition-colors text-left ${
                    streamData.category === category.value
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-white text-sm font-medium">{category.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Expected Duration
            </label>
            <div className="flex space-x-2">
              {[15, 30, 60, 120].map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setStreamData({ ...streamData, duration })}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                    streamData.duration === duration
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {duration}m
                </button>
              ))}
            </div>
          </div>

          {/* Stream Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Stream Features</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-red-500" />
                <span>Live video streaming</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Real-time viewer interaction</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Token tips and votes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Challenge timer</span>
              </div>
            </div>
          </div>

          {/* Camera Permission Notice */}
          <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Video className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="text-yellow-400 font-medium">Camera Access Required</h4>
                <p className="text-yellow-300 text-sm mt-1">
                  Please allow camera and microphone access when prompted to start your live stream.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={!streamData.title.trim() || isStarting}
              className="flex-1"
              isLoading={isStarting}
            >
              <Video className="w-4 h-4 mr-2" />
              {isStarting ? 'Starting...' : 'Go Live'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isStarting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};