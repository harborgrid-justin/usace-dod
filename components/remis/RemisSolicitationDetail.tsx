import React from 'react';
import { Solicitation, SolicitationStatus } from '../../types';
import { ArrowLeft, FileText, CheckCircle2, Hammer, Gavel, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    solicitation: Solicitation;
    onBack: () => void;
    onUpdate: (solicitation: Solicitation) => void;
}

const STAGES: SolicitationStatus[] = ['Requirement Refinement', 'Active Solicitation', 'Evaluating Quotes', 'Awarded'];

const RemisSolicitationDetail: React.FC<Props> = ({ solicitation, onBack, onUpdate }) => {
    
    const handleAdvance = () => {
        const currentIdx = STAGES.indexOf(solicitation.status);
        if (currentIdx < STAGES.length - 1) {
            const nextStatus = STAGES[currentIdx + 1];
            onUpdate({ ...solicitation, status: nextStatus });
        }
    };

    // Fix: Using spread to create a shallow copy before sorting to avoid mutating the read-only prop array
    const sortedQuotes = solicitation.quotes ? [...solicitation.quotes].sort((a, b) => b.amount - a.amount) : [];
    
    return (
        <div className="flex flex-col h-full bg-zinc-50/50">
            <div className="bg-white border-b border-zinc-200 px-6 py-4">
                <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase w-fit mb-4">
                    <ArrowLeft size={14}/> Back to List
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">{solicitation.title}</h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">{solicitation.id}</p>
                    </div>
                    {solicitation.status !== 'Awarded' && (
                        <button onClick={handleAdvance} className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold uppercase hover:bg-emerald-700">
                            Advance to: {STAGES[STAGES.indexOf(solicitation.status) + 1] || '...'}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                    {/* Stepper */}
                    <div className="relative flex justify-between items-center px-4 mb-8">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
                        {STAGES.map((stage, i) => {
                            const currentIdx = STAGES.indexOf(solicitation.status);
                            const isComplete = i < currentIdx;
                            const isCurrent = i === currentIdx;
                            return (
                                <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isComplete ? 'bg-zinc-800 border-zinc-800 text-white' : isCurrent ? 'bg-white border-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                                        {isComplete ? <CheckCircle2 size={14}/> : i + 1}
                                    </div>
                                    <span className={`text-[8px] font-bold uppercase ${isCurrent ? 'text-zinc-900' : 'text-zinc-400'}`}>{stage.split(' ')[0]}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">Linked Asset</p>
                            <p className="text-sm font-bold text-zinc-900">{solicitation.assetId}</p>
                        </div>
                         <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">Type</p>
                            <p className="text-sm font-bold text-zinc-900">{solicitation.type}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase mb-4 flex items-center gap-2"><FileText size={14}/> Bid Items</h4>
                        <div className="space-y-2">
                            {solicitation.bidItems?.map(item => (
                                <div key={item.id} className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex justify-between">
                                    <span className="text-xs text-zinc-800">{item.description}</span>
                                    <span className="text-xs font-mono">{item.quantity} {item.unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase mb-4 flex items-center gap-2"><Users size={14}/> Bids Received</h4>
                        <div className="space-y-2">
                            {sortedQuotes.length > 0 ? sortedQuotes.map(q => (
                                <div key={q.vendorId} className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex justify-between">
                                    <span className="text-xs font-bold text-zinc-800">{q.vendorName}</span>
                                    <span className="text-xs font-mono font-bold text-emerald-600">{formatCurrency(q.amount)}</span>
                                </div>
                            )) : <p className="text-xs text-center text-zinc-400 py-4">No bids received yet.</p>}
                        </div>
                        {solicitation.status === 'Awarded' && (
                             <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-bold">
                                 <Gavel size={14}/> Awarded to {sortedQuotes[0]?.vendorName}
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemisSolicitationDetail;