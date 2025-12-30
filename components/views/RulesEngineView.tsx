
import React, { useState, useTransition } from 'react';
import { Cpu, GitBranch, Play, ShieldCheck, Database, Search, Filter, Bookmark, Info } from 'lucide-react';
import RuleLibrarySidebar from '../rules/RuleLibrarySidebar';
import DecisionExpertArea from '../rules/DecisionExpertArea';
import PolicySimulatorArea from '../rules/PolicySimulatorArea';
import { REMIS_THEME } from '../../constants';

const RulesEngineView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'decision' | 'simulator'>('decision');
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleTabChange = (tab: any) => {
        startTransition(() => {
            setActiveTab(tab);
        });
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-full mx-auto bg-zinc-50/50 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 shrink-0 px-2">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                        <Cpu size={32} className="text-rose-700" /> Fiduciary Logic Engine
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                        <ShieldCheck size={12} className="text-emerald-600"/> Automated Policy Enforcement (31 U.S.C.)
                    </p>
                </div>
                <div className="flex bg-zinc-200/50 p-1 rounded-2xl shadow-inner border border-zinc-300/30 shrink-0">
                    <button 
                        onClick={() => handleTabChange('decision')} 
                        className={`px-8 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                            activeTab === 'decision' ? 'bg-white shadow-lg text-zinc-900 border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                    >
                        <GitBranch size={14}/> Decision Expert
                    </button>
                    <button 
                        onClick={() => handleTabChange('simulator')} 
                        className={`px-8 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                            activeTab === 'simulator' ? 'bg-white shadow-lg text-zinc-900 border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                    >
                        <Play size={14} fill="currentColor"/> Policy Simulator
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden">
                <div className="lg:col-span-4 h-full flex flex-col min-h-0 overflow-hidden">
                    <RuleLibrarySidebar searchTerm={searchTerm} onSearch={setSearchTerm} />
                    
                    <div className="mt-6 p-6 bg-zinc-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden shrink-0 border border-zinc-800">
                        <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Bookmark size={80}/></div>
                        <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                            <Info size={12}/> Engine Status
                        </h4>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                                <span className="text-zinc-500">Logic Blocks</span>
                                <span className="text-white">124 ACTIVE</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{width: '92%'}} />
                            </div>
                            <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">System is enforcing latest FY24 statutory constraints (PL-118). GFEBS interface confirmed.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 h-full flex flex-col min-h-0 overflow-hidden">
                    <div className={`${REMIS_THEME.enterprise.panel} h-full overflow-hidden flex flex-col rounded-[40px] shadow-sm border-zinc-200 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                        {activeTab === 'decision' ? <DecisionExpertArea /> : <PolicySimulatorArea />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RulesEngineView;
