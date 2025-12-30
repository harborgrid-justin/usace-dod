
import React, { useMemo } from 'react';
import { DWCFTransaction } from '../../types';
import { formatCurrencyExact, formatCurrency } from '../../utils/formatting';
import { ArrowDownLeft, ArrowUpRight, Clock, TrendingDown, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

interface Props {
    transactions: DWCFTransaction[];
}

const CashFlowMonitor: React.FC<Props> = ({ transactions }) => {
    const sortedTx = useMemo(() => [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [transactions]);

    // Opp 41: Cash Forecasting
    // Calculate simple burn rate based on last 5 disbursements
    const recentDisbursements = sortedTx.filter(t => t.type === 'Disbursement').slice(0, 5);
    const avgBurn = recentDisbursements.length > 0 
        ? recentDisbursements.reduce((s, t) => s + Math.abs(t.amount), 0) / recentDisbursements.length 
        : 0;
    
    // Mock current balance starting point
    const currentBalance = 125000000; 
    const daysOfCash = avgBurn > 0 ? Math.floor(currentBalance / avgBurn) : 999;
    const isSolvencyRisk = daysOfCash < 45;

    // Generate forecast data
    const forecastData = Array.from({length: 10}).map((_, i) => ({
        day: `Day ${i+1}`,
        balance: currentBalance - (avgBurn * (i+1))
    }));

    return (
        <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Treasury Cash (97X4930)</h3>
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 font-bold uppercase tracking-wider"><Clock size={10}/> Real-Time</span>
                </div>
                
                {/* Solvency Dashboard */}
                <div className={`p-4 rounded-sm border flex justify-between items-center ${isSolvencyRisk ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div>
                         <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Days Cash on Hand</p>
                         <p className={`text-2xl font-mono font-bold tracking-tighter ${isSolvencyRisk ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {daysOfCash} Days
                         </p>
                    </div>
                    {isSolvencyRisk ? <AlertOctagon size={28} className="text-rose-400" /> : <CheckCircle2 size={28} className="text-emerald-400" />}
                </div>

                <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={forecastData}>
                            <Tooltip contentStyle={{fontSize: '10px', borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} formatter={(val: number) => formatCurrency(val)}/>
                            <Area type="monotone" dataKey="balance" stroke={isSolvencyRisk ? "#e11d48" : "#059669"} fill={isSolvencyRisk ? "#ffe4e6" : "#d1fae5"} strokeWidth={2} />
                         </AreaChart>
                    </ResponsiveContainer>
                    <p className="text-[9px] text-center text-zinc-400 mt-2 uppercase font-bold tracking-widest">10-Day Projection (Linear Burn)</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 sticky top-0 border-b border-zinc-100">
                        <tr>
                            <th className="p-3 pl-6 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Activity</th>
                            <th className="p-3 pr-6 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-right">Net Impact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {sortedTx.map(tx => (
                            <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-sm ${
                                            tx.type === 'Collection' ? 'bg-emerald-100 text-emerald-600' : 
                                            tx.type === 'Disbursement' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {tx.type === 'Collection' ? <ArrowDownLeft size={12}/> : <ArrowUpRight size={12}/>}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-800 line-clamp-1">{tx.description}</p>
                                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{tx.date}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 pr-6 text-right">
                                    <span className={`font-mono text-xs font-bold tracking-tight ${
                                        tx.type === 'Collection' ? 'text-emerald-600' : 'text-zinc-900'
                                    }`}>
                                        {tx.type === 'Collection' ? '+' : '-'}{formatCurrencyExact(tx.amount)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CashFlowMonitor;
