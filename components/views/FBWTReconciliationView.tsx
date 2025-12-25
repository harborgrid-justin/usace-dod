
import React from 'react';
import { Scale, CheckCircle, AlertCircle, XCircle, Users, FileDigit, BarChart2 } from 'lucide-react';
import { MOCK_FBWT_CASES, MOCK_SCORECARD_DATA, MOCK_FBWT_TRANSACTIONS } from '../../constants';
import { ScorecardStatus, NavigationTab } from '../../types';
import { ReconciliationStatusBadge } from '../shared/StatusBadges';
import { formatCurrencyExact } from '../../utils/formatting';

interface FBWTReconciliationViewProps {
  onSelectThread: (threadId: string) => void;
}

const ScorecardCard: React.FC<{ status: ScorecardStatus; metric: string; details: string }> = ({ status, metric, details }) => {
    const statusConfig = {
        Green: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        Yellow: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
        Red: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' }
    };
    const { icon: Icon, color, bg, border } = statusConfig[status];

    return (
        <div className={`p-4 rounded-lg border ${bg} ${border}`}>
            <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest">{metric}</h4>
                <Icon size={16} className={color} />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">{details}</p>
        </div>
    );
};

const FBWTReconciliationView: React.FC<FBWTReconciliationViewProps> = ({ onSelectThread }) => {
  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full overflow-y-auto custom-scrollbar pb-8">
        <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
            <Scale size={24} className="text-zinc-400" /> FBWT Reconciliation
        </h2>

        {/* Treasury Scorecard */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Treasury Quarterly Scorecard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_SCORECARD_DATA.map(metric => (
                    <ScorecardCard key={metric.metric} {...metric} />
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-6 border-b border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Open Reconciliation Cases</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Case Type / TAS</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Age</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Assigned To</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {MOCK_FBWT_CASES.map(c => (
                                <tr 
                                    key={c.id} 
                                    className={`transition-colors ${c.linkedThreadId ? 'cursor-pointer hover:bg-blue-50/50' : 'hover:bg-zinc-50'} ${c.age > 60 ? 'bg-rose-50/50' : ''}`}
                                    onClick={() => c.linkedThreadId && onSelectThread(c.linkedThreadId)}
                                >
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            {c.age > 60 && <AlertCircle size={14} className="text-rose-500 shrink-0"/>}
                                            <div>
                                                <p className="text-xs font-semibold text-zinc-800">{c.type}</p>
                                                <p className="text-[10px] text-zinc-500 font-mono">{c.tas}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-xs font-mono text-zinc-800 text-right">{formatCurrencyExact(c.amount)}</td>
                                    <td className="px-6 py-3 text-xs font-mono text-zinc-800 text-center">{c.age}d</td>
                                    <td className="px-6 py-3 text-xs font-medium text-zinc-600">{c.assignedTo}</td>
                                    <td className="px-6 py-3"><ReconciliationStatusBadge status={c.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={14}/> Roles & Responsibilities</h3>
                    <ul className="space-y-3 text-xs text-zinc-600">
                        <li className="flex gap-2"><strong className="text-zinc-800 w-20 shrink-0">OUSD(C):</strong>Manages Advana FBWT application, high-level reconciliation.</li>
                        <li className="flex gap-2"><strong className="text-zinc-800 w-20 shrink-0">DFAS:</strong>Service provider, reports SF-224, resolves SODs.</li>
                        <li className="flex gap-2"><strong className="text-zinc-800 w-20 shrink-0">Component:</strong>Monitors DFAS, resolves differences from their operations.</li>
                    </ul>
                </div>
                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                     <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2"><FileDigit size={14}/> Recent FBWT Transactions</h3>
                     <div className="space-y-2">
                        {MOCK_FBWT_TRANSACTIONS.map(tx => (
                            <div key={tx.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg text-xs">
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${tx.amount > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{tx.type}</span>
                                    <span className="font-mono">{formatCurrencyExact(tx.amount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1">
                                    <span>{tx.tas}</span>
                                    {tx.programType && <span className="font-bold text-purple-600 bg-purple-100 px-1 rounded">{tx.programType}</span>}
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
        <p className="text-center text-[10px] text-zinc-400 font-medium uppercase tracking-widest pt-4">Compliant with DoD 7000.14-R, Vol 4, Ch 2</p>
    </div>
  );
};

export default FBWTReconciliationView;
