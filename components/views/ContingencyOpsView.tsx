
import React, { useState, useMemo, useTransition } from 'react';
import { Globe, Users, FileText, Search, Plus, ShieldAlert, Activity, Navigation, MapPin } from 'lucide-react';
import { MOCK_CONTINGENCY_OPERATIONS } from '../../constants';
import OperationDetailPanel from '../contingency/OperationDetailPanel';
import EmptyState from '../shared/EmptyState';
import Badge from '../shared/Badge';

const ContingencyOpsView: React.FC<any> = ({ selectedContingencyOpId, setSelectedContingencyOpId, onSelectThread }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();
    
    const filteredOps = useMemo(() => 
        MOCK_CONTINGENCY_OPERATIONS.filter(op => 
            op.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            op.id.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [searchTerm]);

    const selectedOp = useMemo(() => 
        MOCK_CONTINGENCY_OPERATIONS.find(op => op.id === selectedContingencyOpId), 
    [selectedContingencyOpId]);

    const handleSelectOp = (id: string) => {
        startTransition(() => {
            setSelectedContingencyOpId(id);
        });
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/50 overflow-hidden">
            <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Globe size={28} className="text-rose-700" /> Operational Context
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">OCO Funding (Vol 12, Ch 23) • Incremental Cost Management</p>
                </div>
                <button className="px-6 py-2.5 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-xl transition-all active:scale-95 flex items-center gap-3">
                    <Plus size={16}/> Declare Contingency
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
                {/* Left Rail: Mission Roster */}
                <div className="lg:col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">
                    <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm shrink-0">
                        <div className="relative group">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search EXORD or Mission..." 
                                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs focus:outline-none focus:border-rose-300 transition-all" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                        {filteredOps.map(op => (
                            <button 
                                key={op.id} 
                                onClick={() => handleSelectOp(op.id)} 
                                className={`w-full text-left p-5 rounded-[24px] border transition-all relative group ${
                                    selectedContingencyOpId === op.id 
                                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.02] z-10' 
                                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-rose-200 hover:shadow-md'
                                }`}
                            >
                                <div className="flex justify-between mb-4 items-start">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${
                                        selectedContingencyOpId === op.id ? 'bg-white/10 border-white/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                    }`}>{op.status}</span>
                                    <span className={`text-[9px] font-mono font-bold uppercase opacity-60 ${selectedContingencyOpId === op.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{op.type}</span>
                                </div>
                                <p className="font-black text-sm uppercase tracking-tight truncate leading-none mb-2">{op.name}</p>
                                <div className="flex items-center gap-2 text-[10px] font-medium opacity-60">
                                    <MapPin size={10} />
                                    <span className="truncate">{op.location}</span>
                                </div>
                                
                                {selectedContingencyOpId === op.id && (
                                    <div className="absolute right-4 bottom-4 animate-in slide-in-from-left-2">
                                        <Activity size={18} className="text-emerald-500 animate-pulse" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Detail Workspace */}
                <div className={`lg:col-span-9 bg-white border border-zinc-200 rounded-[40px] shadow-sm flex flex-col overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                    {selectedOp ? (
                        <OperationDetailPanel operation={selectedOp} onSelectThread={onSelectThread} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-6 p-12">
                            <div className="p-10 bg-zinc-50 rounded-full border-2 border-dashed border-zinc-200">
                                <Globe size={64} className="opacity-10" />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-lg font-bold text-zinc-900 uppercase tracking-widest">Awaiting Mission Selection</h4>
                                <p className="text-sm max-w-sm mx-auto leading-relaxed">Select a validated mission from the roster to monitor OCO fund distributions and incremental cost reporting.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <ShieldAlert size={14}/> FMR Vol 12, Ch 23
                                </div>
                                <div className="w-px h-4 bg-zinc-200" />
                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <Navigation size={14}/> 100% EXORD Linked
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContingencyOpsView;
