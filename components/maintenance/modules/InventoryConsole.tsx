
import React from 'react';
import { Package, Search, AlertTriangle } from 'lucide-react';
import { MOCK_INVENTORY } from '../../../constants';

const InventoryConsole: React.FC = () => (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/><input className="w-64 pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs" placeholder="Search SKU..."/></div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100"><AlertTriangle size={12}/> 2 Low Stock</span>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden"><table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100"><tr className="text-[10px] font-bold text-zinc-400 uppercase"><th className="p-4">Item</th><th className="p-4 text-right">Stock</th></tr></thead>
            <tbody className="divide-y divide-zinc-100">
                {MOCK_INVENTORY.map(i => (
                    <tr key={i.id} className="hover:bg-zinc-50"><td className="p-4 flex items-center gap-3"><Package size={16} className="text-zinc-400"/><div><p className="text-sm font-bold">{i.name}</p><p className="text-[10px] font-mono text-zinc-500">{i.sku}</p></div></td><td className="p-4 text-right font-mono font-bold text-zinc-900">{i.quantityOnHand}</td></tr>
                ))}
            </tbody>
        </table></div>
    </div>
);
export default InventoryConsole;
