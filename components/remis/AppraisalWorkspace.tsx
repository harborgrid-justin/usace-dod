
import React, { useState, useEffect, useMemo, useDeferredValue, useTransition, useCallback } from 'react';
import { Scale, Search, Plus, Eye, EyeOff, FileText, Lock, CheckCircle2, History, ArrowRight } from 'lucide-react';
import { AppraisalRecord } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';
import { useService } from '../../hooks/useService';
import AppraisalForm from './AppraisalForm';
import AppraisalDetail from './AppraisalDetail';

const AppraisalWorkspace: React.FC = () => {
    const records = useService<AppraisalRecord[]>(remisService, useCallback(() => remisService.getAppraisals(), []));
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'detail' | 'form'>('list');
    const [unmaskedIds, setUnmaskedIds] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();

    const toggleMask = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setUnmaskedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filtered = useMemo(() => records.filter(r => 
        r.appraiserName.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        r.assetId.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        r.id.toLowerCase().includes(deferredSearch.toLowerCase())
    ), [records, deferredSearch]);

    const selectedRecord = useMemo(() => 
        records.find(r => r.id === selectedId),
    [records, selectedId]);

    const handleCreate = (record: AppraisalRecord) => {
        remisService.addAppraisal(record);
        setView('list');
    };

    const handleUpdate = (updated: AppraisalRecord) => {
        remisService.updateAppraisal(updated);
    };

    if (view === 'form') return <AppraisalForm onClose={() => setView('list')} onSubmit={handleCreate} />;
    if (view === 'detail' && selectedRecord) return <AppraisalDetail record={selectedRecord} onBack={() => {setSelectedId(null); setView('list');}} onUpdate={handleUpdate} />;

    return (
        <div className={`flex flex-col h-full bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <Scale size={16} className={REMIS_THEME.classes.iconColor}/> Appraisal Management Center
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">Uniform Standards (UASFLA) • Yellow Book Compliance</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Filter by RPUID..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`w-full sm:w-64 pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${REMIS_THEME.classes.inputFocus}`}
                        />
                    </div>
                    <button onClick={() => setView('form')} className={`flex items-center justify-center gap-2 px-6 py-2 rounded-sm text-[10px] font-bold uppercase transition-all shadow-sm ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Plus size={14}/> Initiate Valuation
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10">
                        <tr>
                            <th className="p-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID / Asset</th>
                            <th className="p-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Standard</th>
                            <th className="p-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                            <th className="p-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Appraiser</th>
                            <th className="p-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Market Value</th>
                            <th className="p-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Status</th>
                            <th className="p-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filtered.map(record => (
                            <tr key={record.id} onClick={() => { setSelectedId(record.id); setView('detail'); }} className="hover:bg-zinc-50/50 transition-colors group cursor-pointer">
                                <td className="p-5">
                                    <p className="text-xs font-bold text-zinc-900">{record.id}</p>
                                    <p className="text-[10px] font-mono text-zinc-500 mt-1">{record.assetId}</p>
                                </td>
                                <td className="p-5"><span className="text-[10px] bg-zinc-100 px-2 py-1 rounded-sm border font-medium text-zinc-600">{record.standard}</span></td>
                                <td className="p-5 text-xs text-zinc-500 font-mono">{record.valuationDate}</td>
                                <td className="p-5 text-xs font-bold text-zinc-700">{record.appraiserName}</td>
                                <td className="p-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <p className={`font-mono text-xs font-bold ${unmaskedIds.has(record.id) ? 'text-zinc-900' : 'text-zinc-200 select-none blur-[2px]'}`}>
                                            {unmaskedIds.has(record.id) ? formatCurrency(record.marketValue) : '$0,000,000.00'}
                                        </p>
                                        <button onClick={(e) => toggleMask(e, record.id)} className="p-1 text-zinc-300 hover:text-zinc-900 transition-colors">
                                            {unmaskedIds.has(record.id) ? <EyeOff size={12}/> : <Eye size={12}/>}
                                        </button>
                                    </div>
                                </td>
                                <td className="p-5 text-center">
                                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border ${record.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{record.status}</span>
                                </td>
                                <td className="p-5 text-right"><ArrowRight size={16} className="text-zinc-200 group-hover:text-emerald-600 transition-all ml-auto"/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppraisalWorkspace;
