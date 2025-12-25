
import React from 'react';
import { CreditCard, AlertCircle, DollarSign, Check, X } from 'lucide-react';
import { GPCTransaction, GPCStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    transactions: GPCTransaction[];
    onUpdateStatus: (id: string, status: GPCStatus) => void;
}

const GPCManager: React.FC<Props> = ({ transactions, onUpdateStatus }) => {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard size={16} className="text-zinc-400"/> GPC Transaction Log
                    </h3>
                    <span className="text-xs font-medium text-zinc-500">Cycle closes in 4 days</span>
                </div>
                <div className="space-y-3">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-lg group hover:bg-white hover:shadow-md hover:border-zinc-200 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${tx.status === 'Flagged' ? 'bg-rose-100 text-rose-600' : 'bg-white border border-zinc-200 text-zinc-400'}`}>
                                    {tx.status === 'Flagged' ? <AlertCircle size={16}/> : <DollarSign size={16}/>}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900">{tx.merchant}</p>
                                    <p className="text-xs text-zinc-500">{tx.date} • {tx.cardholder}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(tx.amount)}</p>
                                    <p className={`text-[10px] font-bold uppercase mt-1 ${
                                        tx.status === 'Approved' ? 'text-emerald-600' :
                                        tx.status === 'Flagged' ? 'text-rose-600' : 'text-amber-600'
                                    }`}>{tx.status}</p>
                                </div>
                                
                                {tx.status === 'Pending Approval' && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => onUpdateStatus(tx.id, 'Approved')} 
                                            className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors" 
                                            title="Approve"
                                        >
                                            <Check size={14}/>
                                        </button>
                                        <button 
                                            onClick={() => onUpdateStatus(tx.id, 'Flagged')} 
                                            className="p-1.5 bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition-colors" 
                                            title="Flag"
                                        >
                                            <X size={14}/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GPCManager;
