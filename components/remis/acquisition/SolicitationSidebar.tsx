
import React from 'react';
import { Gavel, Search } from 'lucide-react';
import { Solicitation } from '../../../types';
import Badge from '../../shared/Badge';

interface Props {
    sols: Solicitation[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const SolicitationSidebar: React.FC<Props> = ({ sols, selectedId, onSelect }) => {
    return (
        <div className="w-full md:w-80 border-r border-zinc-100 flex flex-col bg-zinc-50/30 shrink-0">
            <div className="p-4 border-b border-zinc-100 bg-white">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Gavel size={14}/> Active Procurements
                </h3>
                <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/><input type="text" placeholder="Search Solicitations..." className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border rounded-lg text-xs" /></div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {sols.map(sol => (
                    <button key={sol.id} onClick={() => onSelect(sol.id)} className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedId === sol.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.01]' : 'bg-white border-zinc-100 hover:border-zinc-300'}`}>
                        <div className="flex justify-between items-start mb-2"><span className="text-[9px] font-mono opacity-60">{sol.id}</span><Badge variant="neutral">{sol.status.split(' ')[0]}</Badge></div>
                        <h4 className="text-sm font-bold truncate leading-tight mb-2">{sol.title}</h4>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5"><span className="text-[10px] font-bold uppercase opacity-40">Quotes</span><span className="text-xs font-mono font-bold">{sol.quotes.length}</span></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SolicitationSidebar;
