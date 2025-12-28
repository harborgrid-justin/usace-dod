import React, { useState, useTransition, useMemo } from 'react';
import { ArrowLeft, Scale, ShieldCheck, FileText, User, Calendar, Calculator, CheckCircle2, AlertTriangle, History, Landmark, Shield } from 'lucide-react';
import { AppraisalRecord, AppraisalStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { appraisalService } from '../../services/AppraisalDataService';
import { useToast } from '../shared/ToastContext';

const AppraisalDetail: React.FC<{ record: AppraisalRecord, onBack: () => void }> = ({ record, onBack }) => {
    const [activeTab, setActiveTab] = useState<'Report' | 'Review' | 'History'>('Report');
    const [isUnmasked, setIsUnmasked] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();

    const handleApprove = () => {
        if (!confirm("Fiduciary Certification (Req 3.7): Affirm compliance with UASFLA and 49 CFR Part 24?")) return;
        startTransition(() => {
            appraisalService.updateAppraisal({ ...record, status: 'Approved' }, 'Approver_1', 'REMIS_APPROVER');
            addToast('Valuation certified and published.', 'success');
        });
    };

    return (
        <div className={`flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-4 transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="bg-white border-b border-zinc-200 px-6 py-6 flex flex-col gap-6 sticky top-0 z-20 shadow-sm">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-colors">
                        <ArrowLeft size={16}/> Back to Registry
                    </button>
                    <div className="flex items-center gap-3">
                         {record.status !== 'Approved' && (
                            <button onClick={handleApprove} className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg">
                                <CheckCircle2 size={16} className="text-emerald-400"/> Finalize Valuation
                            </button>
                        )}
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${record.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                            {record.status}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-zinc-900 text-white rounded-2xl shadow-xl shrink-0"><Scale size={32}/></div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{record.id}</h2>
                            <p className="text-sm text-zinc-500 font-medium">Standard: <span className="text-zinc-800">{record.standard}</span> • Asset: <span className="font-mono font-bold">{record.assetId}</span></p>
                        </div>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm min-w-[250px] group">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Established Market Value</p>
                        <div className="flex items-center justify-between">
                            <span className={`text-xl font-mono font-bold transition-all ${isUnmasked ? 'text-zinc-900' : 'text-zinc-200 blur-sm'}`}>
                                {isUnmasked ? formatCurrency(record.marketValue) : '$0,000,000.00'}
                            </span>
                            <button onClick={() => setIsUnmasked(!isUnmasked)} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                                <Shield className={`size-5 ${isUnmasked ? 'text-emerald-500' : 'text-zinc-300'}`}/>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-8 border-t border-zinc-100 pt-4 mt-2 px-2 overflow-x-auto custom-scrollbar">
                    {['Report', 'Review', 'History'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-800'}`}>{tab}</button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {activeTab === 'Report' && (
                        <div className="bg-white border border-zinc-200 rounded-3xl p-10 shadow-sm animate-in fade-in">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <FileText size={20} className="text-zinc-400"/> Statement of Work & Findings
                            </h4>
                            <div className="space-y-10">
                                <div>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase mb-2 tracking-widest">Appraisal Assignment Purpose</p>
                                    <p className="text-base text-zinc-800 leading-relaxed font-serif">{record.purpose}</p>
                                </div>
                                <div className="p-6 bg-rose-50/30 rounded-3xl border border-rose-100">
                                    <p className="text-[10px] text-rose-600 font-bold uppercase mb-4 tracking-widest flex items-center gap-2">
                                        <AlertTriangle size={14}/> Extraordinary Assumptions (Req 3.1.4)
                                    </p>
                                    <ul className="space-y-4">
                                        {record.extraordinaryAssumptions.map((a, i) => (
                                            <li key={i} className="text-sm text-zinc-700 flex items-start gap-3 leading-relaxed">
                                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"/> {a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppraisalDetail;