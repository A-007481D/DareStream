import React, { useState } from 'react';
import { Search, Menu, X, Coins, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useStreamStore } from '../../store/useStreamStore';

interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user } = useAuthStore();
  const { searchStreams } = useStreamStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchStreams(searchQuery);
      window.location.href = `/live?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden text-gray-400 hover:text-white transition-colors"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search streamers, dares, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </form>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* Tokens */}
            <div className="hidden sm:flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-full">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-white font-medium">{user.coins}</span>
            </div>
            
            {/* User Avatar */}
            <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded-full transition-colors">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <span className="text-white text-sm hidden sm:block">{user.username}</span>
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};