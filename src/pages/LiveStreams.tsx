import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import { StreamCard } from '../components/Stream/StreamCard';
import { useStreamStore } from '../store/useStreamStore';
import { useAuthStore } from '../store/useAuthStore';

export const LiveStreams: React.FC = () => {
  const { streams, fetchActiveStreams } = useStreamStore();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('viewers');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchActiveStreams();
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [fetchActiveStreams]);

  // Mock data for demo
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
    {
      id: '5',
      title: 'Dance Marathon Challenge',
      performer_id: 'user5',
      performer_name: 'DanceMachine',
      status: 'live' as const,
      viewer_count: 756,
      created_at: new Date().toISOString(),
      mode: 'solo' as const,
      thumbnail: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
      current_dare: 'Dance for 2 hours straight',
      dare_amount: 400,
    },
    {
      id: '6',
      title: 'Memory Challenge Battle',
      performer_id: 'user6',
      performer_name: 'BrainPower',
      status: 'live' as const,
      viewer_count: 543,
      created_at: new Date().toISOString(),
      mode: 'battle' as const,
      thumbnail: 'https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=400',
      current_dare: 'Memorize 100 random numbers',
      dare_amount: 250,
    },
  ];

  const categories = ['All', 'Physical', 'Mental', 'Food', 'Extreme', 'Creative'];
  const sortOptions = [
    { value: 'viewers', label: 'Most Viewers' },
    { value: 'recent', label: 'Recently Started' },
    { value: 'amount', label: 'Highest Reward' },
  ];

  const filteredStreams = mockStreams
    .filter(stream => {
      const matchesCategory = selectedCategory === 'All' || 
        stream.current_dare?.toLowerCase().includes(selectedCategory.toLowerCase());
      
      const matchesSearch = !searchQuery || 
        stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.performer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.current_dare?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'viewers':
          return b.viewer_count - a.viewer_count;
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'amount':
          return (b.dare_amount || 0) - (a.dare_amount || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Streams</h1>
            <p className="text-gray-400">
              {filteredStreams.length} streamers live now
              {searchQuery && ` • Searching for "${searchQuery}"`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* No Results */}
        {filteredStreams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No streams found</div>
            <p className="text-gray-500">
              {searchQuery 
                ? `No streams match "${searchQuery}". Try a different search term.`
                : 'No streams match the selected filters. Try changing your filters.'
              }
            </p>
          </div>
        )}

        {/* Streams Grid */}
        {filteredStreams.length > 0 && (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredStreams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredStreams.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Load More Streams
            </button>
          </div>
        )}
      </div>
    </div>
  );
};