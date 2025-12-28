
import React from 'react';
import { Play, FileCode, ShieldAlert } from 'lucide-react';

const PolicySimulatorArea: React.FC = () => (
    <div className="flex flex-col h-full gap-6">
        <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden shrink-0">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileCode size={20} className="text-emerald-400"/> Compliance Simulator</h3>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2"><label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Target Object</label><select className="w-full bg-zinc-800 border-zinc-700 rounded p-2 text-xs outline-none"><option>Select transaction...</option></select></div>
                <div className="flex items-end"><button className="w-full py-2 bg-emerald-600 rounded text-xs font-bold uppercase hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"><Play size={14} fill="currentColor"/> Run Logic</button></div>
            </div>
        </div>
        <div className="flex-1 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col items-center justify-center text-zinc-300">
            <ShieldAlert size={48} className="opacity-10 mb-2"/><p className="text-sm font-bold uppercase tracking-widest">Awaiting Test Parameters</p>
        </div>
    </div>
);
export default PolicySimulatorArea;
