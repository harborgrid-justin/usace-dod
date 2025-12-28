
import React from 'react';
import { BookOpen, Sparkles, Bot, ChevronRight } from 'lucide-react';
import { JustificationDocStatus } from '../../types';

const BudgetJustification: React.FC<any> = ({ operation }) => {
    const StatusBadge = ({status}: {status: JustificationDocStatus}) => (
        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-100">{status}</span>
    );
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
            <div className="bg-white p-6 rounded-xl border border-zinc-200 space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Exhibit Materials (FMR 9.6)</h4>
                {Object.entries(operation.justificationMaterials).map(([doc, status]) => (
                    <div key={doc} className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg border border-zinc-100"><div className="flex items-center gap-3"><BookOpen size={14} className="text-zinc-400"/><span className="text-xs font-bold text-zinc-800">Exhibit {doc}</span></div><StatusBadge status={status as any} /></div>
                ))}
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 text-white flex flex-col shadow-lg"><h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-4"><Sparkles size={16} className="text-emerald-400"/> Sentinel PRCP</h4><div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-[11px] text-zinc-400 mb-4 italic">Analysis engine ready to draft O-1/P-1 justification narratives...</div><div className="relative"><input className="w-full bg-zinc-800 border-zinc-700 rounded-lg py-2 px-3 text-xs focus:outline-none" placeholder="Ask about OCO requirements..." /><button className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><ChevronRight size={16}/></button></div></div>
        </div>
    );
};
export default BudgetJustification;
