import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, Heart, Share, Gift } from 'lucide-react';
import { ChatBox } from '../components/Chat/ChatBox';
import { useStreamStore } from '../store/useStreamStore';
import { useAuthStore } from '../store/useAuthStore';

export const StreamView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(5);
  const [tipMessage, setTipMessage] = useState('');

  const { currentStream, setCurrentStream, chatMessages } = useStreamStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      // In a real app, fetch stream data from Supabase
      const mockStream = {
        id,
        title: 'Epic Solo Challenge Stream',
        performer_id: 'user1',
        status: 'live' as const,
        viewer_count: 1247,
        created_at: new Date().toISOString(),
        mode: 'solo' as const,
      };
      setCurrentStream(mockStream);
    }

    return () => {
      setCurrentStream(null);
    };
  }, [id, setCurrentStream]);

  const handleSendTip = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending tip:', { amount: tipAmount, message: tipMessage });
    setShowTipModal(false);
    setTipAmount(5);
    setTipMessage('');
  };

  const mockMessages = [
    {
      id: '1',
      stream_id: id || '',
      user_id: 'user1',
      username: 'ChallengeKing',
      message: 'This is insane! 🔥',
      type: 'message' as const,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      stream_id: id || '',
      user_id: 'user2',
      username: 'DareDevil99',
      message: 'Tipped $10 - Make it harder!',
      type: 'tip' as const,
      created_at: new Date().toISOString(),
    },
  ];

  if (!currentStream) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading stream...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Stream Area */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="bg-black rounded-lg aspect-video mb-6 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎥</div>
                  <div className="text-white text-xl font-semibold">Live Stream</div>
                  <div className="text-gray-400">Video player would be integrated here</div>
                </div>
              </div>
              
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                LIVE
              </div>
              
              {/* Viewer Count */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{currentStream.viewer_count}</span>
              </div>
            </div>

            {/* Stream Info */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-white mb-4">{currentStream.title}</h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <div>
                    <div className="text-white font-semibold">Performer123</div>
                    <div className="text-gray-400 text-sm">Started {new Date(currentStream.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>Follow</span>
                  </button>
                  
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  
                  {user && (
                    <button
                      onClick={() => setShowTipModal(true)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Tip</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Current Dare */}
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-3">Current Challenge</h2>
              <div className="text-gray-300">
                <h3 className="font-semibold text-lg mb-2">Ice Bucket Challenge 2.0</h3>
                <p>Fill a bucket with ice water and dump it over your head while doing jumping jacks</p>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">MEDIUM</span>
                  <span className="text-yellow-400 font-semibold">$5 Reward</span>
                </div>
                <div className="text-gray-400 text-sm">234 votes</div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <ChatBox streamId={currentStream.id} messages={mockMessages} />
          </div>
        </div>

        {/* Tip Modal */}
        {showTipModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-6">Send a Tip</h2>
              
              <form onSubmit={handleSendTip} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Amount ($)
                  </label>
                  <div className="flex space-x-2 mb-3">
                    {[1, 5, 10, 25, 50].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setTipAmount(amount)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          tipAmount === amount
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Message (optional)
                  </label>
                  <input
                    type="text"
                    value={tipMessage}
                    onChange={(e) => setTipMessage(e.target.value)}
                    placeholder="Add a message..."
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Send Tip
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTipModal(false)}
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