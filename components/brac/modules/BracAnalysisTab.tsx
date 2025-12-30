
import React, { useMemo } from 'react';
import { Activity, Calculator, TrendingUp, ShieldAlert } from 'lucide-react';
import { BracDssEngine } from '../../../services/BracDssEngine';
import { formatCurrency } from '../../../utils/formatting';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const BracAnalysisTab: React.FC<any> = ({ scenario, losing, gaining }) => {
    const analysis = BracDssEngine.analyzeScenario(scenario, losing, gaining);
    const cobraData = Array.from({length: 21}).map((_, i) => ({ year: `Yr ${i}`, npv: (scenario.annualSavings * i) - (scenario.oneTimeMovingCost + scenario.milconCost) }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-md border border-zinc-200"><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">MVI Score</p><div className="flex items-center gap-3"><div className="p-2 bg-indigo-50 text-indigo-600 rounded-sm"><Activity size={18}/></div><p className="text-2xl font-mono font-bold">{analysis.mviScore.toFixed(1)}</p></div></div>
                <div className="bg-white p-5 rounded-md border border-zinc-200"><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">ROI (Yrs)</p><div className="flex items-center gap-3"><div className="p-2 bg-emerald-50 text-emerald-600 rounded-sm"><Calculator size={18}/></div><p className="text-2xl font-mono font-bold">{analysis.paybackPeriod}</p></div></div>
                <div className="bg-white p-5 rounded-md border border-zinc-200"><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Econ Impact</p><div className="flex items-center gap-3"><div className="p-2 bg-blue-50 text-blue-600 rounded-sm"><TrendingUp size={18}/></div><p className="text-2xl font-mono font-bold">{analysis.economicImpactIndex.toFixed(1)}%</p></div></div>
                <div className="bg-white p-5 rounded-md border border-zinc-200"><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Env. Liab</p><div className="flex items-center gap-3"><div className="p-2 bg-zinc-100 text-zinc-600 rounded-sm"><ShieldAlert size={18}/></div><p className="text-lg font-mono font-bold">{formatCurrency(analysis.environmentalLiability)}</p></div></div>
            </div>
            <div className="bg-white p-8 rounded-md border border-zinc-200 h-[400px] flex flex-col shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6">COBRA Analysis: Cumulative NPV</h3>
                <div className="flex-1 w-full"><ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cobraData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/><XAxis dataKey="year" tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false}/><YAxis tickFormatter={v => `$${v/1e6}M`} tick={{fontSize: 10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px'}}/><Line type="monotone" dataKey="npv" stroke="#4f46e5" strokeWidth={3} dot={false}/></LineChart>
                </ResponsiveContainer></div>
            </div>
        </div>
    );
};
export default BracAnalysisTab;
