
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle, Loader2 } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'processing';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    if (type !== 'processing') {
        setTimeout(() => removeToast(id), 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-md border shadow-lg animate-in slide-in-from-right-10 fade-in duration-200 w-[340px] bg-white group ${
              toast.type === 'success' ? 'border-emerald-500/30 shadow-emerald-900/5' :
              toast.type === 'error' ? 'border-rose-500/30 shadow-rose-900/5' :
              toast.type === 'warning' ? 'border-amber-500/30 shadow-amber-900/5' :
              'border-zinc-300 shadow-zinc-900/5'
            }`}
          >
            <div className={`p-1.5 rounded-sm mt-0.5 shrink-0 ${
               toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
               toast.type === 'error' ? 'bg-rose-50 text-rose-600' :
               toast.type === 'warning' ? 'bg-amber-50 text-amber-600' :
               'bg-zinc-100 text-zinc-900'
            }`}>
              {toast.type === 'success' && <CheckCircle2 size={16} strokeWidth={2} />}
              {toast.type === 'error' && <AlertCircle size={16} strokeWidth={2} />}
              {toast.type === 'warning' && <AlertTriangle size={16} strokeWidth={2} />}
              {toast.type === 'info' && <Info size={16} strokeWidth={2} />}
              {toast.type === 'processing' && <Loader2 size={16} className="animate-spin" strokeWidth={2} />}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-1 leading-none">
                    {toast.type === 'processing' ? 'Processing Authority' : toast.type === 'success' ? 'Protocol Verified' : toast.type === 'error' ? 'Execution Error' : 'System Notification'}
                </p>
                <p className="text-xs font-medium text-zinc-600 leading-snug">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="p-1 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-sm transition-all"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
