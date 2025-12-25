
import React, { useState, useMemo } from 'react';
import { Book, ShieldCheck, ArrowLeft, Bot, Sparkles, ChevronRight, AlertCircle, Bookmark, Code2 } from 'lucide-react';
import { FMRVolume } from '../../types';
import { MOCK_BUSINESS_RULES } from '../../constants';
import { FMR_V12_CH23_CONTENT, FMR_V11B_CH11_CONTENT } from '../../utils/fmrContent';
import { getFinancialAdvice } from '../../services/geminiService';

interface Props {
  volume: FMRVolume;
  onBack: () => void;
}

const VolumeDetail: React.FC<Props> = ({ volume, onBack }) => {
  const [activeContentTab, setActiveContentTab] = useState<'text' | 'controls'>('text');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const linkedRules = useMemo(() => MOCK_BUSINESS_RULES.filter(rule => 
      rule.linkedFmrVolumeId === volume.id || 
      rule.citation.includes(volume.volume) ||
      rule.citation.includes(volume.id)
  ), [volume]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery) return;
    setIsAiLoading(true);
    try {
      const response = await getFinancialAdvice(aiQuery, { currentVolume: volume.volume, title: volume.title });
      setAiResponse(response || "Policy interpretation generated.");
    } catch { setAiResponse("Service unavailable."); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 w-fit transition-colors uppercase tracking-wide">
                <ArrowLeft size={14} /> Back
            </button>
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-zinc-900 text-white rounded-lg"><Book size={24} /></div>
                    <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold uppercase">{volume.category}</span>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-1">{volume.volume}</h2>
                <h3 className="text-sm font-medium text-zinc-500 mb-4">{volume.title}</h3>
                {linkedRules.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setActiveContentTab('controls')}>
                        <div className="flex items-center gap-2 text-blue-700"><ShieldCheck size={16} /><span className="text-xs font-bold uppercase">Active Controls</span></div>
                        <span className="text-xs font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded-full">{linkedRules.length}</span>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-zinc-900 rounded-xl p-6 text-white flex flex-col shadow-lg min-h-[300px]">
                <div className="flex items-center gap-2 mb-4"><Sparkles size={16} className="text-emerald-400" /><h4 className="text-sm font-bold uppercase tracking-widest">Sentinel AI</h4></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-4 pr-2">
                    {aiResponse ? <div className="bg-white/10 rounded-lg p-4 text-xs leading-relaxed border border-white/10">{aiResponse}</div> : <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2"><Bot size={24} className="opacity-50"/><p className="text-xs text-center">Ask about "{volume.title}"</p></div>}
                </div>
                <form onSubmit={handleAskAI} className="relative">
                    <input type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder={`Query ${volume.volume}...`} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 pl-4 pr-10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all" />
                    <button type="submit" disabled={isAiLoading || !aiQuery} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white disabled:opacity-50"><ChevronRight size={16} /></button>
                </form>
            </div>
        </div>
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                <div className="flex gap-4">
                    <button onClick={() => setActiveContentTab('text')} className={`text-sm font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${activeContentTab === 'text' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent hover:text-zinc-600'}`}>Regulation Text</button>
                    <button onClick={() => setActiveContentTab('controls')} className={`text-sm font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${activeContentTab === 'controls' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent hover:text-zinc-600'}`}>Digitized Logic ({linkedRules.length})</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {activeContentTab === 'text' ? (
                    (volume.id === 'V12_CH23' || volume.id === 'V11B') ? 
                    <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-700 leading-relaxed p-4 bg-zinc-50 rounded-lg border border-zinc-100">{volume.id === 'V12_CH23' ? FMR_V12_CH23_CONTENT : FMR_V11B_CH11_CONTENT}</pre> 
                    : <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100"><h4 className="text-xs font-bold text-zinc-800 mb-2 flex items-center gap-2"><AlertCircle size={14} className="text-amber-500"/> Placeholder</h4><p className="text-xs text-zinc-500">Content pending digitization.</p></div>
                ) : (
                    <div className="space-y-4">
                        {linkedRules.length > 0 ? linkedRules.map(rule => (
                            <div key={rule.id} className="p-4 bg-white border border-zinc-200 rounded-xl hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2"><div className="p-1.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100"><Code2 size={16} /></div><span className="text-xs font-mono font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded">{rule.code}</span></div>
                                    <span className="text-[9px] font-bold uppercase px-2 py-1 rounded border bg-blue-50 text-blue-700 border-blue-100">{rule.severity}</span>
                                </div>
                                <h4 className="text-sm font-bold text-zinc-900 mb-1">{rule.name}</h4>
                                <p className="text-xs text-zinc-600 mb-3">{rule.description}</p>
                                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200/60 font-mono text-[10px] text-zinc-600"><p>{rule.logicString}</p></div>
                            </div>
                        )) : <div className="flex flex-col items-center justify-center py-12 text-zinc-400 border-2 border-dashed border-zinc-100 rounded-xl"><Code2 size={32} className="opacity-20 mb-2"/><p className="text-xs font-medium">No digitized rules linked.</p></div>}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default VolumeDetail;
