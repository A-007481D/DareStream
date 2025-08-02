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
          coins: 1000, // Starting coins
          tokens: 1000, // Starting tokens
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
      // 1. First, clear any pending requests or subscriptions
      // 2. Then clear the user state
      set({ user: null, loading: false });
      
      // 3. Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // 4. Clear any local storage that might contain auth state
      localStorage.removeItem('sb-uesrkefrhfiszpxtdhyd-auth-token');
      
      // 5. Force a full page reload to clear all state
      // Using window.location.replace() to prevent the back button from working
      window.location.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still force redirect even if there was an error
      window.location.replace('/');
    }
  },
}));