import React from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon: Icon = Database, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-zinc-200 border-dashed rounded-[40px] bg-zinc-50/30 h-full animate-in fade-in">
      <div className="p-8 bg-white rounded-[32px] shadow-lg mb-8 border border-zinc-100 border-b-4 border-b-rose-700/5">
        <Icon size={48} className="text-zinc-200" strokeWidth={1} />
      </div>
      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[0.2em] mb-3">{title}</h3>
      <p className="text-xs text-zinc-400 max-w-[280px] leading-relaxed mb-10 font-medium">{description}</p>
      {action && <div className="animate-in slide-in-from-bottom-2">{action}</div>}
    </div>
  );
};

export default EmptyState;