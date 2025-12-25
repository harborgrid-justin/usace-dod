
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
                    className={`w-full text-left p-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${selectedId === v.id ? 'bg-zinc-100 border-l-4 border-l-zinc-900' : 'border-l-4 border-l-transparent'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono font-bold text-zinc-500">{v.id}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{v.discoveryDate}</span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-800 mb-1 line-clamp-1">{v.type.split(' - ')[1]}</h4>
                    <div className="flex justify-between items-center mt-2">
                        <ADAViolationStatusBadge status={v.status} />
                        <span className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(v.amount)}</span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ViolationList;
