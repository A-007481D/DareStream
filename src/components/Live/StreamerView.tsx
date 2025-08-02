import React, { useEffect, useRef, useState } from 'react';
import { Eye, Zap, Users, Clock, StopCircle, Settings } from 'lucide-react';
import { useLiveStreamStore } from '../../store/useLiveStreamStore';
import { Button } from '../ui/Button';

export const StreamerView: React.FC = () => {
  const {
    currentStream,
    viewers,
    tips,
    votes,
    isStreaming,
    endStream,
    liveKitService
  } = useLiveStreamStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamDuration, setStreamDuration] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Timer for stream duration
  useEffect(() => {
    if (!isStreaming || !currentStream?.startedAt) return;

    const interval = setInterval(() => {
      const startTime = new Date(currentStream.startedAt!).getTime();
      const now = Date.now();
      setStreamDuration(Math.floor((now - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming, currentStream?.startedAt]);

  // Set up local video
  useEffect(() => {
    if (!liveKitService || !videoRef.current) return;

    const room = liveKitService.getRoom();
    if (!room) return;

    const localVideoTrack = room.localParticipant.videoTrackPublications.values().next().value?.track;
    if (localVideoTrack) {
      localVideoTrack.attach(videoRef.current);
    }

    return () => {
      if (localVideoTrack) {
        localVideoTrack.detach();
      }
    };
  }, [liveKitService]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndStream = async () => {
    await endStream();
    setShowEndConfirm(false);
  };

  const recentTips = tips.slice(-5).reverse();
  const recentVotes = votes.slice(-10).reverse();

  if (!currentStream || !isStreaming) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Stream not active</div>
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
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatDuration(streamDuration)}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEndConfirm(true)}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              End Stream
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover bg-gray-900"
          />
          
          {/* Stream Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            {/* Stats */}
            <div className="flex space-x-4">
              <div className="bg-black/70 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="font-bold">{currentStream.viewerCount}</span>
              </div>
              
              <div className="bg-black/70 text-yellow-400 px-3 py-2 rounded-lg flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span className="font-bold">{currentStream.totalTips}</span>
              </div>
              
              <div className="bg-black/70 text-blue-400 px-3 py-2 rounded-lg flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="font-bold">{currentStream.totalVotes}</span>
              </div>
            </div>
            
            {/* Settings */}
            <button className="bg-black/70 text-white p-2 rounded-lg hover:bg-black/80 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Challenge Info */}
          {currentStream.currentChallenge && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-red-900/90 border border-red-600 rounded-lg p-4">
                <h3 className="text-white font-bold mb-2">Current Challenge</h3>
                <p className="text-gray-200">{currentStream.currentChallenge}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
          {/* Viewers */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Viewers ({viewers.length})
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {viewers.map((viewer) => (
                <div key={viewer.id} className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">{viewer.username[0]}</span>
                  </div>
                  <span className="text-gray-300 text-sm">{viewer.username}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tips */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Recent Tips
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {recentTips.map((tip) => (
                <div key={tip.id} className="bg-gray-800 rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{tip.fromUsername}</span>
                    <span className="text-yellow-400 font-bold">{tip.amount}</span>
                  </div>
                  {tip.message && (
                    <p className="text-gray-300 text-xs">{tip.message}</p>
                  )}
                </div>
              ))}
              {recentTips.length === 0 && (
                <p className="text-gray-400 text-sm">No tips yet</p>
              )}
            </div>
          </div>

          {/* Recent Votes */}
          <div className="p-4 flex-1">
            <h3 className="text-white font-bold mb-3">Recent Activity</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recentVotes.map((vote) => (
                <div key={vote.id} className="text-sm">
                  <span className="text-gray-300">{vote.username}</span>
                  <span className="text-gray-400 ml-2">
                    {vote.voteType === 'pressure' && '🔥 added pressure'}
                    {vote.voteType === 'support' && '💪 showed support'}
                    {vote.voteType === 'next-dare' && '⏭️ wants next dare'}
                  </span>
                </div>
              ))}
              {recentVotes.length === 0 && (
                <p className="text-gray-400 text-sm">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* End Stream Confirmation */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">End Stream?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to end your live stream? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <Button
                onClick={handleEndStream}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                End Stream
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEndConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};