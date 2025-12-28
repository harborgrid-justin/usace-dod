import React from 'react';
import { AssetHistoryEvent } from '../../types';
import { History, User, Edit, PlayCircle, PlusCircle, Trash2 } from 'lucide-react';

interface Props {
    log: AssetHistoryEvent[];
}

const eventIcons: Record<string, React.ElementType> = {
    'Asset Acquired': PlusCircle,
    'Status Change': Edit,
    'Component Added': PlusCircle,
    'Asset disposed': Trash2,
    'Asset Placed in Service': PlayCircle,
};

const AssetHistoryLog: React.FC<Props> = ({ log }) => {
    return (
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
            {log.map((entry, index) => {
                const Icon = Object.keys(eventIcons).find(key => entry.event.includes(key)) 
                    ? eventIcons[Object.keys(eventIcons).find(key => entry.event.includes(key))!] 
                    : History;
                
                return (
                    <div key={index} className="flex items-start gap-3">
                        <div className="p-2 bg-zinc-100 rounded-full border border-zinc-200 text-zinc-500 mt-1">
                            <Icon size={14} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold text-zinc-800">{entry.event}</p>
                                <p className="text-[10px] font-mono text-zinc-400">{new Date(entry.timestamp).toLocaleString()}</p>
                            </div>
                            <p className="text-xs text-zinc-600 mt-1">{entry.details}</p>
                            <div className="flex items-center gap-1 text-xs text-zinc-400 mt-2">
                                <User size={12}/>
                                <span>{entry.user}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AssetHistoryLog;