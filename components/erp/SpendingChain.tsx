
import React from 'react';
import { FileText, ExternalLink, Server, Database, CheckCircle2, ArrowRight, ShieldCheck, Clock, Zap, Info } from 'lucide-react';
import { MOCK_SPENDING_CHAIN } from '../../constants';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    onSelectThread: (threadId: string) => void;
}

const SpendingChain: React.FC<Props> = ({ onSelectThread }) => {
    return (
        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm flex flex-col gap-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] group-hover:rotate-12 transition-all duration-1000">
                <ShieldCheck size={240} />
            </div>
            
            <div className="flex justify-between items-center shrink-0 relative z-10">
                <div>
                    <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tighter leading-none">Procure-to-Pay (P2P) Lineage</h3>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase mt-3 tracking-[0.2em] flex items-center gap-2">
                        <Zap size={10} className="text-emerald-500" fill="currentColor"/> Real-Time 3-Way Match Verification (Vol 10, Ch 1)
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 shadow-xl animate-in zoom-in shadow-emerald-500/5">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">Fiduciary Logic: PASS</span>
                </div>
            </div>
            
            <div className="relative px-4 py-6">
                <div className="absolute top-[48px] left-12 right-12 h-1 bg-zinc-100 -z-0" />
                <div className="grid grid-cols-4 gap-6 relative z-10">
                    {MOCK_SPENDING_CHAIN.map((doc, idx) => (
                        <div key={doc.docNumber} className="flex flex-col items-center group/item">
                            <button 
                                onClick={() => doc.linkedThreadId && onSelectThread(doc.linkedThreadId)} 
                                className={`w-20 h-20 rounded-[28px] border-2 flex items-center justify-center bg-white shadow-2xl transition-all group-hover/item:scale-110 mb-6 group-hover/item:-translate-y-2 relative overflow-hidden ${
                                    doc.status === 'Blocked' 
                                    ? 'border-rose-500 text-rose-500 shadow-rose-200' 
                                    : 'border-zinc-900 text-zinc-900 shadow-zinc-200 group-hover/item:border-emerald-500 group-hover/item:text-emerald-600'
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                {doc.type === 'PR' && <FileText size={28} strokeWidth={1.5} />}
                                {doc.type === 'PO' && <ExternalLink size={28} strokeWidth={1.5} />}
                                {doc.type === 'GR' && <Server size={28} strokeWidth={1.5} />}
                                {doc.type === 'IR' && <Database size={28} strokeWidth={1.5} />}
                                
                                {doc.status !== 'Blocked' && (
                                    <div className="absolute bottom-1 right-1">
                                        <CheckCircle2 size={14} className="text-emerald-500 fill-white" />
                                    </div>
                                )}
                            </button>
                            
                            <div className="text-center space-y-2 w-full px-2">
                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{doc.type} OBJECT</p>
                                <p className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 py-1.5 rounded-xl border border-zinc-200 group-hover/item:bg-white group-hover/item:border-emerald-300 transition-all shadow-inner">{doc.docNumber}</p>
                                <div className="flex flex-col gap-1.5 items-center pt-2">
                                    <span className="text-[11px] font-mono font-bold text-zinc-500 tabular-nums">{formatCurrency(Number(doc.amount))}</span>
                                    <div className="flex items-center gap-1">
                                         <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm border ${
                                            doc.status === 'Blocked' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        }`}>
                                            {doc.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {idx < MOCK_SPENDING_CHAIN.length - 1 && (
                                <div className="absolute -right-3 top-[48px] translate-x-1/2 -translate-y-1/2 text-zinc-200 hidden md:block">
                                    <ArrowRight size={20} className="group-hover/item:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 p-6 bg-zinc-50 border border-zinc-200/60 rounded-[32px] flex flex-col md:flex-row items-center justify-between shrink-0 relative z-10 shadow-inner gap-4">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Commitment Logic Verified</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Receiving Record Posted</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm">
                    <Clock size={12}/> Match Cycle: <span className="text-zinc-900 font-mono">14:22:01.04</span>
                    <Info size={12} className="text-zinc-300 ml-2 hover:text-zinc-900 transition-colors cursor-help" />
                </div>
            </div>
        </div>
    );
};

export default SpendingChain;
