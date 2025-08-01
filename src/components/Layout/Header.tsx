import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, User, Coins, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-black text-white border-b border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              DareStream
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/live" className="hover:text-red-400 transition-colors">
              Live Streams
            </Link>
            <Link to="/dares" className="hover:text-red-400 transition-colors">
              Dare Roulette
            </Link>
            <Link to="/leaderboard" className="hover:text-red-400 transition-colors">
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{user.coins}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm hover:text-red-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};