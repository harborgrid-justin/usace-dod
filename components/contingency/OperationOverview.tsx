
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { GitMerge, Link as LinkIcon } from 'lucide-react';
import { ContingencyOperation } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { MOCK_DIGITAL_THREADS } from '../../constants';
import FiduciarySentinel from './FiduciarySentinel';

interface Props {
    operation: ContingencyOperation;
    onSelectThread: (id: string) => void;
}

const OperationOverview: React.FC<Props> = ({ operation, onSelectThread }) => {
    const totalIncrementalCost = Object.values(operation.incrementalCosts).reduce<number>((sum, cost) => sum + Number(cost), 0);
    
    const costData = [
        { name: 'Personnel', value: operation.incrementalCosts.personnel, fill: '#60a5fa' },
        { name: 'Op Support', value: operation.incrementalCosts.operatingSupport, fill: '#a78bfa' },
        { name: 'Investment', value: operation.incrementalCosts.investment, fill: '#f472b6' },
        { name: 'Retro/Reset', value: Number(operation.incrementalCosts.retrograde) + Number(operation.incrementalCosts.reset), fill: '#fb923c' }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            <div className="lg:col-span-3 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Cost Estimating Workbench</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-zinc-200">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Pre-Deployment</p>
                        <p className="font-mono font-bold text-lg text-zinc-800">{operation.estimates?.preDeployment ? formatCurrency(operation.estimates.preDeployment.cost) : 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-zinc-200">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Budget</p>
                        <p className="font-mono font-bold text-lg text-zinc-800">{operation.estimates?.budget ? formatCurrency(operation.estimates.budget.cost) : 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border-2 border-blue-500 shadow-md">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Working</p>
                        <p className="font-mono font-bold text-lg text-blue-600">{operation.estimates?.working ? formatCurrency(operation.estimates.working.cost) : 'N/A'}</p>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Incremental Cost Breakdown ({formatCurrency(totalIncrementalCost)})</h4>
                <div className="h-48 w-full border border-zinc-100 rounded-lg p-2 bg-zinc-50/30">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '12px' }} formatter={(value: any) => formatCurrency(value)} />
                            <Bar dataKey="value" barSize={24} radius={[4, 4, 4, 4]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2"><GitMerge size={14}/> Linked Digital Threads</h4>
                    {operation.linkedThreadIds.map(id => (
                        <button key={id} onClick={() => onSelectThread(id)} className="flex items-center gap-2 text-xs font-mono text-blue-600 hover:underline p-1"><LinkIcon size={12}/> {id} - {MOCK_DIGITAL_THREADS.find(t=>t.id===id)?.vendorName}</button>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1 min-h-[300px]">
                <FiduciarySentinel operation={operation} />
            </div>
        </div>
    );
};

export default OperationOverview;
