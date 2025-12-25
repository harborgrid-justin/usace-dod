
import React, { useState } from 'react';
import { Obligation } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { AlertCircle, Clock, Check, X, Filter, CheckCircle2 } from 'lucide-react';

interface Props {
    obligations: Obligation[];
    onUpdate: (o: Obligation) => void;
}

const DormantAccountReview: React.FC<Props> = ({ obligations, onUpdate }) => {
    const [reviewReason, setReviewReason] = useState('');
    
    // Identify dormant accounts: Last activity > 120 days ago & ULO > 0
    const dormantCandidates = obligations.filter(o => {
        if (o.status === 'Closed' || o.unliquidatedAmount === 0) return false;
        const lastAct = new Date(o.lastActivityDate);
        const days = (new Date().getTime() - lastAct.getTime()) / (1000 * 3600 * 24);
        return days > 120;
    });

    const handleAction = (obl: Obligation, action: 'Keep' | 'Deobligate') => {
        if (!reviewReason) {
            alert("Please provide a justification for the audit trail.");
            return;
        }

        if (action === 'Deobligate') {
            const updated: Obligation = {
                ...obl,
                status: 'Closed',
                amount: obl.amount - obl.unliquidatedAmount,
                unliquidatedAmount: 0,
                auditLog: [...obl.auditLog, {
                    timestamp: new Date().toISOString(),
                    user: 'DAR_REVIEWER',
                    action: 'Deobligate',
                    details: `DAR Review: Funds recovered. Reason: ${reviewReason}`
                }]
            };
            onUpdate(updated);
        } else {
            // Keep active, update timestamp
            const updated: Obligation = {
                ...obl,
                lastActivityDate: new Date().toISOString().split('T')[0], // Reset clock
                auditLog: [...obl.auditLog, {
                    timestamp: new Date().toISOString(),
                    user: 'DAR_REVIEWER',
                    action: 'DAR Validated',
                    details: `Validated as bona fide need. Reason: ${reviewReason}`
                }]
            };
            onUpdate(updated);
        }
        setReviewReason('');
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in">
             <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-6 flex items-start gap-4">
                <div className="p-2 bg-white rounded-full text-amber-600 shadow-sm"><AlertCircle size={20}/></div>
                <div>
                    <h3 className="text-sm font-bold text-amber-900">Joint Review Program (JRP) - Tri-Annual Review</h3>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        Identify and de-obligate dormant funds to increase purchasing power. 
                        Candidates shown have no activity for > 120 days and valid ULO balances.
                    </p>
                </div>
             </div>

             <div className="flex-1 bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Filter size={14}/> {dormantCandidates.length} Candidates Found
                    </h4>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {dormantCandidates.map(obl => {
                        const daysDormant = Math.floor((new Date().getTime() - new Date(obl.lastActivityDate).getTime()) / (1000 * 3600 * 24));
                        return (
                            <div key={obl.id} className="border border-zinc-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-zinc-900">{obl.documentNumber}</span>
                                            <span className="text-[9px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">{obl.vendor}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500">{obl.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Recoverable</p>
                                        <p className="text-xl font-mono font-bold text-emerald-600">{formatCurrency(obl.unliquidatedAmount)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-amber-600 font-medium bg-amber-50 p-2 rounded mb-4 w-fit">
                                    <Clock size={14}/> Dormant for {daysDormant} days
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 items-end pt-4 border-t border-zinc-100">
                                    <div className="flex-1 w-full">
                                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1 block">Validation / Justification</label>
                                        <input 
                                            type="text" 
                                            className="w-full border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:border-zinc-400"
                                            placeholder="e.g., Valid invoice pending, Litigation hold, or Excess funds..."
                                            value={reviewReason}
                                            onChange={e => setReviewReason(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleAction(obl, 'Keep')}
                                            className="px-3 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-50 flex items-center gap-2"
                                        >
                                            <Check size={14}/> Validate Need
                                        </button>
                                        <button 
                                            onClick={() => handleAction(obl, 'Deobligate')}
                                            className="px-3 py-2 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-rose-500 flex items-center gap-2 shadow-sm"
                                        >
                                            <X size={14}/> De-obligate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {dormantCandidates.length === 0 && (
                        <div className="text-center py-20 text-zinc-400">
                            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20"/>
                            <p className="text-sm font-medium">No dormant obligations detected.</p>
                            <p className="text-xs mt-1">Excellent portfolio hygiene.</p>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

export default DormantAccountReview;