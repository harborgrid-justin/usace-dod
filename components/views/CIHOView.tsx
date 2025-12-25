
import React, { useState, useMemo } from 'react';
import { Wallet, CheckCircle, AlertTriangle, FileText, Calendar, Shield } from 'lucide-react';
import { MOCK_CIHO_ACCOUNTS, MOCK_CIHO_TRANSACTIONS, MOCK_CASH_AUDITS } from '../../constants';
import { CIHOAccount, NavigationTab } from '../../types';
import { AuditOutcomeBadge } from '../shared/StatusBadges';
import { formatCurrencyExact } from '../../utils/formatting';

const isReconciliationOverdue = (lastDate: string) => {
    const last = new Date(lastDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30;
}

interface CIHOViewProps {
    setActiveTab: (tab: NavigationTab) => void;
}

const CIHOView: React.FC<CIHOViewProps> = ({ setActiveTab }) => {
    const [accounts, setAccounts] = useState<CIHOAccount[]>(MOCK_CIHO_ACCOUNTS);
    const [selectedAccount, setSelectedAccount] = useState<CIHOAccount | null>(accounts[0]);

    const handleReconcile = (accountId: string) => {
        setAccounts(prev => prev.map(acc => 
            acc.id === accountId 
            ? { ...acc, lastReconciliationDate: new Date().toISOString().split('T')[0] } 
            : acc
        ));
        setSelectedAccount(prev => prev && prev.id === accountId 
            ? { ...prev, lastReconciliationDate: new Date().toISOString().split('T')[0] } 
            : prev
        );
    };
    
    const transactions = useMemo(() => 
        selectedAccount ? MOCK_CIHO_TRANSACTIONS.filter(t => t.cihoAccountId === selectedAccount.id) : [],
        [selectedAccount]
    );

    const audits = useMemo(() => selectedAccount?.audits || [], [selectedAccount]);

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                <Wallet size={24} className="text-zinc-400" /> Cash Held Outside of Treasury (CIHO)
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                    {accounts.map(acc => (
                        <div key={acc.id} className="relative">
                            <button 
                                onClick={() => setSelectedAccount(acc)}
                                className={`p-4 rounded-xl border text-left transition-all group w-full ${selectedAccount?.id === acc.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveTab(NavigationTab.FBWT_RECONCILIATION);
                                        }} 
                                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border transition-colors ${selectedAccount?.id === acc.id ? 'bg-zinc-700 text-zinc-300 border-zinc-600 hover:bg-zinc-600' : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'}`}>
                                        TAFS: {acc.tafs}
                                    </button>
                                    {isReconciliationOverdue(acc.lastReconciliationDate) && <AlertTriangle size={14} className="text-rose-500" />}
                                </div>
                                <p className={`font-bold mb-1 ${selectedAccount?.id === acc.id ? 'text-white' : 'text-zinc-900'}`}>{acc.component}</p>
                                <div className={`mt-4 pt-3 border-t flex justify-between items-baseline ${selectedAccount?.id === acc.id ? 'border-zinc-700' : 'border-zinc-100'}`}>
                                    <span className={`text-xs font-medium ${selectedAccount?.id === acc.id ? 'text-zinc-400' : 'text-zinc-500'}`}>Balance</span>
                                    <span className="font-mono font-bold text-lg">{formatCurrencyExact(acc.balance)}</span>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-8 xl:col-span-9 bg-white border border-zinc-200 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                    {selectedAccount ? (
                        <>
                           <div className="p-6 border-b border-zinc-100">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Account Details: {selectedAccount.tafs}</h3>
                                    <button onClick={() => handleReconcile(selectedAccount.id)} className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-sm">
                                        <CheckCircle size={12}/> Reconcile Now
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                        <FileText size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-bold text-zinc-500 mb-1">Cash Holding Authority Memo</p>
                                            <p className="text-zinc-800 font-mono">{selectedAccount.cashHoldingAuthorityMemo}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-start gap-3 p-3 rounded-lg border ${isReconciliationOverdue(selectedAccount.lastReconciliationDate) ? 'bg-rose-50 border-rose-100' : 'bg-zinc-50 border-zinc-100'}`}>
                                        <Calendar size={16} className={`${isReconciliationOverdue(selectedAccount.lastReconciliationDate) ? 'text-rose-500' : 'text-zinc-400'} mt-0.5 shrink-0`} />
                                        <div>
                                            <p className="font-bold text-zinc-500 mb-1">Last Reconciliation</p>
                                            <p className="text-zinc-800 font-mono">{selectedAccount.lastReconciliationDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Transaction Ledger</h4>
                                    <div className="border border-zinc-100 rounded-lg overflow-hidden">
                                        <table className="w-full text-left">
                                            <tbody className="divide-y divide-zinc-100">
                                                {transactions.map(tx => (
                                                    <tr key={tx.id}>
                                                        <td className="px-4 py-2 text-xs font-mono text-zinc-400">{tx.date}</td>
                                                        <td className="px-4 py-2 text-xs font-medium text-zinc-700">{tx.description}</td>
                                                        <td className="px-4 py-2 text-right"><span className={`text-xs font-mono font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrencyExact(tx.amount)}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Audit Log</h4>
                                    <div className="space-y-2">
                                        {audits.map(audit => (
                                            <div key={audit.id} className="p-3 border border-zinc-100 rounded-lg bg-zinc-50/50">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <Shield size={14} className="text-zinc-400" />
                                                        <span className="text-xs font-semibold text-zinc-800">{audit.type} Audit by {audit.auditor}</span>
                                                    </div>
                                                    <AuditOutcomeBadge status={audit.outcome} />
                                                </div>
                                                {audit.findingsSummary && <p className="text-[11px] text-zinc-500 mt-2 pl-7">{audit.findingsSummary}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2">
                          <Wallet size={24} className="opacity-20" />
                          <span className="text-xs font-medium">Select an account to view details.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CIHOView;
