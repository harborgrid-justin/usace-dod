
import React, { useState, useMemo } from 'react';
import { FileText, Landmark, Plus, Search, Shield, History, CheckCircle2, AlertTriangle, ArrowRight, BarChart3 } from 'lucide-react';
import { MOCK_FADS, MOCK_WORK_ALLOWANCES } from '../../constants';
import { formatCurrency } from '../../utils/formatting';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

const CivilWorksAllowanceView: React.FC = () => {
    const [selectedFadId, setSelectedFadId] = useState<string | null>(MOCK_FADS[0].id);

    const filteredAllowances = useMemo(() => MOCK_WORK_ALLOWANCES.filter(a => a.fadId === selectedFadId), [selectedFadId]);
    const selectedFad = useMemo(() => MOCK_FADS.find(f => f.id === selectedFadId), [selectedFadId]);

    const chartData = useMemo(() => {
        if (!selectedFad) return [];
        const distributed = filteredAllowances.reduce((sum, a) => sum + a.amount, 0);
        return [
            { name: 'Authority', value: selectedFad.totalAuthority, fill: '#e4e4e7' },
            { name: 'Distributed', value: distributed, fill: '#059669' },
            { name: 'Remaining', value: selectedFad.totalAuthority - distributed, fill: '#2563eb' }
        ];
    }, [selectedFad, filteredAllowances]);

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-full mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <FileText size={24} className="text-rose-700" /> Civil Works Allowance
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">FAD Tracking & Work Allowance (WA) Issuance (ER 37-1-30)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active FADs</h3>
                        <button className="p-1 hover:bg-zinc-200 rounded"><Plus size={14}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {MOCK_FADS.map(fad => (
                            <button key={fad.id} onClick={() => setSelectedFadId(fad.id)} className={`w-full text-left p-4 border-b border-zinc-100 transition-colors ${selectedFadId === fad.id ? 'bg-rose-50 border-l-4 border-l-rose-700' : 'hover:bg-zinc-50 border-l-4 border-l-transparent'}`}>
                                <p className="text-xs font-mono font-bold text-zinc-900">{fad.id}</p>
                                <p className="text-[10px] text-zinc-500 mt-1">{fad.publicLaw}</p>
                                <div className="mt-3 text-[10px] flex justify-between"><span className="text-zinc-400">Authority:</span><span className="font-mono font-bold">{formatCurrency(fad.totalAuthority)}</span></div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-9 flex flex-col gap-6 overflow-hidden">
                    {/* Visualizer */}
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm h-64 shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 size={14} className="text-zinc-400" /> Fund Balance Visualizer
                            </h3>
                            {selectedFad && <span className="text-xs font-mono text-zinc-500">Total Auth: {formatCurrency(selectedFad.totalAuthority)}</span>}
                        </div>
                        <div className="w-full h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" tick={{fontSize: 10}} width={80} />
                                    <Tooltip cursor={{fill: 'transparent'}} formatter={(val) => formatCurrency(val as number)} contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
                                    <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden flex-1">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Work Allowances: {selectedFadId}</h3>
                            <div className="flex gap-2">
                                 <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                    <input type="text" placeholder="Search WA..." className="pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs w-48"/>
                                </div>
                                <button className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors shadow-sm">+ Issue WA</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 sticky top-0 border-b border-zinc-100 z-10 shadow-sm">
                                    <tr>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">District / PPA</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Obligated</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                                        <th className="p-4 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {filteredAllowances.map(wa => (
                                        <tr key={wa.id} className="hover:bg-zinc-50">
                                            <td className="p-4">
                                                <p className="text-xs font-bold text-zinc-800">{wa.districtEROC} - {wa.ppa}</p>
                                                <p className="text-[10px] text-zinc-500">{wa.congressionalLineItem}</p>
                                            </td>
                                            <td className="p-4 text-right text-xs font-mono font-bold text-zinc-900">{formatCurrency(wa.amount)}</td>
                                            <td className="p-4 text-right text-xs font-mono text-zinc-600">{formatCurrency(wa.obligatedAmount)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${wa.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{wa.status}</span>
                                            </td>
                                            <td className="p-4 text-center"><History size={14} className="text-zinc-300 cursor-pointer hover:text-zinc-600 inline-block"/></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CivilWorksAllowanceView;
