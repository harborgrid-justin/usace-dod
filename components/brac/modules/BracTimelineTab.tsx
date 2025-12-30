
import React from 'react';
import { Clock } from 'lucide-react';
import { BracDssEngine } from '../../../services/BracDssEngine';

const BracTimelineTab: React.FC = () => (
    <div className="bg-white p-8 rounded-md border border-zinc-200 shadow-sm animate-in fade-in">
        <h3 className="text-lg font-bold text-zinc-900 mb-8 flex items-center gap-3"><Clock size={20} className="text-zinc-400" /> Implementation Roadmap</h3>
        <div className="relative pl-10 border-l-2 border-indigo-100 space-y-12">
            {BracDssEngine.getLifecycleMilestones(new Date()).map((ms, i) => (
                <div key={i} className="relative group">
                    <div className="absolute -left-[49px] top-0 w-8 h-8 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"><div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /></div>
                    <div className="bg-zinc-50 p-5 rounded-md border border-zinc-100 max-w-2xl group-hover:bg-white group-hover:border-indigo-200 transition-all shadow-sm">
                        <div className="flex justify-between items-center mb-1"><h4 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{ms.stage}</h4><span className="text-[10px] font-mono font-bold text-zinc-400 bg-white px-2 py-1 rounded-sm border">{new Date(ms.deadline).toLocaleDateString()}</span></div>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">{ms.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default BracTimelineTab;
