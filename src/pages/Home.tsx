import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Zap, Users, Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { StreamCard } from '../components/Stream/StreamCard';
import { DareCard } from '../components/Dare/DareCard';
import { useStreamStore } from '../store/useStreamStore';

export const Home: React.FC = () => {
  const { streams, dares, fetchActiveStreams, fetchTopDares } = useStreamStore();

  useEffect(() => {
    fetchActiveStreams();
    fetchTopDares();
  }, [fetchActiveStreams, fetchTopDares]);

  const handleVote = (dareId: string) => {
    console.log('Voting for dare:', dareId);
    // In a real app, this would update the vote count in Supabase
  };

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
  ];

  const mockDares = [
    {
      id: '1',
      title: 'Ice Bucket Challenge 2.0',
      description: 'Fill a bucket with ice water and dump it over your head while doing jumping jacks',
      difficulty: 'medium' as const,
      cost: 5,
      votes: 234,
      status: 'pending' as const,
      created_by: 'user1',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Spicy Food Marathon',
      description: 'Eat 5 different spicy foods in under 2 minutes',
      difficulty: 'hard' as const,
      cost: 8,
      votes: 189,
      status: 'pending' as const,
      created_by: 'user2',
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                DareStream
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The ultimate live streaming platform where courage meets community. 
              Submit dares, vote on challenges, and watch epic performances unfold in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/live"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Live</span>
              </Link>
              <Link
                to="/dares"
                className="bg-transparent border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Submit Dare</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">50K+</h3>
              <p className="text-gray-400">Active Users</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">10K+</h3>
              <p className="text-gray-400">Dares Completed</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">$100K+</h3>
              <p className="text-gray-400">Rewards Distributed</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Streams Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Live Streams</h2>
            <Link
              to="/live"
              className="text-red-400 hover:text-red-300 flex items-center space-x-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockStreams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Dares Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Top Voted Dares</h2>
            <Link
              to="/dares"
              className="text-red-400 hover:text-red-300 flex items-center space-x-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockDares.map((dare) => (
              <DareCard key={dare.id} dare={dare} onVote={handleVote} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};