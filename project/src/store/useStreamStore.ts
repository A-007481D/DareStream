import { create } from 'zustand';
import { Stream, Dare, ChatMessage } from '../types';
import { supabase } from '../lib/supabase';

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
}));