
import React, { useMemo } from 'react';
import { FADocument, WorkAllowance } from '../../types';
import { Landmark, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
    fads: FADocument[];
    allowances: WorkAllowance[];
}

const CWA_Dashboard: React.FC<Props> = ({ fads, allowances }) => {
    const totalAuthority = useMemo(() => fads.reduce((sum, fad) => sum + fad.totalAuthority, 0), [fads]);
    const totalAllowance = useMemo(() => allowances.reduce((sum, wa) => sum + wa.amount, 0), [allowances]);
    const totalObligated = useMemo(() => allowances.reduce((sum, wa) => sum + wa.obligatedAmount, 0), [allowances]);
    
    const executionRate = totalAuthority > 0 ? (totalObligated / totalAuthority) * 100 : 0;

    const chartData = allowances.map(wa => ({
        name: wa.districtEROC,
        allowance: wa.amount,
        obligated: wa.obligatedAmount,
    })).reduce((acc, current) => {
        const existing = acc.find(item => item.name === current.name);
        if (existing) {
            existing.allowance += current.allowance;
            existing.obligated += current.obligated;
        } else {
            acc.push(current);
        }
        return acc;
    }, [] as {name: string, allowance: number, obligated: number}[]);

    return (
        <div className="p-2 space-y-6 h-full overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Landmark size={16}/></div><span className="text-[10px] font-bold text-zinc-400 uppercase">Total Authority</span></div><p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(totalAuthority)}</p></div>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FileText size={16}/></div><span className="text-[10px] font-bold text-zinc-400 uppercase">Allowances Issued</span></div><p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(totalAllowance)}</p></div>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp size={16}/></div><span className="text-[10px] font-bold text-zinc-400 uppercase">Execution Rate</span></div><p className="text-2xl font-mono font-bold text-emerald-600">{executionRate.toFixed(1)}%</p></div>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-amber-50 rounded-lg text-amber-600"><AlertTriangle size={16}/></div><span className="text-[10px] font-bold text-zinc-400 uppercase">Reprogram Alerts</span></div><p className="text-2xl font-mono font-bold text-amber-600">3</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm min-h-[300px]">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Execution by District</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 10}}/>
                                <YAxis tick={{fontSize: 10}} tickFormatter={(val) => `${val/1000000}M`}/>
                                <Tooltip contentStyle={{fontSize: 12}} formatter={(val) => formatCurrency(val as number)}/>
                                <Bar dataKey="allowance" fill="#d4d4d8" name="Allowance"/>
                                <Bar dataKey="obligated" fill="#be123c" name="Obligated"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Reprogramming Monitor</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg"><p className="text-xs font-bold text-rose-800">Navigation - LRL</p><p className="text-[10px] text-rose-600">Threshold breached by $50,000.</p></div>
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg"><p className="text-xs font-bold text-amber-800">Flood Control - MVR</p><p className="text-[10px] text-amber-600">Nearing 25% cumulative limit.</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CWA_Dashboard;
