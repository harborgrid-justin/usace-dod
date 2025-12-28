import React from 'react';
import { VersionEntry } from '../../types';
import { History, User } from 'lucide-react';

interface Props {
    history: VersionEntry<any>[];
}

const VersionHistoryViewer: React.FC<Props> = ({ history }) => {
    if (!history || history.length === 0) {
        return <div className="text-center text-xs text-zinc-400 p-8">No version history available for this record.</div>;
    }

    return (
        <div className="space-y-6 relative animate-in fade-in">
            <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-zinc-100" />
            
            {history.map((entry, index) => (
                <div key={index} className="flex items-start gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-4 border-zinc-100 flex items-center justify-center shrink-0 mt-1">
                        <History size={16} className="text-zinc-400" />
                    </div>
                    <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-zinc-800">Version {history.length - index}</p>
                            <p className="text-[10px] font-mono text-zinc-400">{new Date(entry.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Changes saved by user: <span className="font-bold text-zinc-700">{entry.user}</span></p>
                        {/* A more advanced version would diff the snapshot with the previous one */}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VersionHistoryViewer;