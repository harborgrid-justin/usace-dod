
import React from 'react';
import { AuditLogEntry } from '../../types';
import { History, User, Shield, Info, CheckCircle2 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatting';

interface Props {
    log: AuditLogEntry[];
}

const RemisAuditTrail: React.FC<Props> = ({ log }) => {
    return (
        <div className="space-y-6 relative animate-in fade-in">
            {log.length > 0 ? (
                <>
                    <div className="absolute top-4 bottom-4 left-[19px] w-px bg-zinc-100" />
                    {[...log].reverse().map((entry, idx) => (
                        <div key={idx} className="flex items-start gap-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center shrink-0">
                                <History size={16} className="text-zinc-400"/>
                            </div>
                            <div className="flex-1 bg-zinc-50/50 border border-zinc-100 rounded-3xl p-5 hover:border-zinc-200 transition-all group">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-bold text-zinc-900 uppercase tracking-tight">{entry.action}</p>
                                    <p className="text-[10px] font-mono text-zinc-400">{formatRelativeTime(entry.timestamp)}</p>
                                </div>
                                {entry.details && <p className="text-xs text-zinc-500 leading-relaxed italic">"{entry.details}"</p>}
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-100">
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase">
                                        <User size={10}/> {entry.user}
                                    </div>
                                    <span className="text-zinc-200">•</span>
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase">
                                        <Shield size={10}/> {entry.organization || 'REMIS_INTERNAL'}
                                    </div>
                                    <div className="ml-auto flex items-center gap-1 text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle2 size={10}/> VERIFIED
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className="text-center py-20 text-zinc-400 flex flex-col items-center">
                    <div className="p-6 bg-zinc-50 rounded-full border border-dashed border-zinc-200 mb-4">
                        <Info size={32} className="opacity-10"/>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest">No Fiduciary Events Recorded</p>
                    <p className="text-[10px] max-w-xs mt-2 leading-relaxed">This entity is currently in its initial state with no logged modifications.</p>
                </div>
            )}
        </div>
    );
};

export default RemisAuditTrail;
