import React from 'react';
import { FileSearch, ShieldCheck, RefreshCw, AlertTriangle, Database } from 'lucide-react';
import { RemoteData } from '../../../types';
import EmptyState from '../../shared/EmptyState';

interface Props {
    state: RemoteData<string>;
    onRun: () => void;
}

const ForensicScrubber: React.FC<Props> = ({ state, onRun }) => (
    <div className="flex-1 bg-white rounded-3xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden animate-in">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <div>
                <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3"><FileSearch size={20} className="text-rose-700"/> Integrity Scrubber</h3>
            </div>
            <button onClick={onRun} disabled={state.status === 'LOADING'} className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                {state.status === 'LOADING' ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14}/>}
                Initiate Domain Audit
            </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {state.status === 'SUCCESS' ? (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[32px] flex gap-5 items-start">
                    <AlertTriangle size={24} className="text-rose-600 mt-1" />
                    <div><h4 className="font-bold text-rose-900">Findings</h4><div className="mt-4 text-sm text-rose-800 leading-relaxed whitespace-pre-wrap">{state.data}</div></div>
                </div>
            ) : state.status === 'LOADING' ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-400"><Database size={48} className="animate-pulse"/><p className="text-sm font-bold uppercase">Scanning Ledgers...</p></div>
            ) : (
                <EmptyState title="Forensic Engine Ready" description="Execute a targeted forensic scan to identify statutory compliance gaps." icon={FileSearch} />
            )}
        </div>
    </div>
);
export default ForensicScrubber;