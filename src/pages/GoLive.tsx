import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveStreamStore } from '../store/useLiveStreamStore';
import { useAuthStore } from '../store/useAuthStore';
import { StreamerView } from '../components/Live/StreamerView';
import { GoLiveModal } from '../components/Live/GoLiveModal';

export const GoLive: React.FC = () => {
  const { user } = useAuthStore();
  const { isStreaming } = useLiveStreamStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/go-live' } });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Please log in to start streaming</div>
      </div>
    );
  }

  if (isStreaming) {
    return <StreamerView />;
  }

  return (
    <div className="min-h-screen bg-black">
      <GoLiveModal onClose={() => navigate('/')} />
    </div>
  );
};