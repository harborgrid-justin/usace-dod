import React, { useEffect, useRef } from 'react';
import { Bell, Menu, Search, Castle, Building, Home, Key, Activity, Sparkles, Database } from 'lucide-react';
import { NavigationTab, AgencyContext } from '../../types';
import UserAvatar from './UserAvatar';

interface HeaderProps {
  activeTab: NavigationTab;
  agency: AgencyContext;
  setMobileMenuOpen: (isOpen: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, agency, setMobileMenuOpen, notificationsOpen, setNotificationsOpen }) => {
  const isUsace = agency === 'USACE_CEFMS';
  const isOsd = agency === 'OSD_BRAC';
  const isHap = agency === 'OSD_HAP';
  const isLgh = agency === 'OSD_LGH';
  const isHapmis = agency === 'USACE_HAPMIS';
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInputRef.current?.focus();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-zinc-200 px-4 sm:px-8 flex items-center justify-between shrink-0 z-40 sticky top-0 shadow-[0_1px_15px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-6">
        <button 
            className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
             <h1 className="text-base font-bold text-zinc-900 uppercase tracking-tight leading-none flex items-center gap-2">
                {isUsace && <Castle size={16} className="text-rose-700" />}
                {isOsd && <Building size={16} className="text-indigo-700" />}
                {isHap && <Home size={16} className="text-teal-700" />}
                {isLgh && <Key size={16} className="text-cyan-700" />}
                {activeTab}
             </h1>
             <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-zinc-900 text-white rounded-lg border border-zinc-800 shadow-lg">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Live Sync</span>
             </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">
                {isUsace ? 'U.S. Army Corps of Engineers' : 'OSD Authoritative Platform'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mock Search Bar */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:bg-white focus-within:border-zinc-400 focus-within:ring-4 focus-within:ring-zinc-100 transition-all group w-[320px]">
            <Search size={16} className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <input 
                ref={searchInputRef}
                type="text"
                placeholder={`Search PIID / Document...`}
                className="bg-transparent border-none focus:outline-none text-xs text-zinc-900 w-full placeholder:text-zinc-400 font-medium"
            />
            <div className="flex items-center gap-1.5 opacity-40">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 font-mono">⌘K</span>
            </div>
        </div>

        <div className="hidden md:flex items-center gap-4 border-x border-zinc-100 px-6 h-10">
             <div className="flex flex-col items-end">
                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Sentinel Insight</p>
                <div className="flex items-center gap-1.5 text-emerald-600">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-[10px] font-bold uppercase">Ready</span>
                </div>
             </div>
        </div>

        <div className="flex items-center gap-2">
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all group">
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
            </button>
            <button className="p-0.5 border-2 border-transparent hover:border-zinc-200 rounded-full transition-all">
                <UserAvatar name="Jane Doe" size="lg" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
