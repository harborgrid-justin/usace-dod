
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Check, X } from 'lucide-react';
import { ContingencyOperation } from '../../types';
import { formatCurrency } from '../../utils/formatting';

const CostDetermination = ({ operation }: { operation: ContingencyOperation }) => {
    const totalIncrementalCost = Object.values(operation.incrementalCosts).reduce<number>((sum, cost) => sum + Number(cost), 0);
    const data = [{ name: 'Baseline Costs', value: operation.baselineCosts }, { name: 'Incremental Costs', value: totalIncrementalCost }];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-zinc-200">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Cost Type Breakdown (FMR 9.0)</h4>
                    <div className="h-40"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#8884d8" paddingAngle={5}><Cell key="baseline" fill="#a1a1aa" /><Cell key="incremental" fill="#10b981" /></Pie><Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '12px' }}/></PieChart></ResponsiveContainer></div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center text-xs"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-zinc-400"/>Baseline Costs</span><span className="font-mono font-bold">{formatCurrency(Number(operation.baselineCosts))}</span></div>
                        <div className="flex justify-between items-center text-xs"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Incremental Costs</span><span className="font-mono font-bold">{formatCurrency(Number(totalIncrementalCost))}</span></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-zinc-200">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Cost Offsets (FMR 9.3)</h4>
                    {operation.costOffsets.length > 0 ? (
                        <div className="space-y-2">{operation.costOffsets.map(offset => (<div key={offset.name} className="p-2 bg-zinc-50 rounded flex justify-between items-center"><span className="text-xs font-medium text-zinc-600">{offset.name}</span><span className="text-xs font-mono font-bold text-blue-600">-{formatCurrency(offset.amount)}</span></div>))}</div>
                    ) : <p className="text-xs text-zinc-400 text-center pt-8">No cost offsets documented.</p>}
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Allowable Incremental Costs Checklist (CBS)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    {operation.incrementalCostsBreakdown.map(item => (
                        <div key={item.id} className="flex items-start gap-3">
                            <div>{item.isApplicable ? <Check size={14} className="text-emerald-500 mt-0.5"/> : <X size={14} className="text-zinc-300 mt-0.5"/>}</div>
                            <div><p className={`text-xs font-medium ${item.isApplicable ? 'text-zinc-800' : 'text-zinc-400'}`}>{item.id} {item.name}</p><p className="text-[10px] text-zinc-500">{item.description}</p></div>
                            {item.isApplicable && <span className="ml-auto text-xs font-mono font-semibold text-zinc-700">{formatCurrency(Number(item.cost))}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CostDetermination;
