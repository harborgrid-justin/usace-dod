import React, { useState, useTransition, useMemo, useCallback } from 'react';
import { Box, Plus, Search, ShieldCheck } from 'lucide-react';
import { MOCK_ASSETS } from '../../constants';
import { Asset } from '../../types';
import AssetTable from '../depreciation/AssetTable';
import AssetDetailModal from '../depreciation/AssetDetailModal';
import RateConfig from '../depreciation/RateConfig';
import AssetReports from '../depreciation/AssetReports';
import AssetBatchProcessor from '../depreciation/AssetBatchProcessor';
import MaintenanceManager from '../maintenance/MaintenanceManager';

const AssetLifecycleView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ledger' | 'batch' | 'maintenance' | 'config' | 'reports'>('ledger');
    const [viewState, setViewState] = useState<'LIST' | 'DETAIL'>('LIST');
    const [isPending, startTransition] = useTransition();
    
    const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const handleTabChange = useCallback((id: string) => {
        startTransition(() => {
            setActiveTab(id as any);
            setViewState('LIST');
        });
    }, []);

    const handleSaveAsset = useCallback((savedAsset: Asset) => {
        setAssets(prev => {
            const exists = prev.some(a => a.id === savedAsset.id);
            if (exists) return prev.map(a => a.id === savedAsset.id ? savedAsset : a);
            return [savedAsset, ...prev];
        });
        setViewState('LIST');
    }, []);

    const handleOpenDetail = (asset: Asset | null) => {
        setSelectedAsset(asset);
        setViewState('DETAIL');
    };

    const tabs = useMemo(() => [
        {id: 'ledger', label: 'Asset Ledger'}, 
        {id: 'maintenance', label: 'Maintenance'}, 
        {id: 'batch', label: 'Batch Processing'}, 
        {id: 'config', label: 'Rates'}, 
        {id: 'reports', label: 'Reports'}
    ], []);

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Box size={24} className="text-rose-700 shrink-0" /> Asset Lifecycle
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">ER 37-1-29 Compliant Management</p>
                </div>
                <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 custom-scrollbar">
                    <div className="flex bg-zinc-100 p-1 rounded-lg min-w-max shadow-inner">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => handleTabChange(tab.id)} 
                                className={`px-3 sm:px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`flex-1 transition-opacity duration-300 ${isPending ? 'opacity-50 grayscale-[0.5]' : 'opacity-100'}`}>
                {activeTab === 'ledger' && (
                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-zinc-50/50">
                            <div className="relative flex-1 max-w-md">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                <input type="text" placeholder="Search by asset..." className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400 transition-colors"/>
                            </div>
                            <button onClick={() => handleOpenDetail(null)} className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors shadow-sm">
                                <Plus size={12}/> New Asset
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <AssetTable assets={assets} onSelect={(a) => handleOpenDetail(a)} />
                        </div>
                    </div>
                )}

                {activeTab === 'maintenance' && <MaintenanceManager />}
                {activeTab === 'batch' && <AssetBatchProcessor assets={assets} />}
                {activeTab === 'config' && <RateConfig />}
                {activeTab === 'reports' && <AssetReports assets={assets} />}
            </div>
            
            {viewState === 'DETAIL' && (
              <AssetDetailModal 
                asset={selectedAsset} 
                onClose={() => setViewState('LIST')} 
                onSave={handleSaveAsset} 
              />
            )}
        </div>
    );
};

export default AssetLifecycleView;