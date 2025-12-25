import React, { useState } from 'react';

interface EntityNodeProps {
  label: string;
  value: string | number | boolean;
  icon: React.ElementType;
  fieldKey: string;
  isAlert?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}

const EntityNode: React.FC<EntityNodeProps> = ({ label, value, icon: Icon, fieldKey, isAlert, highlight, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Flat, technical design
  const baseClasses = `group relative p-3 rounded-lg border transition-all duration-200 overflow-hidden`;
  
  // Ghost effects for state
  const stateClasses = isHovered 
    ? 'border-zinc-300 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]' 
    : isAlert 
    ? 'border-rose-200 bg-rose-50/30'
    : highlight
    ? 'border-emerald-200 bg-emerald-50/30'
    : 'border-transparent bg-transparent hover:border-zinc-200';
    
  const clickableClasses = onClick ? 'cursor-pointer' : 'cursor-help';

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${clickableClasses}`}
    >
      <div className="flex items-center justify-between mb-1">
         <span className={`text-[9px] font-medium uppercase tracking-wider ${isAlert ? 'text-rose-500' : 'text-zinc-400'}`}>
           {label}
         </span>
         <Icon size={12} className={isAlert ? 'text-rose-500' : highlight ? 'text-emerald-600' : 'text-zinc-300 group-hover:text-zinc-500 transition-colors'} />
      </div>
      <p className={`text-[11px] font-mono truncate tracking-tight ${isAlert ? 'text-rose-700 font-bold' : 'text-zinc-700 font-medium'}`}>
        {typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}
      </p>
      
      {/* Ghost highlight line on left */}
      {highlight && <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-emerald-500/50 rounded-r-full" />}
      {isAlert && <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-rose-500/50 rounded-r-full" />}
    </div>
  );
};

export default EntityNode;