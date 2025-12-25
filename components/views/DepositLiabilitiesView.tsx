
import React, { useState, useMemo } from 'react';
import { Library, FileCheck, Users, Shield } from 'lucide-react';
import { MOCK_DEPOSIT_FUNDS, MOCK_LIABILITY_TRANSACTIONS } from '../../constants';
import { DepositFundAccount } from '../../types';
import { AuditOutcomeBadge, QuarterlyReviewIndicator } from '../shared/StatusBadges';
import { formatCurrencyExact } from '../../utils/formatting';

const DepositLiabilitiesView: React.FC = () => {
  const [selectedFund, setSelectedFund] = useState<DepositFundAccount | null>(MOCK_DEPOSIT_FUNDS[0]);

  const transactionsForSelectedFund = useMemo(() => {
    return MOCK_LIABILITY_TRANSACTIONS.filter(t => t.depositFundId === selectedFund?.id);
  }, [selectedFund]);

  const auditsForSelectedFund = useMemo(() => selectedFund?.audits || [], [selectedFund]);

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
        <Library size={24} className="text-zinc-400" /> Deposit Fund Liabilities
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Fund Accounts */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          {MOCK_DEPOSIT_FUNDS.map(fund => (
            <button 
              key={fund.id}
              onClick={() => setSelectedFund(fund)}
              className={`p-4 rounded-xl border text-left transition-all group relative overflow-hidden w-full ${selectedFund?.id === fund.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${selectedFund?.id === fund.id ? 'bg-zinc-700 text-zinc-300 border-zinc-600' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                  {fund.treasuryIndex}
                </span>
                <div className="flex gap-2 items-center">
                  {Object.values(fund.quarterlyReviews).map((status, i) => <QuarterlyReviewIndicator key={i} status={status} />)}
                </div>
              </div>
              <p className={`font-bold mb-1 ${selectedFund?.id === fund.id ? 'text-white' : 'text-zinc-900'}`}>{fund.accountName}</p>
              <p className={`text-xs ${selectedFund?.id === fund.id ? 'text-zinc-400' : 'text-zinc-500'}`}>{fund.responsibleComponent}</p>
              <div className={`mt-4 pt-3 border-t flex justify-between items-baseline ${selectedFund?.id === fund.id ? 'border-zinc-700' : 'border-zinc-100'}`}>
                <span className={`text-xs font-medium ${selectedFund?.id === fund.id ? 'text-zinc-400' : 'text-zinc-500'}`}>Balance</span>
                <span className={`font-mono font-bold text-lg ${selectedFund?.id === fund.id ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrencyExact(fund.currentBalance)}</span>
              </div>
              {selectedFund?.id === fund.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-emerald-500 rounded-l-full" />}
            </button>
          ))}
        </div>

        {/* Right Column: Details & Transactions */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white border border-zinc-200 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          {selectedFund ? (
            <>
              <div className="p-6 border-b border-zinc-100">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Account Details: {selectedFund.treasuryIndex}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                    <FileCheck size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-500 mb-1">Statutory Authorization</p>
                      <p className="text-zinc-800 font-mono">{selectedFund.statutoryAuthorization}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                    <Users size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-500 mb-1">Audit Requirement</p>
                      <p className="text-zinc-800 font-mono">{selectedFund.auditRequirement}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                 <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Liability Transactions</h4>
                    <div className="border border-zinc-100 rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50/50">
                                <tr className="border-b border-zinc-100">
                                <th className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Source / Description</th>
                                <th className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {transactionsForSelectedFund.map(tx => (
                                <tr key={tx.id} className={`transition-colors ${tx.description.includes('SALT') ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-4 py-2">
                                    <p className="text-xs font-semibold text-zinc-800">{tx.source}</p>
                                    <p className="text-[10px] text-zinc-500">{tx.description}</p>
                                    </td>
                                    <td className="px-4 py-2 text-xs font-mono text-zinc-800 text-right">{formatCurrencyExact(tx.amount)}</td>
                                    <td className="px-4 py-2">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase whitespace-nowrap border ${
                                        tx.status === 'Held' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    }`}>{tx.status}</span>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Cash Audit Log</h4>
                    <div className="space-y-2">
                        {auditsForSelectedFund.length > 0 ? auditsForSelectedFund.map(audit => (
                            <div key={audit.id} className="p-3 border border-zinc-100 rounded-lg bg-zinc-50/50">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Shield size={14} className="text-zinc-400" />
                                        <span className="text-xs font-semibold text-zinc-800">{audit.type} Audit by {audit.auditor}</span>
                                        <span className="text-xs font-mono text-zinc-400">{audit.date}</span>
                                    </div>
                                    <AuditOutcomeBadge status={audit.outcome} />
                                </div>
                                {audit.findingsSummary && <p className="text-[11px] text-zinc-500 mt-2 pl-7">{audit.findingsSummary}</p>}
                            </div>
                        )) : (
                            <div className="text-center py-4 text-xs text-zinc-400">No audit records for this account.</div>
                        )}
                    </div>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <Library size={24} className="opacity-20" />
              <span className="text-xs font-medium">Select a fund account to view details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositLiabilitiesView;
