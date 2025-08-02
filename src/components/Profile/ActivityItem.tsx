import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ActivityItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  time: string;
  highlight?: boolean;
}

export const ActivityItem = ({
  icon,
  title,
  description,
  time,
  highlight = false,
}: ActivityItemProps) => (
  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
    <div
      className={cn(
        'p-2 rounded-lg',
        highlight ? 'bg-red-500/10 text-red-500' : 'bg-gray-700/50 text-gray-400'
      )}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-white">{title}</h4>
        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
          {time}
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);
