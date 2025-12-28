import React, { useState, useMemo, useDeferredValue, useTransition } from 'react';
import { 
  BookOpen, Search, ShieldCheck, ArrowLeft, Bot, Sparkles, 
  ChevronRight, AlertCircle, Bookmark, Code2, Library, Filter,
  Activity 
} from 'lucide-react';
import { DOD_FMR_VOLUMES } from '../../constants';
import { FMRVolume } from '../../types';
import { FMR_V12_CH23_CONTENT, FMR_V11B_CH11_CONTENT } from '../../utils/fmrContent';
import { getFinancialAdvice } from '../../services/geminiService';
import VolumeCard from '../governance/VolumeCard';

const GovernanceView: React.FC = () => {
  const [selectedVolume, setSelectedVolume] = useState<FMRVolume | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState<'text' | 'controls'>('text');
  
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(searchTerm);

  const categories = useMemo(() => ['All', 'Budget', 'Accounting', 'Pay', 'Funds', 'Policy'], []);

  const filteredVolumes = useMemo(() => {
    return DOD_FMR_VOLUMES.filter(vol => {
      const matchesCategory = activeCategory === 'All' || vol.category === activeCategory;
      const matchesSearch = vol.title.toLowerCase().includes(deferredSearch.toLowerCase()) || 
                            vol.volume.toLowerCase().includes(deferredSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, deferredSearch]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery || !selectedVolume) return;
    setIsAiLoading(true);
    try {
      const response = await getFinancialAdvice(aiQuery, { currentVolume: selectedVolume.volume, title: selectedVolume.title });
      startTransition(() => {
        setAiResponse(response || "No guidance available.");
      });
    } catch { setAiResponse("Sentinel AI unavailable."); } finally { setIsAiLoading(false); }
  };

  if (selectedVolume) {
    return (
      <div className="p-4 sm:p-8 animate-in slide-in-from-right-4 h-full flex flex-col bg-zinc-50">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-8 shrink-0">
             <button onClick={() => {setSelectedVolume(null); setAiResponse('');}} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-widest">
                <ArrowLeft size={16} /> Back to Library
             </button>
             <div className="flex gap-2">
                <button className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-800"><Bookmark size={16}/></button>
                <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg">Download PDF</button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
            <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
               <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm shrink-0">
                  <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100"><BookOpen size={24} /></div>
                      <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[9px] font-bold uppercase border border-zinc-200">{selectedVolume.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 mb-1">{selectedVolume.volume}</h2>
                  <h3 className="text-sm font-medium text-zinc-500 mb-4 leading-snug">{selectedVolume.title}</h3>
               </div>

               <div className="bg-zinc-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col h-[450px] shrink-0 border border-zinc-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Bot size={100} /></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles size={18} className="text-emerald-400" />
                      <h4 className="text-sm font-bold uppercase tracking-widest">Policy Assistant</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar mb-6 space-y-4 pr-2">
                        {aiResponse ? (
                          <div className={`bg-white/5 rounded-2xl p-4 text-xs leading-relaxed border border-white/10 text-zinc-200 animate-in fade-in ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                            {aiResponse}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3 text-center px-4">
                            <Bot size={32} className="opacity-20"/>
                            <p className="text-xs">Query the FMR Sentinel for strategic interpretations.</p>
                          </div>
                        )}
                    </div>
                    <form onSubmit={handleAskAI} className="relative">
                        <input 
                          type="text" 
                          value={aiQuery} 
                          onChange={(e) => setAiQuery(e.target.value)} 
                          placeholder={`Query ${selectedVolume.volume}...`} 
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3.5 pl-4 pr-12 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all" 
                        />
                        <button 
                          type="submit" 
                          disabled={isAiLoading || !aiQuery} 
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white disabled:opacity-50"
                        >
                          {isAiLoading ? <Activity size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                        </button>
                    </form>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-3xl shadow-sm flex flex-col overflow-hidden h-full">
                <div className="px-6 border-b border-zinc-100 flex gap-8 shrink-0">
                    <button 
                      onClick={() => setActiveContentTab('text')} 
                      className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeContentTab === 'text' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent hover:text-zinc-600'}`}
                    >
                      Regulation Text
                    </button>
                    <button 
                      onClick={() => setActiveContentTab('controls')} 
                      className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeContentTab === 'controls' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent hover:text-zinc-600'}`}
                    >
                      Logic Rules
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    {activeContentTab === 'text' ? (
                        <div className="font-serif text-sm text-zinc-800 leading-relaxed space-y-4 max-w-3xl mx-auto">
                            {(selectedVolume.id === 'V12_CH23' || selectedVolume.id === 'V11B') ? (
                              <pre className="whitespace-pre-wrap font-sans text-xs bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-inner">
                                {selectedVolume.id === 'V12_CH23' ? FMR_V12_CH23_CONTENT : FMR_V11B_CH11_CONTENT}
                              </pre>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
                                <Library size={48} className="opacity-10 mb-4" />
                                <p className="font-sans text-xs uppercase tracking-widest font-bold">Content Pending Digitization</p>
                              </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-3xl mx-auto">
                             <div className="flex flex-col items-center justify-center py-20 text-zinc-300 border-2 border-dashed border-zinc-100 rounded-3xl">
                                <Code2 size={48} className="opacity-10 mb-4" />
                                <p className="font-sans text-xs uppercase tracking-widest font-bold">Logic Scenarios Unavailable</p>
                              </div>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 animate-in fade-in h-full flex flex-col bg-[#fafafa]">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h2 className="text-3xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                 <Library size={32} className="text-rose-700" /> DoD FMR Policy Portal
              </h2>
              <p className="text-zinc-500 text-xs mt-2 font-medium tracking-wide">Authoritative Regulatory Library</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group flex-1">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search library..." 
                   value={searchTerm} 
                   onChange={(e) => setSearchTerm(e.target.value)} 
                   className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium w-full sm:w-72 focus:outline-none focus:border-rose-400 transition-all shadow-sm" 
                 />
              </div>
           </div>
        </div>

        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0">
           {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg' 
                  : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
           ))}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${isPending ? 'opacity-40' : 'opacity-100'}`}>
           {filteredVolumes.map((vol) => (
              <VolumeCard key={vol.id} vol={vol} onClick={setSelectedVolume} />
           ))}
        </div>
      </div>
    </div>
  );
};

export default GovernanceView;