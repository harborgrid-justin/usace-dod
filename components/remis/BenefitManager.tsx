import React from 'react';
import { RelocationCase, RelocationBenefit, BenefitStatus } from '../../types';
import { DollarSign, Plus, CheckCircle, ShieldCheck, Send } from 'lucide-react';
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
                action: `Benefit ${benefitId} status changed to ${newStatus}`
            }]
        });

        if (newStatus === 'Paid') {
            // Integration #6: Trigger Expense & Disburse
            const benefitToPay = caseData.benefits.find(b=>b.id===benefitId);
            if(benefitToPay){
                // We need to create a new object with the updated status for the orchestrator
                const paidBenefit = { ...benefitToPay, status: newStatus };
                IntegrationOrchestrator.generateExpenseFromRelocationBenefit(paidBenefit, caseData);
            }
            addToast('Benefit Paid: Disbursement request sent to financial module.', 'success');
        } else {
            addToast(`Benefit status updated to ${newStatus}`, 'info');
        }
    };

    const StatusBadge: React.FC<{ status: BenefitStatus }> = ({ status }) => {
        const styles = {
            'Pending': 'bg-amber-100 text-amber-700',
            'Approved': 'bg-blue-100 text-blue-700',
            'Paid': 'bg-emerald-100 text-emerald-700',
            'Denied': 'bg-rose-100 text-rose-700',
        };
        return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${styles[status]}`}>{status}</span>;
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={16} className="text-zinc-400"/> Financial Benefits
                </h4>
                {caseData.status === 'Assistance Approved' && (
                     <button onClick={onAddBenefitClick} className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                        <Plus size={12}/> Add Benefit
                    </button>
                )}
            </div>
            
            <div className="space-y-3 mt-4">
                {caseData.benefits.map(b => (
                    <div key={b.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-bold text-zinc-800">{b.type}</p>
                                <p className="text-xs text-zinc-500 font-mono">{b.id}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-sm font-mono font-bold">{formatCurrency(b.amount)}</p>
                                <StatusBadge status={b.status} />
                            </div>
                        </div>
                         <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {b.status === 'Pending' && (
                                <button onClick={() => handleUpdateBenefit(b.id, 'Approved')} className="text-[9px] font-bold uppercase px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1">
                                    <ShieldCheck size={12}/> Approve
                                </button>
                            )}
                            {b.status === 'Approved' && (
                                <button onClick={() => handleUpdateBenefit(b.id, 'Paid')} className="text-[9px] font-bold uppercase px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 flex items-center gap-1">
                                    <Send size={12}/> Process Payment
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {caseData.benefits.length === 0 && (
                     <div className="text-center py-4 text-xs text-zinc-400">No benefits recorded for this case.</div>
                )}
            </div>
        </div>
    );
};

export default BenefitManager;