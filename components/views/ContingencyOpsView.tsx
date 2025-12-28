
import React, { useState, useMemo } from 'react';
import { Globe, Users, FileText } from 'lucide-react';
import { MOCK_CONTINGENCY_OPERATIONS } from '../../constants';
import OperationDetailPanel from '../contingency/OperationDetailPanel';
import EmptyState from '../shared/EmptyState';

const ContingencyOpsView: React.FC<any> = ({ selectedContingencyOpId, setSelectedContingencyOpId, onSelectThread }) => {
    const selectedOp = useMemo(() => MOCK_CONTINGENCY_OPERATIONS.find(op => op.id === selectedContingencyOpId), [selectedContingencyOpId]);

    return (
        <div className="p-8 space-y-6 animate-in h-full flex flex-col overflow-hidden">
            <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3"><Globe size={24} className="text-zinc-400" /> Contingency Operations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
                <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                    {MOCK_CONTINGENCY_OPERATIONS.map(op => (
                        <button key={op.id} onClick={() => setSelectedContingencyOpId(op.id)} className={`p-4 rounded-xl border text-left transition-all group ${selectedContingencyOpId === op.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                            <div className="flex justify-between mb-2"><span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-white/20">{op.status}</span><span className="text-[10px] opacity-60 uppercase">{op.type}</span></div>
                            <p className="font-bold mb-1 truncate">{op.name}</p><p className="text-xs opacity-60 truncate">{op.location}</p>
                        </button>
                    ))}
                </div>
                <div className="lg:col-span-9 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    {selectedOp ? <OperationDetailPanel operation={selectedOp} onSelectThread={onSelectThread} /> : <EmptyState icon={Globe} title="Operational Context" description="Select a mission to view OCO funding and execution status." />}
                </div>
            </div>
        </div>
    );
};
export default ContingencyOpsView;
