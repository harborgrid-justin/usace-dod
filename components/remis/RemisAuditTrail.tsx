import React from 'react';
import { AuditLogEntry } from '../../types';
import { History, User, Shield, Info } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatting';

interface Props {
    log: AuditLogEntry[];
}

const RemisAuditTrail: React.FC<Props> = ({ log }) => {
    return (
        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 animate-in fade-in">
            {log.length > 0 ? [...log].reverse().map((entry, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-xl group hover:border-zinc-200 transition-all">
                    <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0">
                        <History size={16}/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-zinc-900 uppercase tracking-tight">{entry.action}</p>
                            <p className="text-[10px] font-mono text-zinc-400">{formatRelativeTime(entry.timestamp)}</p>
                        </div>
                        {entry.details && <p className="text-xs text-zinc-600 mt-1 italic">"{entry.details}"</p>}
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-zinc-100/50">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase">
                                <User size={10}/> {entry.user}
                            </div>
                            <span className="text-zinc-200">|</span>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase">
                                <Shield size={10}/> {entry.organization || 'REMIS_INTERNAL'}
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-10 text-zinc-400 flex flex-col items-center">
                    <Info size={32} className="opacity-10 mb-2"/>
                    <p className="text-xs font-medium">No system events recorded for this entity.</p>
                </div>
            )}
        </div>
    );
};

export default RemisAuditTrail;