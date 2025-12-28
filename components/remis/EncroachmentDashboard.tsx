import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, Plus, Search, AlertOctagon, Activity, Clock, Building } from 'lucide-react';
import { EncroachmentCase, EncroachmentDashboardProps, EncroachmentStatus } from '../../types';
import EncroachmentDetail from './EncroachmentDetail';
import EncroachmentCaseForm from './EncroachmentCaseForm';
import { remisService } from '../../services/RemisDataService';
import { REMIS_THEME } from '../../constants';
import { formatCurrency } from '../../utils/formatting';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const KPICard = React.memo(({ title, value, icon: Icon }: any) => (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex items-start justify-between gap-4">
        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
            <p className="text-3xl font-mono font-bold text-zinc-900 mt-2">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${REMIS_THEME.classes.iconContainer} ${REMIS_THEME.classes.iconColor}`}>
            <Icon size={18} />
        </div>
    </div>
));

const EncroachmentDashboard: React.FC<EncroachmentDashboardProps> = ({ onNavigateToGis }) => {
    const [cases, setCases] = useState<EncroachmentCase[]>(remisService.getEncroachments());
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setCases([...remisService.getEncroachments()]);
        });
        return unsubscribe;
    }, []);
    
    const selectedCase = useMemo(() => cases.find(c => c.id === selectedCaseId), [cases, selectedCaseId]);

    const stats = useMemo(() => {
        const active = cases.filter(c => c.status !== 'Closed' && c.status !== 'Archived').length;
        const structural = cases.filter(c => c.type === 'Structure').length;
        return { total: cases.length, active, structural };
    }, [cases]);

    const chartData = useMemo(() => {
        const statusCounts = cases.reduce((acc, c) => {
            acc[c.status] = (acc[c.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(statusCounts).map(([name, value]) => ({ name, cases: value }));
    }, [cases]);

    if (selectedCase) {
        return <EncroachmentDetail encroachment={selectedCase} onBack={() => setSelectedCaseId(null)} onUpdate={remisService.updateEncroachment} onNavigateToGis={onNavigateToGis} />;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar bg-zinc-50/50 p-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <ShieldAlert size={28} className="text-rose-600"/> Encroachment Control
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Authorized Boundary & Land Use Protection</p>
                </div>
                <button onClick={() => setIsFormOpen(true)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase transition-all shadow-lg ${REMIS_THEME.classes.buttonPrimary}`}>
                    <Plus size={16}/> Report Incident
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Cases" value={stats.total} icon={ShieldAlert} />
                <KPICard title="Active Investigations" value={stats.active} icon={Activity} />
                <KPICard title="Structural Breaches" value={stats.structural} icon={Building} />
                <KPICard title="Avg Resolve" value="42d" icon={Clock} />
            </div>

            <div className="grid grid-cols-12 gap-6 mt-8">
                <div className="col-span-12 lg:col-span-8 bg-white border border-zinc-200 rounded-2xl shadow-sm p-6">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Encroachment Status Pipeline</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{fontSize: 12, borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="cases" fill={REMIS_THEME.colors.primary} radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-4 bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 flex flex-col">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Recent Reports</h3>
                    <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {cases.slice(0, 5).map(c => (
                            <button key={c.id} onClick={() => setSelectedCaseId(c.id)} className="w-full text-left p-4 bg-zinc-50 border border-zinc-100 rounded-xl hover:border-emerald-300 transition-all group">
                                <div className="flex justify-between mb-1">
                                    <span className="text-[10px] font-mono font-bold text-zinc-400">{c.id}</span>
                                    <span className="text-[9px] font-bold uppercase text-rose-600">{c.type}</span>
                                </div>
                                <p className="text-xs font-bold text-zinc-800 line-clamp-1">{c.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {isFormOpen && <EncroachmentCaseForm onClose={() => setIsFormOpen(false)} onSubmit={(c) => {remisService.addEncroachment(c); setIsFormOpen(false);}} />}
        </div>
    );
};

export default EncroachmentDashboard;