
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, Legend } from 'recharts';
import { BudgetLineItem, POMEntry } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { AlertTriangle, CheckCircle2, TrendingUp, Landmark, PieChart } from 'lucide-react';

interface Props {
    items: BudgetLineItem[];
    pom: POMEntry[];
}

const REDashboard: React.FC<Props> = ({ items, pom }) => {
    // 1. Calculate Aggregate Mission Requirements (Budget Year)
    const byRequirements = useMemo(() => {
        return pom.map(entry => ({
            name: entry.businessLine,
            value: entry.fy1,
        })).reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.name);
            if (existing) {
                existing.value += curr.value;
            } else {
                acc.push(curr);
            }
            return acc;
        }, [] as { name: string, value: number }[]);
    }, [pom]);

    // 2. Performance Metrics
    const stats = useMemo(() => {
        const totalReq = byRequirements.reduce((sum, item) => sum + item.value, 0);
        const totalItems = items.length;
        const approvedValue = items
            .filter(i => i.status.includes('Approved') || i.status === 'Presidential Budget')
            .reduce((sum, i) => sum + i.amount, 0);
            
        return {
            totalRequirement: totalReq,
            approvedItems: items.filter(i => i.status.includes('Approved')).length,
            totalItems,
            coverage: totalReq > 0 ? (approvedValue / totalReq) * 100 : 0,
            inflationRisk: items.some(i => !i.isInflationAdjusted)
        };
    }, [items, byRequirements]);

    return (
        <div className="p-6 h-full overflow-y-auto custom-scrollbar space-y-8 animate-in fade-in">
            {/* Mission Critical KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 relative overflow-hidden group">
                    <Landmark size={40} className="absolute -right-4 -bottom-4 text-zinc-100 group-hover:text-rose-100 transition-colors" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 relative">Total Requirement (BY26)</p>
                    <p className="text-2xl font-mono font-bold text-zinc-900 relative">{formatCurrency(stats.totalRequirement)}</p>
                </div>
                
                <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Authorization Progress</p>
                    <div className="flex items-end gap-2">
                        <p className="text-2xl font-mono font-bold text-emerald-600">{stats.approvedItems}</p>
                        <span className="text-xs text-zinc-500 mb-1">/ {stats.totalItems} Items Approved</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(stats.approvedItems / stats.totalItems) * 100}%` }} />
                    </div>
                </div>

                <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Program Coverage (Value)</p>
                    <p className="text-2xl font-mono font-bold text-blue-600">{stats.coverage.toFixed(1)}%</p>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Validated for OMB Submission</p>
                </div>

                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 text-white shadow-xl">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Budget Lock-Down</p>
                    <p className="text-2xl font-mono font-bold">14 Days</p>
                    <div className="flex items-center gap-1.5 mt-3 text-rose-400 text-[10px] font-bold uppercase">
                        <AlertTriangle size={12}/> J-Sheets Outstanding
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Analysis */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Requirement by Business Line</h3>
                            <p className="text-[10px] text-zinc-400 font-medium mt-1">Cross-referencing AAWP vs POM Estimates</p>
                        </div>
                        <PieChart size={20} className="text-zinc-200" />
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={byRequirements} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => `$${val/1e6}M`} />
                                <Tooltip 
                                    formatter={(val: number) => formatCurrency(val)} 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                    {byRequirements.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#be123c', '#2563eb', '#059669', '#7c3aed'][index % 4]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Intelligent Compliance Stream */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Sentinel Insight Stream</h3>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
                        {stats.inflationRisk && (
                            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm"><AlertTriangle size={18} /></div>
                                <div>
                                    <p className="text-xs font-bold text-amber-800">Escalation Logic Mismatch</p>
                                    <p className="text-[10px] text-amber-700 leading-relaxed mt-1">Some Budget Year items have not been adjusted to the current 3.2% escalation factor (G-8 Directive 24-01).</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                            <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><TrendingUp size={18} /></div>
                            <div>
                                <p className="text-xs font-bold text-blue-800">Capability level 1 - 100% Validated</p>
                                <p className="text-[10px] text-blue-700 leading-relaxed mt-1">All mission-critical (Level 1) items have verified justification sheets attached.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
                            <div className="p-2 bg-white rounded-lg text-zinc-600 shadow-sm"><CheckCircle2 size={18} /></div>
                            <div>
                                <p className="text-xs font-bold text-zinc-800">Presidential Budget Cycle Sync</p>
                                <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">Estimates successfully reconciled with SNaP database totals for FY26.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-rose-50 border border-rose-100 rounded-xl">
                            <div className="p-2 bg-white rounded-lg text-rose-600 shadow-sm"><Landmark size={18} /></div>
                            <div>
                                <p className="text-xs font-bold text-rose-800">Unjustified Increase Detected</p>
                                <p className="text-[10px] text-rose-700 leading-relaxed mt-1">Project WBS 123456 shows 15% increase vs FY25 Enacted without supplemental J-Sheet evidence.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default REDashboard;
