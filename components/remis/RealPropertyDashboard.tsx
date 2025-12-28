import React, { useState, useEffect, useMemo } from 'react';
import { Building2, DollarSign, PieChart, TrendingUp, Activity, Maximize, Calendar, Download, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Pie, Cell, PieChart as RePieChart, ScatterChart, Scatter, ZAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatting';
import { remisService } from '../../services/RemisDataService';
import { RealPropertyAsset, Outgrant } from '../../types';
import { REMIS_THEME } from '../../constants';

const KPICard = React.memo(({ title, value, subtext, icon: Icon, trend }: any) => (
    <div className={`bg-white p-5 sm:p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between transition-all group min-h-[140px] ${REMIS_THEME.classes.cardHover}`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-zinc-900 mt-2 tracking-tight">{value}</p>
            </div>
            <div className={`p-2.5 rounded-lg transition-colors shrink-0 ${REMIS_THEME.classes.iconContainer} ${REMIS_THEME.classes.iconColor}`}>
                <Icon size={22} />
            </div>
        </div>
        <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-zinc-500 truncate mr-2">{subtext}</p>
            {trend && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${REMIS_THEME.classes.iconContainer} ${REMIS_THEME.classes.iconColor}`}>
                    {trend}
                </span>
            )}
        </div>
    </div>
));

const RealPropertyDashboard: React.FC = () => {
    const [assets, setAssets] = useState<RealPropertyAsset[]>(remisService.getAssets());
    const [outgrants, setOutgrants] = useState<Outgrant[]>(remisService.getOutgrants());

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setAssets([...remisService.getAssets()]);
            setOutgrants([...remisService.getOutgrants()]);
        });
        return unsubscribe;
    }, []);

    // Memoize heavy aggregates for React 18 Concurrent Rendering
    const stats = useMemo(() => {
        const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
        const totalRevenue = outgrants.filter(o => o.status === 'Active').reduce((sum, o) => sum + o.annualRent, 0);
        const totalDM = assets.reduce((sum, a) => sum + a.deferredMaintenance, 0);
        const portfolioFCI = totalValue > 0 ? (1 - (totalDM / totalValue)) * 100 : 100;
        return { totalAssets: assets.length, totalValue, totalRevenue, totalDM, portfolioFCI };
    }, [assets, outgrants]);

    const fciData = useMemo(() => assets.map(a => ({
        name: a.rpaName,
        fci: a.currentValue > 0 ? (1 - (a.deferredMaintenance / a.currentValue)) * 100 : 100,
        mdi: a.missionDependency === 'Critical' ? 90 : a.missionDependency === 'Dependent' ? 60 : 30,
        utilization: a.utilizationRate,
        value: a.currentValue
    })), [assets]);

    const sortedUtilizationData = useMemo(() => 
        [...fciData].sort((a,b) => b.utilization - a.utilization).slice(0, 10),
    [fciData]);

    const assetComposition = useMemo(() => {
        const cats = assets.reduce((acc, curr) => {
            const type = curr.catcode.startsWith('6') ? 'Buildings' : curr.catcode.startsWith('8') ? 'Land' : 'Structures';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return [
            { name: 'Buildings', value: cats['Buildings'] || 0, color: REMIS_THEME.colors.primary },
            { name: 'Land', value: cats['Land'] || 0, color: REMIS_THEME.colors.secondary },
            { name: 'Structures', value: cats['Structures'] || 0, color: REMIS_THEME.colors.accent },
        ];
    }, [assets]);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar flex flex-col bg-zinc-50/50 animate-in fade-in">
            <div className="px-4 sm:px-6 py-4 bg-white border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky top-0 z-20 gap-4">
                <div className="flex flex-wrap items-center gap-4">
                     <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200">
                        <Calendar size={14} className="text-zinc-400"/>
                        <span>Fiscal Year: 2024</span>
                     </div>
                     <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Authoritative Source: GFEBS/REMIS</span>
                </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <KPICard title="Total Assets" value={stats.totalAssets.toLocaleString()} subtext="Active Inventory" icon={Building2} trend="+3.2%" />
                    <KPICard title="Portfolio FCI" value={stats.portfolioFCI.toFixed(1)} subtext={`DM: ${formatCurrency(stats.totalDM)}`} icon={Activity} />
                    <KPICard title="Plant Replacement Value" value={formatCurrency(stats.totalValue)} subtext="Current PRV" icon={TrendingUp} />
                    <KPICard title="FY Revenue" value={formatCurrency(stats.totalRevenue)} subtext="Agric/Comm Leases" icon={DollarSign} trend="+12%" />
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 xl:col-span-8 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col min-h-[450px]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} className="text-rose-600" /> Infrastructure Health Matrix
                            </h3>
                        </div>
                        <div className="flex-1 w-full relative min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis type="number" dataKey="fci" name="FCI" unit="" domain={[0, 100]} tick={{fontSize: 10, fill: '#71717a'}} axisLine={false} tickLine={false} />
                                    <YAxis type="number" dataKey="mdi" name="MDI" unit="" domain={[0, 100]} tick={{fontSize: 10, fill: '#71717a'}} axisLine={false} tickLine={false} />
                                    <ZAxis type="number" dataKey="value" range={[50, 400]} name="PRV" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{fontSize: '12px', borderRadius: '12px', border: '1px solid #e4e4e7'}} />
                                    <Scatter name="Assets" data={fciData}>
                                        {fciData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fci < 60 && entry.mdi > 70 ? '#e11d48' : entry.fci > 80 ? REMIS_THEME.colors.primary : REMIS_THEME.colors.secondary} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="col-span-12 xl:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col min-h-[450px]">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Maximize size={14} className="text-blue-600" /> Space Utilization
                        </h3>
                        <div className="flex-1 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sortedUtilizationData} layout="vertical" margin={{ left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 10, fill: '#52525b'}} interval={0} axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(val: number) => `${val}%`} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                                    <Bar dataKey="utilization" radius={[0, 4, 4, 0]} barSize={16} name="Utilization %">
                                        {sortedUtilizationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.utilization < 50 ? '#f59e0b' : REMIS_THEME.colors.secondary} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealPropertyDashboard;