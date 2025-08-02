import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Share, Gift, ArrowLeft, UserPlus, UserCheck } from 'lucide-react';
import { ChatBox } from '../components/Chat/ChatBox';
import { DareSubmissionModal } from '../components/Dare/DareSubmissionModal';
import { StreamReactions } from '../components/Stream/StreamReactions';
import { DareQueue } from '../components/Dare/DareQueue';
import { StreamGoals } from '../components/Dare/StreamGoals';
import { DareAlerts } from '../components/Dare/DareAlerts';
import { useStreamStore } from '../store/useStreamStore';
import { useAuthStore } from '../store/useAuthStore';

export const StreamView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDareModal, setShowDareModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(5);
  const [tipMessage, setTipMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'dares' | 'goals'>('chat');

  const { currentStream, setCurrentStream } = useStreamStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      // Mock stream data
      const mockStream = {
        id,
        title: 'Ice Bath Challenge - $500 Dare',
        performer_id: 'user1',
        performer_name: 'DareKing',
        status: 'live' as const,
        viewer_count: 2847,
        created_at: new Date().toISOString(),
        mode: 'solo' as const,
        current_dare: 'Stay in ice bath for 5 minutes',
        dare_amount: 500,
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
      message: 'This is insane!',
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading stream...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Stream Area */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="bg-gray-900 rounded-lg aspect-video mb-6 relative overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Live Stream"
                className="w-full h-full object-cover"
              />
              
              {/* Stream Reactions Overlay */}
              <StreamReactions />
              
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                LIVE
              </div>
              
              {/* Viewer Count */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{currentStream.viewer_count.toLocaleString()}</span>
              </div>
            </div>

            {/* Stream Info */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-white mb-4">{currentStream.title}</h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {currentStream.performer_name?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{currentStream.performer_name || 'Unknown'}</div>
                    <div className="text-gray-400 text-sm">
                      Started {new Date(currentStream.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    disabled={!user}
                    className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      !user
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : isFollowing 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    title={!user ? 'Login to follow' : ''}
                  >
                    {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{!user ? 'Follow' : isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                  
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  
                  <button
                    onClick={() => setShowTipModal(true)}
                    disabled={!user}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    title={!user ? 'Login to tip' : ''}
                  >
                    <Gift className="w-4 h-4" />
                    <span>Tip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Current Dare */}
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-3">Current Challenge</h2>
              <div className="text-gray-300">
                <p className="mb-4">💀 {currentStream.current_dare}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    LIVE
                  </span>
                  <span className="text-yellow-400 font-semibold text-lg">
                    ${currentStream.dare_amount} Reward
                  </span>
                </div>
                
                <button
                  onClick={() => setShowDareModal(true)}
                  disabled={!user}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  title={!user ? 'Login to submit dares' : ''}
                >
                  Submit New Dare
                </button>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            {/* Tab Navigation */}
            <div className="flex bg-gray-900 rounded-t-lg">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-tl-lg transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('dares')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'dares'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Dares
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-tr-lg transition-colors ${
                  activeTab === 'goals'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Goals
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-900 rounded-b-lg">
              {activeTab === 'chat' && <ChatBox messages={mockMessages} />}
              {activeTab === 'dares' && <DareQueue streamId={currentStream.id} />}
              {activeTab === 'goals' && <StreamGoals streamId={currentStream.id} />}
            </div>
          </div>
        </div>

        {/* Dare Submission Modal */}
        {showDareModal && user && (
          <DareSubmissionModal
            streamId={currentStream.id}
            onClose={() => setShowDareModal(false)}
          />
        )}

        {/* Tip Modal */}
        {showTipModal && user && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-6">Send a Tip</h2>
              
              <form onSubmit={handleSendTip} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Amount (tokens)
                  </label>
                  <div className="flex space-x-2 mb-3">
                    {[5, 10, 25, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setTipAmount(amount)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          tipAmount === amount
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Dare Alerts */}
      <DareAlerts streamId={currentStream.id} />
    </div>
  );
};