
import React from 'react';
import { ArrowRightLeft, ExternalLink, AlertOctagon } from 'lucide-react';
import { MOCK_DIGITAL_THREADS, MOCK_BUSINESS_RULES } from '../../constants';
import { evaluateRules } from '../../utils/rulesEngine';

const DisbursementView: React.FC = () => {
  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full overflow-y-auto custom-scrollbar pb-8">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
         <div className="flex items-center gap-4 mb-8 pb-4 border-b border-zinc-100">
            <div className="p-3 bg-zinc-50 text-zinc-600 rounded-lg border border-zinc-100"><ArrowRightLeft size={20}/></div>
            <div>
               <h3 className="text-xl font-semibold text-zinc-900 uppercase tracking-tight">Treasury Terminal</h3>
               <p className="text-xs text-zinc-400 font-medium">DSSN & IPAC Reconciliation • Prompt Payment Act Monitor</p>
            </div>
         </div>
         <div className="space-y-3">
            {MOCK_DIGITAL_THREADS.map(t => {
               // Run PPA Rules
               const ppaContext = { invoiceDaysPending: t.invoiceDaysPending || 0 };
               const ppaRules = MOCK_BUSINESS_RULES.filter(r => r.code === 'PAY-002');
               const ppaViolation = evaluateRules(ppaRules, ppaContext).find(r => !r.passed);

               return (
                   <div key={t.id} className="grid grid-cols-1 md:grid-cols-12 items-center p-4 rounded-lg border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all gap-4 group">
                      <div className="md:col-span-4 flex items-center gap-4">
                         <div className="hidden sm:block text-[10px] font-mono font-medium text-zinc-400 bg-zinc-50 px-2 py-1 rounded">{t.id}</div>
                         <div>
                            <p className="text-sm font-bold text-zinc-800 uppercase tracking-tight">{t.vendorName}</p>
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">DSSN: {t.dssnNumber || 'N/A'} <span className="text-zinc-300">|</span> BETC: {t.betcCode || 'N/A'}</p>
                         </div>
                      </div>
                      <div className="md:col-span-8 flex items-center justify-between sm:justify-end gap-8">
                         {ppaViolation && (
                             <div className="flex items-center gap-2 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-[9px] font-bold text-amber-700 uppercase">
                                 <AlertOctagon size={12} /> Interest Risk
                             </div>
                         )}
                         <div className="text-right">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Amount</p>
                            <p className="text-sm font-bold text-zinc-900 font-mono">${(t.disbursementAmt/1e6).toFixed(2)}M</p>
                         </div>
                         <div className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase border ${t.eftStatus === 'Settled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                            {t.eftStatus}
                         </div>
                         <button className="p-2 text-zinc-300 hover:text-zinc-600 transition-colors"><ExternalLink size={14}/></button>
                      </div>
                   </div>
               )
            })}
         </div>
      </div>
    </div>
  );
};

export default DisbursementView;
