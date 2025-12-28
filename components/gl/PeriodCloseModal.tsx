import React, { useState } from 'react';
import { Lock, ShieldCheck, Database, Calendar, AlertTriangle, FileCheck, Landmark, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import Modal from '../shared/Modal';

interface Props {
    period: string;
    onClose: () => void;
    onLock: () => void;
}

const PeriodCloseModal: React.FC<Props> = ({ period, onClose, onLock }) => {
    const [step, setStep] = useState<'Init' | 'Scanning' | 'Report'>('Init');

    const handleRunScan = () => {
        setStep('Scanning');
        setTimeout(() => setStep('Report'), 2000);
    };

    return (
        <Modal title="Finalize Accounting Period" subtitle="SFFAS Protocol 08.2" onClose={onClose} maxWidth="max-w-2xl">
            <div className="space-y-8 animate-in fade-in">
                {step === 'Init' && (
                    <div className="space-y-8">
                        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-start gap-5">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-600 border border-rose-200"><ShieldCheck size={28}/></div>
                            <div>
                                <p className="text-sm font-bold text-rose-900 uppercase tracking-tight">Period Lock Authorization</p>
                                <p className="text-xs text-rose-700 leading-relaxed mt-1">Initiating this protocol will permanently lock the general ledger for <span className="font-bold underline">{period}</span>. All pending manual journals must be approved before execution.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-center">
                                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Fiscal Year</p>
                                <p className="text-lg font-bold text-zinc-900 font-mono">2024</p>
                            </div>
                            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-center">
                                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Accounting Period</p>
                                <p className="text-lg font-bold text-zinc-900 font-mono">05</p>
                            </div>
                        </div>
                        <button onClick={handleRunScan} className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl active:scale-95">
                            Run Final Tie-Point Scan
                        </button>
                    </div>
                )}

                {step === 'Scanning' && (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <Loader2 size={48} className="animate-spin text-zinc-300" strokeWidth={1}/>
                        <div className="text-center space-y-2">
                            <p className="text-sm font-bold text-zinc-900 uppercase tracking-[0.2em]">Executing Reconciliations</p>
                            <p className="text-xs text-zinc-400 font-mono">Scanning Tie-Point #1010: FBwT Accuracy...</p>
                        </div>
                    </div>
                )}

                {step === 'Report' && (
                    <div className="space-y-8">
                         <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[32px] flex gap-5 items-center">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100"><CheckCircle2 size={24}/></div>
                            <div>
                                <p className="text-sm font-bold text-emerald-900">Pre-Close Scan Successful</p>
                                <p className="text-xs text-emerald-700">Authoritative ledgers are in balance. 62/62 Tie-Points verified.</p>
                            </div>
                        </div>
                        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-4 bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Aggregate Verification Results</div>
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-zinc-100"><th className="p-4">Standard Rule</th><th className="p-4 text-right">Balance Delta</th><th className="p-4 text-center">Status</th></tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50 font-mono">
                                    <tr><td className="p-4 text-zinc-600">FBwT vs 6653 Report</td><td className="p-4 text-right">$0.00</td><td className="p-4 text-center text-emerald-600 font-bold">MATCH</td></tr>
                                    <tr><td className="p-4 text-zinc-600">Expended vs Unfilled</td><td className="p-4 text-right">$0.00</td><td className="p-4 text-center text-emerald-600 font-bold">MATCH</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={onClose} className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-2xl text-[10px] font-bold uppercase hover:bg-zinc-200 transition-all">Cancel Execution</button>
                            <button onClick={onLock} className="flex-[2] py-3 bg-rose-700 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-800 shadow-2xl flex items-center justify-center gap-3">
                                <Lock size={16}/> Commit Period Lock (SF 224)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default PeriodCloseModal;
