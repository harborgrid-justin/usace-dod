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
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-4 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 animate-in slide-in-from-right-10 fade-in duration-300 w-[360px] bg-white group ${
              toast.type === 'success' ? 'border-emerald-500/20' :
              toast.type === 'error' ? 'border-rose-500/20' :
              toast.type === 'warning' ? 'border-amber-500/20' :
              'border-zinc-500/10'
            }`}
          >
            <div className={`p-2 rounded-xl mt-0.5 ${
               toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
               toast.type === 'error' ? 'bg-rose-50 text-rose-600' :
               toast.type === 'warning' ? 'bg-amber-50 text-amber-600' :
               'bg-zinc-900 text-white'
            }`}>
              {toast.type === 'success' && <CheckCircle2 size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'warning' && <AlertTriangle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
              {toast.type === 'processing' && <Loader2 size={20} className="animate-spin" />}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-1">
                    {toast.type === 'processing' ? 'Processing Authority' : toast.type === 'success' ? 'Protocol Verified' : 'System Notification'}
                </p>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="p-1 text-zinc-300 hover:text-zinc-900 transition-colors">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};