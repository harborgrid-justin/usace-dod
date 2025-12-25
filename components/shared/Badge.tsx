
import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-rose-50 text-rose-700 border-rose-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
  neutral: 'bg-zinc-50 text-zinc-500 border-zinc-100',
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
