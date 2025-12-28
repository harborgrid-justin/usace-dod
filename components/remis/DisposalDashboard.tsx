import React, { useState, useEffect, useMemo } from 'react';
import { Shuffle, Plus, DollarSign, Activity, Clock, Building2 } from 'lucide-react';
import { DisposalAction, DisposalDashboardProps } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DisposalActionForm from './DisposalActionForm';
import { DisposalActionDetail } from './DisposalActionDetail';

const KPICard = React.memo(({ title, value, icon: Icon }: any) => (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm transition-all hover:border-rose-200 group">
        <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
            <div className={`p-2 rounded-lg ${REMIS_THEME.classes.iconContainer} ${REMIS_THEME.classes.iconColor}`}>
                <Icon size={18} />
            </div>
        </div>
        <p className="text-3xl font-mono font-bold text-zinc-900 tracking-tighter">{value}</p>
    </div>
));

const DisposalDashboard: React.FC<DisposalDashboardProps> = ({ onNavigateToAsset, onNavigateToSolicitation }) => {
    const [disposals, setDisposals] = useState<DisposalAction[]>(remisService.getDisposals());
    const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setDisposals([...remisService.getDisposals()]);
        });
        return unsubscribe;
    }, []);
    
    const selectedAction = useMemo(() => 
        disposals.find(d => d.id === selectedActionId),
    [disposals, selectedActionId]);

    const stats = useMemo(() => {
        const screeningComplete = disposals.filter(d => d.screeningStatus === 'Final').length;
        const totalProceeds = disposals.reduce((sum, d) => sum + d.estimatedProceeds, 0);
        return { count: disposals.length, screeningComplete, totalProceeds };
    }, [disposals]);

    const chartData = useMemo(() => {
        const statusCounts = disposals.reduce((acc, d) => {
            acc[d.screeningStatus] = (acc[d.screeningStatus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(statusCounts).map(([name, value]) => ({ name, count: value }));
    }, [disposals]);

    if (selectedAction) {
        return <DisposalActionDetail 
            action={selectedAction} 
            onBack={() => setSelectedActionId(null)}
            onNavigateToAsset={onNavigateToAsset}
            onNavigateToSolicitation={onNavigateToSolicitation}
        />;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar bg-zinc-50/50 p-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Shuffle size={28} className="text-amber-600"/> Disposal Pipeline
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Management of Excess Inventory per FMR Vol 12</p>
                </div>
                <button onClick={() => setIsFormOpen(true)} className={`px-6 py-3 rounded-xl text-xs font-bold uppercase transition-all shadow-lg ${REMIS_THEME.classes.buttonPrimary}`}>
                    <Plus size={16}/> Declare Excess
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                <KPICard title="Current Population" value={stats.count} icon={Building2} />
                <KPICard title="Final Screening" value={stats.screeningComplete} icon={Activity} />
                <KPICard title="Est. Proceeds" value={formatCurrency(stats.totalProceeds)} icon={DollarSign} />
            </div>

            <div className="grid grid-cols-12 gap-6 mt-8">
                <div className="col-span-12 lg:col-span-8 bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 h-80">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Stage Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                            <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{fontSize: 12, borderRadius: '8px'}} />
                            <Bar dataKey="count" fill={REMIS_THEME.colors.accent} radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="col-span-12 lg:col-span-4 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-80">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Action Ledger</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {disposals.map(d => (
                            <button key={d.id} onClick={() => setSelectedActionId(d.id)} className="w-full text-left p-4 border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-mono font-bold text-zinc-800">{d.id}</p>
                                    <span className="text-[10px] font-bold text-emerald-700">{formatCurrency(d.estimatedProceeds)}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">{d.screeningStatus}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {isFormOpen && <DisposalActionForm onClose={() => setIsFormOpen(false)} onSubmit={(aid, t, p) => { remisService.initiateDisposalAction(aid, t, p, 'User'); setIsFormOpen(false); }} />}
        </div>
    );
};

export default DisposalDashboard;