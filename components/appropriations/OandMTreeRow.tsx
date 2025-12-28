
import React from 'react';
import { ChevronDown, Info, Edit } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

const OandMTreeRow: React.FC<any> = ({ item, level, expanded, onToggle, onSelect, onPropose }) => {
    const isExpanded = !!expanded[item.id];
    const children = item.activityGroups || item.subActivityGroups;
    const isSag = 'budget' in item;

    return (
        <React.Fragment>
            <tr className={`group border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors ${isSag ? 'bg-white' : 'bg-zinc-50/20'}`}>
                <td className="p-3 text-xs font-medium text-zinc-800" style={{ paddingLeft: `${level * 1.5}rem` }}>
                    <div className="flex items-center gap-2">
                        {!isSag ? <button onClick={() => onToggle(item.id)}><ChevronDown size={14} className={isExpanded ? '' : '-rotate-90'}/></button> : <div className="w-5"/>}
                        <span className={!isSag ? 'font-bold uppercase tracking-tight' : ''}>{item.name}</span>
                    </div>
                </td>
                <td className="p-3 text-xs font-mono text-zinc-800 text-right">{formatCurrency(isSag ? item.budget : 5000000)}</td>
                <td className="p-3 text-center">
                    {isSag && <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => onSelect(item)} className="text-zinc-400 hover:text-zinc-800"><Info size={14}/></button><button onClick={() => onPropose(item)} className="text-zinc-400 hover:text-zinc-800"><Edit size={14}/></button></div>}
                </td>
            </tr>
            {isExpanded && children?.map((child: any) => <OandMTreeRow key={child.id} item={child} level={level + 1} expanded={expanded} onToggle={onToggle} onSelect={onSelect} onPropose={onPropose} />)}
        </React.Fragment>
    );
};
export default OandMTreeRow;
