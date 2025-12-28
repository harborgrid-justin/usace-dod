import React from 'react';
import { DigitalThread, RuleEvaluationResult } from '../../types';
import Modal from '../shared/Modal';
/**
 * Fix: Added missing CheckCircle2 import
 */
import { ShieldCheck, History, Landmark, Database, Link as LinkIcon, FileText, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    thread: DigitalThread;
    ruleResults: RuleEvaluationResult[];
    onClose: () => void;
}

const ThreadDetailModal: React.FC<Props> = ({ thread, ruleResults, onClose }) => {
    return (
        <Modal title="Digital Thread Intelligence" subtitle={`System ID: ${thread.id}`} onClose={onClose} maxWidth="max-w-3xl">
            <div className="space-y-8 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-[32px] shadow-inner">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">Commercial Context</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center"><span className="text-xs text-zinc-500 font-medium">Vendor Identity</span><span className="text-xs font-bold text-zinc-900">{thread.vendorName}</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs text-zinc-500 font-medium">UEI Profile</span><span className="text-xs font-mono font-bold text-zinc-900">{thread.vendorUEI}</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs text-zinc-500 font-medium">Agreement Type</span><span className="text-xs font-bold text-zinc-900">{thread.contractVehicle}</span></div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Landmark size={80}/></div>
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Financial Magnitude</h4>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center"><span className="text-xs text-zinc-400">Total Obligation</span><span className="text-sm font-mono font-bold">{formatCurrency(thread.obligationAmt)}</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs text-zinc-400">YTD Disbursed</span><span className="text-sm font-mono font-bold text-emerald-400">{formatCurrency(thread.disbursementAmt)}</span></div>
                                <div className="flex justify-between items-center pt-3 border-t border-white/5"><span className="text-xs text-zinc-400">Unliquidated (ULO)</span><span className="text-sm font-mono font-bold text-rose-400">{formatCurrency(thread.unliquidatedAmt)}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-zinc-200 p-6 rounded-[32px] shadow-sm h-full">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-600"/> Compliance Matrix
                            </h4>
                            <div className="space-y-3">
                                {ruleResults.length > 0 ? ruleResults.map((r, i) => (
                                    <div key={i} className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 text-xs text-rose-700 font-medium">
                                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                        {r.ruleName}
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-zinc-400 space-y-4">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100"><CheckCircle2 size={24}/></div>
                                        <p className="text-xs font-bold uppercase tracking-widest">Protocol Verified</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-zinc-100 flex flex-col gap-6">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-3">
                        <History size={14}/> Forensic Thread Lineage
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-6 group cursor-pointer">
                            <div className="p-2 bg-zinc-100 rounded-xl text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all"><FileText size={16}/></div>
                            <div className="flex-1 border-b border-zinc-50 pb-2 flex justify-between items-center">
                                <div><p className="text-xs font-bold text-zinc-900">Budget Apportionment (SF 132)</p><p className="text-[10px] text-zinc-400 font-mono">APP-24-012-LRL</p></div>
                                <ArrowRight size={14} className="text-zinc-200 group-hover:text-zinc-400"/>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group cursor-pointer">
                             <div className="p-2 bg-zinc-100 rounded-xl text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all"><Database size={16}/></div>
                             <div className="flex-1 border-b border-zinc-50 pb-2 flex justify-between items-center">
                                <div><p className="text-xs font-bold text-zinc-900">ERP Commitment Document</p><p className="text-[10px] text-zinc-400 font-mono">PR-10002241 (GFEBS)</p></div>
                                <ArrowRight size={14} className="text-zinc-200 group-hover:text-zinc-400"/>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ThreadDetailModal;
