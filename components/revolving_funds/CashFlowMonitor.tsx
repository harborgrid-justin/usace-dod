
import React, { useMemo } from 'react';
import { DWCFTransaction } from '../../types';
import { formatCurrencyExact } from '../../utils/formatting';
import { ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';

interface Props {
    transactions: DWCFTransaction[];
}

const CashFlowMonitor: React.FC<Props> = ({ transactions }) => {
    const sortedTx = useMemo(() => [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [transactions]);

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Real-Time Cash Ledger</h3>
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1"><Clock size={10}/> Live Feed</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <tbody className="divide-y divide-zinc-50">
                        {sortedTx.map(tx => (
                            <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="p-3 pl-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-full ${
                                            tx.type === 'Collection' ? 'bg-emerald-100 text-emerald-600' : 
                                            tx.type === 'Disbursement' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {tx.type === 'Collection' ? <ArrowDownLeft size={12}/> : 
                                             tx.type === 'Disbursement' ? <ArrowUpRight size={12}/> : <ArrowUpRight size={12}/>}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-800">{tx.description}</p>
                                            <p className="text-[10px] text-zinc-500 font-mono">{tx.date} • {tx.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 pr-4 text-right">
                                    <span className={`font-mono text-xs font-bold ${
                                        tx.type === 'Collection' ? 'text-emerald-600' : 'text-zinc-900'
                                    }`}>
                                        {tx.type === 'Collection' ? '+' : '-'}{formatCurrencyExact(tx.amount)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CashFlowMonitor;
