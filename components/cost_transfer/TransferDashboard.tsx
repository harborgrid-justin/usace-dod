
import React from 'react';
import { CostTransfer } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatting';
import { CheckCircle2, AlertOctagon, TrendingUp, Shuffle } from 'lucide-react';

interface Props {
    transfers: CostTransfer[];
}

const TransferDashboard: React.FC<Props> = ({ transfers }) => {
    const totalVolume = transfers.reduce((sum, t) => sum + t.amount, 0);
    const pendingCount = transfers.filter(t => t.status === 'Pending Approval').length;
    const approvalRate = transfers.filter(t => t.status === 'Posted').length / Math.max(1, transfers.length) * 100;
    
    // Chart Data: Status Distribution
    const statusData = [
        { name: 'Pending', value: transfers.filter(t => t.status === 'Pending Approval').length, color: '#fbbf24' },
        { name: 'Posted', value: transfers.filter(t => t.status === 'Posted').length, color: '#34d399' },
        { name: 'Rejected', value: transfers.filter(t => t.status === 'Rejected').length, color: '#f87171' },
    ];

    // Chart Data: Volume by Source
    const volumeData = transfers.reduce((acc, curr) => {
        const project = curr.sourceProjectId.split(' - ')[0];
        const existing = acc.find(i => i.name === project);
        if(existing) existing.value += curr.amount;
        else acc.push({ name: project, value: curr.amount });
        return acc;
    }, [] as {name: string, value: number}[]).slice(0, 5);

    return (
        <div className="space-y-6 animate-in fade-in h-full overflow-y-auto custom-scrollbar p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Transferred</p>
                            <p className="text-2xl font-mono font-bold text-zinc-900 mt-1">{formatCurrency(totalVolume)}</p>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Shuffle size={20}/></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pending Approvals</p>
                            <p className="text-2xl font-mono font-bold text-amber-600 mt-1">{pendingCount}</p>
                        </div>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertOctagon size={20}/></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Approval Rate</p>
                            <p className="text-2xl font-mono font-bold text-emerald-600 mt-1">{approvalRate.toFixed(1)}%</p>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={20}/></div>
                    </div>
                </div>
                <div className="bg-zinc-900 p-5 rounded-xl shadow-lg flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Efficiency Metric</p>
                            <p className="text-2xl font-mono font-bold mt-1">2.4 Days</p>
                        </div>
                        <div className="p-2 bg-zinc-800 text-zinc-200 rounded-lg"><TrendingUp size={20}/></div>
                    </div>
                    <p className="text-[9px] text-zinc-500 mt-2">Avg time to post</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm min-h-[300px] flex flex-col">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Status Composition</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm min-h-[300px] flex flex-col">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Top Source Projects</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={volumeData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={{fontSize: 10}} width={80} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={(val: number) => formatCurrency(val)} />
                                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferDashboard;
