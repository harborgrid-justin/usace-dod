
import React, { useState, useTransition, useMemo } from 'react';
import { ArrowLeft, Home, Calculator, ShieldCheck, History, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';
import { HAPCase, HAPCaseStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import Badge from '../shared/Badge';
import RemisAuditTrail from '../remis/RemisAuditTrail';

interface Props {
    hapCase: HAPCase;
    onBack: () => void;
    onUpdate: (updatedCase: HAPCase) => void;
}

const STAGES: HAPCaseStatus[] = ['New', 'Valuation Review', 'Benefit Calculation', 'Legal Review', 'Approved', 'Paid'];

const HAPCaseDetail: React.FC<Props> = ({ hapCase, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Financials' | 'Compliance'>('Overview');
    const [isPending, startTransition] = useTransition();

    const priorFMV = hapCase.purchasePrice; 
    const currentFMV = hapCase.currentFairMarketValue || priorFMV * 0.85;
    const calculatedBenefit = useMemo(() => Math.max(0, (priorFMV * 0.95) - currentFMV), [priorFMV, currentFMV]);

    const handleAdvance = () => {
        const currentIdx = STAGES.indexOf(hapCase.status);
        if (currentIdx < STAGES.length - 1) {
            startTransition(() => {
                onUpdate({ ...hapCase, status: STAGES[currentIdx + 1] });
            });
        }
    };

    return (
        <div className={`flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-4 transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="bg-white border-b border-zinc-200 px-8 py-6 flex flex-col gap-6 sticky top-0 z-20 shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <button onClick={onBack} className="p-2.5 bg-zinc-50 rounded-sm border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all shadow-sm active:scale-95">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                             <h2 className="text-2xl font-bold text-zinc-900 tracking-tight leading-none">{hapCase.applicantName}</h2>
                             <p className="text-xs text-zinc-500 font-medium mt-2 uppercase tracking-widest flex items-center gap-2">
                                Case ID: <span className="font-mono text-zinc-900 font-bold">{hapCase.id}</span>
                                <span className="text-zinc-300">|</span>
                                <span className="truncate max-w-md">{hapCase.propertyAddress}</span>
                             </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {hapCase.status !== 'Paid' && (
                             <button onClick={handleAdvance} className="px-5 py-2 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-lg flex items-center gap-2 transition-all active:scale-95">
                                Move to {STAGES[STAGES.indexOf(hapCase.status) + 1]} <ArrowRight size={14}/>
                             </button>
                        )}
                        <Badge variant={hapCase.status === 'Paid' ? 'success' : 'info'}>{hapCase.status}</Badge>
                    </div>
                </div>

                <div className="relative flex justify-between items-center px-4 mt-2">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
                    {STAGES.map((stage, i) => {
                        const activeIdx = STAGES.indexOf(hapCase.status);
                        const isComplete = i < activeIdx;
                        const isCurrent = i === activeIdx;
                        return (
                            <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${isComplete ? 'bg-teal-600 border-teal-600 text-white shadow-md' : isCurrent ? 'bg-white border-teal-600 text-teal-600 shadow-md' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                                    {isComplete ? <CheckCircle2 size={12}/> : <span className="text-[9px] font-bold">{i + 1}</span>}
                                </div>
                                <span className={`text-[8px] font-bold uppercase text-center max-w-[80px] leading-tight ${isCurrent ? 'text-zinc-900' : 'text-zinc-400'}`}>{stage}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-8">
                             <div className="bg-white border border-zinc-200 rounded-md p-10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Calculator size={140} /></div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-10 flex items-center gap-3">
                                    <Calculator size={18} className="text-teal-600"/> § 239.5 Benefit Worksheet
                                </h3>
                                <div className="space-y-8 font-mono relative z-10">
                                    <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                                        <span className="text-zinc-500 font-sans text-xs font-bold uppercase tracking-wide">Prior Fair Market Value (PFMV)</span>
                                        <span className="font-bold text-zinc-900 text-lg">{formatCurrency(priorFMV)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                                        <span className="text-teal-600 font-sans text-xs font-bold uppercase tracking-wide">Policy Threshold (95%)</span>
                                        <span className="font-bold text-teal-700 text-lg">{formatCurrency(priorFMV * 0.95)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                                        <span className="text-zinc-500 font-sans text-xs font-bold uppercase tracking-wide">Current Market Assessment</span>
                                        <span className="font-bold text-rose-600 text-lg">-{formatCurrency(currentFMV)}</span>
                                    </div>
                                    <div className="pt-6 flex justify-between items-end border-t border-zinc-100">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">Calculated Cash Benefit</p>
                                            <p className="text-xs text-zinc-500 font-sans font-medium">Payable directly to applicant via EFT.</p>
                                        </div>
                                        <p className="text-5xl font-bold text-zinc-900 tracking-tighter tabular-nums leading-none">
                                            {formatCurrency(calculatedBenefit)}
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-zinc-900 rounded-md p-8 text-white shadow-2xl flex flex-col h-fit relative overflow-hidden border border-zinc-800">
                                <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><UserCheck size={80}/></div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-teal-400 relative z-10">
                                    <ShieldCheck size={16}/> Case Governance
                                </h4>
                                <div className="space-y-6 relative z-10">
                                    <div className="p-5 bg-white/5 border border-white/10 rounded-sm shadow-inner">
                                        <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1 tracking-widest">HAP Specialist</p>
                                        <p className="text-sm font-bold text-white">{hapCase.assignedOfficer}</p>
                                    </div>
                                    <div className="p-5 bg-white/5 border border-white/10 rounded-sm shadow-inner">
                                        <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1 tracking-widest">Mortgage Payoff</p>
                                        <p className="text-lg font-mono font-bold text-white">{formatCurrency(hapCase.mortgageBalance)}</p>
                                    </div>
                                    <div className="pt-4 space-y-3">
                                        <button className="w-full py-3 bg-white text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-xl active:scale-95">Audit Servicer Data</button>
                                        <button className="w-full py-3 bg-white/10 text-white border border-white/20 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95">Request Legal Review</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-zinc-200 rounded-md p-8 shadow-sm">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                             <History size={16} className="text-zinc-400"/> Fiduciary Audit History
                        </h4>
                        {hapCase.auditLog && <RemisAuditTrail log={hapCase.auditLog} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HAPCaseDetail;
