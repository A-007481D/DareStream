export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  coins: number;
  tokens: number;
  created_at: string;
  is_verified: boolean;
  role?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface Dare {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  cost: number;
  votes: number;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  created_by: string;
  created_at: string;
  performer_id?: string;
  stream_id?: string;
  category?: string;
  reward?: number;
}

export interface Stream {
  id: string;
  title: string;
  performer_id: string;
  performer_name?: string;
  dare_id?: string;
  status: 'waiting' | 'live' | 'ended';
  viewer_count: number;
  created_at: string;
  mode: 'solo' | 'battle';
  agora_channel?: string;
  thumbnail?: string;
  current_dare?: string;
  dare_amount?: number;
}

export interface ChatMessage {
  id: string;
  stream_id: string;
  user_id: string;
  username: string;
  message: string;
  type: 'message' | 'tip' | 'pressure';
  created_at: string;
}

export interface Tip {
  id: string;
  from_user_id: string;
  to_user_id: string;
  stream_id: string;
  amount: number;
  message?: string;
  created_at: string;
}