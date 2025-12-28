import React, { useState } from 'react';
import { ADAViolation, ADAInvestigation } from '../../types';
import { ArrowLeft, Gavel, ShieldAlert, Landmark, DollarSign, History, FileText, CheckCircle2, AlertTriangle, UserCheck, Scale, Database } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { ADAViolationStatusBadge } from '../shared/StatusBadges';
import InvestigationDashboard from './InvestigationDashboard';

interface Props {
    violation: ADAViolation;
    investigation?: ADAInvestigation;
    onBack: () => void;
}

const ViolationDetail: React.FC<Props> = ({ violation, investigation, onBack }) => {
    return (
        <div className="flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-4 overflow-hidden">
            <div className="bg-white border-b border-zinc-200 px-8 py-8 flex flex-col gap-8 sticky top-0 z-20 shadow-sm shrink-0">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <button onClick={onBack} className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all active:scale-95 shadow-sm">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                             <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none">{violation.id}</h2>
                                <ADAViolationStatusBadge status={violation.status} />
                             </div>
                             <p className="text-sm text-zinc-500 font-medium mt-2">{violation.organization} • Reported: <span className="font-mono text-zinc-900">{violation.discoveryDate}</span></p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Violation Magnitude</p>
                        <p className="text-4xl font-mono font-bold text-rose-700 tracking-tighter tabular-nums">{formatCurrency(violation.amount)}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
                    
                    {/* Left Column: Statutory Data */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border border-zinc-800">
                             <div className="absolute top-0 right-0 p-6 opacity-5"><Scale size={100}/></div>
                             <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <Database size={16}/> Legal Authority Reference
                             </h4>
                             <div className="space-y-6 relative z-10">
                                <div className="p-5 bg-white/5 border border-white/10 rounded-3xl shadow-inner">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest">Statute Code</p>
                                    <p className="text-base font-bold text-white leading-snug">{violation.type}</p>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/10 rounded-3xl shadow-inner">
                                    <p className="text-xs text-zinc-300 leading-relaxed italic">
                                        "{violation.description}"
                                    </p>
                                </div>
                             </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-[40px] p-8 shadow-sm h-fit">
                             <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">Discovery Audit Log</h4>
                             <div className="space-y-4">
                                <div className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs">
                                    <div className="p-2 bg-white rounded-xl shadow-sm h-fit"><CheckCircle2 size={16} className="text-emerald-500"/></div>
                                    <div>
                                        <p className="font-bold text-zinc-900 uppercase text-[10px]">Initial Detection</p>
                                        <p className="text-zinc-500 mt-1">Variance detected during FY24 Q3 JRP review cycle. Auto-flagged by G-8 Sentinel.</p>
                                        <p className="text-[9px] font-mono text-zinc-400 mt-2 uppercase font-bold tracking-tighter">Source: Sentinel_Logic_A8</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Investigation Workspace */}
                    <div className="lg:col-span-8 flex flex-col min-h-0 h-fit">
                        <InvestigationDashboard 
                            investigation={investigation}
                            violationOrg={violation.organization}
                            onUpdate={() => {}}
                            onCreate={() => {}}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViolationDetail;
