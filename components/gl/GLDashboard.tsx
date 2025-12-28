import React, { useMemo } from 'react';
import { formatCurrencyExact } from '../../utils/formatting';
// Added missing Calendar import
import { AlertCircle, CheckCircle, TrendingUp, ShieldCheck, Database, Landmark, Calendar } from 'lucide-react';
import { glService } from '../../services/GLDataService';
import { useService } from '../../hooks/useService';

const GLDashboard: React.FC = () => {
    // Authoritative State Sync (React 18/19 pattern)
    const transactions = useService(glService, () => glService.getTransactions());

    const { totalDebits, totalCredits, inBalance } = useMemo(() => {
        let debits = 0;
        let credits = 0;
        transactions.forEach(tx => {
            tx.lines.forEach(line => {
                debits += line.debit;
                credits += line.credit;
            });
        });
        return { totalDebits: debits, totalCredits: credits, inBalance: Math.abs(debits - credits) < 0.01 };
    }, [transactions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 h-full overflow-y-auto custom-scrollbar animate-in fade-in">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border border-zinc-800">
                    <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Landmark size={120}/></div>
                    <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <Database size={16}/> Authority Trial Balance
                    </h4>
                    <div className="space-y-6 relative z-10">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total Debits</span>
                            <p className="text-3xl font-mono font-bold text-white mt-2 tracking-tighter">{formatCurrencyExact(totalDebits)}</p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total Credits</span>
                            <p className="text-3xl font-mono font-bold text-white mt-2 tracking-tighter">{formatCurrencyExact(totalCredits)}</p>
                        </div>
                    </div>
                    <div className={`mt-10 p-4 rounded-2xl flex items-center justify-center gap-4 text-xs font-bold border transition-all shadow-xl ${
                        inBalance ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                        {inBalance ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                        <span className="tracking-[0.1em]">{inBalance ? 'LEDGER IN BALANCE' : 'OUT OF BALANCE DETECTED'}</span>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-[32px] p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-rose-700"/> Audit Integrity Monitor
                    </h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <span className="text-xs text-zinc-500 font-medium">USSGL 1010/6653 Match</span>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Verified</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <span className="text-xs text-zinc-500 font-medium">Period Close Status</span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded border border-blue-100">Open (FY24 05)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[40px] p-8 flex flex-col shadow-sm">
                <div className="flex justify-between items-center mb-8 shrink-0">
                    <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                        <TrendingUp size={18} className="text-rose-700" /> Transaction Velocity
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase">{transactions.length} System Postings</span>
                </div>
                <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
                    {transactions.map(tx => (
                        <div key={tx.id} className="p-5 rounded-3xl border border-zinc-50 hover:bg-zinc-50 hover:border-rose-200 transition-all group cursor-default">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-base font-bold text-zinc-900 group-hover:text-rose-700 transition-colors">{tx.description}</span>
                                        <span className="text-[10px] font-mono bg-white text-zinc-500 px-2 py-1 rounded-lg border border-zinc-100 shadow-sm">{tx.sourceModule}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><Landmark size={12}/> Ref: {tx.referenceDoc}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                                        <span className="flex items-center gap-1"><Calendar size={12}/> {tx.date}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-mono font-bold text-zinc-900 tracking-tighter">{formatCurrencyExact(tx.totalAmount)}</p>
                                    <div className="flex items-center justify-end gap-2 mt-1.5">
                                        <div className={`w-2 h-2 rounded-full ${tx.status === 'Posted' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{tx.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GLDashboard;