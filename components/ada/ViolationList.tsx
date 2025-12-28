import React from 'react';
import { ADAViolation } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { ADAViolationStatusBadge } from '../shared/StatusBadges';

interface Props {
    violations: ADAViolation[];
    selectedId?: string;
    onSelect: (v: ADAViolation) => void;
}

const ViolationList: React.FC<Props> = ({ violations, selectedId, onSelect }) => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {violations.map(v => (
                <button 
                    key={v.id}
                    onClick={() => onSelect(v)}
                    className={`w-full text-left p-4 border-b border-zinc-50 transition-all group ${
                        selectedId === v.id 
                        ? 'bg-rose-50/50 border-rose-100' 
                        : 'bg-white hover:bg-zinc-50'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-zinc-500">{v.id}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{v.discoveryDate}</span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-800 mb-2 line-clamp-1 group-hover:text-rose-700 transition-colors">
                        {v.type.split(' - ')[1]}
                    </h4>
                    <div className="flex justify-between items-center mt-3">
                        <ADAViolationStatusBadge status={v.status} />
                        <span className="text-xs font-mono font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">
                            {formatCurrency(v.amount)}
                        </span>
                    </div>
                </button>
            ))}
            {violations.length === 0 && (
                <div className="p-12 text-center text-zinc-400 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest">No Violations Found</p>
                    <p className="text-[10px] leading-relaxed">System state consistent with authorized authority.</p>
                </div>
            )}
        </div>
    );
};

export default ViolationList;