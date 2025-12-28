
import React from 'react';
import { Maximize, TrendingUp } from 'lucide-react';

const LifecycleUtilization: React.FC<{data: any}> = ({ data }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-blue-50 text-blue-600 rounded-full mb-8 shadow-inner"><Maximize size={48}/></div>
            <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Active Occupancy</h3>
            <p className="text-4xl font-mono font-bold text-blue-600 mt-4 tracking-tighter">{data.utilizationRate}%</p>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full mt-10 overflow-hidden shadow-inner"><div className="h-full bg-blue-600" style={{width: `${data.utilizationRate}%`}} /></div>
        </div>
        <div className="bg-zinc-900 rounded-[40px] p-10 text-white shadow-2xl flex flex-col justify-between">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3 text-emerald-400"><TrendingUp size={18}/> Mission Index</h4>
            <div className="space-y-6">
                <div className="flex justify-between items-center text-xs"><span className="text-zinc-400">Dependency Tier</span><span className="font-bold text-emerald-400 uppercase tracking-widest">{data.missionDependency}</span></div>
                <div className="flex justify-between items-center text-xs"><span className="text-zinc-400">Capability Code</span><span className="font-mono text-zinc-300">Level 1 - Sustenance</span></div>
            </div>
            <button className="w-full mt-10 py-4 bg-white text-zinc-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-zinc-100">Update MSI Rationale</button>
        </div>
    </div>
);
export default LifecycleUtilization;
