
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'max-w-md' | 'max-w-lg' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl';
}

const Modal: React.FC<ModalProps> = ({ 
  title, 
  subtitle, 
  onClose, 
  children, 
  maxWidth = 'max-w-lg' 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    // Focus trap logic could be expanded here with a library or custom hook
    // For now, simple focus on mount
    modalRef.current?.focus();

    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={`bg-white border border-zinc-200 rounded-2xl w-full ${maxWidth} p-6 shadow-2xl animate-in slide-in-from-top-2 flex flex-col max-h-[90vh] focus:outline-none`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors rounded-full hover:bg-zinc-100"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
