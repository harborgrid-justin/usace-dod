
import React, { useState } from 'react';
import { Asset } from '../../types';
import { BarChart3, Clock, Shuffle, DollarSign, TrendingDown, Hammer, ArrowRight, Anchor, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import MaintenanceManager from '../maintenance/MaintenanceManager';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, AreaChart, Area } from 'recharts';

interface AssetReportsProps {
    assets: Asset[];
}

const AssetReports: React.FC<AssetReportsProps> = ({ assets }) => {
    // Mock Maintenance Costs aggregation (In real app, join with WorkOrder table)
    const totalAcquisitionCost = assets.reduce((s, a) => s + a.acquisitionCost, 0);
    const totalDepreciation = assets.reduce((s, a) => s + a.accumulatedDepreciation, 0);
    const mockMaintenanceCost = totalAcquisitionCost * 0.04; // Assume 4% annual maintenance
    
    // Opp 53: Dredge Metrics Data
    const dredgeData = [
        { month: 'Jan', cost: 4500, volume: 1200 },
        { month: 'Feb', cost: 4200, volume: 1100 },
        { month: 'Mar', cost: 5100, volume: 1400 },
        { month: 'Apr', cost: 4800, volume: 1350 },
    ];
    
    const [showMaintenanceView, setShowMaintenanceView] = useState(false);

    if (showMaintenanceView) {
        return (
            <div className="h-full flex flex-col">
                <button onClick={() => setShowMaintenanceView(false)} className="self-start mb-4 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase flex items-center gap-2">
                    ← Back to Reports
                </button>
                <MaintenanceManager />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in pb-6">
            
            {/* Opp 53: Dredge Analytics */}
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm lg:col-span-2">
                 <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Anchor size={14} className="text-blue-600" /> Dredge Efficiency (Cost/CY)
                </h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={dredgeData}>
                             <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false}/>
                             <Tooltip contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
                             <Area type="monotone" dataKey="volume" stackId="1" stroke="#3b82f6" fill="#eff6ff" name="Volume (CY)" />
                             <Area type="monotone" dataKey="cost" stackId="2" stroke="#6366f1" fill="#eef2ff" name="Ops Cost ($)" />
                         </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                    <div className="p-2 bg-blue-50 rounded border border-blue-100 text-xs text-blue-900 font-bold">Avg: $3.85 / CY</div>
                    <div className="p-2 bg-zinc-50 rounded border border-zinc-100 text-xs text-zinc-500">Industry Benchmark: $4.10</div>
                </div>
            </div>

            {/* Opp 59: PRIP Recovery */}
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <RefreshCw size={14} className="text-emerald-600" /> PRIP Surcharge Wallet
                </h3>
                <div className="space-y-4">
                    <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                         <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Accumulated Balance</p>
                         <p className="text-3xl font-mono font-bold text-emerald-800">$1.24M</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Current Qtr Accrual</span>
                            <span className="font-mono font-bold">+$45,200</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Projected FY End</span>
                            <span className="font-mono font-bold text-zinc-900">$1.42M</span>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{width: '65%'}} title="65% to Replacement Target"/>
                    </div>
                </div>
            </div>

            {/* Report 1: Lifecycle Status */}
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BarChart3 size={14} className="text-zinc-400" /> Lifecycle Status Summary
                </h3>
                <div className="space-y-2">
                    {['In Service', 'CIP', 'Modification', 'Disposal'].map(status => {
                        const count = assets.filter(a => a.status === status).length;
                        return (
                            <div key={status} className="flex justify-between items-center p-2 bg-zinc-50 rounded">
                                <span className="text-xs font-medium text-zinc-700">{status}</span>
                                <span className="text-sm font-mono font-bold">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Report 2: Financial Health */}
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <DollarSign size={14} className="text-zinc-400" /> Financial Asset Performance
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-xs text-zinc-500">Total Acquisition Value</span>
                        <span className="font-mono font-bold text-sm">{formatCurrency(totalAcquisitionCost)}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-xs text-zinc-500">Net Book Value</span>
                        <span className="font-mono font-bold text-sm text-emerald-600">{formatCurrency(totalAcquisitionCost - totalDepreciation)}</span>
                    </div>
                    <div className="relative pt-2">
                        <div className="flex justify-between text-[10px] text-zinc-400 uppercase mb-1">
                            <span>Depreciated</span>
                            <span>Remaining</span>
                        </div>
                        <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-zinc-400" style={{width: `${(totalDepreciation / totalAcquisitionCost) * 100}%`}} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Report 3: Maintenance Cost Analysis */}
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Hammer size={14} className="text-zinc-400" /> Maintenance Cost Analysis
                </h3>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                    <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Total Maintenance Spend (YTD)</p>
                    <p className="text-xl font-mono font-bold text-blue-900">{formatCurrency(mockMaintenanceCost)}</p>
                </div>
                <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-center text-xs p-2 border-b border-zinc-50">
                        <span className="text-zinc-600">Avg Cost per Asset</span>
                        <span className="font-mono font-bold">{formatCurrency(mockMaintenanceCost / assets.length)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2">
                        <span className="text-zinc-600">Ratio to Replacement Value</span>
                        <span className="font-mono font-bold">{(mockMaintenanceCost / totalAcquisitionCost * 100).toFixed(2)}%</span>
                    </div>
                </div>
                <button onClick={() => setShowMaintenanceView(true)} className="mt-4 w-full py-2 border border-zinc-200 rounded-lg text-[10px] font-bold uppercase text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 transition-colors flex items-center justify-center gap-1">
                    Drill Down <ArrowRight size={12} />
                </button>
            </div>

            {/* Report 4: CIP-to-Capital */}
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shuffle size={14} className="text-zinc-400" /> CIP-to-Capital Transition
                </h3>
                 <div className="space-y-2">
                    {assets.filter(a => a.status === 'CIP').map(asset => (
                         <div key={asset.id} className="p-2 bg-amber-50 rounded border border-amber-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-amber-800">{asset.name}</p>
                                <p className="text-[10px] text-amber-600 font-mono">{asset.id}</p>
                            </div>
                            <button className="text-[9px] font-bold uppercase bg-white text-amber-800 px-2 py-1 rounded border border-amber-200 hover:bg-amber-100">Capitalize</button>
                        </div>
                    ))}
                    {assets.filter(a => a.status === 'CIP').length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No active CIP projects.</p>}
                 </div>
            </div>
            
            {/* Report 5: Asset Aging */}
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm lg:col-span-2">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock size={14} className="text-zinc-400" /> Asset Aging / Remaining Life
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    {assets.filter(a => a.status === 'In Service').map(asset => {
                        const age = new Date().getFullYear() - new Date(asset.placedInServiceDate!).getFullYear();
                        const remaining = asset.usefulLife - age;
                        return (
                             <div key={asset.id} className="p-2 border-b border-zinc-100 last:border-b-0 flex items-center gap-4">
                                <div className="w-1/3">
                                    <p className="text-xs font-semibold text-zinc-800 truncate">{asset.name}</p>
                                    <p className="text-[10px] text-zinc-400 font-mono">{asset.id}</p>
                                </div>
                                <div className="flex-1">
                                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${age > asset.usefulLife * 0.8 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{width: `${Math.min(100, (age / asset.usefulLife) * 100)}%`}} />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1">
                                        <span>Age: {age} yrs</span>
                                        <span className={remaining < 2 ? 'text-rose-600 font-bold' : ''}>{remaining} yrs left</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AssetReports;
