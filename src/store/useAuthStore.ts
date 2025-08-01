import { create } from 'zustand';
import { User } from '../types';
import { supabase, getCurrentUser } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  initialize: async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        // Mock user data for demo - in real app would fetch from Supabase
        const mockUser: User = {
          id: user.id,
          username: user.user_metadata?.username || 'User',
          email: user.email || '',
          coins: 1000, // Starting tokens
          created_at: new Date().toISOString(),
          is_verified: false,
        };
        
        set({ user: mockUser, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, loading: false });
    }
  },
  logout: async () => {
    try {
      // Clear the user state immediately to prevent any UI flicker
      set({ user: null });
      // Then sign out from Supabase
      await supabase.auth.signOut();
      // Force a full page reload to clear any state that might trigger API calls
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      // Still redirect even if there's an error
      window.location.href = '/';
    }
  },
}));