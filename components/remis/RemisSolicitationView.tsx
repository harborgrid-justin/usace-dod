import React, { useState, useEffect } from 'react';
import { Hammer, Search, Plus } from 'lucide-react';
import { Solicitation } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { REMIS_THEME } from '../../constants';
import RemisSolicitationForm from './RemisSolicitationForm';
import RemisSolicitationDetail from './RemisSolicitationDetail';

interface Props {
    selectedSolicitationId?: string | null;
    onNavigateToAsset: (assetId: string) => void;
}

const RemisSolicitationView: React.FC<Props> = ({ selectedSolicitationId: initialId, onNavigateToAsset }) => {
    const [solicitations, setSolicitations] = useState<Solicitation[]>(remisService.getSolicitations());
    const [selectedSol, setSelectedSol] = useState<Solicitation | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (initialId) {
            const sol = remisService.getSolicitations().find(s => s.id === initialId);
            setSelectedSol(sol || null);
        }
    }, [initialId]);
    
    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            const updatedSolicitations = remisService.getSolicitations();
            setSolicitations(updatedSolicitations);
            if (selectedSol) {
                const updatedSelected = updatedSolicitations.find(s => s.id === selectedSol.id);
                setSelectedSol(updatedSelected || null);
            }
        });
        return unsubscribe;
    }, [selectedSol]);

    const handleCreate = (newSol: Solicitation) => {
        // Fix: Changed from acquisitionService to remisService to use the correct domain service.
        remisService.addSolicitation(newSol);
        setIsFormOpen(false);
    };

    const handleUpdate = (updated: Solicitation) => {
        remisService.updateSolicitation(updated);
    };
    
    const filtered = solicitations.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedSol) {
        return <RemisSolicitationDetail solicitation={selectedSol} onBack={() => setSelectedSol(null)} onUpdate={handleUpdate} />;
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white border border-zinc-200 rounded-xl shadow-sm">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <Hammer size={16} className={REMIS_THEME.classes.iconColor}/> Real Property Solicitations
                    </h3>
                    <p className="text-xs text-zinc-500">Public Sale of Excess Real Property</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full md:w-auto">
                     <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Search by title or ID..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`w-full sm:w-64 pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none ${REMIS_THEME.classes.inputFocus}`}
                        />
                    </div>
                    <button onClick={() => setIsFormOpen(true)} className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors w-full sm:w-auto ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Plus size={12}/> New Solicitation
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(sol => (
                        <div key={sol.id} onClick={() => setSelectedSol(sol)} className={`bg-white border border-zinc-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group ${REMIS_THEME.classes.cardHover}`}>
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-50 px-2 py-1 rounded">{sol.id}</span>
                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${REMIS_THEME.classes.badge.info}`}>{sol.type}</span>
                            </div>
                            <h4 className="text-sm font-bold text-zinc-900 mb-2 truncate group-hover:text-emerald-800">{sol.title}</h4>
                            <p className="text-xs text-zinc-500 mb-4">Asset ID: {sol.assetId}</p>
                            <div className="border-t border-zinc-100 pt-3 flex justify-between items-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${sol.status === 'Active Solicitation' ? REMIS_THEME.classes.statusActive : REMIS_THEME.classes.badge.warning}`}>
                                    {sol.status}
                                </span>
                                <span className="text-xs text-zinc-500">{sol.quotes.length} Bids</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isFormOpen && (
                <RemisSolicitationForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />
            )}
        </div>
    );
};

export default RemisSolicitationView;