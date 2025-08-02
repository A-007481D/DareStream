import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  onClick?: () => void;
  className?: string;
}

export const StatCard = ({
  icon,
  label,
  value,
  onClick,
  className,
}: StatCardProps) => (
  <div
    onClick={onClick}
    className={cn(
      'bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-750 transition-colors',
      onClick && 'cursor-pointer',
      className
    )}
  >
    <div className="flex justify-center mb-2">
      <div className="p-2 bg-gray-700 rounded-lg">{icon}</div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-400">{label}</div>
  </div>
);
