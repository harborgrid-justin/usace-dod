import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { FileSignature, Plus, Search, Calendar, DollarSign, Archive, Filter } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { Outgrant } from '../../types';
import { remisService } from '../../services/RemisDataService';
import OutgrantForm from './OutgrantForm';
import OutgrantDetail from './OutgrantDetail';
import { REMIS_THEME } from '../../constants';

const OutgrantManager: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [outgrants, setOutgrants] = useState<Outgrant[]>(remisService.getOutgrants());
    const [selectedOutgrantId, setSelectedOutgrantId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setOutgrants([...remisService.getOutgrants()]);
        });
        return unsubscribe;
    }, []);

    const selectedOutgrant = useMemo(() => 
        outgrants.find(o => o.id === selectedOutgrantId),
    [outgrants, selectedOutgrantId]);

    const filtered = useMemo(() => outgrants.filter(o => {
        const matchesSearch = o.grantee.toLowerCase().includes(deferredSearch.toLowerCase()) || o.id.toLowerCase().includes(deferredSearch.toLowerCase());
        const matchesArchive = showArchived ? true : o.status !== 'Archived';
        return matchesSearch && matchesArchive;
    }), [outgrants, deferredSearch, showArchived]);

    const handleCreate = (newGrant: Outgrant) => {
        remisService.addOutgrant(newGrant);
        setIsFormOpen(false);
    };

    const handleUpdate = (updated: Outgrant) => {
        remisService.updateOutgrant(updated);
        setSelectedOutgrantId(updated.id);
    };

    if (selectedOutgrant) {
        return (
            <OutgrantDetail 
                outgrant={selectedOutgrant} 
                onBack={() => setSelectedOutgrantId(null)} 
                onUpdate={handleUpdate} 
            />
        );
    }

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden animate-in fade-in">
             <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <FileSignature size={16} className={REMIS_THEME.classes.iconColor}/> Outgrants & Revenue
                    </h3>
                    <p className="text-xs text-zinc-500">10 U.S.C. 2667 • Management of Public Lands</p>
                </div>
                <div className="flex gap-2 items-center w-full md:w-auto">
                     <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Filter by grantee..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`w-full sm:w-48 pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${REMIS_THEME.classes.inputFocus}`}
                        />
                    </div>
                    <button onClick={() => setIsFormOpen(true)} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Plus size={14}/> New Outgrant
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lease No. / Grantee</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type / Location</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Annual Rent</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filtered.map(grant => (
                            <tr key={grant.id} onClick={() => setSelectedOutgrantId(grant.id)} className={`${REMIS_THEME.classes.tableRowHover} transition-colors cursor-pointer group`}>
                                <td className="p-4">
                                    <p className="text-xs font-bold text-zinc-800 group-hover:text-emerald-800 transition-colors">{grant.grantee}</p>
                                    <p className="text-[10px] font-mono text-zinc-500">{grant.id}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-xs text-zinc-800">{grant.type}</p>
                                    <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{grant.location}</p>
                                </td>
                                <td className="p-4 text-right text-xs font-mono font-bold text-zinc-900">
                                    {formatCurrency(grant.annualRent)}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                        grant.status === 'Active' ? REMIS_THEME.classes.statusActive : REMIS_THEME.classes.badge.warning
                                    }`}>{grant.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isFormOpen && <OutgrantForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />}
        </div>
    );
};

export default OutgrantManager;