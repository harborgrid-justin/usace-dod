import React, { useState } from 'react';
/**
 * Fix: Added missing AlertTriangle import
 */
import { Users, Gavel, Scale, UserCheck, Star, ShieldCheck, AlertCircle, TrendingUp, CheckCircle2, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { Solicitation, VendorQuote } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import Badge from '../shared/Badge';

interface Props {
    solicitation: Solicitation;
}

const SourceSelectionBoard: React.FC<Props> = ({ solicitation }) => {
    const [activeStage, setActiveStage] = useState<'Evaluations' | 'Consensus' | 'Recommendation'>('Evaluations');

    const boardMembers = [
        { id: 'SSB-01', name: 'Lt Col Richards', role: 'SSB Chair', status: 'Review Complete' },
        { id: 'SSB-02', name: 'Maj Stevens', role: 'Technical Evaluator', status: 'In Progress' },
        { id: 'SSB-03', name: 'Ms. Henderson', role: 'Cost Analyst', status: 'Review Complete' },
    ];

    return (
        <div className="flex flex-col h-full bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm animate-in fade-in">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 text-white rounded-2xl shadow-xl"><Scale size={20}/></div>
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Source Selection Board (SSB)</h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter mt-0.5">Authority: FAR Part 15 • Case: {solicitation.id}</p>
                    </div>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-zinc-200 shadow-sm overflow-x-auto">
                    {['Evaluations', 'Consensus', 'Recommendation'].map(tab => (
                        <button key={tab} onClick={() => setActiveStage(tab as any)} className={`px-5 py-2 rounded-lg text-[9px] font-bold uppercase transition-all whitespace-nowrap ${activeStage === tab ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-700'}`}>{tab}</button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <Star size={16} className="text-amber-500 fill-amber-500" /> Evaluation Matrix
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                                    <ShieldCheck size={14} className="text-emerald-500"/> PRICE/TECH TRADEOFF
                                </div>
                            </div>
                            <div className="space-y-4">
                                {solicitation.quotes.map(quote => (
                                    <div key={quote.vendorId} className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-all cursor-default">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900">{quote.vendorName}</p>
                                                <p className="text-[10px] font-mono text-zinc-400 uppercase mt-0.5">UEI: {quote.uei}</p>
                                            </div>
                                            <p className="text-base font-mono font-bold text-zinc-900">{formatCurrency(quote.amount)}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-zinc-100">
                                            <div>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase mb-2">Technical Factor (V-I)</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1.5 flex-1 bg-zinc-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-zinc-800" style={{width: `${quote.technicalScore}%`}} />
                                                    </div>
                                                    <span className="text-xs font-bold font-mono">{quote.technicalScore}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase mb-2">Risk Factor (V-II)</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1.5 flex-1 bg-zinc-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500" style={{width: `${quote.pastPerformanceScore}%`}} />
                                                    </div>
                                                    <span className="text-xs font-bold font-mono">{quote.pastPerformanceScore}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl border border-zinc-800 flex flex-col h-fit">
                             <h4 className="text-xs font-bold uppercase tracking-widest mb-10 flex items-center gap-3 text-amber-400">
                                <Users size={16}/> Board Composition
                             </h4>
                             <div className="space-y-4">
                                {boardMembers.map(member => (
                                    <div key={member.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-xs shadow-lg">{member.name.charAt(0)}</div>
                                            <div>
                                                <p className="text-sm font-bold">{member.name}</p>
                                                <p className="text-[9px] text-zinc-500 uppercase font-bold">{member.role}</p>
                                            </div>
                                        </div>
                                        {member.status === 'Review Complete' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                                    </div>
                                ))}
                             </div>
                             <button className="w-full mt-10 py-3 border border-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">Record Board Consensus</button>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                             <div className="flex items-start gap-4 text-amber-900 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                <AlertTriangle size={20} className="shrink-0" />
                                <p className="text-xs leading-relaxed font-medium"><strong>Conflict Note:</strong> SSB members must certify no financial interest in any offeror per OGE 450 requirements.</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourceSelectionBoard;
