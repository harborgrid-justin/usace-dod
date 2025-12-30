
import React, { useEffect, useRef } from 'react';
import { ArrowLeft, X, ShieldCheck, Database, History } from 'lucide-react';

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  title, 
  subtitle, 
  onClose, 
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    containerRef.current?.focus();
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-white z-[60] flex flex-col animate-in fade-in zoom-in-95 duration-200 focus:outline-none"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* High-Fidelity Header Bar - Terminal Style Dark */}
      <div className="h-16 bg-zinc-950 border-b border-white/5 px-6 flex items-center justify-between shrink-0 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500/40" />
        
        <div className="flex items-center gap-6 relative z-10">
          <button 
            onClick={onClose} 
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-all shadow-sm active:scale-95 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} strokeWidth={2}/> Back
          </button>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">{title}</h3>
            {subtitle && (
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                <ShieldCheck size={10} className="text-emerald-500" strokeWidth={2}/> {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
            <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Thread Workspace</span>
                <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-widest">SESSION_ACTIVE</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-zinc-400 hover:text-white transition-all rounded hover:bg-white/5 border border-transparent hover:border-white/10"
              aria-label="Close Workspace"
            >
              <X size={18} strokeWidth={2}/>
            </button>
        </div>
      </div>
      
      {/* Adaptive Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 bg-zinc-50/50 surface-grid">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Workspace Footer Information */}
      <div className="h-8 bg-white border-t border-zinc-200 px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 text-[8px] font-black text-zinc-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Database size={10} strokeWidth={2}/> Node: AUTH_DB_12</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200" />
              <span className="flex items-center gap-1.5"><History size={10} strokeWidth={2}/> Persistence Valid</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Fiduciary Logic Active</span>
          </div>
      </div>
    </div>
  );
};

export default Modal;
