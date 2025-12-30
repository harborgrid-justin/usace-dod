
import React, { useState, useMemo, useDeferredValue, useTransition } from 'react';
import { Library, Search, Filter, BookOpen, Clock, ShieldCheck, Database } from 'lucide-react';
import { DOD_FMR_VOLUMES } from '../../constants';
import { FMRVolume } from '../../types';
import VolumeCard from '../governance/VolumeCard';
import VolumeDetail from '../governance/VolumeDetail';

const GovernanceView: React.FC = () => {
  const [selectedVolume, setSelectedVolume] = useState<FMRVolume | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
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

  if (selectedVolume) {
    return <VolumeDetail volume={selectedVolume} onBack={() => setSelectedVolume(null)} />;
  }

  return (
    <div className="p-4 sm:p-8 animate-in fade-in h-full flex flex-col bg-zinc-50/30 overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col h-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
           <div>
              <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                <Library size={32} className="text-rose-700" /> Regulatory Gateway
              </h2>
              <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-widest">Authoritative DoD 7000.14-R (FMR) Repository</p>
           </div>
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative group flex-1 md:flex-none">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                  <input 
                    type="text" 
                    placeholder="Search regulation titles, volumes, or logic tags..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs font-medium w-full sm:w-80 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all shadow-sm" 
                  />
              </div>
              <button className="p-2.5 bg-white border border-zinc-200 rounded-2xl text-zinc-400 hover:text-zinc-900 shadow-sm transition-all">
                <Filter size={20}/>
              </button>
           </div>
        </div>

        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0">
            {categories.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)} 
                    className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap border shadow-sm ${
                        activeCategory === cat 
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg' 
                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-12">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                {filteredVolumes.map((vol) => (
                    <VolumeCard key={vol.id} vol={vol} onClick={setSelectedVolume} />
                ))}
                
                <div className="p-8 rounded-[40px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center gap-4 bg-white/50 opacity-60">
                    <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-400"><Clock size={24}/></div>
                    <div>
                        <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Expansion in Progress</h5>
                        <p className="text-[10px] text-zinc-400 mt-1">Remaining FMR Volumes are being digitized for real-time inference.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="shrink-0 flex items-center gap-6 px-6 py-3 bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-800">
            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                <Database size={12}/> Repository Version: <span className="text-white">v4.12.24</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-auto">
                <ShieldCheck size={12} className="text-emerald-500"/> Authoritative Source Verified
            </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceView;
