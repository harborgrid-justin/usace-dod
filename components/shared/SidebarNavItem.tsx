
import React from 'react';
import { NavigationTab } from '../../types';
import { REMIS_THEME } from '../../constants/theme';

interface NavItemProps {
  tab: NavigationTab;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isOpen: boolean;
  count?: number;
}

const SidebarNavItem: React.FC<NavItemProps> = ({ tab, icon: Icon, label, isActive, onClick, isOpen, count }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 group relative ${
        isActive 
        ? 'bg-emerald-600/10 text-emerald-400 font-bold border border-emerald-500/20 shadow-lg' 
        : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
    }`}
  >
    <Icon 
        size={18} 
        strokeWidth={isActive ? 2.5 : 1.5} 
        className={`shrink-0 ${isActive ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'group-hover:scale-110 group-hover:text-zinc-300 transition-all duration-300'}`} 
    />
    {isOpen && (
        <div className="flex-1 flex items-center justify-between min-w-0">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider truncate text-left">{label || tab}</span>
            {count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 rounded-sm text-[8px] font-black border shrink-0 ${
                    isActive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-600'
                } transition-all`}>
                    {count}
                </span>
            )}
        </div>
    )}
    
    {/* Authoritative Indicator bar */}
    {!isOpen && isActive && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-sm shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
    )}
  </button>
);

export default SidebarNavItem;
