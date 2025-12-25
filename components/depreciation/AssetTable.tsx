
import React from 'react';
import { Asset } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Box, CheckCircle2, AlertTriangle, MoreHorizontal, Calendar, Activity } from 'lucide-react';

interface Props {
    assets: Asset[];
    onSelect: (asset: Asset) => void;
}

const AssetTable: React.FC<Props> = ({ assets, onSelect }) => {
    return (
        <div className="flex flex-col h-full">
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-zinc-50/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                        <tr className="border-b border-zinc-200">
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-1/3">Asset Details</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type / Class</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Cost Basis</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Life</th>
                            <th className="p-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {assets.map(asset => (
                            <tr 
                                key={asset.id} 
                                onClick={() => onSelect(asset)}
                                className="hover:bg-zinc-50 cursor-pointer group transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600 group-hover:bg-rose-50 group-hover:text-rose-700 transition-colors">
                                            <Box size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-800">{asset.name}</p>
                                            <p className="text-[10px] text-zinc-400 font-mono">{asset.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                     <div className="flex flex-col gap-1">
                                        <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                            asset.type === 'PRIP' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>{asset.type}</span>
                                        <span className="text-[10px] text-zinc-500">{asset.assetClass}</span>
                                     </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5">
                                        {asset.status === 'In Service' ? <CheckCircle2 size={14} className="text-emerald-500"/> : <AlertTriangle size={14} className="text-amber-500"/>}
                                        <span className="text-xs font-medium text-zinc-700">{asset.status}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-mono text-zinc-700 text-right font-bold">{formatCurrency(asset.acquisitionCost)}</td>
                                <td className="p-4 text-sm font-mono text-zinc-700 text-center">{asset.usefulLife} yr</td>
                                <td className="p-4 text-center">
                                    <button className="p-1 text-zinc-300 hover:text-zinc-800 transition-colors"><MoreHorizontal size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 p-4 overflow-y-auto">
                {assets.map(asset => (
                    <div 
                        key={asset.id} 
                        onClick={() => onSelect(asset)}
                        className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform"
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
                            <button className="text-zinc-400"><MoreHorizontal size={16}/></button>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssetTable;
