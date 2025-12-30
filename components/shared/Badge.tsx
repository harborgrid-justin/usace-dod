
import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'dark' | 'emerald' | 'rose';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200/50',
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/50',
  warning: 'bg-amber-50 text-amber-900 border-amber-200/50',
  danger: 'bg-rose-50 text-rose-900 border-rose-200/50',
  rose: 'bg-rose-50 text-rose-900 border-rose-200/50',
  info: 'bg-blue-50 text-blue-900 border-blue-200/50',
  neutral: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  dark: 'bg-zinc-900 text-white border-zinc-800'
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border shadow-inner tracking-widest whitespace-nowrap inline-flex items-center justify-center ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
