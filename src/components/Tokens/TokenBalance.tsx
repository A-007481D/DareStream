import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface TokenBalanceProps {
  showLabel?: boolean;
  className?: string;
}

export const TokenBalance = ({ showLabel = true, className = '' }: TokenBalanceProps) => {
  const { user } = useAuthStore();
  
  if (!user) return null;

  return (
    <Link 
      to="/tokens" 
      className={`flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors ${className}`}
    >
      <div className="flex items-center text-yellow-400">
        <Zap className="w-4 h-4 fill-current" />
        <span className="ml-1 font-medium">{user.tokens?.toLocaleString() || '0'}</span>
      </div>
      {showLabel && <span className="text-sm text-gray-300">Tokens</span>}
    </Link>
  );
};

export default TokenBalance;
