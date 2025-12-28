
import React, { useState } from 'react';
import { Search, Plus, ShoppingCart } from 'lucide-react';
import { PurchaseRequest } from '../../../types';
import { formatCurrency } from '../../../utils/formatting';
import Badge from '../../shared/Badge';

interface Props {
    prs: PurchaseRequest[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
}

const PRSidebar: React.FC<Props> = ({ prs, selectedId, onSelect, onAdd }) => {
    const [q, setQ] = useState('');
    const filtered = prs.filter(p => p.description.toLowerCase().includes(q.toLowerCase()) || p.id.includes(q));

    return (
        <div className="w-full md:w-80 border-r border-zinc-100 flex flex-col bg-zinc-50/30 shrink-0">
            <div className="p-4 border-b border-zinc-100 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingCart size={14}/> Intake Ledger
                    </h3>
                    <button onClick={onAdd} className="p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"><Plus size={14}/></button>
                </div>
                <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/><input type="text" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500" /></div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {filtered.map(pr => (
                    <button key={pr.id} onClick={() => onSelect(pr.id)} className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedId === pr.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.01]' : 'bg-white border-zinc-100 hover:border-zinc-300'}`}>
                        <div className="flex justify-between items-start mb-2"><span className="text-[9px] font-mono opacity-60">{pr.id}</span><Badge variant={pr.status === 'Funds Certified' ? 'success' : 'neutral'}>{pr.status.split(' ')[0]}</Badge></div>
                        <h4 className="text-sm font-bold truncate leading-tight mb-3">{pr.description}</h4>
                        <div className="flex justify-between items-end pt-2 border-t border-white/5"><span className="text-[10px] font-bold uppercase opacity-40">Amount</span><span className="text-xs font-mono font-bold">{formatCurrency(pr.amount)}</span></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PRSidebar;
