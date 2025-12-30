
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Building2, DollarSign, Activity, TrendingUp, Maximize, Calendar, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, ScatterChart, Scatter, ZAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatting';
import { remisService } from '../../services/RemisDataService';
import { RealPropertyAsset, Outgrant, NavigationTab } from '../../types';
import { REMIS_THEME } from '../../constants';
import { usePlatform } from '../../context/PlatformContext';

const KPICard = React.memo(({ title, value, subtext, icon: Icon, trend }: any) => (
    <div className={`bg-white p-6 rounded-md border border-zinc-200 shadow-sm flex flex-col justify-between transition-all group min-h-[140px] ${REMIS_THEME.classes.cardHover}`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
                <p className="text-3xl font-mono font-bold text-zinc-900 mt-2 tracking-tight">{value}</p>
            </div>
            <div className={`p-3 rounded-sm transition-colors shrink-0 ${REMIS_THEME.classes.iconContainer} ${REMIS_THEME.classes.iconColor}`}>
                <Icon size={22} />
            </div>
        </div>
        <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-zinc-500 truncate mr-2">{subtext}</p>
            {trend && <span className={`text-[9px] font-bold px-2 py-1 rounded-sm border ${REMIS_THEME.classes.iconContainer} ${REMIS_THEME.classes.iconColor}`}>{trend}</span>}
        </div>
    </div>
));

interface Props {
    onNavigateToAsset?: (id: string) => void;
}

const RealPropertyDashboard: React.FC<Props> = ({ onNavigateToAsset }) => {
    const [assets, setAssets] = useState<RealPropertyAsset[]>(remisService.getAssets());
    const [outgrants, setOutgrants] = useState<Outgrant[]>(remisService.getOutgrants());

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setAssets([...remisService.getAssets()]);
            setOutgrants([...remisService.getOutgrants()]);
        });
        return unsubscribe;
    }, []);

    const stats = useMemo(() => {
        const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
        const totalRevenue = outgrants.filter(o => o.status === 'Active').reduce((sum, o) => sum + o.annualRent, 0);
        const totalDM = assets.reduce((sum, a) => sum + a.deferredMaintenance, 0);
        const portfolioFCI = totalValue > 0 ? (1 - (totalDM / totalValue)) * 100 : 100;
        return { totalAssets: assets.length, totalValue, totalRevenue, totalDM, portfolioFCI };
    }, [assets, outgrants]);

    const chartData = useMemo(() => assets.map(a => ({
        id: a.rpuid,
        name: a.rpaName,
        fci: a.currentValue > 0 ? (1 - (a.deferredMaintenance / a.currentValue)) * 100 : 100,
        mdi: a.missionDependency === 'Critical' ? 90 : a.missionDependency === 'Dependent' ? 60 : 30,
        utilization: a.utilizationRate,
        value: a.currentValue
    })), [assets]);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-zinc-50/50 animate-in fade-in p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Assets" value={stats.totalAssets.toLocaleString()} subtext="Active Inventory" icon={Building2} trend="+3.2%" />
                <KPICard title="Portfolio FCI" value={stats.portfolioFCI.toFixed(1)} subtext={`DM: ${formatCurrency(stats.totalDM)}`} icon={Activity} />
                <KPICard title="Plant Replacement Value" value={formatCurrency(stats.totalValue)} subtext="Current PRV" icon={TrendingUp} />
                <KPICard title="FY Revenue" value={formatCurrency(stats.totalRevenue)} subtext="Agric/Comm Leases" icon={DollarSign} trend="+12%" />
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 xl:col-span-8 bg-white p-8 rounded-md border border-zinc-200 shadow-sm flex flex-col h-[500px]">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                        <Activity size={18} className="text-rose-600" /> Infrastructure Health Matrix (FCI vs MDI)
                    </h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis type="number" dataKey="fci" name="FCI" unit="%" domain={[0, 100]} tick={{fontSize: 10}} />
                                <YAxis type="number" dataKey="mdi" name="MDI" unit="%" domain={[0, 100]} tick={{fontSize: 10}} />
                                <ZAxis type="number" dataKey="value" range={[60, 400]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Assets" data={chartData}>
                                    {chartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.fci < 60 && entry.mdi > 70 ? '#e11d48' : entry.fci > 80 ? REMIS_THEME.colors.primary : REMIS_THEME.colors.secondary} 
                                            className="cursor-pointer"
                                            onClick={() => onNavigateToAsset?.(entry.id)}
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-span-12 xl:col-span-4 bg-zinc-900 rounded-md p-8 text-white shadow-2xl flex flex-col h-[500px] border border-zinc-800">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-10 flex items-center gap-3 text-emerald-400">
                        <Maximize size={18}/> Utilization Hotspots
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                        {chartData.sort((a,b) => b.utilization - a.utilization).map((asset, i) => (
                            <button 
                                key={i} 
                                onClick={() => onNavigateToAsset?.(asset.id)}
                                className="w-full text-left p-4 rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold truncate max-w-[150px] group-hover:text-emerald-400 transition-colors">{asset.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-emerald-400 text-xs font-bold">{asset.utilization}%</span>
                                        <ArrowRight size={12} className="text-zinc-600 group-hover:text-white transition-all"/>
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${asset.utilization}%` }} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealPropertyDashboard;
