
import React, { useMemo } from 'react';
import { Hammer, FileEdit, Lock, TrendingUp, AlertCircle } from 'lucide-react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

export const ContractProgress = ({ project }: { project: USACEProject }) => {
    // Generate S-Curve based on programmed vs obligated
    const data = useMemo(() => {
        const total = project.financials.programmed;
        return [
            { month: 'Jan', planned: total * 0.1, actual: total * 0.12 },
            { month: 'Feb', planned: total * 0.25, actual: total * 0.28 },
            { month: 'Mar', planned: total * 0.45, actual: total * 0.42 },
            { month: 'Apr', planned: total * 0.60, actual: total * 0.55 },
            { month: 'May', planned: total * 0.80, actual: project.financials.obligated },
            { month: 'Jun', planned: total, actual: null },
        ];
    }, [project]);

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Hammer size={14} className="text-zinc-400"/> Construction Progress (RMS Feed)
            </h4>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '12px' }}
                            formatter={(val: number) => formatCurrency(val)}
                        />
                        <Area type="monotone" dataKey="planned" stroke="#a1a1aa" strokeDasharray="3 3" fill="none" name="Planned Value" />
                        <Area type="monotone" dataKey="actual" stroke="#2563eb" fill="url(#colorActual)" name="Earned Value" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                    <div className="w-3 h-0.5 bg-zinc-400 border border-zinc-400 border-dashed" /> Planned
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                    <div className="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded-sm" /> Actual (EV)
                </div>
            </div>
        </div>
    );
};

export const ChangeOrderLog = ({ project }: { project: USACEProject }) => {
    if (!project.contractMods) return null;

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <FileEdit size={14} className="text-zinc-400"/> Modification Log
                </h4>
                <span className="text-[10px] font-mono text-zinc-500">Total: {formatCurrency(project.contractMods.reduce((s, m) => s + m.amount, 0))}</span>
            </div>
            <div className="space-y-3">
                {project.contractMods.map(mod => (
                    <div key={mod.modNumber} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-zinc-800">{mod.modNumber}</span>
                            <span className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(mod.amount)}</span>
                        </div>
                        <p className="text-xs text-zinc-600 mb-2">{mod.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 font-bold uppercase">{mod.reason}</span>
                            <span className="text-[10px] font-mono text-zinc-400">{mod.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ContractRetainageTracker = ({ project }: { project: USACEProject }) => (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-fit">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Lock size={14} className="text-zinc-400"/> Contract Retainage
        </h4>
        <div className="p-4 bg-zinc-900 rounded-xl text-white text-center mb-4">
            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Held Balance</p>
            <p className="text-2xl font-mono font-bold">{formatCurrency(project.financials.contractRetainage || 0)}</p>
        </div>
        <div className="space-y-2 text-xs text-zinc-600">
            <p className="flex justify-between"><span>Rate:</span> <span className="font-mono">10%</span></p>
            <p className="flex justify-between"><span>Trigger:</span> <span>Unsatisfactory Progress</span></p>
        </div>
        {project.financials.contractRetainage ? (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-800 flex gap-2">
                <AlertCircle size={14} className="shrink-0"/>
                <span>Funds withheld due to schedule slip. Release pending recovery plan approval.</span>
            </div>
        ) : (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] text-emerald-800 flex gap-2">
                <TrendingUp size={14} className="shrink-0"/>
                <span>No funds currently withheld. Contractor performing on schedule.</span>
            </div>
        )}
    </div>
);
