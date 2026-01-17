
import React, { useState, useMemo, useTransition } from 'react';
import { Library, FileCheck, Users } from 'lucide-react';
import { QuarterlyReviewIndicator } from '../shared/StatusBadges';
import { formatCurrencyExact } from '../../utils/formatting';
import { useFinanceData } from '../../hooks/useDomainData';

const DepositLiabilitiesView: React.FC = () => {
  const { depositFunds, liabilityTransactions } = useFinanceData();
  const [isPending, startTransition] = useTransition();
  const [selectedFundId, setSelectedFundId] = useState<string>(depositFunds[0]?.id || '');

  const selectedFund = useMemo(() => 
    depositFunds.find(f => f.id === selectedFundId),
  [depositFunds, selectedFundId]);

  const transactions = useMemo(() => {
    return liabilityTransactions.filter(t => t.depositFundId === selectedFundId);
  }, [liabilityTransactions, selectedFundId]);

  const handleFundClick = (id: string) => {
    startTransition(() => {
      setSelectedFundId(id);
    });
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
        <Library size={24} className="text-zinc-400" /> Deposit Fund Liabilities
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          {depositFunds.map(fund => (
            <button 
              key={fund.id}
              onClick={() => handleFundClick(fund.id)}
              className={`p-4 rounded-xl border text-left transition-all group relative overflow-hidden w-full ${selectedFundId === fund.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg scale-[1.02]' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${selectedFundId === fund.id ? 'bg-zinc-700 text-zinc-300 border-zinc-600' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                  {fund.treasuryIndex}
                </span>
                <div className="flex gap-2 items-center">
                  {Object.values(fund.quarterlyReviews).map((status, i) => <QuarterlyReviewIndicator key={i} status={status} />)}
                </div>
              </div>
              <p className={`font-bold mb-1 ${selectedFundId === fund.id ? 'text-white' : 'text-zinc-900'}`}>{fund.accountName}</p>
              <div className={`mt-4 pt-3 border-t flex justify-between items-baseline ${selectedFundId === fund.id ? 'border-zinc-700' : 'border-zinc-100'}`}>
                <span className={`text-xs font-medium ${selectedFundId === fund.id ? 'text-zinc-400' : 'text-zinc-500'}`}>Balance</span>
                <span className={`font-mono font-bold text-lg ${selectedFundId === fund.id ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrencyExact(fund.currentBalance)}</span>
              </div>
            </button>
          ))}
        </div>

        <div className={`lg:col-span-8 xl:col-span-9 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          {selectedFund ? (
            <>
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Account Details: {selectedFund.treasuryIndex}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-zinc-100 shadow-sm">
                    <FileCheck size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-500 mb-1">Authorization</p>
                      <p className="text-zinc-800 font-mono">{selectedFund.statutoryAuthorization}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-zinc-100 shadow-sm">
                    <Users size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-500 mb-1">Requirement</p>
                      <p className="text-zinc-800 font-mono">{selectedFund.auditRequirement}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                 <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Liability Ledger</h4>
                    <div className="border border-zinc-100 rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50">
                                <tr className="border-b border-zinc-100">
                                <th className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase">Source</th>
                                <th className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Amount</th>
                                <th className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-4 py-2">
                                        <p className="text-xs font-bold text-zinc-800">{tx.source}</p>
                                        <p className="text-[10px] text-zinc-400">{tx.description}</p>
                                    </td>
                                    <td className="px-4 py-2 text-xs font-mono text-zinc-800 text-right font-bold">{formatCurrencyExact(tx.amount)}</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${tx.status === 'Held' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>{tx.status}</span>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <Library size={32} className="opacity-10" />
              <span className="text-xs font-medium">Select a fund node to inspect ledger state.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositLiabilitiesView;
