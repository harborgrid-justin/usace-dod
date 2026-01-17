import React, { useMemo, useCallback } from 'react';
import { ArrowRightLeft, ExternalLink, AlertOctagon, Landmark, Database, ShieldCheck, Activity } from 'lucide-react';
import { complianceService } from '../../services/ComplianceDataService';
import { useService } from '../../hooks/useService';
import { evaluateRules } from '../../utils/rulesEngine';
import { BusinessRule, DigitalThread } from '../../types';
import { formatCurrency } from '../../utils/formatting';

const DisbursementView: React.FC = () => {
  const threads = useService<DigitalThread[]>(complianceService, useCallback(() => complianceService.getDigitalThreads(), []));
  const rules = useService<BusinessRule[]>(complianceService, useCallback(() => complianceService.getBusinessRules(), []));

  const totals = useMemo(() => {
    return threads.reduce((acc, t) => ({
        settled: acc.settled + (t.eftStatus === 'Settled' ? t.disbursementAmt : 0),
        pending: acc.pending + (t.eftStatus === 'Pending' ? t.disbursementAmt : 0)
    }), { settled: 0, pending: 0 });
  }, [threads]);

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/30 overflow-hidden">
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                <ArrowRightLeft size={28} className="text-rose-700" /> Outlay Execution
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-1">Treasury Terminal • IPAC & EFT Settlement Control</p>
          </div>
          <div className="flex gap-4">
              <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm text-center">
                  <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Settled (YTD)</p>
                  <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(totals.settled)}</p>
              </div>
              <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl shadow-sm text-center">
                  <p className="text-[8px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">Pending EFT</p>
                  <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(totals.pending)}</p>
              </div>
          </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[32px] shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
         <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white rounded-xl shadow-sm border border-zinc-100 text-zinc-400"><Landmark size={20}/></div>
               <div>
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">IPAC / SF-1151 Reconciliation Registry</h3>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase mt-1">SFFAS 7 Outlay Recognition Module</p>
               </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                <ShieldCheck size={12}/> Treasury Connected
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
                <thead className="bg-white border-b border-zinc-100 sticky top-0 z-10 shadow-sm">
                    <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <th className="p-6">Transaction / Vendor</th>
                        <th className="p-6 text-center">Reference Codes</th>
                        <th className="p-6 text-right">Magnitude</th>
                        <th className="p-6 text-center">Status</th>
                        <th className="p-6 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {threads.map(t => {
                        const ppaContext = { invoiceDaysPending: (t as any).invoiceDaysPending || 0 };
                        const ppaRules: BusinessRule[] = rules.filter(r => r.code === 'PAY-002');
                        const ppaViolation = evaluateRules(ppaRules, ppaContext).find(r => !r.passed);

                        return (
                            <tr key={t.id} className="hover:bg-zinc-50/80 transition-colors group cursor-default">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-zinc-100 items-center justify-center font-mono text-[10px] font-bold text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-inner">
                                            {t.id.slice(-3)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-800 uppercase tracking-tight group-hover:text-rose-700 transition-colors">{t.vendorName}</p>
                                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">PIID: {t.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="inline-flex flex-col gap-1">
                                        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-50 px-2 py-0.5 rounded border">DSSN: {(t as any).dssnNumber || '5555'}</span>
                                        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-50 px-2 py-0.5 rounded border">BETC: {(t as any).betcCode || 'COLL'}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(t.disbursementAmt)}</p>
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase mt-1">Disbursed Amt</p>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className={`px-3 py-1 rounded-xl text-[9px] font-bold uppercase border shadow-sm ${
                                            t.eftStatus === 'Settled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                        }`}>
                                            {t.eftStatus}
                                        </span>
                                        {ppaViolation && (
                                            <div className="flex items-center gap-1 text-[8px] font-bold text-rose-600 uppercase animate-pulse">
                                                <AlertOctagon size={10} /> PPA Interest Risk
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-white hover:border-zinc-300 transition-all shadow-inner">
                                        <ExternalLink size={16}/>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
         </div>
         
         <div className="p-4 bg-zinc-900 border-t border-zinc-800 shrink-0 flex justify-between items-center">
             <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5"><Activity size={12}/> Daily Settlement Cycle Active</span>
                 <div className="w-px h-3 bg-zinc-800" />
                 <span className="flex items-center gap-1.5"><Database size={12}/> Source: DFAS Interface</span>
             </div>
             <button className="px-6 py-2 bg-white text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-95 shadow-xl">
                 Execute SF-1151 Net
             </button>
         </div>
      </div>
    </div>
  );
};

export default DisbursementView;