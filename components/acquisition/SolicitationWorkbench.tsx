
import React, { useState, useMemo } from 'react';
import { 
    Hammer, ArrowRight, ShieldCheck, Clock, Search, 
    Sparkles, FileText, Users, Landmark, AlertTriangle, 
    ChevronRight, CheckCircle2, Bot, Database, Briefcase
} from 'lucide-react';
import { Solicitation, SolicitationStatus, PurchaseRequest, VendorQuote, Contract } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { AcquisitionOrchestrator } from '../../services/AcquisitionOrchestrator';
import { generateMarketResearch, generateStatementOfWork } from '../../services/geminiService';

// Sub-Modules
import MarketResearchModule from './MarketResearchModule';
import EvaluationModule from './EvaluationModule';

interface Props {
    prs: PurchaseRequest[];
    setPrs: React.Dispatch<React.SetStateAction<PurchaseRequest[]>>;
    contracts: Contract[];
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
}

const SolicitationWorkbench: React.FC<Props> = ({ prs, setPrs, contracts, setContracts }) => {
    // Pipeline State
    const initialSols: Solicitation[] = prs
        .filter(p => p.status === 'Funds Certified')
        .map(pr => AcquisitionOrchestrator.initiateSolicitation(pr));

    const [solicitations, setSolicitations] = useState<Solicitation[]>(initialSols);
    const [selectedSolId, setSelectedSolId] = useState<string | null>(solicitations[0]?.id || null);
    
    // UI Local State
    const [isGenerating, setIsGenerating] = useState(false);

    const selectedSol = useMemo(() => solicitations.find(s => s.id === selectedSolId), [solicitations, selectedSolId]);
    const linkedPR = useMemo(() => prs.find(p => p.id === selectedSol?.prId), [prs, selectedSol]);

    const handleAdvance = (nextStatus: SolicitationStatus) => {
        if (!selectedSol) return;
        const updated = AcquisitionOrchestrator.advanceSolicitation(selectedSol, nextStatus, 'KO_ADMIN');
        setSolicitations(prev => prev.map(s => s.id === selectedSol.id ? updated : s));
    };

    const handleAIRearch = async () => {
        if (!selectedSol) return;
        setIsGenerating(true);
        const report = await generateMarketResearch(selectedSol);
        const sow = await generateStatementOfWork(selectedSol);
        
        setSolicitations(prev => prev.map(s => s.id === selectedSol.id ? {
            ...s,
            marketResearch: {
                naicsCode: '541330',
                smallBusinessSetAside: true,
                estimatedMarketPrice: linkedPR?.amount || 0,
                competitors: ['V-NEX SOLUTIONS', 'DEFENSE LOGISTICS GROUP', 'SENTINEL SYSTEMS'],
                aiNarrative: report
            },
            statementOfWork: sow,
            status: 'Market Research'
        } : s));
        setIsGenerating(false);
    };

    const handleAward = (quote: VendorQuote) => {
        if (!selectedSol || !linkedPR) return;

        const result = AcquisitionOrchestrator.awardContract(linkedPR, quote);
        
        // Update System Records
        setContracts(prev => [result.contract, ...prev]);
        setPrs(prev => prev.map(p => p.id === linkedPR.id ? { ...p, status: 'Awarded' } : p));
        setSolicitations(prev => prev.filter(s => s.id !== selectedSol.id));
        
        alert(`CONTRACT AWARDED: PIID ${result.contract.id} to ${quote.vendorName}. Obligation posted.`);
        setSelectedSolId(null);
    };

    const STAGES: SolicitationStatus[] = [
        'Requirement Refinement', 
        'Market Research', 
        'Active Solicitation', 
        'Evaluating Quotes', 
        'Ready for Award'
    ];

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full min-h-0">
            {/* Sidebar: Pipeline Queue */}
            <div className="w-full md:w-[400px] border-r border-zinc-100 flex flex-col bg-zinc-50/30 shrink-0">
                <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-white shadow-sm">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase size={14} /> Solicitation Queue
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-mono font-bold text-zinc-500">
                        {solicitations.length}
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {solicitations.map(sol => (
                        <button 
                            key={sol.id}
                            onClick={() => setSelectedSolId(sol.id)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                selectedSolId === sol.id 
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.01]' 
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[9px] font-mono font-bold ${selectedSolId === sol.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{sol.id}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                                    selectedSolId === sol.id ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                }`}>{sol.status}</span>
                            </div>
                            <h4 className="text-sm font-bold truncate leading-tight mb-1">{sol.title}</h4>
                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/5">
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">PR Reference</span>
                                <span className="text-[10px] font-mono font-bold">{sol.prId}</span>
                            </div>
                        </button>
                    ))}
                    {solicitations.length === 0 && (
                        <div className="py-20 text-center text-zinc-400">
                             <Database size={32} className="mx-auto mb-4 opacity-10" />
                             <p className="text-xs font-medium px-4">No certified requirements pending solicitation.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Workbench Area */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white">
                {selectedSol ? (
                    <>
                        {/* Header & Progress */}
                        <div className="p-6 border-b border-zinc-100 shrink-0">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 mb-1">{selectedSol.title}</h2>
                                    <p className="text-sm text-zinc-500 flex items-center gap-2">
                                        Linked Requirement: <span className="font-mono font-bold text-zinc-800">{selectedSol.prId}</span>
                                        <ChevronRight size={14} className="text-zinc-300"/>
                                        Amount: <span className="font-mono font-bold text-zinc-800">{formatCurrency(linkedPR?.amount || 0)}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {selectedSol.status === 'Requirement Refinement' && (
                                        <button 
                                            onClick={handleAIRearch}
                                            disabled={isGenerating}
                                            className="px-6 py-2.5 bg-rose-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                                        >
                                            {isGenerating ? <Clock className="animate-spin" size={14}/> : <Sparkles size={14}/>}
                                            {isGenerating ? 'Analyzing...' : 'Initiate AI Market Research'}
                                        </button>
                                    )}
                                    {selectedSol.status === 'Evaluating Quotes' && (
                                        <button 
                                            onClick={() => handleAdvance('Ready for Award')}
                                            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200"
                                        >
                                            <CheckCircle2 size={14}/> Finalize Evaluation
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Workflow Stepper */}
                            <div className="relative flex justify-between items-center px-4">
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
                                {STAGES.map((stage, i) => {
                                    const currentIdx = STAGES.indexOf(selectedSol.status);
                                    const isComplete = i < currentIdx;
                                    const isCurrent = i === currentIdx;
                                    return (
                                        <div key={stage} className="flex flex-col items-center gap-2 bg-white px-3">
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                                isComplete ? 'bg-zinc-900 border-zinc-900 text-white' :
                                                isCurrent ? 'bg-white border-rose-600 text-rose-700 shadow-lg' :
                                                'bg-zinc-50 border-zinc-200 text-zinc-400'
                                            }`}>
                                                {isComplete ? <CheckCircle2 size={16}/> : i + 1}
                                            </div>
                                            <span className={`text-[8px] font-bold uppercase text-center max-w-[80px] leading-tight ${isCurrent ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                                {stage}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                            <div className="max-w-5xl mx-auto space-y-10">
                                
                                {/* Stage 1: Market Research Data */}
                                {selectedSol.marketResearch && (
                                    <MarketResearchModule 
                                        report={selectedSol.marketResearch} 
                                        onAdvance={() => handleAdvance('Active Solicitation')}
                                        status={selectedSol.status}
                                    />
                                )}

                                {/* Stage 2: SOW & Solicitation Package */}
                                {selectedSol.status !== 'Requirement Refinement' && (
                                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                                <FileText size={14} className="text-zinc-400" /> Acquisition Package (FAR Part 15)
                                            </h4>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-1 rounded">RFP-D-24-001</span>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 font-serif text-sm leading-relaxed text-zinc-700">
                                                <h5 className="font-bold text-zinc-900 mb-3 border-b pb-2">Statement of Work (SOW) - Draft</h5>
                                                {selectedSol.statementOfWork || "Drafting in progress..."}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
                                                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase mb-3">Evaluation Criteria</h5>
                                                    <ul className="space-y-2 text-xs">
                                                        <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500"/> Technical Excellence</li>
                                                        <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500"/> Past Performance</li>
                                                        <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500"/> Cost/Price Fair & Reasonable</li>
                                                    </ul>
                                                </div>
                                                <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
                                                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase mb-3">Submission Controls</h5>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-zinc-500">Method</span>
                                                            <span className="font-bold">LPTA</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-zinc-500">SAM Status</span>
                                                            <span className="text-emerald-600 font-bold">Validated</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {selectedSol.status === 'Active Solicitation' && (
                                                <button 
                                                    onClick={() => handleAdvance('Evaluating Quotes')}
                                                    className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-xl text-xs font-bold text-zinc-400 hover:text-rose-600 hover:border-rose-300 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Users size={16}/> Record Quote Submissions
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Stage 3: Evaluation & Award */}
                                {(selectedSol.status === 'Evaluating Quotes' || selectedSol.status === 'Ready for Award') && (
                                    <EvaluationModule 
                                        sol={selectedSol} 
                                        onAward={handleAward}
                                        status={selectedSol.status}
                                    />
                                )}

                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase">
                                    <CheckCircle2 size={14} className="text-emerald-500" /> Legal Sufficiency Check
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase">
                                    <CheckCircle2 size={14} className="text-emerald-500" /> Small Business Coord (DD 2579)
                                </div>
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono italic">
                                SEC: UNCLASSIFIED // FOUO
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-4">
                        <div className="p-8 bg-zinc-50 rounded-full border border-zinc-200 border-dashed">
                             <Hammer size={48} className="opacity-10" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Workbench Idle</p>
                            <p className="text-xs max-w-xs leading-relaxed">Select a requirement from the queue to begin the solicitation and market intelligence process.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolicitationWorkbench;
