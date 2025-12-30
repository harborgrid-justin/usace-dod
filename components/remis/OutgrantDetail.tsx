
import React, { useState, useTransition } from 'react';
import { 
    ArrowLeft, FileSignature, Database, ClipboardCheck, Plus, History, 
    FileText, Trash2, Edit2, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { Outgrant, OutgrantStatus, OutgrantInspection, InspectionStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { useToast } from '../shared/ToastContext';
import RemisAuditTrail from './RemisAuditTrail';
import InspectionModal from './InspectionModal';

const OutgrantDetail: React.FC<{ outgrant: Outgrant, onBack: () => void, onUpdate: (o: Outgrant) => void }> = ({ outgrant, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'General' | 'Inspections' | 'History'>('General');
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();
    
    // Mock State for Inspections - in a real app these would be in the outgrant object or a separate service
    const [inspections, setInspections] = useState<OutgrantInspection[]>([
        { id: 'INSP-001', outgrantId: outgrant.id, type: 'Compliance', scheduleDate: '2023-11-15', completionDate: '2023-11-20', findings: 'Compliant. Fence line verified.', status: 'Closed', inspector: 'Ranger Dave', correctiveActions: '' }
    ]);
    const [selectedInspection, setSelectedInspection] = useState<OutgrantInspection | null>(null);
    const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

    const handleAction = (status: OutgrantStatus) => {
        startTransition(() => {
            onUpdate({ 
                ...outgrant, 
                status,
                auditLog: [...outgrant.auditLog, { timestamp: new Date().toISOString(), user: 'CurrentUser', action: `Status changed to ${status}` }]
            });
            addToast(`Record status updated to ${status}.`, 'info');
        });
    };

    const handleBill = () => {
        startTransition(() => {
            IntegrationOrchestrator.handleOutgrantBilling(outgrant);
            addToast('Reimbursable billing generated (FS 7600B equivalent).', 'success');
        });
    };

    const handleSaveInspection = (insp: OutgrantInspection) => {
        const exists = inspections.find(i => i.id === insp.id);
        if (exists) {
            setInspections(inspections.map(i => i.id === insp.id ? insp : i));
        } else {
            setInspections([insp, ...inspections]);
        }
        setIsInspectionModalOpen(false);
        setSelectedInspection(null);
    };

    const handleDeleteInspection = (id: string) => {
        if (!confirm("Are you sure you want to delete this inspection record?")) return;
        setInspections(inspections.filter(i => i.id !== id));
    };

    const StatusBadge = ({ status }: { status: InspectionStatus }) => {
        const colors = {
            'Scheduled': 'bg-blue-50 text-blue-700 border-blue-100',
            'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'Reviewed': 'bg-purple-50 text-purple-700 border-purple-100',
            'Closed': 'bg-zinc-100 text-zinc-500 border-zinc-200'
        };
        // @ts-ignore
        return <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm border whitespace-nowrap ${colors[status]}`}>{status}</span>;
    };

    return (
        <div className={`flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-4 transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="bg-white border-b border-zinc-200 px-6 py-6 flex flex-col gap-6 sticky top-0 z-20 shadow-sm">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase">
                        <ArrowLeft size={16}/> Back to Registry
                    </button>
                    <div className="flex gap-2">
                        {outgrant.status === 'Proposed' && (
                            <button onClick={() => handleAction('Active')} className="px-5 py-2 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg">Activate Grant</button>
                        )}
                        <span className={`px-4 py-1.5 rounded-sm text-[9px] font-bold uppercase border ${outgrant.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                            {outgrant.status}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-sm shadow-inner border border-emerald-100 shrink-0"><FileSignature size={32}/></div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{outgrant.grantee}</h2>
                            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 font-medium">
                                <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded-sm border border-zinc-200">{outgrant.id}</span>
                                <span>{outgrant.type} Authority</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-md p-4 shadow-sm min-w-[200px]">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Annual Rent Revenue</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(outgrant.annualRent)}</span>
                            <button onClick={handleBill} className="p-1.5 hover:bg-zinc-50 rounded-sm text-emerald-600 transition-colors" title="Trigger Billing">
                                <Database size={18}/>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 border-t border-zinc-100 pt-4 -mb-6">
                    {(['General', 'Inspections', 'History'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                                activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    
                    {activeTab === 'General' && (
                        <div className="bg-white border border-zinc-200 rounded-md p-8 shadow-sm">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <FileText size={16} className="text-zinc-400"/> Regulatory Data (Req 12.1.2)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1.5">Statutory Authority</p><p className="text-sm font-bold text-zinc-800">{outgrant.authority}</p></div>
                                    <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1.5">Permitted Land Use</p><p className="text-sm text-zinc-700 leading-relaxed">{outgrant.permittedUse}</p></div>
                                </div>
                                <div className="bg-zinc-50 rounded-md p-6 border border-zinc-100 space-y-4">
                                    <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/50">
                                        <span className="text-zinc-500">Effective Date</span>
                                        <span className="font-mono font-bold text-zinc-800">{outgrant.termStart}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/50">
                                        <span className="text-zinc-500">Term Expiration</span>
                                        <span className="font-mono font-bold text-rose-700">{outgrant.expirationDate}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500">Payment Freq</span>
                                        <span className="font-bold text-zinc-800 uppercase">{outgrant.paymentFrequency}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Inspections' && (
                        <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <ClipboardCheck size={16} className="text-zinc-400"/> Compliance Inspections
                                </h4>
                                <button 
                                    onClick={() => { setSelectedInspection(null); setIsInspectionModalOpen(true); }}
                                    className="px-4 py-2 rounded-sm bg-zinc-900 text-white text-[10px] font-bold uppercase shadow-sm hover:bg-zinc-800 transition-all flex items-center gap-2"
                                >
                                    <Plus size={12} /> Schedule Review
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-50 border-b border-zinc-100">
                                        <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            <th className="p-4">Type</th>
                                            <th className="p-4">Schedule / Completion</th>
                                            <th className="p-4">Findings</th>
                                            <th className="p-4 text-center">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {inspections.map(insp => (
                                            <tr key={insp.id} className="hover:bg-zinc-50 transition-colors group">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-zinc-100 rounded-sm text-zinc-400"><ClipboardCheck size={14}/></div>
                                                        <p className="text-xs font-bold text-zinc-900">{insp.type}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-mono font-bold text-zinc-800">{insp.scheduleDate}</span>
                                                        {insp.completionDate && <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 size={10}/> Done: {insp.completionDate}</span>}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-xs text-zinc-500 line-clamp-1 max-w-xs">{insp.findings || 'Pending performance...'}</p>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <StatusBadge status={insp.status} />
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setSelectedInspection(insp); setIsInspectionModalOpen(true); }} className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-sm transition-all"><Edit2 size={14}/></button>
                                                        <button onClick={() => handleDeleteInspection(insp.id)} className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all"><Trash2 size={14}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {inspections.length === 0 && (
                                            <tr><td colSpan={5} className="p-12 text-center text-zinc-400 text-xs italic">No inspections scheduled or recorded.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'History' && (
                        <div className="bg-white border border-zinc-200 rounded-md p-8 shadow-sm animate-in fade-in">
                            <div className="flex justify-between items-center mb-10 border-b border-zinc-50 pb-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <History size={16} className="text-zinc-400"/> Authoritative Change Ledger
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-100">
                                    <ShieldCheck size={12}/> RECORD AUTHENTICATED
                                </div>
                            </div>
                            <RemisAuditTrail log={outgrant.auditLog} />
                        </div>
                    )}
                </div>
            </div>
            {isInspectionModalOpen && <InspectionModal outgrantId={outgrant.id} inspection={selectedInspection} onSave={handleSaveInspection} onClose={() => setIsInspectionModalOpen(false)} />}
        </div>
    );
};

export default OutgrantDetail;
