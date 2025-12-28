import React from 'react';
import { RelocationCase, RelocationBenefit, BenefitStatus } from '../../types';
import { DollarSign, Plus, CheckCircle, ShieldCheck, Send, Trash2, XCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { useToast } from '../shared/ToastContext';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';

interface Props {
    caseData: RelocationCase;
    onUpdate: (c: RelocationCase) => void;
    onAddBenefitClick: () => void;
}

const BenefitManager: React.FC<Props> = ({ caseData, onUpdate, onAddBenefitClick }) => {
    const { addToast } = useToast();

    const handleUpdateBenefit = (benefitId: string, newStatus: BenefitStatus) => {
        const updatedBenefits = caseData.benefits.map(b => b.id === benefitId ? { ...b, status: newStatus, approvalDate: new Date().toISOString().split('T')[0], approvingOfficial: 'REMIS_MGR' } : b);
        onUpdate({ 
            ...caseData, 
            benefits: updatedBenefits,
            auditLog: [...caseData.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'REMIS_MGR',
                action: `Benefit ${benefitId} status changed to ${newStatus}`,
                details: `Status transition of relocation entitlement.`
            }]
        });

        if (newStatus === 'Paid') {
            const benefitToPay = caseData.benefits.find(b => b.id === benefitId);
            if(benefitToPay){
                const paidBenefit = { ...benefitToPay, status: newStatus };
                IntegrationOrchestrator.generateExpenseFromRelocationBenefit(paidBenefit, caseData);
            }
            addToast('Benefit Paid: Disbursement request sent to financial module.', 'success');
        } else {
            addToast(`Benefit status updated to ${newStatus}`, 'info');
        }
    };

    const handleDeleteBenefit = (benefitId: string) => {
        if (!confirm("Are you sure you want to remove this benefit claim? This will be recorded in the case audit log.")) return;
        
        const updatedBenefits = caseData.benefits.filter(b => b.id !== benefitId);
        onUpdate({
            ...caseData,
            benefits: updatedBenefits,
            auditLog: [...caseData.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'REMIS_MGR',
                action: `Benefit Removed`,
                details: `Benefit record ${benefitId} deleted by authorized official.`
            }]
        });
        addToast('Benefit claim removed.', 'warning');
    };

    const StatusBadge: React.FC<{ status: BenefitStatus }> = ({ status }) => {
        const styles = {
            'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
            'Approved': 'bg-blue-100 text-blue-700 border-blue-200',
            'Paid': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Denied': 'bg-rose-100 text-rose-700 border-rose-200',
        };
        // @ts-ignore
        return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${styles[status]}`}>{status}</span>;
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-600"/> Entitlement & Benefits Ledger
                </h4>
                {['Initiated', 'Eligibility Determined', 'Assistance Approved'].includes(caseData.status) && (
                     <button onClick={onAddBenefitClick} className="px-4 py-1.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-sm flex items-center gap-2">
                        <Plus size={12}/> New Entitlement
                    </button>
                )}
            </div>
            
            <div className="space-y-4">
                {caseData.benefits.map(b => (
                    <div key={b.id} className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl group hover:border-zinc-200 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-zinc-100 text-zinc-400 group-hover:text-emerald-600 transition-colors">
                                    <DollarSign size={18}/>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-800">{b.type}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{b.id}</span>
                                        <StatusBadge status={b.status} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(b.amount)}</p>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">NTE Total</p>
                            </div>
                        </div>
                        
                         <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-zinc-200/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            {b.status === 'Pending' && (
                                <>
                                    <button onClick={() => handleUpdateBenefit(b.id, 'Denied')} className="text-[9px] font-bold uppercase px-3 py-1.5 bg-white text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-50 flex items-center gap-2">
                                        <XCircle size={12}/> Deny
                                    </button>
                                    <button onClick={() => handleUpdateBenefit(b.id, 'Approved')} className="text-[9px] font-bold uppercase px-3 py-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 flex items-center gap-2 shadow-md">
                                        <ShieldCheck size={12}/> Authorize
                                    </button>
                                </>
                            )}
                            {b.status === 'Approved' && (
                                <button onClick={() => handleUpdateBenefit(b.id, 'Paid')} className="text-[9px] font-bold uppercase px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 shadow-md">
                                    <Send size={12}/> Process Payment
                                </button>
                            )}
                            {(b.status === 'Pending' || b.status === 'Denied') && (
                                <button onClick={() => handleDeleteBenefit(b.id)} className="p-1.5 text-zinc-400 hover:text-rose-600 rounded transition-colors">
                                    <Trash2 size={14}/>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {caseData.benefits.length === 0 && (
                     <div className="text-center py-12 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200 text-zinc-400 flex flex-col items-center justify-center gap-2">
                         <DollarSign size={24} className="opacity-10"/>
                         <p className="text-xs font-bold uppercase tracking-widest">No Entitlements Recorded</p>
                     </div>
                )}
            </div>
        </div>
    );
};

export default BenefitManager;
