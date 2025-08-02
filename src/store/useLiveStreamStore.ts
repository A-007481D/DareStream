import { create } from 'zustand';
import { LiveKitService } from '../lib/livekit';
import { socketService, TipEvent, VoteEvent } from '../lib/socket';
import { v4 as uuidv4 } from 'uuid';

export interface LiveStream {
  id: string;
  title: string;
  streamerId: string;
  streamerName: string;
  status: 'preparing' | 'live' | 'ended';
  viewerCount: number;
  totalTips: number;
  totalVotes: number;
  startedAt?: string;
  endedAt?: string;
  currentChallenge?: string;
  challengeTimer?: number;
  roomToken?: string;
}

export interface StreamViewer {
  id: string;
  username: string;
  joinedAt: string;
}

export interface StreamTip {
  id: string;
  fromUserId: string;
  fromUsername: string;
  amount: number;
  message?: string;
  timestamp: string;
}

export interface StreamVote {
  id: string;
  userId: string;
  username: string;
  voteType: 'pressure' | 'support' | 'next-dare';
  timestamp: string;
}

interface LiveStreamState {
  // Current stream state
  currentStream: LiveStream | null;
  isStreaming: boolean;
  isViewing: boolean;
  
  // Stream data
  viewers: StreamViewer[];
  tips: StreamTip[];
  votes: StreamVote[];
  
  // Services
  liveKitService: LiveKitService | null;
  
  // Actions
  startStream: (title: string, challenge?: string) => Promise<boolean>;
  endStream: () => Promise<void>;
  joinStream: (streamId: string) => Promise<boolean>;
  leaveStream: () => Promise<void>;
  sendTip: (amount: number, message?: string) => Promise<boolean>;
  submitVote: (voteType: 'pressure' | 'support' | 'next-dare') => Promise<boolean>;
  
  // Internal actions
  setCurrentStream: (stream: LiveStream | null) => void;
  updateViewerCount: (count: number) => void;
  addTip: (tip: StreamTip) => void;
  addVote: (vote: StreamVote) => void;
  addViewer: (viewer: StreamViewer) => void;
  removeViewer: (viewerId: string) => void;
}

export const useLiveStreamStore = create<LiveStreamState>((set, get) => ({
  currentStream: null,
  isStreaming: false,
  isViewing: false,
  viewers: [],
  tips: [],
  votes: [],
  liveKitService: null,

  startStream: async (title: string, challenge?: string) => {
    try {
      const streamId = uuidv4();
      const liveKitService = new LiveKitService();
      
      // Mock room token generation - in production, get from your backend
      const roomToken = `mock-token-${streamId}`;
      
      const stream: LiveStream = {
        id: streamId,
        title,
        streamerId: 'current-user', // Get from auth store
        streamerName: 'Current User', // Get from auth store
        status: 'preparing',
        viewerCount: 0,
        totalTips: 0,
        totalVotes: 0,
        currentChallenge: challenge,
        roomToken
      };

      set({ 
        currentStream: stream, 
        liveKitService,
        isStreaming: true,
        viewers: [],
        tips: [],
        votes: []
      });

      // Connect to LiveKit room
      const wsUrl = 'wss://your-livekit-server.com'; // Replace with your LiveKit server
      await liveKitService.connect(wsUrl, roomToken, {
        onParticipantConnected: (participant) => {
          const viewer: StreamViewer = {
            id: participant.identity,
            username: participant.name || participant.identity,
            joinedAt: new Date().toISOString()
          };
          get().addViewer(viewer);
          get().updateViewerCount(liveKitService.getViewerCount());
        },
        onParticipantDisconnected: (participant) => {
          get().removeViewer(participant.identity);
          get().updateViewerCount(liveKitService.getViewerCount());
        }
      });

      // Start streaming
      await liveKitService.startStreaming();

      // Connect to socket for real-time events
      socketService.connect('ws://localhost:3001', 'current-user', 'auth-token');
      
      // Set up event listeners
      socketService.on('tip-sent', (tipData: TipEvent) => {
        const tip: StreamTip = {
          id: uuidv4(),
          fromUserId: tipData.fromUserId,
          fromUsername: tipData.fromUsername,
          amount: tipData.amount,
          message: tipData.message,
          timestamp: new Date(tipData.timestamp).toISOString()
        };
        get().addTip(tip);
      });

      socketService.on('vote-submitted', (voteData: VoteEvent) => {
        const vote: StreamVote = {
          id: uuidv4(),
          userId: voteData.userId,
          username: voteData.username,
          voteType: voteData.voteType,
          timestamp: new Date(voteData.timestamp).toISOString()
        };
        get().addVote(vote);
      });

      // Start the stream
      socketService.startStream(streamId, { title, challenge });

      // Update stream status
      set((state) => ({
        currentStream: state.currentStream ? {
          ...state.currentStream,
          status: 'live',
          startedAt: new Date().toISOString()
        } : null
      }));

      return true;
    } catch (error) {
      console.error('Failed to start stream:', error);
      set({ isStreaming: false, currentStream: null, liveKitService: null });
      return false;
    }
  },

  endStream: async () => {
    const { currentStream, liveKitService } = get();
    if (!currentStream || !liveKitService) return;

    try {
      // Stop streaming
      await liveKitService.stopStreaming();
      await liveKitService.disconnect();

      // End stream on socket
      socketService.endStream(currentStream.id);
      socketService.disconnect();

      // Update stream status
      set((state) => ({
        currentStream: state.currentStream ? {
          ...state.currentStream,
          status: 'ended',
          endedAt: new Date().toISOString()
        } : null,
        isStreaming: false,
        liveKitService: null
      }));
    } catch (error) {
      console.error('Failed to end stream:', error);
    }
  },

  joinStream: async (streamId: string) => {
    try {
      const liveKitService = new LiveKitService();
      
      // Mock getting stream data and room token
      const roomToken = `viewer-token-${streamId}`;
      const wsUrl = 'wss://your-livekit-server.com';

      await liveKitService.connect(wsUrl, roomToken);

      // Connect to socket
      socketService.connect('ws://localhost:3001', 'current-user', 'auth-token');
      socketService.joinStream(streamId);

      set({ 
        liveKitService,
        isViewing: true
      });

      return true;
    } catch (error) {
      console.error('Failed to join stream:', error);
      return false;
    }
  },

  leaveStream: async () => {
    const { currentStream, liveKitService } = get();
    if (!currentStream || !liveKitService) return;

    try {
      await liveKitService.disconnect();
      socketService.leaveStream(currentStream.id);
      socketService.disconnect();

      set({
        isViewing: false,
        liveKitService: null,
        currentStream: null
      });
    } catch (error) {
      console.error('Failed to leave stream:', error);
    }
  },

  sendTip: async (amount: number, message?: string) => {
    const { currentStream } = get();
    if (!currentStream) return false;

    try {
      const tipData: TipEvent = {
        streamId: currentStream.id,
        fromUserId: 'current-user',
        fromUsername: 'Current User',
        amount,
        message,
        timestamp: Date.now()
      };

      socketService.sendTip(tipData);
      return true;
    } catch (error) {
      console.error('Failed to send tip:', error);
      return false;
    }
  },

  submitVote: async (voteType: 'pressure' | 'support' | 'next-dare') => {
    const { currentStream } = get();
    if (!currentStream) return false;

    try {
      const voteData: VoteEvent = {
        streamId: currentStream.id,
        userId: 'current-user',
        username: 'Current User',
        voteType,
        timestamp: Date.now()
      };

      socketService.submitVote(voteData);
      return true;
    } catch (error) {
      console.error('Failed to submit vote:', error);
      return false;
    }
  },

  setCurrentStream: (stream) => set({ currentStream: stream }),
  
  updateViewerCount: (count) => set((state) => ({
    currentStream: state.currentStream ? {
      ...state.currentStream,
      viewerCount: count
    } : null
  })),

  addTip: (tip) => set((state) => ({
    tips: [...state.tips, tip],
    currentStream: state.currentStream ? {
      ...state.currentStream,
      totalTips: state.currentStream.totalTips + tip.amount
    } : null
  })),

  addVote: (vote) => set((state) => ({
    votes: [...state.votes, vote],
    currentStream: state.currentStream ? {
      ...state.currentStream,
      totalVotes: state.currentStream.totalVotes + 1
    } : null
  })),

  addViewer: (viewer) => set((state) => ({
    viewers: [...state.viewers, viewer]
  })),

  removeViewer: (viewerId) => set((state) => ({
    viewers: state.viewers.filter(v => v.id !== viewerId)
  }))
}));