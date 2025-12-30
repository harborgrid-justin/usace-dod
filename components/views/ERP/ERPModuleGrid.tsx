
import React from 'react';
import { Database, Layers, Server, Activity, Grid, List, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { REMIS_THEME } from '../../../constants';

interface Props {
    activeModule: string;
    onSelect: (id: string) => void;
}

const modules = [
    { id: 'FI', label: 'Financials', icon: Database, desc: 'GL, AP, AR, Assets', sub: 'FI-AA, FI-GL' },
    { id: 'CO', label: 'Controlling', icon: Layers, desc: 'Cost Centers, Orders', sub: 'CO-OM, CO-PA' },
    { id: 'MM', label: 'Materials', icon: Server, desc: 'Procurement, MRP', sub: 'MM-PUR, MM-IM' },
    { id: 'SD', label: 'Sales & Dist', icon: Activity, desc: 'Reimbursables', sub: 'SD-BIL, SD-SLS' },
    { id: 'BI', label: 'Business Intel', icon: Grid, desc: 'BW Reporting', sub: 'ECC-BW' },
    { id: 'PS', label: 'Project Sys', icon: List, desc: 'WBS, Project Builder', sub: 'PS-ST' }
];

const ERPModuleGrid: React.FC<Props> = ({ activeModule, onSelect }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in">
        {modules.map((mod) => (
            <button 
                key={mod.id} 
                onClick={() => onSelect(mod.id)} 
                className={`p-6 rounded-[32px] border text-left transition-all relative overflow-hidden group ${
                    activeModule === mod.id 
                    ? 'bg-zinc-900 border-zinc-800 text-white shadow-2xl scale-[1.02] z-10' 
                    : 'bg-white border-zinc-200 hover:border-rose-200 hover:shadow-lg'
                }`}
            >
                <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all group-hover:rotate-12 ${
                    activeModule === mod.id ? 'opacity-10' : ''
                }`}>
                    <mod.icon size={80} />
                </div>
                
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl transition-all shadow-inner ${
                        activeModule === mod.id 
                        ? 'bg-emerald-500 text-zinc-900' 
                        : 'bg-zinc-50 text-zinc-400 group-hover:bg-rose-50 group-hover:text-rose-600'
                    }`}>
                        <mod.icon size={24} strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight size={14} className={`transition-all ${
                        activeModule === mod.id ? 'text-zinc-500' : 'text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    }`}/>
                </div>
                
                <div className="relative z-10">
                    <h4 className="font-black text-base mb-1 uppercase tracking-tight">{mod.label}</h4>
                    <p className={`text-[10px] font-medium leading-relaxed ${
                        activeModule === mod.id ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>{mod.desc}</p>
                    
                    <div className="mt-6 pt-4 border-t border-zinc-100/10 flex justify-between items-center">
                        <span className={`text-[9px] font-mono font-bold ${
                            activeModule === mod.id ? 'text-emerald-400' : 'text-zinc-400'
                        }`}>{mod.sub}</span>
                        {activeModule === mod.id && <ShieldCheck size={14} className="text-emerald-400"/>}
                    </div>
                </div>
            </button>
        ))}
    </div>
);
export default ERPModuleGrid;
