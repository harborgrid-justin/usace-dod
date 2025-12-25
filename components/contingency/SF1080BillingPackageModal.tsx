
import React, { useState } from 'react';
import { ContingencyOperation } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { Database } from 'lucide-react';

interface SF1080BillingPackageModalProps {
    operation: ContingencyOperation;
    onClose: () => void;
}

const SF1080BillingPackageModal: React.FC<SF1080BillingPackageModalProps> = ({ operation, onClose }) => {
    const [docsChecked, setDocsChecked] = useState(false);
    const [integrationMsg, setIntegrationMsg] = useState('');
    
    const handleSubmit = () => {
        // Integration #11: Tag Incremental Cost
        const glEntry = IntegrationOrchestrator.tagIncrementalCost(operation, operation.billableIncrementalCosts);
        setIntegrationMsg(`GL Integration: Incremental Cost ${formatCurrency(glEntry.totalAmount)} tagged (Doc: ${glEntry.id}).`);
        console.log('Incremental Cost Tagged:', glEntry);
        
        // Delay close to show success
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-top-2">
                <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">Prepare SF 1080 Billing Package</h3>
                <p className="text-xs text-zinc-500 mb-4">For {operation.name}</p>
                
                {integrationMsg ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2"><Database size={24} className="text-emerald-500"/></div>
                        <p className="text-sm font-bold text-emerald-800">Processing Successful</p>
                        <p className="text-xs text-emerald-600 mt-1">{integrationMsg}</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 space-y-2">
                            <div className="flex justify-between text-xs"><span className="text-zinc-500">Billable Incremental Costs:</span> <span className="font-mono font-bold">{formatCurrency(operation.billableIncrementalCosts)}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-zinc-500">Total Offsets:</span> <span className="font-mono font-bold text-blue-600">-{formatCurrency(operation.costOffsets.reduce((s, o) => s + o.amount, 0))}</span></div>
                        </div>
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={docsChecked} onChange={() => setDocsChecked(!docsChecked)} className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-zinc-300" />
                                <span className="text-xs text-amber-900 font-medium">I certify all sufficient supporting documentation (receipts, invoices, UNLoA) is attached per FMR 10.1.</span>
                            </label>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 mt-4">
                            <button onClick={onClose} className="px-5 py-2.5 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                            <button onClick={handleSubmit} disabled={!docsChecked} className="px-5 py-2.5 bg-zinc-900 rounded-lg text-[10px] font-bold uppercase text-white hover:bg-zinc-800 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed">Submit to DFAS</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SF1080BillingPackageModal;
