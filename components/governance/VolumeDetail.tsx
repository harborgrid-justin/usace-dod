import React, { useState, useTransition } from 'react';
import { ArrowLeft, BookOpen, ShieldCheck, Bookmark } from 'lucide-react';
import { FMRVolume } from '../../types';
import { FMR_V12_CH23_CONTENT, FMR_V11B_CH11_CONTENT } from '../../utils/fmrContent';
import { getFinancialAdvice } from '../../services/geminiService';
import PolicyAssistant from './PolicyAssistant';

interface Props {
  volume: FMRVolume;
  onBack: () => void;
}

const VolumeDetail: React.FC<Props> = ({ volume, onBack }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'controls'>('text');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery) return;
    setIsAiLoading(true);
    try {
      const response = await getFinancialAdvice(aiQuery, { vol: volume.volume });
      startTransition(() => setAiResponse(response || "No guidance available."));
    } catch { setAiResponse("Sentinel AI unavailable."); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="p-4 sm:p-8 animate-in slide-in-from-right-4 h-full flex flex-col bg-zinc-50">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-8">
             <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-900 transition-colors"><ArrowLeft size={16} /> Back</button>
             <div className="flex gap-2"><button className="p-2 bg-white border border-zinc-200 rounded-lg"><Bookmark size={16}/></button><button className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase">Download PDF</button></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
            <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto">
               <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm"><div className="flex items-start justify-between mb-4"><div className="p-3 bg-rose-50 text-rose-700 rounded-xl"><BookOpen size={24} /></div><span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[9px] font-bold uppercase border">{volume.category}</span></div><h2 className="text-xl font-bold text-zinc-900 mb-1">{volume.volume}</h2><h3 className="text-sm font-medium text-zinc-500">{volume.title}</h3></div>
               <PolicyAssistant response={aiResponse} query={aiQuery} setQuery={setAiQuery} isLoading={isAiLoading} onAsk={handleAskAI} volumeName={volume.volume} />
            </div>
            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
                <div className="px-6 border-b border-zinc-100 flex gap-8">
                    {['text', 'controls'].map(t => (<button key={t} onClick={() => setActiveTab(t as any)} className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === t ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent hover:text-zinc-600'}`}>{t === 'text' ? 'Regulation Text' : 'Logic Rules'}</button>))}
                </div>
                <div className="flex-1 overflow-y-auto p-8 font-serif text-sm text-zinc-800 leading-relaxed">
                    {(volume.id === 'V12_CH23' || volume.id === 'V11B') ? <pre className="whitespace-pre-wrap font-sans text-xs bg-zinc-50 p-6 rounded-2xl border border-zinc-100">{volume.id === 'V12_CH23' ? FMR_V12_CH23_CONTENT : FMR_V11B_CH11_CONTENT}</pre> : <p className="text-center text-zinc-400 py-12">Pending Digitization.</p>}
                </div>
            </div>
          </div>
        </div>
    </div>
  );
};
export default VolumeDetail;