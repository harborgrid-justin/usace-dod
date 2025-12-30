
import React from 'react';
import { Database, Landmark, Layers, Briefcase, ShieldCheck } from 'lucide-react';

interface Props {
    fund?: string;
    fundCenter?: string;
    ussgl?: string;
    wbs?: string;
}

const SegmentVisualizer: React.FC<Props> = ({ fund = '21 2020', fundCenter = 'A76LRL', ussgl = '480100', wbs = '123456.01' }) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-md p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Database size={100}/></div>
            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <ShieldCheck size={14}/> SFIS Segment Decomposition
            </h4>
            
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[120px] p-4 bg-white/5 border border-white/10 rounded-sm group/seg hover:border-emerald-500/50 transition-all">
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Landmark size={10}/> Appropriation
                    </p>
                    <p className="text-xs font-mono font-bold text-white uppercase">{fund}</p>
                </div>
                <div className="flex-1 min-w-[120px] p-4 bg-white/5 border border-white/10 rounded-sm group/seg hover:border-emerald-500/50 transition-all">
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Layers size={10}/> Cost Center
                    </p>
                    <p className="text-xs font-mono font-bold text-white uppercase">{fundCenter}</p>
                </div>
                <div className="flex-1 min-w-[120px] p-4 bg-white/5 border border-white/10 rounded-sm group/seg hover:border-emerald-500/50 transition-all">
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <ShieldCheck size={10}/> USSGL
                    </p>
                    <p className="text-xs font-mono font-bold text-emerald-400 uppercase">{ussgl}</p>
                </div>
                <div className="flex-1 min-w-[120px] p-4 bg-white/5 border border-white/10 rounded-sm group/seg hover:border-emerald-500/50 transition-all">
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Briefcase size={10}/> WBS Element
                    </p>
                    <p className="text-xs font-mono font-bold text-white uppercase">{wbs}</p>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Logic Validation: <span className="text-emerald-500">AUTHORIZED</span></span>
                <span className="text-[9px] font-mono text-zinc-700">HASH: 0x8821AF...4D</span>
            </div>
        </div>
    );
};

export default SegmentVisualizer;
