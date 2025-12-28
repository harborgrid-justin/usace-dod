import React from 'react';
import { ArrowLeft, Landmark, ShieldCheck } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const PageWithHeader: React.FC<Props> = ({ title, subtitle, onBack, children, actions }) => (
  <div className="flex flex-col h-full animate-in fade-in bg-white overflow-hidden">
    <div className="p-8 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between gap-6 shrink-0 shadow-sm relative z-10">
      <div className="flex items-center gap-6">
        <button 
            onClick={onBack} 
            className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-500 hover:text-rose-700 hover:border-rose-200 transition-all shadow-sm active:scale-95"
            aria-label="Navigate back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="text-2xl font-bold text-zinc-900 tracking-tight leading-none">{title}</h3>
          {subtitle && <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-600"/> {subtitle}
          </p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-zinc-50/20">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  </div>
);

export default PageWithHeader;