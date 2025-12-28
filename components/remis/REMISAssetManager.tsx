import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { Building2, Search, MapPin, Globe, Plus, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { RealPropertyAsset } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import RemisAssetForm from './RemisAssetForm';
import AssetLifecyclePage from './AssetLifecyclePage';
import { REMIS_THEME } from '../../constants';
import { useToast } from '../shared/ToastContext';

const REMISAssetManager: React.FC = () => {
    const [view, setView] = useState<'list' | 'detail' | 'form'>('list');
    const [assets, setAssets] = useState<RealPropertyAsset[]>(remisService.getAssets());
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const { addToast } = useToast();
    
    const selectedAsset = useMemo(() => assets.find(a => a.rpuid === selectedAssetId), [assets, selectedAssetId]);

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setAssets([...remisService.getAssets()]);
        });
        return unsubscribe;
    }, []);

    const filtered = useMemo(() => assets.filter(a => 
        a.rpaName.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        a.rpuid.toLowerCase().includes(deferredSearch.toLowerCase())
    ), [assets, deferredSearch]);

    const handleCreate = (newAsset: RealPropertyAsset) => {
        IntegrationOrchestrator.createRemisAsset(newAsset);
        addToast('Authoritative Record established and capitalized.', 'success');
        setView('list');
    };

    const handleUpdate = (updatedAsset: RealPropertyAsset) => {
        remisService.updateAsset(updatedAsset);
        setView('list');
    };

    if (view === 'detail' && selectedAsset) {
        return (
            <AssetLifecyclePage 
                asset={selectedAsset} 
                onBack={() => setView('list')} 
                onUpdate={handleUpdate} 
            />
        );
    }

    if (view === 'form') {
        return (
            <RemisAssetForm 
                onClose={() => setView('list')} 
                onSubmit={selectedAsset ? handleUpdate : handleCreate}
                initialData={selectedAsset}
            />
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white border border-zinc-200 rounded-2xl shadow-sm animate-in fade-in">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                        <Building2 size={16} className={REMIS_THEME.classes.iconColor}/> Real Property Inventory
                    </h3>
                    <div className="relative w-full sm:w-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Filter by RPUID or Name..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`w-full sm:w-64 pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${REMIS_THEME.classes.inputFocus}`}
                        />
                    </div>
                </div>
                <button onClick={() => { setSelectedAssetId(null); setView('form'); }} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm ${REMIS_THEME.classes.buttonPrimary}`}>
                    <Plus size={14}/> New Asset Record
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">RPUID / Name</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Installation</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">CATCODE</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Interest</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Size</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Status</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">GIS</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filtered.map(asset => (
                            <tr key={asset.rpuid} onClick={() => { setSelectedAssetId(asset.rpuid); setView('detail'); }} className={`${REMIS_THEME.classes.tableRowHover} transition-colors group cursor-pointer`}>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-zinc-800 group-hover:text-emerald-800 transition-colors truncate max-w-[200px]">{asset.rpaName}</span>
                                        <span className="text-[10px] font-mono text-zinc-500">{asset.rpuid}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-xs text-zinc-600 truncate">{asset.installation}</td>
                                <td className="p-4"><span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded border font-mono">{asset.catcode}</span></td>
                                <td className="p-4 text-xs text-zinc-600">{asset.interestType}</td>
                                <td className="p-4 text-right text-xs font-mono text-zinc-800">{asset.sqFt > 0 ? `${asset.sqFt.toLocaleString()} SF` : `${asset.acres} AC`}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                        asset.status === 'Active' ? REMIS_THEME.classes.statusActive : REMIS_THEME.classes.badge.warning
                                    }`}>{asset.status}</span>
                                </td>
                                <td className="p-4 text-center">
                                    {asset.hasGeo ? <Globe size={14} className={REMIS_THEME.classes.iconColor}/> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 mx-auto"/>}
                                </td>
                                <td className="p-4 text-center">
                                    <ArrowRight size={16} className="text-zinc-300 group-hover:text-emerald-600 transition-all mx-auto"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default REMISAssetManager;