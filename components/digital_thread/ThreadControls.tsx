
import React from 'react';
import { Search } from 'lucide-react';
import { DigitalThread } from '../../types';

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredThreads: DigitalThread[];
  selectedThreadId: string | null;
  onSelect: (id: string) => void;
}

const ThreadControls: React.FC<Props> = ({ searchTerm, setSearchTerm, filteredThreads, selectedThreadId, onSelect }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between shrink-0 gap-4 bg-white p-4 rounded-xl border border-zinc-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
    <div className="relative w-full sm:w-96 group">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
      <input 
        type="text" 
        placeholder="Search threads (ID, Vendor, Appropriation)..." 
        className="w-full bg-zinc-50 hover:bg-white border border-zinc-200 rounded-lg py-2 pl-9 pr-3 text-xs font-medium text-zinc-800 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all placeholder:text-zinc-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <div className="flex gap-2 self-start sm:self-center overflow-x-auto custom-scrollbar w-full sm:w-auto">
      {filteredThreads.slice(0, 5).map(t => (
        <button 
          key={t.id} 
          onClick={() => onSelect(t.id)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-medium border transition-all whitespace-nowrap ${selectedThreadId === t.id ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'}`}
        >
          {t.id}
        </button>
      ))}
    </div>
  </div>
);

export default ThreadControls;
