
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-2">
      <Home size={10} className="text-zinc-400" />
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="text-zinc-300" />
          <button 
            onClick={item.onClick}
            disabled={!item.onClick}
            className={`${item.onClick ? 'hover:text-zinc-900 cursor-pointer' : 'text-zinc-800 cursor-default'} transition-colors`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
