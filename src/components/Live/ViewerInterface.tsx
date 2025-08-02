import React, { useEffect, useRef, useState } from 'react';
import { Eye, Zap, Heart, ArrowRight, Gift } from 'lucide-react';
import { useLiveStreamStore } from '../../store/useLiveStreamStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';

interface ViewerInterfaceProps {
  streamId: string;
}

export const ViewerInterface: React.FC<ViewerInterfaceProps> = ({ streamId }) => {
  const { user } = useAuthStore();
  const {
    currentStream,
    tips,
    votes,
    isViewing,
    joinStream,
    leaveStream,
    sendTip,
    submitVote,
    liveKitService
  } = useLiveStreamStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(10);
  const [tipMessage, setTipMessage] = useState('');
  const [hasVoted, setHasVoted] = useState<Set<string>>(new Set());

  // Join stream on mount
  useEffect(() => {
    if (streamId && !isViewing) {
      joinStream(streamId);
    }

    return () => {
      if (isViewing) {
        leaveStream();
      }
    };
  }, [streamId]);

  // Set up remote video
  useEffect(() => {
    if (!liveKitService || !videoRef.current) return;

    const room = liveKitService.getRoom();
    if (!room) return;

    // Listen for remote tracks
    room.remoteParticipants.forEach((participant) => {
      participant.videoTrackPublications.forEach((publication) => {
        if (publication.track && videoRef.current) {
          publication.track.attach(videoRef.current);
        }
      });
    });

    return () => {
      room.remoteParticipants.forEach((participant) => {
        participant.videoTrackPublications.forEach((publication) => {
          if (publication.track) {
            publication.track.detach();
          }
        });
      });
    };
  }, [liveKitService]);

  const handleSendTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const success = await sendTip(tipAmount, tipMessage);
    if (success) {
      setShowTipModal(false);
      setTipAmount(10);
      setTipMessage('');
    }
  };

  const handleVote = async (voteType: 'pressure' | 'support' | 'next-dare') => {
    if (!user || hasVoted.has(voteType)) return;

    const success = await submitVote(voteType);
    if (success) {
      setHasVoted(prev => new Set([...prev, voteType]));
      // Reset vote after 30 seconds
      setTimeout(() => {
        setHasVoted(prev => {
          const newSet = new Set(prev);
          newSet.delete(voteType);
          return newSet;
        });
      }, 30000);
    }
  };

  const recentTips = tips.slice(-3).reverse();

  if (!currentStream) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading stream...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              LIVE
            </div>
            <h1 className="text-white font-bold text-lg">{currentStream.title}</h1>
            <div className="flex items-center space-x-2 text-gray-400">
              <Eye className="w-4 h-4" />
              <span>{currentStream.viewerCount} watching</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">by</span>
            <span className="text-white font-medium">{currentStream.streamerName}</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-900"
          />
          
          {/* Stream Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            {/* Stream Stats */}
            <div className="flex space-x-2">
              <div className="bg-black/70 text-yellow-400 px-3 py-2 rounded-lg flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span className="font-bold">{currentStream.totalTips}</span>
                <span className="text-xs">tips</span>
              </div>
              
              <div className="bg-black/70 text-blue-400 px-3 py-2 rounded-lg flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span className="font-bold">{currentStream.totalVotes}</span>
                <span className="text-xs">votes</span>
              </div>
            </div>
          </div>

          {/* Challenge Info */}
          {currentStream.currentChallenge && (
            <div className="absolute bottom-20 left-4 right-4">
              <div className="bg-red-900/90 border border-red-600 rounded-lg p-4">
                <h3 className="text-white font-bold mb-2">Current Challenge</h3>
                <p className="text-gray-200">{currentStream.currentChallenge}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-center space-x-4">
              {user ? (
                <>
                  <Button
                    onClick={() => handleVote('pressure')}
                    disabled={hasVoted.has('pressure')}
                    className="bg-red-600 hover:bg-red-700 flex items-center space-x-2"
                  >
                    <span>🔥</span>
                    <span>{hasVoted.has('pressure') ? 'Pressured!' : 'Add Pressure'}</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleVote('support')}
                    disabled={hasVoted.has('support')}
                    className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{hasVoted.has('support') ? 'Supported!' : 'Support'}</span>
                  </Button>
                  
                  <Button
                    onClick={() => setShowTipModal(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 flex items-center space-x-2"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Tip</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleVote('next-dare')}
                    disabled={hasVoted.has('next-dare')}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>{hasVoted.has('next-dare') ? 'Voted!' : 'Next Dare'}</span>
                  </Button>
                </>
              ) : (
                <div className="bg-black/70 rounded-lg p-4 text-center">
                  <p className="text-white mb-3">Join to interact with the stream!</p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Sign Up
                    </Button>
                    <Button size="sm" variant="outline">
                      Log In
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
          {/* Recent Tips */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Recent Tips
            </h3>
            <div className="space-y-2">
              {recentTips.map((tip) => (
                <div key={tip.id} className="bg-gray-800 rounded p-3 animate-pulse">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{tip.fromUsername}</span>
                    <span className="text-yellow-400 font-bold">{tip.amount} tokens</span>
                  </div>
                  {tip.message && (
                    <p className="text-gray-300 text-xs">{tip.message}</p>
                  )}
                </div>
              ))}
              {recentTips.length === 0 && (
                <p className="text-gray-400 text-sm">No tips yet - be the first!</p>
              )}
            </div>
          </div>

          {/* Stream Info */}
          <div className="p-4 flex-1">
            <h3 className="text-white font-bold mb-3">Stream Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-medium">Live</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Viewers:</span>
                <span className="text-white">{currentStream.viewerCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Tips:</span>
                <span className="text-yellow-400 font-medium">{currentStream.totalTips} tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Votes:</span>
                <span className="text-blue-400 font-medium">{currentStream.totalVotes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      {showTipModal && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Send a Tip</h3>
            
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
                      className={`px-3 py-2 rounded-lg font-medium transition-colors ${
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
                <Button type="submit" className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                  Send Tip
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTipModal(false)}
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