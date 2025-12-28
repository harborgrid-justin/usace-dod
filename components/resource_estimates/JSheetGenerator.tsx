
import React, { useState, useMemo } from 'react';
import { BudgetLineItem, POMEntry } from '../../types';
import { FileText, Sparkles, Download, ChevronDown, ChevronUp, Database, AlertCircle, Bot, CheckCircle2, RefreshCw, Landmark, ShieldAlert, Award } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { generateJSheetNarrative } from '../../services/geminiService';

interface Props {
    items: BudgetLineItem[];
    pom: POMEntry[];
}

export const JSheetGenerator: React.FC<Props> = ({ items, pom }) => {
    const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);
    const [justification, setJustification] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isListExpanded, setIsListExpanded] = useState(false);

    const selectedItem = useMemo(() => items.find(i => i.id === selectedId), [items, selectedId]);
    const pomDetail = useMemo(() => pom.find(p => p.projectId === selectedItem?.projectId), [pom, selectedItem]);

    // Quality Score Calculation
    const qualityScore = useMemo(() => {
        if (!justification) return 0;
        let score = 50; // Base
        if (justification.length > 200) score += 20;
        if (justification.toLowerCase().includes('critical') || justification.toLowerCase().includes('mission')) score += 15;
        if (justification.toLowerCase().includes('safety')) score += 15;
        return Math.min(100, score);
    }, [justification]);

    const handleGenerate = async () => {
        if (!selectedItem) return;
        setIsGenerating(true);
        const response = await generateJSheetNarrative(selectedItem, { district: 'LRL District', priorities: 'Flood risk mitigation and navigation lock stability.' });
        setJustification(response || "Generation failed. Service node 8821 offline.");
        setIsGenerating(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-0 relative">
            
            {/* Project Selector Sidebar */}
            <div className={`lg:col-span-3 bg-zinc-50 border-r border-zinc-200 flex flex-col overflow-hidden transition-all duration-300 absolute lg:relative z-20 w-full lg:w-auto lg:h-full ${isListExpanded ? 'h-full shadow-2xl' : 'h-14 lg:h-full'}`}>
                <div 
                    className="p-4 border-b border-zinc-200 bg-white flex justify-between items-center cursor-pointer lg:cursor-default"
                    onClick={() => setIsListExpanded(!isListExpanded)}
                >
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Database size={14} /> Submission Items
                    </h3>
                    <div className="lg:hidden text-zinc-400">
                        {isListExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                </div>
                <div className={`flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5 ${isListExpanded ? 'block' : 'hidden lg:block'}`}>
                    {items.map(item => (
                        <button 
                            key={item.id}
                            onClick={() => { 
                                setSelectedId(item.id); 
                                setJustification(item.justification || ''); 
                                setIsListExpanded(false); 
                            }}
                            className={`w-full text-left p-4 rounded-xl transition-all border ${
                                selectedId === item.id 
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg scale-[1.02]' 
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                    selectedId === item.id ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                                }`}>FY26</span>
                                <span className={`text-[9px] font-bold uppercase ${selectedId === item.id ? 'text-rose-400' : 'text-rose-600'}`}>
                                    {item.capabilityLevel.split(' ')[1]}
                                </span>
                            </div>
                            <p className="text-xs font-bold truncate leading-tight">{item.projectName}</p>
                            <p className="text-[10px] font-mono mt-1 opacity-60 group-hover:opacity-100">{formatCurrency(item.amount)}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Document Preview & AI Workspace */}
            <div className="lg:col-span-9 bg-white flex flex-col overflow-hidden mt-14 lg:mt-0 h-full">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/30 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-400"><FileText size={18}/></div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">ENG Form 2201 (Electronic J-Sheet)</h3>
                            <p className="text-[10px] text-zinc-400 font-medium">Compliance: 31 U.S.C. 1105(a)</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* Quality Score Badge */}
                        <div className={`px-3 py-1 rounded-xl border flex items-center gap-2 ${qualityScore > 80 ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                            <Award size={14}/>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold uppercase">Quality Score</span>
                                <span className="text-xs font-mono font-bold">{qualityScore}/100</span>
                            </div>
                        </div>
                        <button className="px-4 py-2 border border-zinc-200 rounded-xl text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50 flex items-center gap-2 transition-all">
                            <Download size={14}/> PDF Export
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-zinc-50/50">
                    <div className="space-y-8 pb-20">
                        {/* Capability Risk Warning */}
                        {selectedItem?.capabilityLevel !== 'Capability 1' && (
                             <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 shadow-sm animate-in slide-in-from-top-2">
                                <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold">Mission Risk Warning</p>
                                    <p className="text-xs mt-1 leading-relaxed">
                                        This item is programmed below Capability Level 1 (Sustainment). This introduces risk to critical infrastructure performance and requires enhanced justification for OMB review.
                                    </p>
                                </div>
                             </div>
                        )}

                        {/* AI Justification Workbench */}
                        <div className="bg-zinc-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-10"><Bot size={120} /></div>
                             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles size={18} className="text-emerald-400" />
                                        <h4 className="text-base font-bold uppercase tracking-widest">Sentinel Budget Defender</h4>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 min-h-[140px] relative">
                                        {isGenerating ? (
                                            <div className="flex flex-col items-center justify-center h-24 gap-3">
                                                <RefreshCw size={24} className="text-emerald-400 animate-spin" />
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase">Analyzing mission data...</p>
                                            </div>
                                        ) : (
                                            <textarea 
                                                value={justification}
                                                onChange={e => setJustification(e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-0 text-sm leading-relaxed text-zinc-200 min-h-[120px] resize-none"
                                                placeholder="Budget justification will be generated here. High-level requirement data is utilized to draft the narrative..."
                                            />
                                        )}
                                        {!isGenerating && !justification && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                                <p className="text-xs italic text-zinc-400">Click 'AI Generation' to start drafting.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full md:w-64 space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Contextual Alignment</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[10px]"><span className="text-zinc-400">PPA Match</span> <span className="text-emerald-400 font-bold">100%</span></div>
                                            <div className="flex justify-between items-center text-[10px]"><span className="text-zinc-400">Priority Score</span> <span className="text-emerald-400 font-bold">8.4 / 10</span></div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !selectedItem}
                                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Sparkles size={14}/> Run AI Generation
                                    </button>
                                </div>
                             </div>
                        </div>

                        {/* Formal Document Preview */}
                        <div className="bg-white p-10 border border-zinc-200 rounded-3xl shadow-xl font-serif text-sm text-zinc-800 relative">
                            <div className="absolute top-6 right-8 opacity-20 pointer-events-none rotate-12">
                                <Landmark size={80} />
                            </div>
                            
                            <div className="text-center font-bold mb-10 pb-6 border-b-2 border-zinc-900">
                                <p className="uppercase text-xs tracking-widest mb-1">Department of the Army - U.S. Army Corps of Engineers</p>
                                <p className="uppercase text-lg">CIVIL WORKS BUDGET JUSTIFICATION - FISCAL YEAR 2026</p>
                                <div className="mt-4 flex justify-center gap-4 text-[10px] font-mono font-bold text-zinc-500 uppercase">
                                    <span>Program: {selectedItem?.businessLine}</span>
                                    <span>•</span>
                                    <span>Appropriation: Construction, General</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12 mb-10">
                                <div className="space-y-4">
                                    <div className="border-l-2 border-rose-700 pl-4">
                                        <h5 className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Project Name & District</h5>
                                        <p className="text-base font-bold text-zinc-900 leading-tight">{selectedItem?.projectName}</p>
                                        <p className="text-xs text-zinc-500 mt-1">District: Louisville (LRL)</p>
                                    </div>
                                    <div className="border-l-2 border-rose-700 pl-4">
                                        <h5 className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest mb-1">P2 Number</h5>
                                        <p className="text-sm font-mono font-bold">{selectedItem?.projectId}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-right">
                                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                        <h5 className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest mb-1 text-right">Budget Request (BY)</h5>
                                        <p className="text-2xl font-mono font-bold text-rose-700">{formatCurrency(selectedItem?.amount || 0)}</p>
                                        <p className="text-[9px] text-zinc-400 mt-1 font-bold uppercase">{selectedItem?.capabilityLevel}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h5 className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <AlertCircle size={14} className="text-zinc-300"/> Justification of Requirement
                                </h5>
                                <div className="text-sm text-zinc-700 leading-relaxed indent-8 p-6 bg-zinc-50/30 rounded-2xl border border-dashed border-zinc-200 min-h-[160px]">
                                    {justification || "Record pending AI justification generation or manual transcription."}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h5 className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest mb-4">5-Year Program (POM)</h5>
                                <div className="grid grid-cols-5 gap-4 text-center">
                                    {['fy1', 'fy2', 'fy3', 'fy4', 'fy5'].map((fy, i) => (
                                        <div key={fy} className={`p-4 rounded-xl ${i === 0 ? 'bg-zinc-900 text-white' : 'bg-zinc-100'}`}>
                                            <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">FY{26 + i}</p>
                                            <p className="text-sm font-mono font-bold mt-1">{pomDetail ? formatCurrency(pomDetail[fy as keyof POMEntry] as number) : '$0'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
