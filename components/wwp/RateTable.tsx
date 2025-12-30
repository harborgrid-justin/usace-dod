import React from 'react';
import { DollarSign, Edit } from 'lucide-react';
import { LaborRate } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    rates: LaborRate[];
    editingId: string | null;
    editVal: number;
    onEdit: (r: LaborRate) => void;
    onValChange: (v: number) => void;
    onSave: () => void;
}

const RateTable: React.FC<Props> = ({ rates, editingId, editVal, onEdit, onValChange, onSave }) => (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 font-bold text-sm uppercase"><DollarSign className="inline mr-2" size={16}/> Burdened Rates</div>
        <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b"><tr><th className="p-4">Category</th><th className="p-4 text-right">Rate/Hr</th></tr></thead>
            <tbody className="divide-y divide-zinc-50">
                {rates.map(r => (
                    <tr key={r.laborCategory} className="hover:bg-zinc-50">
                        <td className="p-4 font-semibold">{r.laborCategory}</td>
                        <td className="p-4 text-right">
                            {editingId === r.laborCategory ? <input type="number" value={editVal} onChange={e => onValChange(Number(e.target.value))} className="w-20 border rounded p-1" /> : formatCurrency(r.rate)}
                            <button onClick={() => editingId === r.laborCategory ? onSave() : onEdit(r)} className="ml-3 text-zinc-400 hover:text-zinc-900"><Edit size={12}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
export default RateTable;