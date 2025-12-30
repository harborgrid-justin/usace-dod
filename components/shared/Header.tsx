
import React from 'react';
import { Bell, Search, Monitor, ShieldCheck, Globe } from 'lucide-react';
import { NavigationTab, AgencyContext } from '../../types';
import UserAvatar from './UserAvatar';
import { REMIS_THEME } from '../../constants/theme';

interface HeaderProps {
  activeTab: NavigationTab;
  agency: AgencyContext;
  setMobileMenuOpen: (isOpen: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, agency, notificationsOpen, setNotificationsOpen }) => {
  return (
    <div className="flex flex-col shrink-0 z-40 sticky top-0">
      <div className="h-5 bg-emerald-900 flex items-center justify-center text-[7px] font-black text-white uppercase tracking-[0.5em] relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
        <span className="relative z-10">UNCLASSIFIED // FOUO // MISSION CRITICAL</span>
      </div>

      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200/60 px-6 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-6 min-w-0">
          <div className="flex items-center gap-4 min-w-0">
             <div className="p-2.5 rounded-sm bg-zinc-900 text-white shadow-lg border border-zinc-800 shrink-0">
                <Globe size={18} strokeWidth={2}/>
             </div>
             <div className="min-w-0">
                <h1 className="text-sm font-black text-zinc-900 uppercase tracking-tight truncate">
                    {activeTab}
                </h1>
                <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap overflow-hidden">
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                       <Monitor size={8} /> {agency}
                    </span>
                    <div className="w-0.5 h-0.5 rounded-full bg-zinc-300 shrink-0" />
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                       <ShieldCheck size={8} /> FIAR SECURE
                    </span>
                </div>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 shrink-0">
          <div className="hidden xl:flex items-center gap-8 px-6 border-x border-zinc-100">
              <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Interface Lag</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 leading-none">0.03ms</span>
              </div>
              <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">USSGL Integrity</span>
                  <span className="text-[10px] font-mono font-bold text-blue-600 leading-none">100% SYNC</span>
              </div>
          </div>

          <div className="flex items-center gap-2">
              <div className="relative group hidden lg:block">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                  <input 
                      type="text"
                      placeholder="Search Ledger..."
                      className="bg-zinc-50 border border-zinc-100 rounded-sm py-1.5 pl-8 pr-3 text-[10px] font-bold w-48 focus:outline-none focus:bg-white focus:border-zinc-300 transition-all shadow-inner"
                  />
              </div>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 text-zinc-400 hover:text-zinc-900 bg-zinc-50 border border-zinc-100 rounded-sm transition-all relative">
                  <Bell size={16} strokeWidth={2} />
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-600 border border-white" />
              </button>
              <button className="flex items-center gap-3 pl-1 pr-3 py-1 bg-zinc-900 text-white rounded-sm hover:bg-zinc-800 shadow-lg transition-all active:scale-95 border border-zinc-800">
                  <UserAvatar name="Maj Gen Finance" size="sm" />
                  <div className="hidden lg:block text-left min-w-0">
                    <p className="text-[9px] font-black uppercase leading-none truncate">G-8 Admin</p>
                  </div>
              </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
