import { io, Socket } from 'socket.io-client';

export interface StreamEvent {
  type: 'stream-started' | 'viewer-joined' | 'tip-sent' | 'vote-submitted' | 'stream-ended' | 'viewer-left';
  data: any;
  timestamp: number;
}

export interface TipEvent {
  streamId: string;
  fromUserId: string;
  fromUsername: string;
  amount: number;
  message?: string;
  timestamp: number;
}

export interface VoteEvent {
  streamId: string;
  userId: string;
  username: string;
  voteType: 'pressure' | 'support' | 'next-dare';
  timestamp: number;
}

export class SocketService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();

  connect(serverUrl: string, userId: string, token: string) {
    this.socket = io(serverUrl, {
      auth: {
        userId,
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('stream-event', (event: StreamEvent) => {
      this.handleStreamEvent(event);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Stream management
  startStream(streamId: string, streamData: any) {
    this.socket?.emit('start-stream', { streamId, ...streamData });
  }

  endStream(streamId: string) {
    this.socket?.emit('end-stream', { streamId });
  }

  joinStream(streamId: string) {
    this.socket?.emit('join-stream', { streamId });
  }

  leaveStream(streamId: string) {
    this.socket?.emit('leave-stream', { streamId });
  }

  // Interactions
  sendTip(tipData: TipEvent) {
    this.socket?.emit('send-tip', tipData);
  }

  submitVote(voteData: VoteEvent) {
    this.socket?.emit('submit-vote', voteData);
  }

  // Event handling
  on(eventType: string, handler: Function) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)?.push(handler);
  }

  off(eventType: string, handler: Function) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private handleStreamEvent(event: StreamEvent) {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => handler(event.data));
    }
  }
}

// Singleton instance
export const socketService = new SocketService();