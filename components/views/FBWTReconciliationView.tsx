import React, { useMemo, useTransition, useCallback } from 'react';
import { Scale, CheckCircle, AlertCircle, XCircle, Users, FileDigit } from 'lucide-react';
import { MOCK_FBWT_CASES, MOCK_SCORECARD_DATA, MOCK_FBWT_TRANSACTIONS } from '../../constants';
import { ScorecardStatus } from '../../types';
import { ReconciliationStatusBadge } from '../shared/StatusBadges';
import { formatCurrencyExact } from '../../utils/formatting';

interface FBWTReconciliationViewProps {
  onSelectThread: (threadId: string) => void;
}

const ScorecardCard = React.memo(({ status, metric, details }: { status: ScorecardStatus; metric: string; details: string }) => {
    const statusConfig = {
        Green: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        Yellow: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
        Red: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' }
    };
    const { icon: Icon, color, bg, border } = statusConfig[status];

    return (
        <div className={`p-4 rounded-xl border transition-all ${bg} ${border} shadow-sm`}>
            <div className="flex items-start justify-between">
                <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">{metric}</h4>
                <Icon size={16} className={color} />
            </div>
            <p className="text-[11px] text-zinc-600 mt-2 leading-relaxed">{details}</p>
        </div>
    );
});

const FBWTReconciliationView: React.FC<FBWTReconciliationViewProps> = ({ onSelectThread }) => {
  const [isPending, startTransition] = useTransition();

  const handleThreadClick = useCallback((id: string) => {
    startTransition(() => {
        onSelectThread(id);
    });
  }, [onSelectThread]);

  const cases = useMemo(() => MOCK_FBWT_CASES, []);

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in h-full overflow-y-auto custom-scrollbar pb-8 bg-zinc-50/30">
        <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
            <Scale size={24} className="text-zinc-400" /> FBWT Reconciliation
        </h2>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Treasury Analytics Scorecard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_SCORECARD_DATA.map(metric => (
                    <ScorecardCard key={metric.metric} {...metric} />
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Reconciliation Registry</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50">
                                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Case / TAS</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Age</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {cases.map(c => (
                                <tr 
                                    key={c.id} 
                                    className={`transition-colors cursor-pointer hover:bg-zinc-50`}
                                    onClick={() => handleThreadClick(c.linkedThreadId)}
                                >
                                    <td className="px-6 py-3">
                                        <p className="text-xs font-bold text-zinc-900">{c.type}</p>
                                        <p className="text-[10px] text-zinc-400 font-mono">{c.tas}</p>
                                    </td>
                                    <td className="px-6 py-3 text-xs font-mono text-zinc-900 font-bold text-right">{formatCurrencyExact(c.amount)}</td>
                                    <td className="px-6 py-3 text-xs font-mono text-center">{c.age}d</td>
                                    <td className="px-6 py-3"><ReconciliationStatusBadge status={c.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-zinc-900 p-6 rounded-xl shadow-xl text-white">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-emerald-400"><Users size={14}/> Multi-Agency Workflow</h3>
                    <ul className="space-y-4 text-xs">
                        <li className="flex gap-3"><div className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0"/><span><strong>OUSD(C):</strong> Advana high-level reconciliation logic.</span></li>
                        <li className="flex gap-3"><div className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0"/><span><strong>DFAS:</strong> Reports SF-224 and initiates IPAC.</span></li>
                        <li className="flex gap-3"><div className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0"/><span><strong>District:</strong> Resolves variances at transaction level.</span></li>
                    </ul>
                </div>
                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                     <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Recent Tie-Points</h3>
                     <div className="space-y-3">
                        {MOCK_FBWT_TRANSACTIONS.map(tx => (
                            <div key={tx.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg text-xs">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-zinc-800">{tx.type}</span>
                                    <span className="font-mono font-bold text-emerald-600">{formatCurrencyExact(tx.amount)}</span>
                                </div>
                                <div className="text-[10px] text-zinc-400 font-mono">{tx.tas}</div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FBWTReconciliationView;