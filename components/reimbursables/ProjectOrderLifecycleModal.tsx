
import React, { useState } from 'react';
import { ProjectOrder, ProjectOrderStatus } from '../../types';
import Modal from '../shared/Modal';
import { CheckCircle2, Circle, ArrowRight, FileText, ShieldCheck, Database } from 'lucide-react';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';

interface Props {
    order: ProjectOrder;
    onClose: () => void;
    onUpdate: (updatedOrder: ProjectOrder) => void;
}

const STAGES: ProjectOrderStatus[] = ['Draft (Advance Planning)', 'Issued', 'Accepted', 'Work In Progress', 'Completed'];

const ProjectOrderLifecycleModal: React.FC<Props> = ({ order, onClose, onUpdate }) => {
    const currentStageIndex = STAGES.indexOf(order.status);
    const nextStage = STAGES[currentStageIndex + 1];

    const [gtcNumber, setGtcNumber] = useState(order.documents.fs7600a || '');
    const [commencementDate, setCommencementDate] = useState(new Date().toISOString().split('T')[0]);
    const [integrationMsg, setIntegrationMsg] = useState('');
    
    const handleAdvance = () => {
        let updates: Partial<ProjectOrder> = {};

        if (nextStage === 'Issued') {
            if (!gtcNumber) return;
            updates = {
                status: 'Issued',
                documents: { ...order.documents, fs7600a: gtcNumber }
            };
        } else if (nextStage === 'Accepted') {
            // Integration #2: Generate GL Obligation via Orchestrator
            const glEntry = IntegrationOrchestrator.generateObligationFromProjectOrder(order, 'Budget Officer');
            
            if (glEntry) {
                setIntegrationMsg(`Integration Successful: Generated GL Obligation ${glEntry.id} for $${glEntry.totalAmount.toLocaleString()}. Funds obligated per 41 USC 6307.`);
                // In a real Redux app, we would dispatch(addGLTransaction(glEntry)) here.
                console.log("GL Transaction Created:", glEntry);
            }

            updates = {
                status: 'Accepted',
                acceptanceDate: new Date().toISOString().split('T')[0],
                obligatedAmount: order.totalAmount
            };

        } else if (nextStage === 'Work In Progress') {
            updates = {
                status: 'Work In Progress',
                commencementDate: commencementDate
            };
        } else if (nextStage === 'Completed') {
            updates = {
                status: 'Completed',
                completionDate: new Date().toISOString().split('T')[0]
            };
        }

        onUpdate({ ...order, ...updates });
        // Don't close immediately if we showed a success message
        if(nextStage !== 'Accepted') onClose();
    };

    return (
        <Modal title={`Manage Order: ${order.orderNumber}`} onClose={onClose} maxWidth="max-w-2xl">
            <div className="space-y-8">
                <div className="relative flex justify-between items-center px-2">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-100 -z-10" />
                    {STAGES.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        return (
                            <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2">
                                {isCompleted ? (
                                    <CheckCircle2 size={20} className="text-emerald-600 fill-emerald-50" />
                                ) : (
                                    <Circle size={20} className="text-zinc-300" />
                                )}
                                <span className={`text-[9px] font-bold uppercase max-w-[60px] text-center leading-tight ${isCurrent ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                    {stage.replace(/\s*\(.*\)/, '')}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                    {nextStage ? (
                        <>
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                Action Required: Advance to {nextStage}
                            </h4>

                            {nextStage === 'Issued' && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex gap-3">
                                        <FileText size={16} className="shrink-0" />
                                        <p><strong>Requirement:</strong> Ensure General Terms & Conditions (FS Form 7600A) are signed before issuing the order (FS Form 7600B).</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">GT&C Number (7600A)</label>
                                        <input 
                                            type="text" 
                                            value={gtcNumber} 
                                            onChange={e => setGtcNumber(e.target.value)} 
                                            placeholder="e.g., GTC-24-..."
                                            className="w-full mt-1 border border-zinc-300 rounded p-2 text-sm" 
                                        />
                                    </div>
                                </div>
                            )}

                            {nextStage === 'Accepted' && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-800 flex gap-3">
                                        <ShieldCheck size={16} className="shrink-0" />
                                        <p><strong>FMR Compliance (41 U.S.C. 6307):</strong> Accepting this order will record a formal <strong>obligation</strong> of funds in the amount of <strong>${order.totalAmount.toLocaleString()}</strong>. Unlike Economy Act orders, these funds do not de-obligate at fiscal year-end.</p>
                                    </div>
                                    {integrationMsg && (
                                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800 flex gap-3 animate-in fade-in">
                                            <Database size={16} className="shrink-0" />
                                            <p>{integrationMsg}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {nextStage === 'Work In Progress' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Commencement Date</label>
                                        <input 
                                            type="date" 
                                            value={commencementDate} 
                                            onChange={e => setCommencementDate(e.target.value)} 
                                            className="w-full mt-1 border border-zinc-300 rounded p-2 text-sm" 
                                        />
                                        <p className="text-[10px] text-zinc-400 mt-1">Must be within reasonable time (usually 90 days) of acceptance.</p>
                                    </div>
                                </div>
                            )}

                            {nextStage === 'Completed' && (
                                <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-lg text-xs text-zinc-600">
                                    Confirm all deliverables have been received and final billing is prepared.
                                </div>
                            )}

                            <div className="flex justify-end pt-6 mt-4 border-t border-zinc-200/50">
                                <button 
                                    onClick={integrationMsg ? onClose : handleAdvance} 
                                    disabled={nextStage === 'Issued' && !gtcNumber}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {integrationMsg ? 'Close' : `Confirm & Advance`} <ArrowRight size={14} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                            <p className="text-sm font-bold text-zinc-900">Order Cycle Complete</p>
                            <p className="text-xs text-zinc-500">All lifecycle stages have been executed.</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProjectOrderLifecycleModal;
