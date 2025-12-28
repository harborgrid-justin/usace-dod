import React, { useMemo } from 'react';
import { Asset } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Box, CheckCircle2, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';

interface Props {
    assets: Asset[];
    onSelect: (asset: Asset) => void;
}

const Row = React.memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: { assets: Asset[], onSelect: (asset: Asset) => void } }) => {
    const { assets, onSelect } = data;
    const asset = assets[index];
    
    return (
        <div 
            style={style} 
            role="button"
            tabIndex={0}
            aria-label={`View details for asset ${asset.name}`}
            className="flex items-center hover:bg-zinc-50 cursor-pointer group transition-colors border-b border-zinc-100 outline-none focus:bg-rose-50/30"
            onClick={() => onSelect(asset)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(asset)}
        >
            <div className="flex-1 p-4 flex items-center gap-3 min-w-0">
                <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600 group-hover:bg-rose-50 group-hover:text-rose-700 transition-colors shrink-0">
                    <Box size={18} />
                </div>
                <div className="truncate">
                    <p className="text-sm font-bold text-zinc-800 truncate">{asset.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">{asset.id}</p>
                </div>
            </div>
            <div className="w-32 p-4 hidden md:block">
                 <div className="flex flex-col gap-1">
                    <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        asset.type === 'PRIP' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>{asset.type}</span>
                    <span className="text-[10px] text-zinc-500">{asset.assetClass}</span>
                 </div>
            </div>
            <div className="w-32 p-4 hidden sm:block">
                <div className="flex items-center gap-1.5">
                    {asset.status === 'In Service' ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> : <AlertTriangle size={14} className="text-amber-500 shrink-0"/>}
                    <span className="text-xs font-medium text-zinc-700 truncate">{asset.status}</span>
                </div>
            </div>
            <div className="w-32 p-4 text-right font-mono text-sm text-zinc-700 font-bold hidden sm:block">
                {formatCurrency(asset.acquisitionCost)}
            </div>
            <div className="w-20 p-4 text-center text-sm font-mono text-zinc-700 hidden lg:block">
                {asset.usefulLife} yr
            </div>
            <div className="w-12 p-4 text-center shrink-0">
                <button className="p-1 text-zinc-300 hover:text-zinc-800 transition-colors" aria-label="More actions">
                  <MoreHorizontal size={16}/>
                </button>
            </div>
        </div>
    );
});

const AssetTable: React.FC<Props> = ({ assets, onSelect }) => {
    const itemData = useMemo(() => ({ assets, onSelect }), [assets, onSelect]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="hidden sm:flex flex-col h-full flex-1 min-h-0 bg-white">
                <div className="flex bg-zinc-50/95 backdrop-blur-sm border-b border-zinc-200 sticky top-0 z-10 shadow-sm pr-4">
                    <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex-1">Asset Details</div>
                    <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32 hidden md:block">Type / Class</div>
                    <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32 hidden sm:block">Status</div>
                    <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32 text-right hidden sm:block">Cost Basis</div>
                    <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-20 text-center hidden lg:block">Life</div>
                    <div className="p-4 w-12"></div>
                </div>
                <div className="flex-1 min-h-0">
                    <List
                        height={600}
                        itemCount={assets.length}
                        itemSize={72}
                        width="100%"
                        className="custom-scrollbar"
                        itemData={itemData}
                    >
                        {Row}
                    </List>
                </div>
            </div>

            <div className="sm:hidden space-y-3 p-4 overflow-y-auto">
                {assets.map(asset => (
                    <button 
                        key={asset.id} 
                        onClick={() => onSelect(asset)}
                        className="w-full text-left bg-white border border-zinc-200 rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
                                    <Box size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{asset.name}</h4>
                                    <p className="text-[10px] text-zinc-400 font-mono">{asset.id}</p>
                                </div>
                            </div>
                            <MoreHorizontal size={16} className="text-zinc-400"/>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 py-3 border-t border-zinc-100 mb-3">
                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Acq Cost</p>
                                <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(asset.acquisitionCost)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Useful Life</p>
                                <p className="text-sm font-mono text-zinc-900">{asset.usefulLife} yrs</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                             <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                asset.type === 'PRIP' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>{asset.type}</span>
                            <div className="flex items-center gap-1.5">
                                {asset.status === 'In Service' ? <CheckCircle2 size={12} className="text-emerald-500"/> : <AlertTriangle size={12} className="text-amber-500"/>}
                                <span className="text-xs font-medium text-zinc-700">{asset.status}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AssetTable;