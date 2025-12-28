
import React, { useState } from 'react';
import { Solicitation, VendorQuote, SolicitationStatus } from '../../types';
import { Users, Gavel, Scale, Star, ShieldCheck, CheckCircle2, ChevronRight, AlertTriangle, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    sol: Solicitation;
    onAward: (quote: VendorQuote) => void;
    status: SolicitationStatus;
}

const EvaluationModule: React.FC<Props> = ({ sol, onAward, status }) => {
    // Component now strictly renders data passed in via `sol` prop
    // Data generation is handled by the service layer
    const activeQuotes = sol.quotes;
    
    const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-100';
        return 'text-amber-600 bg-amber-50 border-amber-100';
    };

    if (activeQuotes.length === 0) {
        return (
             <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center text-zinc-400 flex flex-col items-center">
                 <Users size={32} className="opacity-20 mb-2" />
                 <p className="text-sm font-medium">Awaiting Vendor Proposals</p>
                 <p className="text-xs">Quotes will appear here after the solicitation closes.</p>
             </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Scale size={16} className="text-zinc-600" />
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Source Selection & Technical Evaluation</h4>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                        <Users size={12}/> {activeQuotes.length} Quotes Received
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Offeror (Vendor)</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Price Proposal</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Technical Score</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Past Perf</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Compliance</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {activeQuotes.map(quote => (
                                <tr 
                                    key={quote.vendorId} 
                                    onClick={() => setSelectedQuoteId(quote.vendorId)}
                                    className={`hover:bg-zinc-50 transition-colors cursor-pointer ${selectedQuoteId === quote.vendorId ? 'bg-zinc-50' : ''}`}
                                >
                                    <td className="p-4">
                                        <p className="text-sm font-bold text-zinc-900">{quote.vendorName}</p>
                                        <p className="text-[10px] text-zinc-500 font-mono uppercase">UEI: {quote.uei}</p>
                                    </td>
                                    <td className="p-4 text-right">
                                        <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(quote.amount)}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getScoreColor(quote.technicalScore)}`}>
                                            {quote.technicalScore}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getScoreColor(quote.pastPerformanceScore)}`}>
                                            {quote.pastPerformanceScore}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1.5">
                                            {quote.isResponsive ? <CheckCircle2 size={14} className="text-emerald-500" title="Responsive" /> : <AlertTriangle size={14} className="text-rose-500" />}
                                            {quote.isResponsible ? <ShieldCheck size={14} className="text-emerald-500" title="Responsible" /> : <AlertTriangle size={14} className="text-rose-500" />}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        {selectedQuoteId === quote.vendorId ? (
                                            <div className="flex items-center justify-end text-rose-700">
                                                <ChevronRight size={18}/>
                                            </div>
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 ml-auto mr-1" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Award Recommendation Logic */}
                {selectedQuoteId && (
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
                                <h5 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                    <Star size={16} className="text-amber-500 fill-amber-500" /> Best Value Determination
                                </h5>
                                <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
                                    <p>Based on the technical evaluation of the proposal from <strong>{activeQuotes.find(q => q.vendorId === selectedQuoteId)?.vendorName}</strong>, the board has determined that the submission exceeds the minimum requirements in the Statement of Work.</p>
                                    <p>The price proposal of <strong>{formatCurrency(activeQuotes.find(q => q.vendorId === selectedQuoteId)?.amount || 0)}</strong> is deemed fair and reasonable based on historical costs for similar USACE engineering services (Independent Government Cost Estimate comparison).</p>
                                </div>
                                <div className="mt-6 p-4 bg-white rounded-xl border border-zinc-200 flex gap-4 items-center">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle2 size={18}/></div>
                                    <div className="text-xs">
                                        <p className="font-bold text-zinc-900">Responsibility Check Passed</p>
                                        <p className="text-zinc-500">Verified via SAM.gov Exclusion Search (No active debarments found).</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Gavel size={64}/></div>
                                <h5 className="text-sm font-bold uppercase tracking-widest mb-4">Contract Action</h5>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">Target Vendor</span>
                                        <span className="font-bold truncate max-w-[150px]">{activeQuotes.find(q => q.vendorId === selectedQuoteId)?.vendorName}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">Total Award</span>
                                        <span className="font-mono font-bold text-emerald-400">{formatCurrency(activeQuotes.find(q => q.vendorId === selectedQuoteId)?.amount || 0)}</span>
                                    </div>
                                </div>
                                <button 
                                    disabled={status !== 'Ready for Award'}
                                    onClick={() => onAward(activeQuotes.find(q => q.vendorId === selectedQuoteId)!)}
                                    className="w-full py-3 bg-white text-zinc-900 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                                >
                                    Confirm Contract Award
                                </button>
                                {status !== 'Ready for Award' && (
                                    <p className="text-[9px] text-zinc-500 text-center mt-3 italic flex items-center justify-center gap-1">
                                        <Clock size={10}/> Evaluation must be finalized first.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluationModule;
