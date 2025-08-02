import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { CreditCard, Zap, Plus, Minus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'INR' | 'BRL';

interface TokenPackage {
  id: string;
  tokens: number;
  bonus: number;
  price: number;
  popular?: boolean;
}

export const TokenPurchase = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(100);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();
  
  const exchangeRates: Record<Currency, number> = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.72,
    JPY: 110.15,
    CAD: 1.25,
    AUD: 1.35,
    INR: 75.5,
    BRL: 5.3
  };

  const tokenPackages: TokenPackage[] = [
    { id: '1', tokens: 100, bonus: 0, price: 0.99 },
    { id: '2', tokens: 550, bonus: 50, price: 4.99 },
    { id: '3', tokens: 1200, bonus: 300, price: 9.99, popular: true },
    { id: '4', tokens: 2500, bonus: 1000, price: 19.99 },
    { id: '5', tokens: 5000, bonus: 2500, price: 34.99 },
  ];

  // Detect user's locale for default currency
  useEffect(() => {
    const userLocale = navigator.language;
    const localeToCurrency: Record<string, Currency> = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'en-EU': 'EUR',
      'ja-JP': 'JPY',
      'en-CA': 'CAD',
      'en-AU': 'AUD',
      'en-IN': 'INR',
      'pt-BR': 'BRL',
    };
    
    const detectedCurrency = localeToCurrency[userLocale] || 'USD';
    setCurrency(detectedCurrency as Currency);
  }, []);

  const convertPrice = (price: number) => {
    return (price * exchangeRates[currency]).toFixed(2);
  };

  const getCurrencySymbol = () => {
    const symbols: Record<Currency, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
      INR: '₹',
      BRL: 'R$',
    };
    return symbols[currency];
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCustomAmount(Math.min(100000, Math.max(100, value)));
  };

  const incrementCustomAmount = () => {
    setCustomAmount(prev => Math.min(100000, prev + 100));
  };

  const decrementCustomAmount = () => {
    setCustomAmount(prev => Math.max(100, prev - 100));
  };

  const calculateCustomPrice = () => {
    const basePrice = (customAmount / 100) * 0.99; // $0.99 per 100 tokens
    return (basePrice * exchangeRates[currency]).toFixed(2);
  };

  const handlePurchase = async (pkg: TokenPackage) => {
    if (!user) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real app, you would call your payment API here
      // For demo, we'll just update the local state
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Update user's token balance
      const updatedUser = {
        ...user,
        tokens: (user.tokens || 0) + pkg.tokens + (pkg.bonus || 0)
      };
      
      setUser(updatedUser);
      
      // In a real app, you would show a success message or redirect to a success page
      alert(`Successfully purchased ${pkg.tokens} tokens!`);
    } catch (err) {
      console.error('Purchase failed:', err);
      setError('Failed to process purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg">
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-200 rounded-lg">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Buy Tokens</h1>
          <p className="text-gray-400">Get tokens to support your favorite streamers</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="bg-gray-800 text-white rounded px-3 py-1 text-sm"
          >
            {Object.entries(exchangeRates).map(([code]) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {tokenPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
              selectedPackage === pkg.id
                ? 'border-red-500 bg-gray-800'
                : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
            } ${pkg.popular ? 'ring-2 ring-red-500' : ''}`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {pkg.tokens.toLocaleString()}
                {pkg.bonus > 0 && (
                  <span className="text-sm text-green-400 ml-1">+{pkg.bonus}</span>
                )}
              </div>
              <div className="text-gray-400 mb-4">tokens</div>
              <div className="text-2xl font-bold text-white mb-2">
                {getCurrencySymbol()}
                {convertPrice(pkg.price)}
              </div>
              <div className="text-sm text-gray-400 mb-6">
                {getCurrencySymbol()}
                {(pkg.price / (pkg.tokens / 100)).toFixed(2)} per 100 tokens
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(pkg);
                }}
                className="w-full"
                disabled={isProcessing}
              >
                <Zap className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Custom Amount</h2>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter token amount (100 - 100,000)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <input
                type="number"
                min="100"
                max="100000"
                step="100"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="block w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={decrementCustomAmount}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-2 text-gray-300">|</span>
                <button
                  type="button"
                  onClick={incrementCustomAmount}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {getCurrencySymbol()}
              {calculateCustomPrice()}
            </div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <Button 
            className="whitespace-nowrap"
            disabled={isProcessing}
            onClick={async () => {
              setIsProcessing(true);
              setError(null);
              
              try {
                // In a real app, you would call your payment API here
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Update user's token balance
                if (user) {
                  const updatedUser = {
                    ...user,
                    tokens: (user.tokens || 0) + customAmount
                  };
                  setUser(updatedUser);
                  alert(`Successfully purchased ${customAmount} tokens!`);
                }
              } catch (err) {
                console.error('Purchase failed:', err);
                setError('Failed to process purchase. Please try again.');
              } finally {
                setIsProcessing(false);
              }
            }}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-800/30 rounded-lg">
        <h3 className="font-medium text-gray-300 mb-2">How to use tokens?</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Support your favorite streamers with tips</li>
          <li>• Unlock exclusive content</li>
          <li>• Get special badges and emotes</li>
          <li>• Participate in giveaways and contests</li>
        </ul>
      </div>
    </div>
  );
};

export default TokenPurchase;
