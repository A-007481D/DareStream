import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Section = ({
  title,
  action,
  children,
  className = '',
}: SectionProps) => (
  <section className={className}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {action}
    </div>
    <div className="bg-gray-800 rounded-xl p-4">{children}</div>
  </section>
);
