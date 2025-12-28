
import React from 'react';
import { Clock } from 'lucide-react';
import { BracDssEngine } from '../../../services/BracDssEngine';

const BracTimelineTab: React.FC = () => (
    <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 mb-8 flex items-center gap-3"><Clock size={24} className="text-zinc-400" /> Implementation Roadmap</h3>
        <div className="relative pl-12 border-l-2 border-indigo-100 space-y-12">
            {BracDssEngine.getLifecycleMilestones(new Date()).map((ms, i) => (
                <div key={i} className="relative">
                    <div className="absolute -left-[53px] top-0 w-8 h-8 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /></div>
                    <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 max-w-2xl">
                        <div className="flex justify-between items-center mb-1"><h4 className="font-bold text-zinc-900 uppercase">{ms.stage}</h4><span className="text-[10px] font-mono text-zinc-400">{new Date(ms.deadline).toLocaleDateString()}</span></div>
                        <p className="text-sm text-zinc-500">{ms.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default BracTimelineTab;
