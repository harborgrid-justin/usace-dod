
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ShieldAlert, Plus, Search, AlertOctagon, Activity, Clock, Building, Map as MapIcon, BookOpen, ChevronRight } from 'lucide-react';
import { EncroachmentCase, EncroachmentDashboardProps, EncroachmentStatus } from '../../types';
import EncroachmentDetail from './EncroachmentDetail';
import EncroachmentCaseForm from './EncroachmentCaseForm';
import { remisService } from '../../services/RemisDataService';
import { REMIS_THEME } from '../../constants';
import { formatCurrency } from '../../utils/formatting';
import { useService } from '../../hooks/useService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const EncroachmentDashboard: React.FC<EncroachmentDashboardProps> = ({ onNavigateToGis }) => {
    const cases = useService<EncroachmentCase[]>(remisService, useCallback(() => remisService.getEncroachments(), []));
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'Active' | 'GIS' | 'Policy'>('Active');

    const selectedCase = useMemo(() => cases.find(c => c.id === selectedCaseId), [cases, selectedCaseId]);

    const stats = useMemo(() => {
        // Corrected comparison logic to match EncroachmentStatus type
        const active = cases.filter(c => c.status !== 'Closed' && c.status !== 'Archived' && c.status !== 'Resolved').length;
        const structural = cases.filter(c => c.type === 'Structure').length;
        return { total: cases.length, active, structural };
    }, [cases]);

    if (selectedCase) {
        return <EncroachmentDetail encroachment={selectedCase} onBack={() => setSelectedCaseId(null)} onUpdate={remisService.updateEncroachment} />;
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 animate-in fade-in overflow-hidden">
            {/* Contextual Tabs */}
            <div className="px-6 bg-white border-b border-zinc-200 flex justify-between items-end shrink-0">
                <div className="flex gap-8">
                    {(['Active', 'GIS', 'Policy'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                                activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab === 'Active' ? 'Active Cases' : tab === 'GIS' ? 'Spatial View' : 'Regulatory'}
                        </button>
                    ))}
                </div>
                <div className="pb-3">
                    <button onClick={() => setIsFormOpen(true)} className={`flex items-center gap-2 px-5 py-2 rounded-sm text-[10px] font-bold uppercase transition-all shadow-md ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Plus size={14}/> Declare Incident
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {activeTab === 'Active' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-rose-50 text-rose-600 rounded-sm"><ShieldAlert size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Active Population</p><p className="text-xl font-mono font-bold text-zinc-900">{stats.active}</p></div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-sm"><Building size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Structural Breaches</p><p className="text-xl font-mono font-bold text-zinc-900">{stats.structural}</p></div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-sm"><Activity size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Mean Resolution</p><p className="text-xl font-mono font-bold text-zinc-900">42d</p></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {cases.map(c => (
                                <div key={c.id} onClick={() => setSelectedCaseId(c.id)} className="bg-white border border-zinc-200 rounded-md p-5 hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group flex justify-between items-center">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-zinc-50 rounded-sm border border-zinc-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors"><ShieldAlert size={20}/></div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-sm font-bold text-zinc-900">{c.id}</h4>
                                                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm border bg-zinc-50 text-zinc-500">{c.status}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500 max-w-md line-clamp-1">{c.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-zinc-200 group-hover:text-emerald-600 transition-all" />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'GIS' && (
                    <div className="bg-white border border-zinc-200 rounded-md p-10 shadow-sm flex flex-col items-center justify-center h-[500px] text-center gap-6">
                        <div className="p-6 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-inner animate-pulse"><MapIcon size={48}/></div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Spatial Intelligence View</h3>
                            <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-2">Visualizing encroachment points against authoritative boundary layers (SDSVIE Compliant).</p>
                        </div>
                        <button onClick={onNavigateToGis} className="px-8 py-3 bg-zinc-900 text-white rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-xl transition-all active:scale-95">Open Global GIS Viewer</button>
                    </div>
                )}

                {activeTab === 'Policy' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-white p-8 rounded-md border border-zinc-200 shadow-sm">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3"><BookOpen size={18} className="text-rose-600"/> ER 405-1-12 Enforcement</h4>
                            <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
                                <p><strong>Purpose:</strong> To establish uniform procedures for detecting, reporting, and resolving encroachments upon Army-controlled real property.</p>
                                <p><strong>Administrative Action:</strong> All identified encroachments must be investigated within 30 days. Formal legal action via the US Attorney Office requires OGC certification.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isFormOpen && <EncroachmentCaseForm onClose={() => setIsFormOpen(false)} onSubmit={(c) => {remisService.addEncroachment(c); setIsFormOpen(false);}} />}
        </div>
    );
};

export default EncroachmentDashboard;
