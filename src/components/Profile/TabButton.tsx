import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface TabButtonProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export const TabButton = ({
  icon,
  label,
  isActive,
  onClick,
  count,
}: TabButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      'flex flex-col items-center justify-center py-3 px-4 border-b-2 transition-colors',
      isActive
        ? 'text-red-500 border-red-500'
        : 'text-gray-500 border-transparent hover:border-gray-700 hover:text-gray-300'
    )}
  >
    <div className="flex items-center space-x-2">
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
      {count !== undefined && (
        <span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  </button>
);
