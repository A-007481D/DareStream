import React, { useState, useEffect } from 'react';
import { Bell, Zap, CheckCircle, Clock, Gift, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DareAlert {
  id: string;
  type: 'funded' | 'completed' | 'milestone' | 'goal_reached';
  title: string;
  message: string;
  amount?: number;
  user?: string;
  timestamp: number;
}

interface DareAlertsProps {
  streamId: string;
  isStreamer?: boolean;
}

export const DareAlerts: React.FC<DareAlertsProps> = ({ streamId, isStreamer = false }) => {
  const [alerts, setAlerts] = useState<DareAlert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  // Mock alert generation for demo
  useEffect(() => {
    const generateRandomAlert = () => {
      const alertTypes = [
        {
          type: 'funded' as const,
          title: 'Dare Funded!',
          message: 'Ice Bath Challenge has been fully funded',
          amount: 500,
          user: 'DareKing'
        },
        {
          type: 'completed' as const,
          title: 'Dare Completed!',
          message: 'Successfully completed the Spicy Noodle Challenge',
          amount: 250
        },
        {
          type: 'milestone' as const,
          title: 'Milestone Reached!',
          message: 'Hair Dye Challenge reached 75% funding',
          amount: 750
        },
        {
          type: 'goal_reached' as const,
          title: 'Goal Achieved!',
          message: 'Stream goal "Cooking Disaster" has been completed',
          amount: 500
        }
      ];

      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const alert: DareAlert = {
        id: Date.now().toString(),
        ...randomAlert,
        timestamp: Date.now()
      };

      setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts

      // Play sound if enabled
      if (soundEnabled) {
        playAlertSound(alert.type);
      }

      // Auto-remove alert after 5 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== alert.id));
      }, 5000);
    };

    // Generate random alerts for demo
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        generateRandomAlert();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const playAlertSound = (type: string) => {
    // In a real app, you would play different sounds for different alert types
    const audio = new Audio();
    switch (type) {
      case 'funded':
        // audio.src = '/sounds/funded.mp3';
        break;
      case 'completed':
        // audio.src = '/sounds/completed.mp3';
        break;
      case 'milestone':
        // audio.src = '/sounds/milestone.mp3';
        break;
      case 'goal_reached':
        // audio.src = '/sounds/goal.mp3';
        break;
    }
    // audio.play().catch(() => {}); // Ignore errors if sound fails
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'funded':
        return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'milestone':
        return <Clock className="w-6 h-6 text-blue-400" />;
      case 'goal_reached':
        return <Gift className="w-6 h-6 text-purple-400" />;
      default:
        return <Bell className="w-6 h-6 text-gray-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'funded':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'milestone':
        return 'border-blue-500 bg-blue-500/10';
      case 'goal_reached':
        return 'border-purple-500 bg-purple-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 w-80">
      {/* Controls */}
      {isStreamer && (
        <div className="mb-4 flex items-center justify-end space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-white" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title="Alert history"
          >
            <Bell className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Active Alerts */}
      <AnimatePresence>
        {alerts.slice(0, 3).map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`mb-3 p-4 rounded-lg border-2 backdrop-blur-sm ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-bold text-sm">{alert.title}</h4>
                  {alert.amount && (
                    <span className="text-yellow-400 font-bold text-sm">
                      {alert.amount} tokens
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm">{alert.message}</p>
                {alert.user && (
                  <p className="text-gray-400 text-xs mt-1">by {alert.user}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Alert History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Alert History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No alerts yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                            {alert.amount && (
                              <span className="text-yellow-400 font-bold text-xs">
                                {alert.amount}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-300 text-xs">{alert.message}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};