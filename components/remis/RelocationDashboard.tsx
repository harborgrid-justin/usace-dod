import React, { useState, useEffect, useMemo, useDeferredValue, useTransition, useCallback } from 'react';
import { Users, Search, Plus, DollarSign, BookOpen, Clock, Activity, ChevronRight, Gavel } from 'lucide-react';
import { RelocationCase, RelocationBenefit, RelocationDashboardProps } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { REMIS_THEME } from '../../constants';
import { useToast } from '../shared/ToastContext';
import { useService } from '../../hooks/useService';
import RelocationCaseDetail from './RelocationCaseDetail';
import RelocationCaseForm from './RelocationCaseForm';
import BenefitForm from './BenefitForm';
import EmptyState from '../shared/EmptyState';
import { formatCurrency } from '../../utils/formatting';

const RelocationDashboard: React.FC<RelocationDashboardProps> = ({ onNavigateToAcquisition }) => {
    const cases = useService<RelocationCase[]>(remisService, useCallback(() => remisService.getRelocationCases(), []));
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'Active' | 'Financials' | 'Policy'>('Active');
    const [view, setView] = useState<'list' | 'detail' | 'createCase' | 'addBenefit'>('list');
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();
    
    const selectedCase = useMemo(() => cases.find(c => c.id === selectedCaseId), [cases, selectedCaseId]);

    const filteredCases = useMemo(() => cases.filter(c => 
        c.displacedPersonName.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        c.id.toLowerCase().includes(deferredSearch.toLowerCase())
    ), [cases, deferredSearch]);

    const handleUpdate = (updated: RelocationCase) => {
        startTransition(() => {
            remisService.updateRelocationCase(updated);
        });
        addToast('Authoritative case updated.', 'info');
    };
    
    const totalBenefitLiability = useMemo(() => 
        cases.reduce((sum, c) => sum + c.benefits.reduce((bs, b) => bs + b.amount, 0), 0),
    [cases]);

    if (selectedCase && view === 'detail') {
        return <RelocationCaseDetail caseData={selectedCase} onUpdate={handleUpdate} onBack={() => { setView('list'); setSelectedCaseId(null); }} onNavigateToAddBenefit={() => setView('addBenefit')} onDelete={() => {}} onNavigateToAcquisition={onNavigateToAcquisition} />;
    }

    return (
        <div className={`flex flex-col h-full bg-zinc-50/50 animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {/* Feature Tabs */}
            <div className="px-6 bg-white border-b border-zinc-200 flex justify-between items-end shrink-0">
                <div className="flex gap-8">
                    {(['Active', 'Financials', 'Policy'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                                activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab === 'Active' ? 'Case Registry' : tab === 'Financials' ? 'Benefit Matrix' : 'Statutory Reference'}
                        </button>
                    ))}
                </div>
                <div className="pb-3">
                    <button onClick={() => setView('createCase')} className={`p-2 text-white rounded-xl ${REMIS_THEME.classes.buttonPrimary}`}><Plus size={16}/></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {activeTab === 'Active' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm text-center">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Open Cases</p>
                                <p className="text-2xl font-mono font-bold text-zinc-900">{cases.length}</p>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm text-center">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Assistance Provided</p>
                                <p className="text-2xl font-mono font-bold text-emerald-700">{cases.filter(c=>c.status === 'Assistance Provided').length}</p>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm text-center lg:col-span-2">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Liability Pool</p>
                                <p className="text-2xl font-mono font-bold text-rose-700">{formatCurrency(totalBenefitLiability)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {filteredCases.map(c => (
                                <div key={c.id} onClick={() => { setSelectedCaseId(c.id); setView('detail'); }} className="bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer group flex justify-between items-center">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors"><Users size={20}/></div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-sm font-bold text-zinc-900">{c.displacedPersonName}</h4>
                                                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded border bg-zinc-50 text-zinc-500">{c.status}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500">Asset: <span className="font-mono font-bold text-zinc-800">{c.assetId}</span> • Entity: {c.displacedEntityType}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-zinc-200 group-hover:text-emerald-600 transition-all" />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'Financials' && (
                     <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm h-[500px] flex flex-col items-center justify-center text-center gap-4">
                         <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl shadow-inner"><DollarSign size={32}/></div>
                         <h3 className="text-lg font-bold text-zinc-900">Programmatic Benefit Analysis</h3>
                         <p className="text-xs text-zinc-400 max-w-sm">Detailed financial roll-up of moving expenses and replacement housing payments across the district.</p>
                         <button className="mt-4 px-6 py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">Generate Audit Packet</button>
                     </div>
                )}

                {activeTab === 'Policy' && (
                    <div className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded-3xl p-10 shadow-sm space-y-10">
                        <div className="flex items-center gap-4 border-b border-zinc-50 pb-6">
                            <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl"><Gavel size={24}/></div>
                            <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Public Law 91-646 (URA)</h3>
                        </div>
                        <div className="space-y-6 text-sm text-zinc-600 leading-relaxed font-serif">
                            <p>The Uniform Relocation Assistance and Real Property Acquisition Policies Act of 1970 (URA) provides important protections and assistance for people affected by federally funded projects.</p>
                            <p><strong>Fiduciary Duty:</strong> USACE must ensure that displaced persons will not suffer disproportionate injuries as a result of programs designed for the benefit of the public as a whole.</p>
                        </div>
                    </div>
                )}
            </div>
            {view === 'createCase' && <RelocationCaseForm onClose={() => setView('list')} onSubmit={(c) => {remisService.addRelocationCase(c); setView('list');}} />}
        </div>
    );
};

export default RelocationDashboard;
