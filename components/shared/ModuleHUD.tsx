
import React from 'react';
import { Terminal, Zap, ShieldCheck, Database, Search, Activity, Cpu, Clock } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { REMIS_THEME } from '../../constants/theme';

interface ModuleHUDProps {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    iconColor?: string;
    onSearch?: (q: string) => void;
    actions?: React.ReactNode;
}

const ModuleHUD: React.FC<ModuleHUDProps> = ({ title, subtitle, icon: Icon, iconColor = "text-emerald-500", onSearch, actions }) => {
    const { system, ui } = usePlatform();

    return (
        <div className="flex flex-col lg:flex-row items-stretch bg-[#09090b] rounded-lg shadow-3xl border border-zinc-800 overflow-hidden shrink-0 group relative animate-in slide-in-from-top-4">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] to-transparent pointer-events-none" />
            
            <div className="p-5 flex items-center gap-4 bg-zinc-900/50 border-r border-zinc-800 min-w-[240px] relative z-10">
                <div className={`w-12 h-12 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-2xl transition-all group-hover:rotate-3`}>
                    <Icon size={24} className={iconColor} strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] leading-none">{title}</h3>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                        <ShieldCheck size={10} className="text-emerald-500"/> {subtitle}
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center gap-6 px-8 relative z-10">
                {onSearch ? (
                    <div className="relative flex-1 group/search">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-500 font-mono font-bold text-base opacity-50 select-none">/&gt;</div>
                        <input 
                            onChange={e => onSearch(e.target.value)}
                            placeholder="EXECUTE DIRECTIVE (CTRL+ENTER)..." 
                            className="w-full bg-transparent text-sm font-mono text-white placeholder:text-zinc-800 focus:outline-none uppercase tracking-[0.2em] py-4 pl-10" 
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center gap-8">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Fiscal Context</span>
                            <span className="text-white font-mono font-bold text-base tracking-tighter">FY{ui.fiscalYear} P-{ui.postingPeriod}</span>
                        </div>
                        <div className="h-6 w-px bg-zinc-800" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Node Instance</span>
                            <span className="text-zinc-400 font-mono text-xs font-bold uppercase">{system.nodeId}</span>
                        </div>
                    </div>
                )}
                
                {actions}
            </div>

            {/* Global Telemetry Bar */}
            <div className="hidden 2xl:flex items-center gap-8 px-6 bg-zinc-900/80 border-l border-zinc-800 relative z-10">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Activity size={10} className="text-zinc-500" />
                        <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Interface Lag</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">0.03ms</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Database size={10} className="text-zinc-500" />
                        <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Integrity</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-blue-400">100% SYNC</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Clock size={10} className="text-zinc-500" />
                        <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Cycle Clock</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-300">{new Date().toLocaleTimeString([], { hour12: false })}</span>
                </div>
            </div>
        </div>
    );
};

export default ModuleHUD;
