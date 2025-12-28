
import React from 'react';
import { CostTransfer } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { CheckCircle2, XCircle, ArrowLeft, History, User, FileText, Shuffle, Database } from 'lucide-react';

interface Props {
    transfer: CostTransfer;
    onBack: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onPost: (id: string) => void;
}

const TransferDetail: React.FC<Props> = ({ transfer, onBack, onApprove, onReject, onPost }) => {
    return (
        <div className="flex flex-col h-full bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden animate-in slide-in-from-right-4">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={onBack} className="text-zinc-400 hover:text-zinc-800 mr-2"><ArrowLeft size={18}/></button>
                        <h3 className="text-xl font-bold text-zinc-900">{transfer.id}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            transfer.status === 'Posted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            transfer.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>{transfer.status}</span>
                    </div>
                    <p className="text-xs text-zinc-500 ml-8">Requested on {new Date(transfer.requestDate).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-2">
                    {transfer.status === 'Pending Approval' && (
                        <>
                            <button onClick={() => onReject(transfer.id)} className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-lg text-xs font-bold uppercase hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all flex items-center gap-2">
                                <XCircle size={14}/> Reject
                            </button>
                            <button onClick={() => onApprove(transfer.id)} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-all flex items-center gap-2">
                                <CheckCircle2 size={14}/> Approve
                            </button>
                        </>
                    )}
                    {transfer.status === 'Approved' && (
                        <button onClick={() => onPost(transfer.id)} className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2">
                            <Database size={14}/> Post to GL
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="space-y-8">
                    
                    {/* T-Account Visualization */}
                    <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-8 flex flex-col md:flex-row items-center justify-center gap-12 relative">
                        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-zinc-200 -z-10 hidden md:block" />
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 text-center w-64 z-10">
                            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Source (Credit)</p>
                            <p className="text-xs font-bold text-zinc-800 mb-2 truncate" title={transfer.sourceProjectId}>{transfer.sourceProjectId.split(' - ')[0]}</p>
                            <div className="border-t border-zinc-100 pt-2 text-rose-600 font-mono font-bold">
                                ({formatCurrency(transfer.amount)})
                            </div>
                        </div>

                        <div className="bg-white p-3 rounded-full border border-zinc-200 text-zinc-400 z-10 shadow-sm">
                            <Shuffle size={20} />
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 text-center w-64 z-10">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Target (Debit)</p>
                            <p className="text-xs font-bold text-zinc-800 mb-2 truncate" title={transfer.targetProjectId}>{transfer.targetProjectId.split(' - ')[0]}</p>
                            <div className="border-t border-zinc-100 pt-2 text-emerald-600 font-mono font-bold">
                                +{formatCurrency(transfer.amount)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText size={14} className="text-zinc-400"/> Justification
                            </h4>
                            <div className="p-4 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 leading-relaxed shadow-sm">
                                {transfer.justification}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <History size={14} className="text-zinc-400"/> Audit Trail
                            </h4>
                            <div className="space-y-3">
                                {transfer.auditLog.map((log, i) => (
                                    <div key={i} className="flex gap-4 p-3 bg-white rounded-xl border border-zinc-200 text-xs shadow-sm">
                                        <div className="font-mono text-zinc-400 shrink-0 border-r border-zinc-100 pr-3 flex items-center">
                                            {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-bold text-zinc-800 uppercase text-[10px]">{log.action}</span>
                                            <p className="text-zinc-500 mt-0.5">{log.details}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase bg-zinc-50 px-2 py-1 rounded border border-zinc-100 h-fit">
                                            <User size={10}/> {log.user}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {transfer.status === 'Posted' && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 text-indigo-800 text-xs items-center justify-center">
                            <Database size={16}/>
                            <p><strong>GL Posted:</strong> Transaction ID {transfer.glTransactionId} recorded in General Ledger.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransferDetail;
