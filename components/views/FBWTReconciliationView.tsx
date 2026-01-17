
import React, { useMemo, useTransition, useCallback } from 'react';
import { Scale, CheckCircle, AlertCircle, XCircle, Users } from 'lucide-react';
import { MOCK_SCORECARD_DATA, REMIS_THEME } from '../../constants';
import { ScorecardStatus } from '../../types';
import { ReconciliationStatusBadge } from '../shared/StatusBadges';
import { formatCurrencyExact } from '../../utils/formatting';
import Badge from '../shared/Badge';
import { useFinanceData } from '../../hooks/useDomainData';

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
        <div className={`p-5 rounded-xl border transition-all ${bg} ${border} shadow-sm group hover:scale-[1.02]`}>
            <div className="flex items-start justify-between">
                <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">{metric}</h4>
                <Icon size={18} className={color} />
            </div>
            <p className="text-[11px] text-zinc-600 mt-3 leading-relaxed font-medium">{details}</p>
        </div>
    );
});

const FBWTReconciliationView: React.FC<FBWTReconciliationViewProps> = ({ onSelectThread }) => {
  const { fbwtCases, fbwtTransactions } = useFinanceData();
  const [isPending, startTransition] = useTransition();

  const handleThreadClick = useCallback((id: string) => {
    startTransition(() => {
        onSelectThread(id);
    });
  }, [onSelectThread]);

  return (
    <div className="p-6 sm:p-8 space-y-8 animate-in h-full overflow-y-auto custom-scrollbar pb-8 bg-zinc-50/50">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 px-2">
            <div>
                <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                    <Scale size={28} className="text-zinc-800" /> FBWT Reconciliation
                </h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">Treasury Account Symbol (TAS) Monitor • SFFAS 7 Protocol</p>
            </div>
            <Badge variant="success">Fiduciary Sync Active</Badge>
        </div>

        <div className={`${REMIS_THEME.enterprise.container} p-8 shadow-sm`}>
            <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-8">Authoritative Scorecard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_SCORECARD_DATA.map(metric => (
                    <ScorecardCard key={metric.metric} {...metric} />
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className={`lg:col-span-8 ${REMIS_THEME.enterprise.panel} flex flex-col transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em]">Open Reconciliation Registry</h3>
                </div>
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/30">
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Case / TAS Symbol</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Age</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {fbwtCases.map(c => (
                                <tr 
                                    key={c.id} 
                                    className="hover:bg-zinc-50 transition-colors cursor-pointer group"
                                    onClick={() => handleThreadClick(c.linkedThreadId)}
                                >
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-zinc-900 group-hover:text-rose-700 transition-colors">{c.type}</p>
                                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{c.tas}</p>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-zinc-900 font-bold text-right">{formatCurrencyExact(c.amount)}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-center text-zinc-500">{c.age}d</td>
                                    <td className="px-6 py-4"><ReconciliationStatusBadge status={c.status as any} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden border border-zinc-800">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Users size={120} /></div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-3 text-emerald-400 relative z-10"><Users size={16}/> Multi-Agency Logic</h3>
                    <ul className="space-y-6 text-xs relative z-10">
                        <li className="flex gap-4 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"/>
                            <div className="space-y-1">
                                <span className="font-bold text-emerald-400 uppercase tracking-widest text-[9px]">OUSD(C) Context</span>
                                <p className="text-zinc-400 font-medium leading-relaxed">Advana high-level reconciliation engine synchronization active.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"/>
                            <div className="space-y-1">
                                <span className="font-bold text-emerald-400 uppercase tracking-widest text-[9px]">DFAS Terminal</span>
                                <p className="text-zinc-400 font-medium leading-relaxed">Electronic SF-224 reporting and IPAC initiation protocols verified.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className={`${REMIS_THEME.enterprise.container} p-6 shadow-sm`}>
                     <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-6">Recent Ledger Events</h3>
                     <div className="space-y-3">
                        {fbwtTransactions.map(tx => (
                            <div key={tx.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl hover:border-zinc-300 transition-all group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-tight group-hover:text-rose-700 transition-colors">{tx.type}</span>
                                    <span className="font-mono font-bold text-emerald-600 text-xs">{formatCurrencyExact(tx.amount)}</span>
                                </div>
                                <div className="text-[9px] text-zinc-400 font-mono font-bold uppercase">{tx.tas}</div>
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
