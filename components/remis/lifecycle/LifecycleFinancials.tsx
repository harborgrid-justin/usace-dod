
import React from 'react';
import { TrendingDown, TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../../utils/formatting';

const LifecycleFinancials: React.FC<{data: any}> = ({ data }) => {
    const dmTrend = [ { year: '2022', dm: data.deferredMaintenance * 0.8 }, { year: '2023', dm: data.deferredMaintenance * 0.9 }, { year: '2024', dm: data.deferredMaintenance } ];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-2">
            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm h-[400px] flex flex-col">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-10 flex items-center gap-3"><TrendingDown size={20} className="text-rose-600"/> Sustenance Liability</h4>
                <div className="flex-1 w-full min-h-0"><ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dmTrend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="year" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="dm" stroke="#e11d48" fill="#ffe4e6"/></AreaChart>
                </ResponsiveContainer></div>
            </div>
            <div className="lg:col-span-4 space-y-6 flex flex-col">
                <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm flex-1"><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Aggregate DM</p><p className="text-4xl font-mono font-bold text-rose-700 tracking-tighter">{formatCurrency(data.deferredMaintenance)}</p></div>
                <div className="p-8 bg-emerald-900 rounded-[32px] text-white shadow-2xl relative border border-emerald-800"><p className="text-[10px] font-bold text-emerald-400 uppercase mb-1.5">Replacement Value (PRV)</p><p className="text-4xl font-mono font-bold tracking-tighter">{formatCurrency(data.currentValue)}</p></div>
            </div>
        </div>
    );
};
export default LifecycleFinancials;
