
import React from 'react';
import { FileText, ExternalLink, Server, Database } from 'lucide-react';
import { MOCK_SPENDING_CHAIN } from '../../constants';

interface Props {
    onSelectThread: (threadId: string) => void;
}

const SpendingChain: React.FC<Props> = ({ onSelectThread }) => {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Procure-to-Pay (P2P) Flow</h3>
                    <p className="text-xs text-zinc-400">Transaction: 45000021 (Purchase Order)</p>
                </div>
                <div className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 rounded">3-WAY MATCH OK</div>
            </div>
            
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 z-0" />
                <div className="grid grid-cols-4 gap-4 relative z-10">
                {MOCK_SPENDING_CHAIN.map((doc) => (
                    <button key={doc.docNumber} onClick={() => doc.linkedThreadId && onSelectThread(doc.linkedThreadId)} className="flex flex-col items-center group text-left w-full">
                        <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center bg-white shadow-sm transition-transform group-hover:scale-110 mb-3 ${doc.status === 'Blocked' ? 'border-rose-500 text-rose-500' : 'border-zinc-900 text-zinc-900'}`}>
                        {doc.type === 'PR' && <FileText size={16} />}
                        {doc.type === 'PO' && <ExternalLink size={16} />}
                        {doc.type === 'GR' && <Server size={16} />}
                        {doc.type === 'IR' && <Database size={16} />}
                        </div>
                        <div className="text-center bg-zinc-50 border border-zinc-200 p-2 rounded-lg w-full group-hover:bg-white group-hover:shadow-sm transition-all">
                        <p className="text-[10px] font-bold text-zinc-400 mb-1">{doc.type} Document</p>
                        <p className="text-xs font-mono font-bold text-zinc-800">{doc.docNumber}</p>
                        {/* Fix: Cast amount string to number for arithmetic operation at line 35 */}
                        <p className="text-[10px] text-zinc-500 mt-1">${(Number(doc.amount)/1000).toFixed(0)}k</p>
                        <div className={`mt-2 text-[9px] font-bold uppercase py-0.5 rounded ${doc.status === 'Blocked' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{doc.status}</div>
                        </div>
                    </button>
                ))}
                </div>
            </div>
        </div>
    );
};

export default SpendingChain;
