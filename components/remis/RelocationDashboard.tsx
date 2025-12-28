import React, { useState, useEffect, useMemo, useDeferredValue, useTransition } from 'react';
import { Users, Search, Plus } from 'lucide-react';
import { RelocationCase, RelocationBenefit, RelocationDashboardProps } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { REMIS_THEME } from '../../constants';
import { useToast } from '../shared/ToastContext';
import RelocationCaseDetail from './RelocationCaseDetail';
import RelocationCaseForm from './RelocationCaseForm';
import BenefitForm from './BenefitForm';
import EmptyState from '../shared/EmptyState';

const RelocationDashboard: React.FC<RelocationDashboardProps> = ({ onNavigateToAcquisition }) => {
    const [view, setView] = useState<'list' | 'detail' | 'createCase' | 'addBenefit'>('list');
    const [cases, setCases] = useState<RelocationCase[]>(remisService.getRelocationCases());
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();
    
    const selectedCase = useMemo(() => cases.find(c => c.id === selectedCaseId), [cases, selectedCaseId]);

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setCases([...remisService.getRelocationCases()]);
        });
        return unsubscribe;
    }, []);

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
    
    const handleDelete = (id: string) => {
        if(!confirm("Permanent record deletion: Proceed?")) return;
        startTransition(() => {
            remisService.deleteRelocationCase(id);
            setSelectedCaseId(null);
            setView('list');
        });
    };

    const renderDetailView = () => {
        if (!selectedCase) return <EmptyState icon={Users} title="Relocation Center" description="Select an active case to manage displacement benefits." />;
        switch (view) {
            case 'createCase': return <RelocationCaseForm onClose={() => setView('list')} onSubmit={(c) => {remisService.addRelocationCase(c); setView('list');}} />;
            case 'addBenefit': return <BenefitForm caseData={selectedCase} onClose={() => setView('detail')} onSave={() => setView('detail')} />;
            case 'detail': return <RelocationCaseDetail caseData={selectedCase} onUpdate={handleUpdate} onBack={() => { setView('list'); setSelectedCaseId(null); }} onNavigateToAddBenefit={() => setView('addBenefit')} onDelete={handleDelete} onNavigateToAcquisition={onNavigateToAcquisition} />;
            default: return null;
        }
    };

    return (
        <div className={`flex flex-col md:flex-row h-full overflow-hidden transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className={`w-full md:w-[400px] border-r border-zinc-200 flex-col bg-zinc-50 ${view === 'list' ? 'flex' : 'hidden md:flex'}`}>
                <div className="p-4 border-b border-zinc-200 space-y-3 shrink-0">
                    <div className="flex justify-between items-center">
                         <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2"><Users size={16}/> Case Inventory</h3>
                         <button onClick={() => setView('createCase')} className={`p-2 text-white rounded-xl ${REMIS_THEME.classes.buttonPrimary}`}><Plus size={16}/></button>
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Filter by name..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            className={`w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${REMIS_THEME.classes.inputFocus}`}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {filteredCases.map(c => (
                        <button key={c.id} onClick={() => { setSelectedCaseId(c.id); setView('detail'); }} className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedCaseId === c.id ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl scale-[1.01]' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono font-bold opacity-60">{c.id}</span>
                                <span className="text-[9px] font-bold uppercase">{c.status}</span>
                            </div>
                            <p className="text-sm font-bold truncate">{c.displacedPersonName}</p>
                            <p className="text-[10px] opacity-60 mt-1">{c.displacedEntityType}</p>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-white overflow-hidden flex flex-col">{renderDetailView()}</div>
        </div>
    );
};

export default RelocationDashboard;