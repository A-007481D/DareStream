import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import TokenPurchase from '../components/Tokens/TokenPurchase';

export default function TokensPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/tokens' } });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 px-4 pb-8">
      <div className="max-w-6xl mx-auto">
        <TokenPurchase />
      </div>
    </div>
  );
}
