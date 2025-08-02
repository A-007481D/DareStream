import React, { useState, useEffect } from 'react';
import { Clock, Users, Zap, Check, X, Eye, MessageSquare, Heart, Timer, AlertCircle } from 'lucide-react';
import { Dare, DareReaction } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useStreamStore } from '../../store/useStreamStore';
import { Button } from '../ui/Button';

interface DareQueueProps {
  streamId: string;
  isStreamer?: boolean;
}

export const DareQueue: React.FC<DareQueueProps> = ({ streamId, isStreamer = false }) => {
  const { user } = useAuthStore();
  const { voteDare, approveDare, rejectDare } = useStreamStore();
  const [dares, setDares] = useState<Dare[]>([]);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'active' | 'completed'>('pending');
  const [votedDares, setVotedDares] = useState<Set<string>>(new Set());

  // Load dares from localStorage on component mount
  useEffect(() => {
    const storedDares = JSON.parse(localStorage.getItem('dares') || '[]');
    const streamDares = storedDares.filter((dare: Dare) => dare.stream_id === streamId);
    setDares(streamDares);
  }, [streamId]);

  // Mock data for demonstration
  useEffect(() => {
    // Only add mock data if no dares exist
    const storedDares = JSON.parse(localStorage.getItem('dares') || '[]');
    if (storedDares.length > 0) return;
    
    const mockDares: Dare[] = [
      {
        id: '1',
        title: 'Ice Bath Challenge',
        description: 'Stay in ice bath for 5 minutes straight',
        difficulty: 'extreme',
        cost: 500,
        votes: 23,
        status: 'pending',
        created_by: 'user1',
        created_by_username: 'DareKing',
        created_at: new Date().toISOString(),
        stream_id: streamId,
        category: 'physical',
        time_limit: 10,
        priority_score: 850,
        total_contributions: 750,
        contributors: [
          { user_id: 'user1', username: 'DareKing', amount: 500, created_at: new Date().toISOString() },
          { user_id: 'user2', username: 'ChallengeSeeker', amount: 250, created_at: new Date().toISOString() }
        ],
        reactions: [
          { id: '1', dare_id: '1', user_id: 'user3', emoji: '🔥', created_at: new Date().toISOString() },
          { id: '2', dare_id: '1', user_id: 'user4', emoji: '💀', created_at: new Date().toISOString() }
        ]
      },
      {
        id: '2',
        title: 'Spicy Noodle Challenge',
        description: 'Eat the spiciest ramen without drinking anything for 2 minutes',
        difficulty: 'wild',
        cost: 250,
        votes: 18,
        status: 'approved',
        created_by: 'user2',
        created_by_username: 'HeatLover',
        created_at: new Date().toISOString(),
        stream_id: streamId,
        category: 'food',
        time_limit: 5,
        priority_score: 420,
        total_contributions: 350
      },
      {
        id: '3',
        title: 'Dance Marathon',
        description: 'Dance non-stop for 30 minutes',
        difficulty: 'mild',
        cost: 100,
        votes: 31,
        status: 'active',
        created_by: 'user3',
        created_by_username: 'DanceFan',
        created_at: new Date().toISOString(),
        stream_id: streamId,
        category: 'creative',
        time_limit: 35,
        priority_score: 310
      }
    ];
    setDares(mockDares);
    localStorage.setItem('dares', JSON.stringify(mockDares));
  }, [streamId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'mild': return 'text-green-400 bg-green-400/10';
      case 'wild': return 'text-orange-400 bg-orange-400/10';
      case 'extreme': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const handleVote = (dareId: string) => {
    if (!user || votedDares.has(dareId)) return;
    
    const success = voteDare(dareId, user.id);
    if (success) {
      setDares(prev => prev.map(dare => 
        dare.id === dareId 
          ? { ...dare, votes: dare.votes + 1, priority_score: (dare.priority_score || 0) + 10 }
          : dare
      ));
      setVotedDares(prev => new Set([...prev, dareId]));
    } else {
      alert('Insufficient tokens to vote! Voting costs 10 tokens.');
    }
  };

  const handleContribute = (dareId: string, amount: number) => {
    if (!user) return;
    
    setDares(prev => prev.map(dare => 
      dare.id === dareId 
        ? { 
            ...dare, 
            total_contributions: (dare.total_contributions || 0) + amount,
            priority_score: (dare.priority_score || 0) + amount * 2,
            contributors: [
              ...(dare.contributors || []),
              { user_id: user.id, username: user.username, amount, created_at: new Date().toISOString() }
            ]
          }
        : dare
    ));
  };

  const handleModeration = (dareId: string, action: 'approve' | 'reject', notes?: string) => {
    if (!isStreamer) return;
    
    if (action === 'approve') {
      approveDare(dareId);
    } else {
      rejectDare(dareId);
    }
    
    setDares(prev => prev.map(dare => 
      dare.id === dareId 
        ? { 
            ...dare, 
            status: action === 'approve' ? 'approved' : 'rejected',
            moderation_notes: notes
          }
        : dare
    ));
  };

  const handleActivate = (dareId: string) => {
    if (!isStreamer) return;
    
    setDares(prev => prev.map(dare => 
      dare.id === dareId 
        ? { ...dare, status: 'active' }
        : dare.status === 'active' 
          ? { ...dare, status: 'approved' }
          : dare
    ));
  };

  const filteredDares = dares
    .filter(dare => dare.status === selectedTab)
    .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));

  const tabs = [
    { key: 'pending', label: 'Pending', count: dares.filter(d => d.status === 'pending').length },
    { key: 'approved', label: 'Approved', count: dares.filter(d => d.status === 'approved').length },
    { key: 'active', label: 'Active', count: dares.filter(d => d.status === 'active').length },
    { key: 'completed', label: 'Completed', count: dares.filter(d => d.status === 'completed').length }
  ];

  return (
    <div className="h-full flex flex-col p-3 sm:p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">Dare Queue</h2>
        {isStreamer && (
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-400">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Streamer Controls</span>
            <span className="sm:hidden">Controls</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 sm:mb-6 bg-gray-800 rounded-lg p-1 flex-shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`flex-1 px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
              selectedTab === tab.key
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 sm:ml-2 bg-gray-600 text-xs px-1 sm:px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dare List */}
      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 min-h-0">
        {filteredDares.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-400">
            <div className="text-base sm:text-lg mb-2">No {selectedTab} dares</div>
            <p className="text-xs sm:text-sm">
              {selectedTab === 'pending' && 'Waiting for new dare submissions...'}
              {selectedTab === 'approved' && 'No approved dares ready to activate.'}
              {selectedTab === 'active' && 'No dares currently in progress.'}
              {selectedTab === 'completed' && 'No completed dares yet.'}
            </p>
          </div>
        ) : (
          filteredDares.map(dare => (
            <div key={dare.id} className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-2">
                    <h3 className="text-white font-bold text-sm sm:text-lg">{dare.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(dare.difficulty)}`}>
                      {dare.difficulty.toUpperCase()}
                    </span>
                      {dare.time_limit && (
                        <div className="flex items-center text-gray-400 text-xs">
                        <Timer className="w-3 h-3 mr-1" />
                        {dare.time_limit}min limit
                      </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-2 sm:mb-3 text-xs sm:text-sm">{dare.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
                    <span>By {dare.created_by_username}</span>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {dare.votes} votes
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" />
                      {dare.total_contributions || dare.cost} tokens
                    </div>
                    {dare.priority_score && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                        Priority: {dare.priority_score}
                      </div>
                    )}
                  </div>

                  {/* Contributors */}
                  {dare.contributors && dare.contributors.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-400 mb-1">Contributors:</div>
                      <div className="flex flex-wrap gap-1">
                        {dare.contributors.slice(0, 3).map((contributor, index) => (
                          <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded">
                            {contributor.username}: {contributor.amount} tokens
                          </span>
                        ))}
                        {dare.contributors.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{dare.contributors.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reactions */}
                  {dare.reactions && dare.reactions.length > 0 && (
                    <div className="flex items-center space-x-2 mb-3">
                      {dare.reactions.slice(0, 5).map((reaction, index) => (
                        <span key={index} className="text-lg">
                          {reaction.emoji}
                        </span>
                      ))}
                      {dare.reactions.length > 5 && (
                        <span className="text-xs text-gray-400">
                          +{dare.reactions.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-lg sm:text-2xl font-bold text-yellow-400 mb-1 sm:mb-2">
                    {dare.total_contributions || dare.cost}
                  </div>
                  <div className="text-xs text-gray-400">tokens</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-700 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Viewer Actions */}
                  {!isStreamer && user && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVote(dare.id)}
                        disabled={votedDares.has(dare.id)}
                        className="text-xs px-2 py-1"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {votedDares.has(dare.id) ? 'Voted' : 'Vote'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContribute(dare.id, 50)}
                        className="text-xs px-2 py-1 bg-yellow-600/10 border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        +50 Tokens
                      </Button>
                    </>
                  )}

                  {/* Streamer Actions */}
                  {isStreamer && (
                    <>
                      {dare.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleModeration(dare.id, 'approve')}
                            className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleModeration(dare.id, 'reject')}
                            className="text-xs px-2 py-1 border-red-600/30 text-red-400 hover:bg-red-600/20"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {dare.status === 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => handleActivate(dare.id)}
                          className="text-xs px-2 py-1"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Start Dare
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-1 sm:space-x-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  {new Date(dare.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};