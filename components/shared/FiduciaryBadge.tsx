
import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, Clock, ShieldCheck } from 'lucide-react';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'dark' | 'emerald' | 'pulse' | 'certified';

interface Props {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: boolean;
}

const FiduciaryBadge: React.FC<Props> = ({ children, variant = 'neutral', className = '', icon = false }) => {
  const styles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/50',
    certified: 'bg-emerald-900 text-emerald-400 border-emerald-800 shadow-xl',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/50 shadow-emerald-500/5',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/50',
    warning: 'bg-amber-50 text-amber-900 border-amber-200/50',
    info: 'bg-blue-50 text-blue-900 border-blue-200/50',
    neutral: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    dark: 'bg-zinc-950 text-zinc-400 border-zinc-800 shadow-inner',
    pulse: 'bg-emerald-50 text-emerald-700 border-emerald-200/50 animate-pulse'
  };

  const icons: Record<string, any> = {
    success: CheckCircle2,
    certified: ShieldCheck,
    emerald: CheckCircle2,
    danger: ShieldAlert,
    warning: AlertTriangle,
    info: Info,
    pulse: Clock
  };

  const IconComp = icon && (icons[variant] || Info);

  return (
    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border shadow-sm tracking-widest whitespace-nowrap inline-flex items-center justify-center gap-2 ${styles[variant]} ${className}`}>
      {icon && IconComp && <IconComp size={11} strokeWidth={3}/>}
      {children}
    </span>
  );
};

export default FiduciaryBadge;
