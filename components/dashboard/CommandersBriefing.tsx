
import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, Clock, ShieldCheck, ChevronRight, Activity, Terminal } from 'lucide-react';
import { generateStrategicBriefing } from '../../services/gemini/SentinelAI';

interface Props {
    stats: any;
}

const CommandersBriefing: React.FC<Props> = ({ stats }) => {
    const [briefing, setBriefing] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loadBriefing = async () => {
        setIsLoading(true);
        const result = await generateStrategicBriefing(stats);
        setBriefing(result);
        setIsLoading(false);
    };

    useEffect(() => {
        loadBriefing();
    }, []);

    return (
        <div className="bg-zinc-900 rounded-md border border-zinc-800 shadow-xl overflow-hidden flex flex-col h-full relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-sm border border-emerald-500/20">
                        <Sparkles size={16} className={isLoading ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest leading-none">Command Strategic Briefing</h3>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter flex items-center gap-1.5 mt-1">
                            <ShieldCheck size={10} className="text-emerald-500"/> Sentinel-3 AI Synthesis
                        </p>
                    </div>
                </div>
                <button 
                    onClick={loadBriefing}
                    disabled={isLoading}
                    className="p-1.5 text-zinc-500 hover:text-white transition-all disabled:opacity-50"
                    title="Refresh AI Analysis"
                >
                    <Clock size={14} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-700">
                        <Terminal size={24} className="animate-pulse" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Synthesizing Fiscal Intelligence...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="prose prose-invert prose-sm max-w-none">
                            <div className="text-zinc-300 leading-relaxed text-xs font-medium space-y-4 whitespace-pre-wrap">
                                {briefing}
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-white/5 flex gap-4">
                            <div className="flex-1 p-4 bg-white/5 rounded-sm border border-white/5 group-hover:border-emerald-500/30 transition-all">
                                <p className="text-[8px] font-bold text-zinc-500 uppercase mb-2">Readiness Posture</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                    <span className="text-xs font-bold text-white uppercase tracking-tight">F-1 (FULL)</span>
                                </div>
                            </div>
                            <div className="flex-1 p-4 bg-white/5 rounded-sm border border-white/5 group-hover:border-rose-500/30 transition-all">
                                <p className="text-[8px] font-bold text-zinc-500 uppercase mb-2">Active Discrepancies</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                    <span className="text-xs font-bold text-white uppercase tracking-tight">2 CRITICAL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center relative z-10">
                <span className="text-[8px] font-mono text-zinc-600 font-bold uppercase tracking-tighter">Protocol: G8-STRAT-INTEL-V4</span>
                <button className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest group/btn">
                    Drill Down <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
                </button>
            </div>
        </div>
    );
};

export default CommandersBriefing;
