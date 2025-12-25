
import React, { useState, useMemo } from 'react';
import { FADocument, WorkAllowance, WorkAllowanceStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Landmark, Plus, FileText, Check, X, Minus, History, Shield, CheckCircle2 } from 'lucide-react';
import CWA_AllowanceForm from './CWA_AllowanceForm';
import CWA_AuditLogViewer from './CWA_AuditLogViewer';
import CWA_ReductionForm from './CWA_ReductionForm';
import CWA_FADForm from './CWA_FADForm';

interface Props {
    fads: FADocument[];
    allowances: WorkAllowance[];
    onCreateAllowance: (allowance: WorkAllowance) => void;
    onUpdateAllowance: (allowance: WorkAllowance) => void;
    onCreateFAD: (fad: FADocument) => void;
}

// Reusable Status Badge Component
const StatusBadge: React.FC<{ status: WorkAllowanceStatus }> = ({ status }) => {
    const styles: Record<WorkAllowanceStatus, string> = {
        'Pending Approval': 'bg-amber-100 text-amber-700 border-amber-200',
        'Active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Rejected': 'bg-rose-100 text-rose-700 border-rose-200',
        'Reduced': 'bg-zinc-100 text-zinc-700 border-zinc-200',
        'Closed': 'bg-zinc-800 text-white border-zinc-900',
    };
    return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${styles[status]}`}>{status}</span>;
};

const CWA_Manager: React.FC<Props> = ({ fads, allowances, onCreateAllowance, onUpdateAllowance, onCreateFAD }) => {
    const [selectedFadId, setSelectedFadId] = useState<string | null>(fads[0]?.id || null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFadFormOpen, setIsFadFormOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isReductionOpen, setIsReductionOpen] = useState(false);
    const [historyTarget, setHistoryTarget] = useState<{title: string, log: any[]} | null>(null);
    const [allowanceToEdit, setAllowanceToEdit] = useState<WorkAllowance | null>(null);

    const selectedFad = useMemo(() => fads.find(f => f.id === selectedFadId), [fads, selectedFadId]);
    const fadDistributedAmount = useMemo(() => allowances.filter(a => a.fadId === selectedFadId && a.status !== 'Rejected').reduce((sum, a) => sum + a.amount, 0), [allowances, selectedFadId]);
    
    const filteredAllowances = useMemo(() => allowances.filter(a => a.fadId === selectedFadId), [allowances, selectedFadId]);

    const viewHistory = (target: FADocument | WorkAllowance) => {
        setHistoryTarget({ title: target.id, log: target.auditLog });
        setIsHistoryOpen(true);
    };

    const handleStatusChange = (allowance: WorkAllowance, newStatus: WorkAllowanceStatus, reason: string) => {
        onUpdateAllowance({
            ...allowance,
            status: newStatus,
            auditLog: [...allowance.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'HQ_APPROVER',
                action: `Status changed to ${newStatus}`,
                details: reason
            }]
        });
    };
    
    const handleOpenReduction = (allowance: WorkAllowance) => {
        setAllowanceToEdit(allowance);
        setIsReductionOpen(true);
    };

    const handleReduction = (allowance: WorkAllowance, reductionAmount: number, justification: string) => {
        const newAmount = allowance.amount - reductionAmount;
        onUpdateAllowance({
            ...allowance,
            amount: newAmount,
            status: newAmount > allowance.obligatedAmount ? 'Active' : 'Reduced',
            auditLog: [...allowance.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'HQ_RM',
                action: 'Allowance Reduced',
                details: `Reduced by ${formatCurrency(reductionAmount)}. Justification: ${justification}`
            }]
        });
        setIsReductionOpen(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
            {/* Left: FAD List */}
            <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Funding Docs (FAD)</h3>
                    <button onClick={() => setIsFadFormOpen(true)} className="p-1.5 hover:bg-zinc-200 rounded-md text-zinc-600 transition-colors" title="Create New FAD">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {fads.map(fad => (
                        <button key={fad.id} onClick={() => setSelectedFadId(fad.id)} className={`w-full text-left p-4 border-b border-zinc-100 ${selectedFadId === fad.id ? 'bg-rose-50' : 'hover:bg-zinc-50'}`}>
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-mono font-bold text-zinc-800">{fad.id}</span>
                                <div className="flex items-center gap-2">
                                    {fad.fundType === 'Trust' && <Shield size={12} className="text-blue-600" title="Trust Fund"/>}
                                    <span className="text-[10px] font-bold bg-zinc-100 px-1.5 py-0.5 rounded border">{fad.publicLaw}</span>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">{fad.appropriationSymbol} FY{fad.programYear}</p>
                            <div className="mt-3 text-xs flex justify-between"><span className="text-zinc-500">Authority:</span><span className="font-mono font-bold text-zinc-900">{formatCurrency(fad.totalAuthority)}</span></div>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Right: Work Allowances */}
            <div className="lg:col-span-9 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                {selectedFad ? (
                    <>
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div><h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Work Allowances for {selectedFad.id}</h3><div className="h-1 w-full bg-zinc-200 rounded-full mt-2 max-w-sm"><div className="h-1 bg-rose-600 rounded-full" style={{width: `${(fadDistributedAmount / selectedFad.totalAuthority) * 100}%`}}/></div><p className="text-[10px] font-mono mt-1 text-zinc-500">{formatCurrency(fadDistributedAmount)} / {formatCurrency(selectedFad.totalAuthority)} Distributed</p></div>
                            <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 w-full sm:w-auto justify-center"><Plus size={12}/> Issue Allowance</button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left min-w-[700px]">
                                <thead className="bg-white sticky top-0 border-b border-zinc-100"><tr className="shadow-sm"><th className="p-3 text-[10px] font-bold text-zinc-400 uppercase">District / PPA</th><th className="p-3 text-[10px] font-bold text-zinc-400 uppercase text-right">Amount</th><th className="p-3 text-[10px] font-bold text-zinc-400 uppercase text-right">Available</th><th className="p-3 text-[10px] font-bold text-zinc-400 uppercase">Status</th><th className="p-3 text-[10px] font-bold text-zinc-400 uppercase text-center">Actions</th></tr></thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {filteredAllowances.map(wa => (
                                        <tr key={wa.id} className="hover:bg-zinc-50 group">
                                            <td className="p-3"><p className="text-xs font-bold text-zinc-800">{wa.districtEROC} - {wa.ppa}</p><p className="text-[10px] text-zinc-500">{wa.congressionalLineItem}</p></td>
                                            <td className="p-3 text-xs font-mono font-bold text-zinc-900 text-right">{formatCurrency(wa.amount)}</td>
                                            <td className="p-3 text-xs font-mono font-bold text-emerald-600 text-right">{formatCurrency(wa.amount - wa.obligatedAmount)}</td>
                                            <td className="p-3"><StatusBadge status={wa.status} /></td>
                                            <td className="p-3 text-center">
                                                <div className="flex items-center justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => viewHistory(wa)} className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded"><History size={14}/></button>
                                                    {wa.status === 'Pending Approval' && <>
                                                        <button onClick={() => handleStatusChange(wa, 'Active', 'Approved by HQ.')} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded"><Check size={14}/></button>
                                                        <button onClick={() => handleStatusChange(wa, 'Rejected', 'Insufficient justification.')} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"><X size={14}/></button>
                                                    </>}
                                                    {wa.status === 'Active' && <button onClick={() => handleOpenReduction(wa)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded"><Minus size={14}/></button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2"><Landmark size={24}/><p className="text-xs">Select a FAD to manage allowances.</p></div>}
            </div>
            {isFormOpen && selectedFad && <CWA_AllowanceForm fad={selectedFad} allowances={allowances} onClose={() => setIsFormOpen(false)} onSubmit={onCreateAllowance} />}
            {isFadFormOpen && <CWA_FADForm onClose={() => setIsFadFormOpen(false)} onSubmit={onCreateFAD} />}
            {isHistoryOpen && historyTarget && <CWA_AuditLogViewer title={historyTarget.title} log={historyTarget.log} onClose={() => setIsHistoryOpen(false)} />}
            {isReductionOpen && allowanceToEdit && <CWA_ReductionForm allowance={allowanceToEdit} onClose={() => setIsReductionOpen(false)} onSubmit={handleReduction} />}
        </div>
    );
};

export default CWA_Manager;
