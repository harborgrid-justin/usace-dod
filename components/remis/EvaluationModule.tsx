import React, { useState, useMemo } from 'react';
import { Solicitation, VendorQuote, SolicitationStatus } from '../../types';
// Fix: Added missing DollarSign icon to the imports
import { Users, Gavel, Scale, Star, ShieldCheck, CheckCircle2, ChevronRight, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';

interface Props {
    sol: Solicitation;
    onAward: (quote: VendorQuote) => void;
    status: SolicitationStatus;
}

const EvaluationModule: React.FC<Props> = ({ sol, onAward, status }) => {
    const activeQuotes = sol.quotes;
    const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

    const selectedQuote = useMemo(() => 
        activeQuotes.find(q => q.vendorId === selectedQuoteId),
    [activeQuotes, selectedQuoteId]);

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
        if (score >= 80) return 'text-blue-700 bg-blue-50 border-blue-100';
        return 'text-amber-700 bg-amber-50 border-amber-100';
    };

    if (activeQuotes.length === 0) {
        return (
             <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-16 text-center text-zinc-400 flex flex-col items-center">
                 <Users size={48} className="opacity-10 mb-4" />
                 <p className="text-sm font-bold uppercase tracking-widest">Waiting for GPE Response</p>
                 <p className="text-xs max-w-xs mt-2 leading-relaxed">Evaluation metrics will be available once the open solicitation period has concluded and PIEE data is synchronized.</p>
             </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm animate-in fade-in">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Scale size={20} className="text-zinc-600" />
                    <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Source Selection Board (SSB) Worksheet</h4>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${REMIS_THEME.classes.statusActive}`}>
                    {activeQuotes.length} Offers Evaluated
                </div>
            </div>

            <div className="p-0 overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="bg-zinc-50/30 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <th className="p-6">Offeror (Vendor PIID)</th>
                            <th className="p-6 text-right">Price Proposal</th>
                            <th className="p-6 text-center">Technical</th>
                            <th className="p-6 text-center">Past Perf</th>
                            <th className="p-6 text-center">Eligibility</th>
                            <th className="p-6 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {activeQuotes.map(quote => (
                            <tr 
                                key={quote.vendorId} 
                                onClick={() => setSelectedQuoteId(quote.vendorId)}
                                className={`hover:bg-zinc-50 transition-all cursor-pointer ${selectedQuoteId === quote.vendorId ? 'bg-zinc-50' : ''}`}
                            >
                                <td className="p-6">
                                    <p className="text-sm font-bold text-zinc-900">{quote.vendorName}</p>
                                    <p className="text-[10px] font-mono text-zinc-400 uppercase mt-1">UEI: {quote.uei}</p>
                                </td>
                                <td className="p-6 text-right">
                                    <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(quote.amount)}</p>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getScoreColor(quote.technicalScore)}`}>
                                        {quote.technicalScore}
                                    </span>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getScoreColor(quote.pastPerformanceScore)}`}>
                                        {quote.pastPerformanceScore}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-center gap-2">
                                        {quote.isResponsive ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-rose-500" />}
                                        {quote.isResponsible ? <ShieldCheck size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-rose-500" />}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <ChevronRight size={18} className={`transition-transform ${selectedQuoteId === quote.vendorId ? 'text-zinc-900' : 'text-zinc-200'}`}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedQuote && (
                <div className="p-8 bg-zinc-50/50 border-t border-zinc-100 animate-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Gavel size={64}/></div>
                                <h5 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                    <Star size={16} className="text-amber-500 fill-amber-500" /> Best Value Determination
                                </h5>
                                <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
                                    <p>Evaluation of <strong>{selectedQuote.vendorName}</strong> indicates a "Satisfactory" risk rating. The price proposal is within 5% of the IGCE. Selection is recommended based on technical superiority in real-property digitization methodologies.</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-2xl space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10"><DollarSign size={64}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Contract Action</p>
                                    <p className="text-xl font-bold text-emerald-400">{formatCurrency(selectedQuote.amount)}</p>
                                </div>
                                <button 
                                    disabled={status !== 'Ready for Award'}
                                    onClick={() => onAward(selectedQuote)}
                                    className={`w-full py-3 bg-white text-zinc-900 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-lg disabled:opacity-30`}
                                >
                                    Execute Award Notice
                                </button>
                                {status !== 'Ready for Award' && (
                                    <p className="text-[9px] text-zinc-500 text-center italic flex items-center justify-center gap-1">
                                        <Clock size={10}/> Technical review must be completed first.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvaluationModule;