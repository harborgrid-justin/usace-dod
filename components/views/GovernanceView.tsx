
import React, { useState, useMemo } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { DOD_FMR_VOLUMES } from '../../constants';
import { FMRVolume } from '../../types';
import VolumeCard from '../governance/VolumeCard';
import VolumeDetail from '../governance/VolumeDetail';

const GovernanceView: React.FC = () => {
  const [selectedVolume, setSelectedVolume] = useState<FMRVolume | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Budget', 'Accounting', 'Pay', 'Funds', 'Policy', 'Debt'];

  const filteredVolumes = useMemo(() => {
    return DOD_FMR_VOLUMES.filter(vol => {
      const matchesCategory = activeCategory === 'All' || vol.category === activeCategory;
      const matchesSearch = vol.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            vol.volume.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a,b) => a.volume.localeCompare(b.volume));
  }, [activeCategory, searchTerm]);

  if (selectedVolume) {
    return (
      <div className="p-4 sm:p-8 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
        <VolumeDetail volume={selectedVolume} onBack={() => setSelectedVolume(null)} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 animate-in h-full flex flex-col max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
         <div>
            <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
               <BookOpen size={24} className="text-zinc-400" /> DoD FMR Library
            </h2>
            <p className="text-zinc-500 text-xs mt-2 font-medium">DoD 7000.14-R • Financial Management Regulation</p>
         </div>
         <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
               <input type="text" placeholder="Search volumes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-medium w-full sm:w-64 focus:outline-none focus:border-zinc-400 transition-all" />
            </div>
         </div>
      </div>

      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-4 mb-2 shrink-0">
         {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900'}`}>
               {cat}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pr-2 pb-2">
         {filteredVolumes.map((vol) => (
            <VolumeCard key={vol.id} vol={vol} onClick={setSelectedVolume} />
         ))}
      </div>
    </div>
  );
};

export default GovernanceView;
