
import React, { useState, useEffect } from 'react';
import { PieChart, Plus, Search, Scale } from 'lucide-react';
import { CostShareRecord, CostShareStatus } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { formatCurrency } from '../../utils/formatting';
import CostShareForm from './CostShareForm';
import CostShareDetail from './CostShareDetail';
import { REMIS_THEME } from '../../constants';

const CostShareManager: React.FC = () => {
    const [records, setRecords] = useState<CostShareRecord[]>(remisService.getCostShares());
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<CostShareRecord | null>(null);

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setRecords([...remisService.getCostShares()]);
        });
        return unsubscribe;
    }, []);

    const filtered = records.filter(r => 
        r.sponsorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.projectOrAssetId.includes(searchTerm)
    );

    const handleCreate = (newRecord: CostShareRecord) => {
        remisService.addCostShare(newRecord);
        setIsFormOpen(false);
    };

    const handleUpdate = (updated: CostShareRecord) => {
        remisService.updateCostShare(updated);
        setSelectedRecord(updated);
    };

    const handleAdjustment = (id: string, adj: any) => {
        remisService.addCostShareAdjustment(id, adj);
        // Refresh selected record
        const updated = remisService.getCostShares().find(r => r.id === id);
        if (updated) setSelectedRecord(updated);
    };

    const StatusBadge = ({ status }: { status: CostShareStatus }) => {
        const styles: Record<string, string> = {
            'Active': REMIS_THEME.classes.statusActive,
            'Initiated': REMIS_THEME.classes.badge.info,
            'Completed': 'bg-zinc-800 text-white border-zinc-900',
            'Archived': 'bg-zinc-100 text-zinc-500 border-zinc-200'
        };
        return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${styles[status] || 'bg-zinc-50'}`}>{status}</span>;
    };

    if (selectedRecord) {
        return (
            <CostShareDetail 
                record={selectedRecord} 
                onBack={() => setSelectedRecord(null)}
                onUpdate={handleUpdate}
                onAdjust={handleAdjustment}
            />
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white border border-zinc-200 rounded-xl shadow-sm">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                        <PieChart size={16} className={REMIS_THEME.classes.iconColor}/> Cost Share Agreements
                    </h3>
                    <div className="relative w-full sm:w-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Search Sponsor or Project ID..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`w-full sm:w-64 pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none ${REMIS_THEME.classes.inputFocus}`}
                        />
                    </div>
                </div>
                <button onClick={() => setIsFormOpen(true)} className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors w-full md:w-auto ${REMIS_THEME.classes.buttonPrimary}`}>
                    <Plus size={12}/> New Agreement
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map(r => {
                        const percentContributed = (r.contributedValue / (r.totalValue * (r.percentage.nonFederal/100))) * 100;
                        return (
                            <div 
                                key={r.id} 
                                onClick={() => setSelectedRecord(r)}
                                className={`bg-white border border-zinc-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group ${REMIS_THEME.classes.cardHover}`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg shrink-0 ${REMIS_THEME.classes.iconContainer} ${REMIS_THEME.classes.iconColor}`}>
                                            <Scale size={18}/>
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-sm font-bold text-zinc-900">{r.sponsorName}</h4>
                                                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded border">{r.id}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                Ref: {r.projectOrAssetId} • Auth: {r.authority}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusBadge status={r.status} />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-50 pt-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Cost Share Split</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-rose-700">Fed: {r.percentage.federal}%</span>
                                            <span className="text-zinc-300">|</span>
                                            <span className="text-xs font-bold text-blue-700">Non-Fed: {r.percentage.nonFederal}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Sponsor Contribution</p>
                                        <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(r.contributedValue)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Target (Non-Fed)</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600" style={{width: `${Math.min(percentContributed, 100)}%`}} />
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-500">{percentContributed.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isFormOpen && (
                <CostShareForm 
                    onClose={() => setIsFormOpen(false)} 
                    onSubmit={handleCreate} 
                />
            )}
        </div>
    );
};

export default CostShareManager;
