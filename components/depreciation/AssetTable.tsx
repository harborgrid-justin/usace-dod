
import React from 'react';
import { Asset } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Box, CheckCircle2, AlertTriangle, MoreHorizontal } from 'lucide-react';

interface Props {
    assets: Asset[];
    onSelect: (asset: Asset) => void;
}

const AssetTable: React.FC<Props> = ({ assets, onSelect }) => {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            <div className="flex bg-zinc-50/95 backdrop-blur-sm border-b border-zinc-200 sticky top-0 z-10 shadow-sm pr-4">
                <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex-1">Asset Details</div>
                <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32 hidden md:block">Type / Class</div>
                <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32 hidden sm:block">Status</div>
                <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32 text-right hidden sm:block">Cost Basis</div>
                <div className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-20 text-center hidden lg:block">Life</div>
                <div className="p-4 w-12"></div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {assets.map((asset) => (
                    <div 
                        key={asset.id}
                        role="button"
                        tabIndex={0}
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
                ))}
            </div>
        </div>
    );
};

export default AssetTable;
