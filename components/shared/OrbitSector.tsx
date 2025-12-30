
import React from 'react';

interface OrbitSectorProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

const OrbitSector: React.FC<OrbitSectorProps> = ({ title, icon: Icon, children, colorClass, bgClass }) => (
  <div className="flex flex-col gap-2 p-4 h-full border-r border-dashed border-zinc-200 last:border-r-0 relative group">
    <div className={`flex items-center gap-2 mb-3 opacity-60 group-hover:opacity-100 transition-opacity`}>
       <Icon size={14} className={colorClass.replace('text-', 'text-opacity-80 text-')} />
       <h4 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{title}</h4>
    </div>
    <div className="space-y-1 relative z-10">
      {children}
    </div>
    {/* Subtle gradient at bottom to indicate section */}
    <div className={`absolute bottom-0 left-0 right-0 h-[1px] ${bgClass.replace('bg-', 'bg-gradient-to-r from-transparent via-') .replace('/50', '-500/20')} to-transparent`} />
  </div>
);

export default OrbitSector;
