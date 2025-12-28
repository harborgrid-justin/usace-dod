import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, RefreshCcw, Info, UserCheck, Scale, Database } from 'lucide-react';
import { remisService, AUTHORITATIVE_SOURCE_ID } from '../../services/RemisDataService';
import { RealPropertyAsset, A123Status } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';

const InternalControlsDashboard: React.FC = () => {
    const [assets, setAssets] = useState<RealPropertyAsset[]>(remisService.getAssets());
    const [filter, setFilter] = useState<A123Status | 'All'>('All');
    const [reason, setReason] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setAssets([...remisService.getAssets()]);
        });
        return unsubscribe;
    }, []);

    const stats = useMemo(() => ({
        total: assets.length,
        certified: assets.filter(a => a.a123Status === 'Certified').length,
        pending: assets.filter(a => !a.a123Status || a.a123Status === 'Pending').length,
        flagged: assets.filter(a => a.a123Status === 'Flagged').length,
    }), [assets]);

    const handleCertify = (status: A123Status) => {
        if (!selectedId || !reason) return;
        startTransition(() => {
            remisService.updateA123Status(selectedId, status, reason);
            setReason('');
            setSelectedId(null);
        });
    };

    const filtered = useMemo(() => 
        assets.filter(a => filter === 'All' || (a.a123Status || 'Pending') === filter),
    [assets, filter]);

    return (
        <div className={`flex flex-col h-full bg-zinc-50/50 p-6 space-y-8 animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <ShieldCheck size={28} className="text-emerald-600"/> A-123 Internal Controls
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium">Standardized Compliance sample validation suite.</p>
                </div>
                <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner shrink-0">
                    {(['All', 'Certified', 'Pending', 'Flagged'] as const).map(s => (
                        <button key={s} onClick={() => setFilter(s)} className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${filter === s ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}>{s}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Population</p>
                    <p className="text-3xl font-mono font-bold text-zinc-900">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Certified Clean</p>
                    <p className="text-3xl font-mono font-bold text-emerald-700">{stats.certified}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Review Required</p>
                    <p className="text-3xl font-mono font-bold text-amber-700">{stats.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm text-center">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-2">Flagged Anomaly</p>
                    <p className="text-3xl font-mono font-bold text-rose-700">{stats.flagged}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-50 sticky top-0 border-b border-zinc-100 z-10">
                                <tr className="text-zinc-500 font-bold uppercase tracking-widest">
                                    <th className="p-4">RPUID</th>
                                    <th className="p-4">Org Origin</th>
                                    <th className="p-4 text-right">Value (PRV)</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filtered.map(a => (
                                    <tr key={a.rpuid} className={`hover:bg-zinc-50 cursor-pointer transition-colors ${selectedId === a.rpuid ? 'bg-emerald-50/50' : ''}`} onClick={() => setSelectedId(a.rpuid)}>
                                        <td className="p-4 font-mono font-bold text-zinc-800">{a.rpuid}</td>
                                        <td className="p-4 text-zinc-600 font-medium">{a.originatingOrg}</td>
                                        <td className="p-4 text-right font-mono font-bold">{formatCurrency(a.currentValue)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${
                                                a.a123Status === 'Certified' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                                a.a123Status === 'Flagged' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                                                'bg-zinc-100 text-zinc-500'
                                            }`}>{a.a123Status || 'Pending'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-zinc-900 rounded-3xl p-8 text-white shadow-2xl flex flex-col">
                    <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
                        <Scale size={20} className="text-emerald-400"/> Certification Panel
                    </h4>
                    {selectedId ? (
                        <div className="space-y-6 animate-in fade-in">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target RPUID</label>
                                <p className="text-lg font-mono font-bold text-white mt-1">{selectedId}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Justification Reason</label>
                                <textarea 
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 h-32 resize-none transition-all"
                                    placeholder="Enter the rationale for internal control sample validation..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button onClick={() => handleCertify('Flagged')} className="py-3 bg-rose-600/20 text-rose-400 border border-rose-600/30 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600/40">Flag Risk</button>
                                <button onClick={() => handleCertify('Certified')} className="py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-lg">
                                    <CheckCircle2 size={14}/> Certify Clean
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 py-12">
                            <AlertCircle size={48} className="opacity-10 mb-4"/>
                            <p className="text-xs text-center leading-relaxed">Select an authoritative record from the population registry to initiate the certification workflow.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InternalControlsDashboard;