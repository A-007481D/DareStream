import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Heart, 
  Trophy, 
  Zap, 
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  Circle
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Browse', href: '/live', icon: Compass },
    { name: 'Following', href: '/following', icon: Heart },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Dare Roulette', href: '/dares', icon: Zap },
  ];

  // Mock recommended streamers
  const recommendedStreamers = [
    { id: '1', username: 'DareKing', viewers: 2847, isLive: true },
    { id: '2', username: 'HeatMaster', viewers: 1923, isLive: true },
    { id: '3', username: 'FitnessDare', viewers: 1456, isLive: true },
    { id: '4', username: 'Fearless', viewers: 987, isLive: true },
    { id: '5', username: 'DanceMachine', viewers: 756, isLive: true },
    { id: '6', username: 'BrainPower', viewers: 543, isLive: true },
    { id: '7', username: 'ExtremeMaster', viewers: 432, isLive: false },
    { id: '8', username: 'WildCard', viewers: 321, isLive: false },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 z-40 flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            DareStream
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Recommended Section */}
        <div className="px-4 py-2 border-t border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Recommended
            </h3>
            <button className="text-gray-500 hover:text-gray-300">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {recommendedStreamers.slice(0, 6).map((streamer) => (
              <Link
                key={streamer.id}
                to={`/stream/${streamer.id}`}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {streamer.username[0]}
                    </span>
                  </div>
                  {streamer.isLive && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-gray-900" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {streamer.username}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    {streamer.isLive ? (
                      <>
                        <Circle className="w-2 h-2 fill-red-500 text-red-500" />
                        <span>{streamer.viewers.toLocaleString()}</span>
                      </>
                    ) : (
                      <span>Offline</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
            Show More
          </button>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{user.username}</div>
                <div className="text-gray-400 text-sm">{user.coins} tokens</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <Settings className="w-4 h-4 mx-auto" />
              </button>
              <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <HelpCircle className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="block w-full bg-gray-800 hover:bg-gray-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};