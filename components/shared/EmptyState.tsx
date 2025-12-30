
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
    <div className="flex flex-col items-center justify-center p-12 text-center border border-zinc-200 border-dashed rounded-lg bg-zinc-50/30 h-full animate-in fade-in">
      <div className="p-6 bg-white rounded shadow-md mb-6 border border-zinc-100 border-b-2 border-b-rose-700/5">
        <Icon size={32} className="text-zinc-200" strokeWidth={1} />
      </div>
      <h3 className="text-xs font-black text-zinc-900 uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-[10px] text-zinc-400 max-w-[240px] leading-relaxed mb-8 font-bold uppercase tracking-wide">{description}</p>
      {action && <div className="animate-in slide-in-from-bottom-1">{action}</div>}
    </div>
  );
};

export default EmptyState;
