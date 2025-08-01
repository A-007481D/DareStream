import React, { useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { StreamCard } from '../components/Stream/StreamCard';
import { useStreamStore } from '../store/useStreamStore';
import { useAuthStore } from '../store/useAuthStore';

export const LiveStreams: React.FC = () => {
  const { streams, fetchActiveStreams } = useStreamStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchActiveStreams();
  }, [fetchActiveStreams]);

  // Mock data for demo
  const mockStreams = [
    {
      id: '1',
      title: 'Epic Solo Challenge Stream',
      performer_id: 'user1',
      status: 'live' as const,
      viewer_count: 1247,
      created_at: new Date().toISOString(),
      mode: 'solo' as const,
    },
    {
      id: '2',
      title: '1v1 Battle Royale',
      performer_id: 'user2',
      status: 'live' as const,
      viewer_count: 892,
      created_at: new Date().toISOString(),
      mode: 'battle' as const,
    },
    {
      id: '3',
      title: 'Midnight Madness Challenge',
      performer_id: 'user3',
      status: 'live' as const,
      viewer_count: 654,
      created_at: new Date().toISOString(),
      mode: 'solo' as const,
    },
    {
      id: '4',
      title: 'Ultimate Showdown',
      performer_id: 'user4',
      status: 'live' as const,
      viewer_count: 432,
      created_at: new Date().toISOString(),
      mode: 'battle' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Live Streams</h1>
            <p className="text-gray-400">Watch epic challenges unfold in real-time</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            {user && (
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Go Live</span>
              </button>
            )}
          </div>
        </div>

        {/* Stream Categories */}
        <div className="flex space-x-4 mb-8">
          <button className="bg-red-600 text-white px-6 py-2 rounded-full font-medium">
            All Streams
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            Solo Challenges
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            1v1 Battles
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-full font-medium transition-colors">
            Group Challenges
          </button>
        </div>

        {/* Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Load More Streams
          </button>
        </div>
      </div>
    </div>
  );
};