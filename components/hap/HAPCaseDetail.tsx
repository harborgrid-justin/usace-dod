import React, { useState, useTransition, useMemo } from 'react';
import { ArrowLeft, Home, FileText, DollarSign, Scale, CheckCircle2, AlertTriangle, Calculator, ShieldCheck, History, Gavel, ArrowRight, UserCheck } from 'lucide-react';
import { HAPCase, HAPCaseStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import Badge from '../shared/Badge';

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
            <div className="bg-white border-b border-zinc-200 px-8 py-8 flex flex-col gap-8 sticky top-0 z-20 shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <button onClick={onBack} className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all shadow-sm">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                             <h2 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none">{hapCase.applicantName}</h2>
                             <p className="text-sm text-zinc-500 font-medium mt-2">Case ID: <span className="font-mono text-zinc-900">{hapCase.id}</span> • {hapCase.propertyAddress}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {hapCase.status !== 'Paid' && (
                             <button onClick={handleAdvance} className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-lg flex items-center gap-2">
                                Move to {STAGES[STAGES.indexOf(hapCase.status) + 1]} <ArrowRight size={14}/>
                             </button>
                        )}
                        <Badge variant={hapCase.status === 'Paid' ? 'success' : 'info'}>{hapCase.status}</Badge>
                    </div>
                </div>

                <div className="relative flex justify-between items-center px-4">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
                    {STAGES.map((stage, i) => {
                        const activeIdx = STAGES.indexOf(hapCase.status);
                        const isComplete = i < activeIdx;
                        const isCurrent = i === activeIdx;
                        return (
                            <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isComplete ? 'bg-teal-600 border-teal-600 text-white shadow-lg' : isCurrent ? 'bg-white border-teal-600 text-teal-600 shadow-md' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                                    {isComplete ? <CheckCircle2 size={16}/> : i + 1}
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
                             <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5"><Calculator size={140} /></div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-10 flex items-center gap-3">
                                    <Calculator size={18} className="text-teal-600"/> § 239.5 Benefit Worksheet
                                </h3>
                                <div className="space-y-8 font-mono">
                                    <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                                        <span className="text-zinc-500 font-sans text-xs">Prior Fair Market Value (PFMV)</span>
                                        <span className="font-bold text-zinc-900 text-lg">{formatCurrency(priorFMV)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                                        <span className="text-teal-600 font-sans text-xs font-bold uppercase">Policy Threshold (95%)</span>
                                        <span className="font-bold text-teal-700 text-lg">{formatCurrency(priorFMV * 0.95)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                                        <span className="text-zinc-500 font-sans text-xs">Current Market Assessment</span>
                                        <span className="font-bold text-rose-600 text-lg">-{formatCurrency(currentFMV)}</span>
                                    </div>
                                    <div className="pt-6 flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">Calculated Cash Benefit</p>
                                            <p className="text-xs text-zinc-500 font-sans">Payable directly to applicant.</p>
                                        </div>
                                        <p className="text-6xl font-bold text-zinc-900 tracking-tighter tabular-nums leading-none">
                                            {formatCurrency(calculatedBenefit)}
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl flex flex-col h-fit relative overflow-hidden border border-zinc-800">
                                <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><UserCheck size={80}/></div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-teal-400 relative z-10">
                                    <ShieldCheck size={16}/> Case Governance
                                </h4>
                                <div className="space-y-6 relative z-10">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                                        <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">HAP Specialist</p>
                                        <p className="text-sm font-bold text-white">{hapCase.assignedOfficer}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                                        <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">Mortgage Payoff</p>
                                        <p className="text-sm font-mono font-bold text-white">{formatCurrency(hapCase.mortgageBalance)}</p>
                                    </div>
                                    <div className="pt-4 space-y-2">
                                        <button className="w-full py-3 bg-white text-zinc-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-xl">Audit Servicer Data</button>
                                        <button className="w-full py-3 bg-white/10 text-white border border-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all">Request Legal Review</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HAPCaseDetail;
