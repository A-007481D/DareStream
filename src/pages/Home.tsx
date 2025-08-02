import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Eye, ChevronRight } from 'lucide-react';
import { StreamCard } from '../components/Stream/StreamCard';
import { useStreamStore } from '../store/useStreamStore';
import { useAuthStore } from '../store/useAuthStore';

export const Home: React.FC = () => {
  const { streams, fetchActiveStreams } = useStreamStore();
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchActiveStreams();
  }, [fetchActiveStreams]);

  // Mock data for demo - simulating real streams
  const mockStreams = [
    {
      id: '1',
      title: 'Ice Bath Challenge - $500 Dare',
      performer_id: 'user1',
      performer_name: 'DareKing',
      status: 'live' as const,
      viewer_count: 2847,
      created_at: new Date().toISOString(),
      mode: 'solo' as const,
      thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
      current_dare: 'Stay in ice bath for 5 minutes',
      dare_amount: 500,
    },
    {
      id: '2',
      title: 'Spicy Food Challenge Battle',
      performer_id: 'user2',
      performer_name: 'HeatMaster',
      status: 'live' as const,
      viewer_count: 1923,
      created_at: new Date().toISOString(),
      mode: 'battle' as const,
      thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      current_dare: 'Eat ghost pepper without milk',
      dare_amount: 300,
    },
    {
      id: '3',
      title: 'Extreme Workout Challenge',
      performer_id: 'user3',
      performer_name: 'FitnessDare',
      status: 'live' as const,
      viewer_count: 1456,
      created_at: new Date().toISOString(),
      mode: 'solo' as const,
      thumbnail: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400',
      current_dare: '100 burpees in 10 minutes',
      dare_amount: 200,
    },
    {
      id: '4',
      title: 'Fear Factor Challenge',
      performer_id: 'user4',
      performer_name: 'Fearless',
      status: 'live' as const,
      viewer_count: 987,
      created_at: new Date().toISOString(),
      mode: 'solo' as const,
      thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
      current_dare: 'Hold tarantula for 2 minutes',
      dare_amount: 750,
    },
  ];

  const categories = ['All', 'Physical', 'Mental', 'Food', 'Extreme'];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Featured Stream */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Featured Stream"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="relative h-full flex items-end">
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                  LIVE
                </div>
                <div className="flex items-center text-white text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  2,847 watching
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ice Bath Challenge - $500 Dare
              </h1>
              
              <p className="text-gray-300 text-lg mb-6">
                DareKing attempts to stay in an ice bath for 5 minutes to win $500
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/watch/1"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Now
                </Link>
                
                {!user && (
                  <Link
                    to="/signup"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors hover:bg-white/20"
                  >
                    Sign Up to Interact
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Live Streams Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Live Streams</h2>
          <Link
            to="/live"
            className="text-red-400 hover:text-red-300 flex items-center text-sm font-medium"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-900/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2">50K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-gray-400">Dares Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">$2M+</div>
            <div className="text-gray-400">Rewards Paid</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Live Streams</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How DareStream Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Watch Streams</h3>
            <p className="text-gray-400">
              Browse live streams and watch performers take on incredible challenges
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-white font-bold text-xl">$</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Submit Dares</h3>
            <p className="text-gray-400">
              Buy tokens and submit custom dares with rewards for streamers to attempt
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Earn Rewards</h3>
            <p className="text-gray-400">
              Streamers earn money by completing dares, viewers earn by successful predictions
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};