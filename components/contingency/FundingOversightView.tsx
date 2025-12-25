
import React from 'react';
import { CheckCircle2, Activity, Clock, FileUp, Repeat, Layers, Send, Package } from 'lucide-react';
import { ContingencyOperation, OHDAReimbursementStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface FundingOversightViewProps {
    operation: ContingencyOperation;
}

const ReimbursementStatusBadge: React.FC<{status: OHDAReimbursementStatus}> = ({status}) => {
    const classes = {
        'Pending Validation': 'bg-amber-100 text-amber-800 border-amber-200',
        'Validated': 'bg-blue-100 text-blue-800 border-blue-200',
        'Reimbursed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${classes[status]}`}>{status}</span>
}

const FundingOversightView: React.FC<FundingOversightViewProps> = ({ operation }) => {
    // OHDACA View for Foreign Disaster Relief
    if (operation.fundingSource === 'OHDACA') {
        const deadline = operation.endDate ? new Date(new Date(operation.endDate).getTime() + 60 * 24 * 60 * 60 * 1000) : null;
        const daysRemaining = deadline ? Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="bg-white p-6 rounded-xl border border-zinc-200">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">OHDACA Workflow (FMR 16.0)</h4>
                    {/* Timeline component here */}
                    <div className="flex justify-between items-center text-center text-[10px] font-medium text-zinc-500">
                         <div className="flex flex-col items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500"/><span>USAID MiTaM</span></div>
                         <div className="flex-1 h-px bg-zinc-200 mx-2"/>
                         <div className="flex flex-col items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500"/><span>DSCA FAD</span></div>
                          <div className="flex-1 h-px bg-zinc-200 mx-2"/>
                         <div className="flex flex-col items-center gap-1 text-blue-600 font-bold"><Activity size={14}/><span>Reimbursement</span></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-zinc-200">
                         <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">DSCA Funding (FMR 16.3.1)</h4>
                         <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg space-y-2">
                             <div className="flex justify-between text-xs"><span className="text-zinc-500">FAD Number:</span> <span className="font-mono font-bold">{operation.ohdacaDetails?.fadNumber}</span></div>
                             <div className="flex justify-between text-xs"><span className="text-zinc-500">Total Authorized:</span> <span className="font-mono font-bold">{formatCurrency(operation.ohdacaDetails?.dscaFunding || 0)}</span></div>
                         </div>
                         {deadline && daysRemaining !== null && (
                             <div className={`mt-4 p-3 rounded-lg border flex items-start gap-2 ${daysRemaining > 10 ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'}`}>
                                 <Clock size={16} className={daysRemaining > 10 ? 'text-amber-500' : 'text-rose-500'}/>
                                 <p className={`text-xs font-medium ${daysRemaining > 10 ? 'text-amber-800' : 'text-rose-800'}`}>
                                    <strong>{daysRemaining} days remaining</strong> to submit reimbursement requests per FMR 16.3.4.4.
                                 </p>
                             </div>
                         )}
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-zinc-200">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Component Actions (FMR 16.3.3)</h4>
                        <div className="space-y-3">
                            {operation.ohdacaDetails?.reimbursementRequests.map(req => (
                               <div key={req.id} className="flex justify-between items-center text-xs">
                                   <span className="font-mono">{req.id} - {formatCurrency(req.amount)}</span>
                                   <ReimbursementStatusBadge status={req.status} />
                               </div>
                            ))}
                             <button className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors">
                                 <FileUp size={12}/> Request Reimbursement
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Default view for OCOTF / Base funded
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-xl border border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Repeat size={14}/> OCO Transfer Fund (FMR 15.1)</h4>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">No-year transfer account for emerging requirements based on actual execution experience.</p>
                <button disabled={operation.fundingSource !== 'OCOTF'} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed">
                    <Send size={12}/> Request OCOTF Transfer
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Layers size={14}/> Base Funded Operations (FMR 15.2)</h4>
                 <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Estimates for base-funded operations are submitted electronically via the SNaP system.</p>
                <button disabled={!operation.isBaseFunded} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed">
                    <Package size={12}/> Submit Estimates to SNaP
                </button>
            </div>
         </div>
    );
};

export default FundingOversightView;
