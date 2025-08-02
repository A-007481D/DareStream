import React from 'react';
import { useParams } from 'react-router-dom';
import { ViewerInterface } from '../components/Live/ViewerInterface';

export const WatchStream: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Stream not found</div>
      </div>
    );
  }

  return <ViewerInterface streamId={id} />;
};