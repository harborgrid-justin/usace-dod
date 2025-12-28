import React, { useState, useTransition, useMemo } from 'react';
import { 
    ArrowLeft, Scale, ShieldCheck, FileText, User, Calendar, 
    Calculator, CheckCircle2, AlertTriangle, History, 
    Landmark, Shield, ClipboardCheck, Edit2, Save, Trash2, XCircle,
    // Fix: Added missing Plus import
    Plus
} from 'lucide-react';
import { AppraisalRecord, AppraisalStatus, AppraisalReview } from '../../types';
import { formatCurrency, formatRelativeTime } from '../../utils/formatting';
import { remisService } from '../../services/RemisDataService';
import { useToast } from '../shared/ToastContext';
import RemisAuditTrail from './RemisAuditTrail';

interface Props {
    record: AppraisalRecord;
    onBack: () => void;
    onUpdate?: (record: AppraisalRecord) => void;
}

const AppraisalDetail: React.FC<Props> = ({ record, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'Report' | 'Review' | 'History'>('Report');
    const [isUnmasked, setIsUnmasked] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();
    
    // Review form state
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewForm, setReviewForm] = useState<Partial<AppraisalReview>>(record.technicalReview || {
        reviewerId: 'REVIEWER-01',
        findings: '',
        isTechnicallySufficient: true
    });

    const handleApprove = () => {
        if (!confirm("Fiduciary Certification (Req 3.7): Affirm compliance with UASFLA and 49 CFR Part 24?")) return;
        startTransition(() => {
            const updated = { ...record, status: 'Approved' as AppraisalStatus };
            if (onUpdate) onUpdate(updated);
            else remisService.updateAppraisal(updated);
            addToast('Valuation certified and published.', 'success');
        });
    };

    const handleSaveReview = () => {
        if (!reviewForm.findings) return;
        startTransition(() => {
            const updated = { 
                ...record, 
                status: 'Under Review' as AppraisalStatus,
                technicalReview: {
                    ...reviewForm as AppraisalReview,
                    date: new Date().toISOString().split('T')[0]
                },
                auditLog: [...record.auditLog, {
                    timestamp: new Date().toISOString(),
                    user: 'REMIS_REVIEWER',
                    action: 'Technical Review Completed',
                    details: reviewForm.isTechnicallySufficient ? 'Review passed.' : 'Review flagged deficiencies.'
                }]
            };
            if (onUpdate) onUpdate(updated);
            else remisService.updateAppraisal(updated);
            setIsReviewing(false);
            addToast('Technical review record updated.', 'info');
        });
    };

    const handleDeleteReview = () => {
        if (!confirm("Delete this review record? This will return the appraisal to 'In-Progress' status.")) return;
        startTransition(() => {
            const { technicalReview, ...rest } = record;
            const updated = { 
                ...rest, 
                status: 'In-Progress' as AppraisalStatus,
                auditLog: [...record.auditLog, {
                    timestamp: new Date().toISOString(),
                    user: 'REMIS_REVIEWER',
                    action: 'Technical Review Voided',
                    details: 'Review record removed.'
                }]
            };
            if (onUpdate) onUpdate(updated);
            else remisService.updateAppraisal(updated);
            addToast('Review record deleted.', 'warning');
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
                            <button onClick={handleApprove} className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg">
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

                    {activeTab === 'Review' && (
                        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm animate-in fade-in">
                            <div className="flex justify-between items-center mb-10 border-b border-zinc-50 pb-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <ClipboardCheck size={20} className="text-zinc-400"/> Technical Appraisal Review
                                </h4>
                                {!isReviewing && (
                                    <div className="flex gap-2">
                                        {record.technicalReview && (
                                            <button onClick={handleDeleteReview} className="p-2 text-zinc-400 hover:text-rose-600 transition-all"><Trash2 size={16}/></button>
                                        )}
                                        <button onClick={() => setIsReviewing(true)} className="px-5 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 shadow-md">
                                            {record.technicalReview ? <Edit2 size={14}/> : <Plus size={14}/>}
                                            {record.technicalReview ? 'Update Review' : 'Initiate Review'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isReviewing ? (
                                <div className="space-y-8 animate-in slide-in-from-bottom-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Review Findings / Justification</label>
                                        <textarea 
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-sm focus:bg-white focus:border-zinc-900 outline-none transition-all h-48 leading-relaxed shadow-inner"
                                            value={reviewForm.findings}
                                            onChange={e => setReviewForm({...reviewForm, findings: e.target.value})}
                                            placeholder="Enter technical sufficiency analysis..."
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                                        <div className="flex items-center gap-4">
                                            <button 
                                                type="button"
                                                onClick={() => setReviewForm({...reviewForm, isTechnicallySufficient: true})}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 transition-all ${reviewForm.isTechnicallySufficient ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-zinc-400 border border-zinc-200'}`}
                                            >
                                                <CheckCircle2 size={14}/> Technically Sufficient
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setReviewForm({...reviewForm, isTechnicallySufficient: false})}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 transition-all ${!reviewForm.isTechnicallySufficient ? 'bg-rose-600 text-white shadow-lg' : 'bg-white text-zinc-400 border border-zinc-200'}`}
                                            >
                                                <AlertTriangle size={14}/> Deficient
                                            </button>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => setIsReviewing(false)} className="px-5 py-2 text-zinc-400 font-bold uppercase text-[10px]">Cancel</button>
                                            <button onClick={handleSaveReview} className="px-8 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 shadow-xl flex items-center gap-2">
                                                <Save size={14}/> Commit Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : record.technicalReview ? (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-4 rounded-3xl border flex items-center gap-4 ${record.technicalReview.isTechnicallySufficient ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                                            {record.technicalReview.isTechnicallySufficient ? <ShieldCheck size={24}/> : <XCircle size={24}/>}
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-tight">{record.technicalReview.isTechnicallySufficient ? 'Technically Sufficient' : 'Deficient / Required Correction'}</p>
                                                <p className="text-[10px] opacity-70 mt-0.5">Reviewed on: {record.technicalReview.date} by {record.technicalReview.reviewerId}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[32px] shadow-inner font-serif text-zinc-700 leading-relaxed indent-8">
                                        {record.technicalReview.findings}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                                    <div className="p-6 bg-zinc-50 rounded-full border border-zinc-200 text-zinc-300"><ClipboardCheck size={48}/></div>
                                    <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">No Technical Review on File</h4>
                                    <p className="text-xs text-zinc-400 max-w-sm">Every appraisal record must undergo a formal review by a staff appraiser to ensure UASFLA compliance.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'History' && (
                        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm animate-in fade-in">
                            <div className="flex justify-between items-center mb-10 border-b border-zinc-50 pb-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <History size={20} className="text-zinc-400"/> Appraisal Audit History
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                                    <ShieldCheck size={14}/> RECORD AUTHENTICATED
                                </div>
                            </div>
                            <RemisAuditTrail log={record.auditLog} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppraisalDetail;