import React, { useEffect, useRef } from 'react';
import { ArrowLeft, X, ShieldCheck } from 'lucide-react';

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string; // Kept for API compatibility but unused in full-page layout
}

/**
 * Global Full-Page Workspace Container
 * Replaces the legacy center-popup modal with a dedicated slide-in workspace.
 */
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
      className="fixed inset-0 bg-white z-[60] flex flex-col animate-in slide-in-from-right duration-300 focus:outline-none"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Header Bar */}
      <div className="h-20 bg-zinc-50 border-b border-zinc-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose} 
            className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-rose-700 hover:border-rose-200 transition-all shadow-sm active:scale-95 flex items-center gap-2 text-xs font-bold uppercase"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-600"/> {subtitle}
              </p>
            )}
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-100"
          aria-label="Close Workspace"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 bg-zinc-50/20">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;