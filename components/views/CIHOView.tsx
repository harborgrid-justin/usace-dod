
import React, { useState, useMemo, useTransition, useCallback } from 'react';
import { Wallet, CheckCircle, FileText, Calendar } from 'lucide-react';
import { NavigationTab } from '../../types';
import { formatCurrencyExact } from '../../utils/formatting';
import { useFinanceData } from '../../hooks/useDomainData';
import { financeService } from '../../services/FinanceDataService';

interface CIHOViewProps {
    setActiveTab: (tab: NavigationTab) => void;
}

const CIHOView: React.FC<CIHOViewProps> = ({ setActiveTab }) => {
    const { cihoAccounts, cihoTransactions } = useFinanceData();
    const [isPending, startTransition] = useTransition();
    const [selectedId, setSelectedId] = useState<string>(cihoAccounts[0]?.id || '');

    const selectedAccount = useMemo(() => 
        cihoAccounts.find(a => a.id === selectedId), 
    [cihoAccounts, selectedId]);

    const handleAccountClick = useCallback((id: string) => {
        startTransition(() => {
            setSelectedId(id);
        });
    }, []);

    const transactions = useMemo(() => 
        cihoTransactions.filter(t => t.cihoAccountId === selectedId),
    [cihoTransactions, selectedId]);

    const handleReconcile = (accountId: string) => {
        const account = cihoAccounts.find(a => a.id === accountId);
        if (account) {
            financeService.updateCihoAccount({
                ...account,
                lastReconciliationDate: new Date().toISOString().split('T')[0]
            });
        }
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/30">
            <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                <Wallet size={24} className="text-zinc-400" /> Cash Outside Treasury (CIHO)
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                    {cihoAccounts.map(acc => (
                        <button 
                            key={acc.id} 
                            onClick={() => handleAccountClick(acc.id)}
                            className={`p-4 rounded-xl border text-left transition-all group w-full ${selectedId === acc.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg scale-[1.02]' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border transition-colors ${selectedId === acc.id ? 'bg-zinc-700 text-zinc-300 border-zinc-600' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>TAFS: {acc.tafs}</span>
                            </div>
                            <p className={`font-bold mb-1 ${selectedId === acc.id ? 'text-white' : 'text-zinc-900'}`}>{acc.component}</p>
                            <div className={`mt-4 pt-3 border-t flex justify-between items-baseline ${selectedId === acc.id ? 'border-zinc-700' : 'border-zinc-100'}`}>
                                <span className={`text-[10px] font-medium ${selectedId === acc.id ? 'text-zinc-400' : 'text-zinc-500'}`}>Balance</span>
                                <span className="font-mono font-bold text-lg">{formatCurrencyExact(acc.balance)}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className={`lg:col-span-8 xl:col-span-9 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                    {selectedAccount ? (
                        <>
                           <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Account Details: {selectedAccount.tafs}</h3>
                                    <button onClick={() => handleReconcile(selectedAccount.id)} className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-zinc-800 shadow-sm transition-all">
                                        <CheckCircle size={12}/> Reconcile Authority
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-zinc-100 shadow-sm">
                                        <FileText size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                                        <div><p className="font-bold text-zinc-500 mb-1 uppercase tracking-tighter">Authority Memo</p><p className="text-zinc-800 font-mono">{selectedAccount.cashHoldingAuthorityMemo}</p></div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-zinc-100 shadow-sm">
                                        <Calendar size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                                        <div><p className="font-bold text-zinc-500 mb-1 uppercase tracking-tighter">Last Rec</p><p className="text-zinc-800 font-mono">{selectedAccount.lastReconciliationDate}</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Transaction Ledger</h4>
                                    <div className="border border-zinc-100 rounded-lg overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <tbody className="divide-y divide-zinc-100">
                                                {transactions.map(tx => (
                                                    <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                                                        <td className="px-4 py-2 text-xs font-mono text-zinc-400">{tx.date}</td>
                                                        <td className="px-4 py-2 text-xs font-medium text-zinc-700">{tx.description}</td>
                                                        <td className="px-4 py-2 text-right font-mono font-bold text-zinc-900">{formatCurrencyExact(tx.amount)}</td>
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
                          <Wallet size={32} className="opacity-10" />
                          <span className="text-xs font-medium">Select a node to inspect holding state.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CIHOView;
