import React from 'react';
import { ChevronRight, Home, LayoutGrid } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-3 animate-in fade-in">
      <div className="p-1 bg-zinc-100 rounded text-zinc-400 mr-1"><LayoutGrid size={10} /></div>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={10} className="text-zinc-200 mx-0.5" />}
          <button 
            onClick={item.onClick}
            disabled={!item.onClick}
            className={`${item.onClick ? 'hover:text-rose-700 cursor-pointer transition-colors' : 'text-zinc-500 cursor-default'}`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;