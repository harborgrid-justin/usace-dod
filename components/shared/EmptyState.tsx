
import React from 'react';
import { Ghost } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon: Icon = Ghost, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 h-full">
      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
        <Icon size={32} className="text-zinc-300" />
      </div>
      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 max-w-xs leading-relaxed mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
