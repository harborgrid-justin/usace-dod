import React from 'react';
import { Edit, Plus, History } from 'lucide-react';
import { FundControlNode } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    node: FundControlNode;
    risk: 'Low' | 'Warning' | 'Critical';
    canAddChild: boolean;
    onEdit: () => void;
    onAddChild: () => void;
    onHistory: () => void;
}

const FundNodeRow: React.FC<Props> = ({ node, risk, canAddChild, onEdit, onAddChild, onHistory }) => {
    const available = node.totalAuthority - node.amountObligated;
    const pct = (node.amountObligated / node.totalAuthority) * 100;
    const styles = { Low: 'border-zinc-200 bg-white', Warning: 'border-amber-300 bg-amber-50/50', Critical: 'border-rose-300 bg-rose-50/50' };

    return (
        <div className={`flex items-stretch border rounded-xl shadow-sm hover:shadow-md transition-all ${styles[risk]}`}>
            <div className="p-4 border-r border-zinc-100 flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <span className="text-xs font-bold text-zinc-900">{node.name}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border">{node.level}</span>
                           {risk !== 'Low' && <span className="text-[9px] font-bold uppercase bg-rose-500 text-white px-1.5 py-0.5 rounded">{risk}</span>}
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                        <div className={`h-full ${risk === 'Critical' ? 'bg-rose-500' : 'bg-zinc-800'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-500">Available:</span>
                        <span className={available < 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}>{formatCurrency(available)}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col border-l border-zinc-100 shrink-0">
                {canAddChild && <button onClick={onAddChild} className="flex-1 px-3 text-zinc-400 hover:text-blue-600"><Plus size={14}/></button>}
                <button onClick={onEdit} className="flex-1 px-3 text-zinc-400 hover:text-amber-700"><Edit size={14}/></button>
                <button onClick={onHistory} className="flex-1 px-3 text-zinc-400 hover:text-purple-700"><History size={14}/></button>
            </div>
        </div>
    );
};
export default FundNodeRow;