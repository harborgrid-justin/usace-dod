import React from 'react';
import { Obligation } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { TrendingDown, Hourglass, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
    obligations: Obligation[];
}

const KPICard = ({ title, value, subtext, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
                <Icon size={20} />
            </div>
            {subtext && <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${bgClass} ${colorClass}`}>{subtext}</span>}
        </div>
        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
            <p className="text-2xl font-mono font-bold text-zinc-900 mt-1">{value}</p>
        </div>
    </div>
);

const ObligationDashboard: React.FC<Props> = ({ obligations }) => {
    const totalObligated = obligations.reduce((sum, o) => sum + o.amount, 0);
    const totalULO = obligations.reduce((sum, o) => sum + o.unliquidatedAmount, 0);
    const totalDormant = obligations.filter(o => o.status === 'Dormant').reduce((sum, o) => sum + o.unliquidatedAmount, 0);
    const disbursementRate = totalObligated > 0 ? ((totalObligated - totalULO) / totalObligated) * 100 : 0;

    const burnData = [
        { name: 'Q1', obligated: totalObligated * 0.25, disbursed: (totalObligated - totalULO) * 0.2 },
        { name: 'Q2', obligated: totalObligated * 0.45, disbursed: (totalObligated - totalULO) * 0.4 },
        { name: 'Q3', obligated: totalObligated * 0.80, disbursed: (totalObligated - totalULO) * 0.7 },
        { name: 'Q4', obligated: totalObligated, disbursed: (totalObligated - totalULO) }
    ];

    // Fix: Create a copy before sorting to avoid mutating the read-only prop
    const topVendors = [...obligations]
        .sort((a, b) => b.unliquidatedAmount - a.unliquidatedAmount)
        .slice(0, 4);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    title="Total Obligations (FY24)" 
                    value={formatCurrency(totalObligated)} 
                    icon={TrendingDown} 
                    colorClass="text-zinc-700" 
                    bgClass="bg-zinc-100" 
                />
                <KPICard 
                    title="Unliquidated Obs (ULO)" 
                    value={formatCurrency(totalULO)} 
                    subtext={`${((totalULO/totalObligated)*100).toFixed(1)}% of Total`}
                    icon={Hourglass} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KPICard 
                    title="Dormant ULO Risk" 
                    value={formatCurrency(totalDormant)} 
                    subtext="Action Required"
                    icon={AlertOctagon} 
                    colorClass="text-rose-600" 
                    bgClass="bg-rose-50" 
                />
                <KPICard 
                    title="Disbursement Rate" 
                    value={`${disbursementRate.toFixed(1)}%`} 
                    subtext="On Target"
                    icon={CheckCircle2} 
                    colorClass="text-emerald-600" 
                    bgClass="bg-emerald-50" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-80">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Execution Burn Rate</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={burnData} barGap={0}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => `$${val/1000}k`} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={(val: number) => formatCurrency(val)} />
                            <Bar dataKey="obligated" fill="#e4e4e7" name="Obligated" radius={[4, 4, 0, 0]} barSize={30} />
                            <Bar dataKey="disbursed" fill="#10b981" name="Disbursed" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Top Vendors by ULO</h3>
                    <div className="flex-1 space-y-4">
                        {topVendors.map(o => (
                            <div key={o.id} className="flex justify-between items-center p-2 hover:bg-zinc-50 rounded transition-colors cursor-default">
                                <div>
                                    <p className="text-xs font-bold text-zinc-800 line-clamp-1">{o.vendor}</p>
                                    <p className="text-[10px] text-zinc-500 font-mono">{o.documentNumber}</p>
                                </div>
                                <span className="text-xs font-mono font-bold text-rose-600">{formatCurrency(o.unliquidatedAmount)}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 border border-zinc-200 rounded-lg text-[10px] font-bold uppercase text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
                        View Full Aging Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ObligationDashboard;