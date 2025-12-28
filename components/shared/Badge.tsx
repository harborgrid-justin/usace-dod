import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'dark' | 'emerald' | 'rose';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  success: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  rose: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  info: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  neutral: 'bg-zinc-50 text-zinc-400 border-zinc-200',
  dark: 'bg-zinc-900 text-white border-zinc-800'
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border shadow-sm tracking-widest whitespace-nowrap ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;