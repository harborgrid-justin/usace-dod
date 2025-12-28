
import React from 'react';
import { FileCheck, Search, Plus } from 'lucide-react';
import { Contract } from '../../../types';
import { formatCurrency } from '../../../utils/formatting';
import Badge from '../../shared/Badge';

interface Props {
    contracts: Contract[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
}

const ContractSidebar: React.FC<Props> = ({ contracts, selectedId, onSelect, onAdd }) => {
    return (
        <div className="w-full md:w-80 border-r border-zinc-100 flex flex-col bg-zinc-50/30 shrink-0">
            <div className="p-4 border-b border-zinc-100 bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <FileCheck size={14}/> Active Obligations
                    </h3>
                    <button onClick={onAdd} className="p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"><Plus size={14}/></button>
                </div>
                <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/><input type="text" placeholder="Search Award ID..." className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border rounded-lg text-xs" /></div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {contracts.map(c => (
                    <button key={c.id} onClick={() => onSelect(c.id)} className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedId === c.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.01]' : 'bg-white border-zinc-100 hover:border-zinc-300'}`}>
                        <div className="flex justify-between items-start mb-2"><span className="text-[9px] font-mono opacity-60">{c.id}</span><Badge variant="success">Active</Badge></div>
                        <h4 className="text-sm font-bold truncate leading-tight mb-2">{c.vendor}</h4>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5"><span className="text-[10px] font-bold uppercase opacity-40">Value</span><span className="text-xs font-mono font-bold">{formatCurrency(c.value)}</span></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ContractSidebar;
