
import React, { useTransition } from 'react';
import { Command, Castle, Building2, ShieldCheck, Activity, Terminal } from 'lucide-react';
import { NavigationTab } from '../../types';
import { useSidebarNav } from '../../hooks/useSidebarNav';
import { usePlatform } from '../../context/PlatformContext';
import SidebarAgencyStrip from './SidebarAgencyStrip';
import SidebarNavItem from './SidebarNavItem';
import { REMIS_THEME } from '../../constants/theme';

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isSidebarOpen, isMobileMenuOpen, setMobileMenuOpen 
}) => {
  const { ui, system } = usePlatform();
  const [isPending, startTransition] = useTransition();
  const navGroups = useSidebarNav(ui.agency);
  const isOpen = isSidebarOpen || isMobileMenuOpen;

  const handleTabClick = (tab: NavigationTab) => {
    startTransition(() => {
      ui.setActiveTab(tab);
      if (isMobileMenuOpen) setMobileMenuOpen(false);
    });
  };

  const getAgencyIcon = () => {
    if (ui.agency.startsWith('USACE')) return <Castle size={18} />;
    if (ui.agency.startsWith('OSD')) return <Building2 size={18} />;
    return <Command size={18} />;
  };

  return (
    <aside className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-[#09090b] border-r border-white/5 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'} ${isOpen ? 'w-72' : 'w-[76px]'} h-full shrink-0 ${isPending ? 'opacity-80' : 'opacity-100'}`}>
        
        <div className="h-24 flex items-center px-6 border-b border-white/5 bg-white/[0.02] shrink-0 gap-4">
             <div className="flex items-center gap-4 overflow-hidden">
                <div className={`p-2.5 rounded-md shrink-0 shadow-2xl border border-white/10 ${ui.agency.includes('REMIS') ? 'bg-emerald-900 text-emerald-400' : 'bg-zinc-800 text-zinc-100'}`}>
                  {getAgencyIcon()}
                </div>
                {isOpen && (
                  <div className="animate-in slide-in-from-left-2">
                    <span className="font-black text-sm tracking-tight text-white leading-none uppercase block">D-AFMP</span>
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-2 block flex items-center gap-2">
                      <ShieldCheck size={10} className="text-emerald-500" /> SYS_READY_V4
                    </span>
                  </div>
                )}
            </div>
        </div>
        
        <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar space-y-8">
          <SidebarAgencyStrip agency={ui.agency} setAgency={ui.setAgency} isOpen={isOpen} setActiveTab={ui.setActiveTab} />
          
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {isOpen ? (
                <h3 className="px-4 py-2 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] truncate">{group.title}</h3>
              ) : (
                <div className="mx-4 h-px bg-white/5 my-4" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarNavItem 
                    key={item.tab} 
                    {...item} 
                    isActive={ui.activeTab === item.tab} 
                    onClick={() => handleTabClick(item.tab)} 
                    isOpen={isOpen} 
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-white/[0.01] shrink-0">
            {isOpen ? (
              <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded border border-white/5 group hover:border-emerald-500/20 transition-all cursor-default">
                  <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <div className="flex-1 min-w-0">
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Global Node Sync</p>
                          <p className="text-[10px] text-zinc-300 font-mono font-bold leading-none mt-1 uppercase tracking-tighter">{system.nodeId}</p>
                      </div>
                  </div>
                  <Terminal size={12} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mx-auto shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            )}
        </div>
    </aside>
  );
};
export default Sidebar;
