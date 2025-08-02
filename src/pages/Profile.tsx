import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Settings, LogOut, Edit3, Video, Share2, Users, Award, 
  UserPlus, Star, Zap, BarChart2, Clock, Trophy, Activity, 
  Trophy as TrophyIcon, UserCheck, MessageSquare, Bell, Plus, Search, Filter
} from 'lucide-react';
import { signOut } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { StatCard } from '../components/Profile/StatCard';
import { TabButton } from '../components/Profile/TabButton';
import { ActivityItem } from '../components/Profile/ActivityItem';
import { Section } from '../components/Profile/Section';

// Mock data - in a real app, this would come from your backend
// Mock data - in a real app, this would come from your backend
const mockStats = {
  followers: 1243,
  following: 542,
  streams: 28,
  totalEarned: 1250,
  rating: 4.8,
  challengesCompleted: 42,
  challengesWon: 28,
  currentStreak: 12,
};

const recentAchievements = [
  { id: 1, name: 'Dare Master', icon: <TrophyIcon className="w-5 h-5 text-yellow-500" /> },
  { id: 2, name: 'Week Streak', icon: <Activity className="w-5 h-5 text-blue-500" /> },
  { id: 3, name: 'Top 10%', icon: <Award className="w-5 h-5 text-purple-500" /> },
];

const upcomingChallenges = [
  { id: 1, title: 'Ice Bucket Challenge', time: 'In 2 hours', opponent: 'DareMaster99' },
  { id: 2, title: 'Spicy Noodle Challenge', time: 'Tomorrow', opponent: 'SpiceKing' },
];

const recentActivities = [
  {
    id: 1,
    title: 'New Follower',
    description: 'DareMaster99 started following you',
    time: '2h ago',
    icon: <UserPlus className="w-5 h-5" />,
    highlight: true
  },
  {
    id: 2,
    title: 'Challenge Completed',
    description: 'You completed the Hot Pepper Challenge',
    time: '5h ago',
    icon: <Award className="w-5 h-5" />,
    highlight: false
  },
  {
    id: 3,
    title: 'New Message',
    description: 'You have a new message from SpiceKing',
    time: '1d ago',
    icon: <MessageSquare className="w-5 h-5" />,
    highlight: true
  },
];

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || 'DareDevil123',
    bio: 'Daredevil and challenge enthusiast! Love pushing my limits and taking on new challenges.',
    location: 'New York, USA',
    website: 'daredevil.example.com',
    followers: 1243,
    following: 542,
    streams: 28,
    totalEarned: 1250,
    rating: 4.8,
    challengesCompleted: 42,
    challengesWon: 28,
    currentStreak: 12,
  });
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown') && !target.closest('.profile-button')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, you would save this to your backend
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleGoLive = () => {
    navigate('/go-live');
  };

  const handleStartRoulette = () => {
    navigate('/roulette');
  };

  const handleShareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user?.username}'s Profile`,
          text: `Check out ${user?.username}'s profile on DareStream!`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="mb-6">Please log in to view your profile</p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/login" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with Cover Photo */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-500 w-full"></div>
        
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={handleShareProfile}
            className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
            title="Share Profile"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            {showDropdown && (
              <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="container mx-auto px-4 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
            <div className="flex items-end space-x-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-700 overflow-hidden">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Edit Profile"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className="bg-gray-800 text-white border-b border-gray-600 focus:outline-none focus:border-red-500"
                    />
                  ) : (
                    user.username
                  )}
                </h1>
                <p className="text-gray-400 flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  {profileData.rating.toFixed(1)} Rating
                </p>
                
                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      placeholder="Location"
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      placeholder="Website"
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>{profileData.location}</span>
                    {profileData.website && (
                      <a 
                        href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {profileData.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 mb-4 w-full md:w-auto mt-4 md:mt-0">
              <Button 
                onClick={handleGoLive}
                className="flex items-center space-x-2"
              >
                <Video className="w-5 h-5" />
                <span>Go Live</span>
              </Button>
              <Button 
                onClick={handleStartRoulette}
                variant="outline"
                className="bg-purple-600 hover:bg-purple-700 border-0 text-white flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Challenge Roulette</span>
              </Button>
            </div>
          </div>
          
          {/* Bio */}
          <div className="mt-4 max-w-2xl">
            {isEditing ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-300">{profileData.bio}</p>
            )}
          </div>
          
          {/* Edit/Save Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-3 mt-4">
              <Button 
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={<Users className="w-6 h-6 text-blue-500" />} 
            label="Followers" 
            value={profileData.followers.toLocaleString()} 
            onClick={() => navigate(`/profile/${user.username}/followers`)}
          />
          <StatCard 
            icon={<UserCheck className="w-6 h-6 text-green-500" />} 
            label="Following" 
            value={profileData.following.toLocaleString()}
            onClick={() => navigate(`/profile/${user.username}/following`)}
          />
          <StatCard 
            icon={<Video className="w-6 h-6 text-red-500" />} 
            label="Streams" 
            value={profileData.streams.toLocaleString()}
          />
          <StatCard 
            icon={<Award className="w-6 h-6 text-yellow-500" />} 
            label="Earned" 
            value={`$${profileData.totalEarned.toLocaleString()}`}
          />
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <div className="flex space-x-1">
            <TabButton
              icon={<BarChart2 className="w-5 h-5" />}
              label="Overview"
              isActive={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <TabButton
              icon={<Trophy className="w-5 h-5" />}
              label="Challenges"
              isActive={activeTab === 'challenges'}
              onClick={() => setActiveTab('challenges')}
              count={profileData.challengesCompleted}
            />
            <TabButton
              icon={<Clock className="w-5 h-5" />}
              label="Scheduled"
              isActive={activeTab === 'scheduled'}
              onClick={() => setActiveTab('scheduled')}
              count={upcomingChallenges.length}
            />
            <TabButton
              icon={<Award className="w-5 h-5" />}
              label="Achievements"
              isActive={activeTab === 'achievements'}
              onClick={() => setActiveTab('achievements')}
              count={recentAchievements.length}
            />
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              <Section title="Recent Activity">
                <div className="space-y-2">
                  {recentActivities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      icon={activity.icon}
                      title={activity.title}
                      description={activity.description}
                      time={activity.time}
                      highlight={activity.highlight}
                    />
                  ))}
                </div>
              </Section>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section 
                  title="Upcoming Challenges"
                  action={
                    <button className="text-sm text-blue-400 hover:text-blue-300">
                      View All
                    </button>
                  }
                >
                  <div className="space-y-4">
                    {upcomingChallenges.map((challenge) => (
                      <div key={challenge.id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{challenge.title}</h4>
                            <p className="text-sm text-gray-400">vs {challenge.opponent}</p>
                          </div>
                          <span className="text-sm text-yellow-400">{challenge.time}</span>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Remind Me
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
                
                <Section 
                  title="Recent Achievements"
                  action={
                    <button className="text-sm text-blue-400 hover:text-blue-300">
                      View All
                    </button>
                  }
                >
                  <div className="grid grid-cols-3 gap-4">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="text-center">
                        <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                          {achievement.icon}
                        </div>
                        <p className="text-xs font-medium">{achievement.name}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            </>
          )}
          
          {activeTab === 'challenges' && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Your Challenges</h3>
              <p className="text-gray-400 mb-6">
                You've completed {profileData.challengesCompleted} challenges and won {profileData.challengesWon} of them!
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Start New Challenge
              </Button>
            </div>
          )}
          
          {activeTab === 'scheduled' && (
            <div className="space-y-4">
              {upcomingChallenges.length > 0 ? (
                upcomingChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-gray-400">vs {challenge.opponent}</p>
                      </div>
                      <span className="text-sm text-yellow-400">{challenge.time}</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Video className="w-4 h-4 mr-2" />
                        Join Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Upcoming Challenges</h3>
                  <p className="text-gray-400 mb-6">
                    You don't have any scheduled challenges yet. Start a new one!
                  </p>
                  <Button onClick={handleStartRoulette}>
                    <Zap className="w-4 h-4 mr-2" />
                    Find a Challenge
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                    {achievement.icon}
                  </div>
                  <h4 className="font-medium mb-1">{achievement.name}</h4>
                  <p className="text-xs text-gray-400">Earned 2 days ago</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
