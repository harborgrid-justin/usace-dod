
import React, { useEffect, useRef } from 'react';
import { Bell, Menu, Search, Castle, Building, Home, Key } from 'lucide-react';
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

  // Opp 8: Keyboard Shortcut
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
    <header className="h-16 bg-[#fafafa]/80 backdrop-blur-md border-b border-zinc-200/50 px-4 sm:px-8 flex items-center justify-between shrink-0 z-40 sticky top-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-zinc-500" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest leading-none flex items-center gap-2">
             {isUsace && <Castle size={14} className="text-rose-700" />}
             {isOsd && <Building size={14} className="text-indigo-700" />}
             {isHap && <Home size={14} className="text-teal-700" />}
             {isLgh && <Key size={14} className="text-cyan-700" />}
             {isHapmis && <Home size={14} className="text-orange-700" />}
             {activeTab === 'P2 Project Lifecycle' && isUsace ? 'P2 Project Lifecycle' : activeTab}
          </h1>
          {isUsace && <span className="text-[9px] font-bold text-rose-600 tracking-wide mt-0.5">U.S. Army Corps of Engineers</span>}
          {isHapmis && <span className="text-[9px] font-bold text-orange-600 tracking-wide mt-0.5">USACE (HAPMIS)</span>}
          {(isOsd || isHap || isLgh) && <span className={`text-[9px] font-bold tracking-wide mt-0.5 ${isOsd ? 'text-indigo-600' : isHap ? 'text-teal-600' : isLgh ? 'text-cyan-600' : 'text-zinc-600'}`}>Office of the Secretary of Defense</span>}
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mock Search Bar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-full shadow-[0_2px_4px_-2px_rgba(0,0,0,0.02)] focus-within:ring-1 focus-within:ring-zinc-300 transition-all">
            <Search size={14} className="text-zinc-400" />
            <input 
                ref={searchInputRef}
                type="text"
                placeholder={`Search ${isUsace ? 'P2 / CEFMS' : 'nexus'}...`}
                className="bg-transparent border-none focus:outline-none text-xs text-zinc-800 w-48 placeholder:text-zinc-400"
            />
            <span className="text-[10px] text-zinc-400 border border-zinc-100 px-1.5 py-0.5 rounded bg-zinc-50 font-mono">⌘K</span>
        </div>

        <div className="h-6 w-[1px] bg-zinc-200 mx-2 hidden sm:block" />

        <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 text-zinc-400 hover:text-zinc-800 transition-colors">
           <Bell size={18} />
           {notificationsOpen && (
             <div className="absolute top-10 right-0 w-80 bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-50 animate-in slide-in-from-top-2">
                <h4 className="text-[10px] font-bold uppercase text-zinc-400 mb-3 tracking-widest">Alerts</h4>
                <div className="space-y-2">
                  <div className="flex gap-3 p-3 bg-white rounded-lg border border-zinc-100 shadow-sm">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"/>
                     <div>
                        <p className="text-xs font-medium text-zinc-800">CR Authority Expiration</p>
                        <p className="text-[10px] text-zinc-500">24 hours remaining.</p>
                     </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-white rounded-lg border border-zinc-100 shadow-sm">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"/>
                     <div>
                        <p className="text-xs font-medium text-zinc-800">UMD Threshold Reached</p>
                        <p className="text-[10px] text-zinc-500">FORSCOM variance detected.</p>
                     </div>
                  </div>
                </div>
             </div>
           )}
        </button>
        <button className="flex items-center justify-center transition-opacity hover:opacity-80">
           <UserAvatar name="Jane Doe" size="md" />
        </button>
      </div>
    </header>
  );
};

export default Header;
