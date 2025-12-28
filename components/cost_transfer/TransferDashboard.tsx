import React, { useMemo } from 'react';
import { CostTransfer } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatting';
import { CheckCircle2, AlertOctagon, TrendingUp, Shuffle, DollarSign, Activity } from 'lucide-react';

interface Props {
    transfers: CostTransfer[];
}

const KPICard = React.memo(({ title, value, sub, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between group hover:border-rose-200 transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-tighter mt-1">{sub}</p>
        </div>
        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">{title}</p>
            <p className="text-3xl font-mono font-bold text-zinc-900 tracking-tight">{value}</p>
        </div>
    </div>
));

const TransferDashboard: React.FC<Props> = ({ transfers }) => {
    const totalVolume = useMemo(() => transfers.reduce((sum, t) => sum + t.amount, 0), [transfers]);
    const pendingCount = useMemo(() => transfers.filter(t => t.status === 'Pending Approval').length, [transfers]);
    const approvalRate = useMemo(() => (transfers.filter(t => t.status === 'Posted').length / Math.max(1, transfers.length)) * 100, [transfers]);
    
    const statusData = useMemo(() => [
        { name: 'Pending', value: transfers.filter(t => t.status === 'Pending Approval').length, color: '#fbbf24' },
        { name: 'Posted', value: transfers.filter(t => t.status === 'Posted').length, color: '#10b981' },
        { name: 'Rejected', value: transfers.filter(t => t.status === 'Rejected').length, color: '#f43f5e' },
    ], [transfers]);

    const volumeData = useMemo(() => transfers.reduce((acc, curr) => {
        const project = curr.sourceProjectId.split(' - ')[0];
        const existing = acc.find(i => i.name === project);
        if(existing) existing.value += curr.amount;
        else acc.push({ name: project, value: curr.amount });
        return acc;
    }, [] as {name: string, value: number}[]).slice(0, 5), [transfers]);

    return (
        <div className="space-y-8 animate-in fade-in h-full overflow-y-auto custom-scrollbar p-1 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Transfer Volume" value={formatCurrency(totalVolume)} sub="Cumulative YTD" icon={Shuffle} colorClass="text-zinc-900" bgClass="bg-zinc-100" />
                <KPICard title="Approval Backlog" value={pendingCount} sub="Pending review" icon={AlertOctagon} colorClass="text-amber-600" bgClass="bg-amber-50" />
                <KPICard title="Execution Rate" value={`${approvalRate.toFixed(0)}%`} sub="Successful posting" icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
                <KPICard title="Avg Cycle Time" value="1.8d" sub="Request to Post" icon={Activity} colorClass="text-blue-600" bgClass="bg-blue-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm flex flex-col h-[450px]">
                    <div className="flex justify-between items-center mb-10">
                         <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Case Status Composition</h3>
                         <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                                    {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-7 bg-[#18181b] border border-zinc-800 rounded-[32px] p-8 shadow-2xl flex flex-col h-[450px] relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                            <TrendingUp size={18} className="text-emerald-400"/> Source Concentration Analysis
                        </h3>
                    </div>
                    <div className="flex-1 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={volumeData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={{fontSize: 11, fill: '#71717a', fontWeight: 'bold'}} width={90} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                                    contentStyle={{ backgroundColor: '#27272a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                                    formatter={(val: number) => formatCurrency(val)} 
                                />
                                <Bar dataKey="value" fill="#4f46e5" radius={[0, 8, 8, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferDashboard;