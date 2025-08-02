import { create } from 'zustand';
import { Stream, Dare, ChatMessage } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';

interface StreamState {
  currentStream: Stream | null;
  streams: Stream[];
  dares: Dare[];
  chatMessages: ChatMessage[];
  pressureMeter: number;
  searchResults: Stream[];
  setCurrentStream: (stream: Stream | null) => void;
  setStreams: (streams: Stream[]) => void;
  setDares: (dares: Dare[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  increasePressure: () => void;
  resetPressure: () => void;
  fetchActiveStreams: () => Promise<void>;
  fetchTopDares: () => Promise<void>;
  searchStreams: (query: string) => void;
  submitDare: (dare: Omit<Dare, 'id' | 'created_at' | 'votes' | 'status'>) => Promise<boolean>;
  voteDare: (dareId: string, userId: string) => boolean;
  approveDare: (dareId: string) => void;
  rejectDare: (dareId: string) => void;
}

export const useStreamStore = create<StreamState>((set, get) => ({
  currentStream: null,
  streams: [],
  dares: [],
  chatMessages: [],
  pressureMeter: 0,
  searchResults: [],
  setCurrentStream: (stream) => set({ currentStream: stream }),
  setStreams: (streams) => set({ streams }),
  setDares: (dares) => set({ dares }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
  increasePressure: () => set((state) => ({
    pressureMeter: Math.min(state.pressureMeter + 1, 100)
  })),
  resetPressure: () => set({ pressureMeter: 0 }),
  fetchActiveStreams: async () => {
    const { data } = await supabase
      .from('streams')
      .select('*')
      .eq('status', 'live')
      .order('viewer_count', { ascending: false });
    
    if (data) set({ streams: data });
  },
  fetchTopDares: async () => {
    const { data } = await supabase
      .from('dares')
      .select('*')
      .eq('status', 'pending')
      .order('votes', { ascending: false })
      .limit(10);
    
    if (data) set({ dares: data });
  },
  searchStreams: (query: string) => {
    const { streams } = get();
    const results = streams.filter(stream => 
      stream.title.toLowerCase().includes(query.toLowerCase()) ||
      stream.performer_name?.toLowerCase().includes(query.toLowerCase())
    );
    set({ searchResults: results });
  },
  submitDare: async (dareData) => {
    const { deductTokens } = useAuthStore.getState();
    
    // Deduct tokens from user
    const success = deductTokens(dareData.cost);
    if (!success) {
      return false;
    }
    
    const newDare: Dare = {
      ...dareData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      votes: 0,
      status: 'pending',
    };
    
    // Store dare in localStorage for persistence
    const existingDares = JSON.parse(localStorage.getItem('dares') || '[]');
    existingDares.push(newDare);
    localStorage.setItem('dares', JSON.stringify(existingDares));
    
    set((state) => ({
      dares: [...state.dares, newDare]
    }));
    
    return true;
  },
  voteDare: (dareId: string, userId: string) => {
    const { deductTokens } = useAuthStore.getState();
    
    // Voting costs 10 tokens
    const success = deductTokens(10);
    if (!success) {
      return false;
    }
    
    set((state) => ({
      dares: state.dares.map(dare => 
        dare.id === dareId 
          ? { ...dare, votes: dare.votes + 1, priority_score: (dare.priority_score || 0) + 10 }
          : dare
      )
    }));
    
    // Update localStorage
    const { dares } = get();
    localStorage.setItem('dares', JSON.stringify(dares));
    
    return true;
  },
  approveDare: (dareId: string) => {
    set((state) => ({
      dares: state.dares.map(dare => 
        dare.id === dareId 
          ? { ...dare, status: 'approved' }
          : dare
      )
    }));
    
    // Update localStorage
    const { dares } = get();
    localStorage.setItem('dares', JSON.stringify(dares));
  },
  rejectDare: (dareId: string) => {
    const { updateTokens } = useAuthStore.getState();
    
    set((state) => {
      const dare = state.dares.find(d => d.id === dareId);
      if (dare) {
        // Refund tokens to the user who submitted the dare
        updateTokens(dare.cost);
      }
      
      return {
        dares: state.dares.map(d => 
          d.id === dareId 
            ? { ...d, status: 'rejected' }
            : d
        )
      };
    });
    
    // Update localStorage
    const { dares } = get();
    localStorage.setItem('dares', JSON.stringify(dares));
  },
}));