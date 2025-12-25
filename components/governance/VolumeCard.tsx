
import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { FMRVolume } from '../../types';

interface Props {
  vol: FMRVolume;
  onClick: (vol: FMRVolume) => void;
}

const VolumeCard: React.FC<Props> = ({ vol, onClick }) => (
  <div 
     onClick={() => onClick(vol)}
     className="bg-white border border-zinc-200 rounded-xl p-5 hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer group flex flex-col h-48"
  >
     <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-lg ${
           vol.category === 'Budget' ? 'bg-emerald-50 text-emerald-600' :
           vol.category === 'Pay' ? 'bg-blue-50 text-blue-600' :
           vol.category === 'Accounting' ? 'bg-purple-50 text-purple-600' :
           'bg-zinc-100 text-zinc-600'
        }`}>
           <FileText size={18} />
        </div>
        <span className="text-[10px] font-mono font-bold text-zinc-400">{vol.sizeMB} MB</span>
     </div>
     
     <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{vol.volume}</h4>
     <h3 className="text-sm font-semibold text-zinc-900 leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
        {vol.title}
     </h3>
     
     <div className="mt-auto pt-3 border-t border-zinc-50 flex justify-between items-center">
        <span className="text-[10px] font-medium text-zinc-400">{vol.pages} Pages</span>
        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-900 uppercase opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
           Open Platform <ChevronRight size={12} />
        </div>
     </div>
  </div>
);

export default VolumeCard;
