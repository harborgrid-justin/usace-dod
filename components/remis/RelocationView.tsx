import React, { useState, useEffect } from 'react';
import { Users, Search, Plus } from 'lucide-react';
import { RelocationCase, RelocationBenefit } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { REMIS_THEME } from '../../constants';
import { useToast } from '../shared/ToastContext';
import RelocationCaseDetail from './RelocationCaseDetail';
import RelocationCaseForm from './RelocationCaseForm';
import BenefitForm from './BenefitForm';
import EmptyState from '../shared/EmptyState';

// --- Sub-Component: CaseList ---
interface CaseListProps {
    cases: RelocationCase[];
    onSelect: (c: RelocationCase) => void;
    selectedId: string | null;
}
const CaseList: React.FC<CaseListProps> = ({ cases, onSelect, selectedId }) => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {cases.map(c => (
                <button
                    key={c.id}
                    onClick={() => onSelect(c)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedId === c.id 
                        ? 'bg-emerald-100 border-emerald-300' 
                        : 'bg-white border-zinc-200 hover:border-emerald-300'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono font-bold text-zinc-800">{c.id}</span>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                            c.eligibilityStatus === 'Eligible' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>{c.eligibilityStatus}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-900 truncate">{c.displacedPersonName}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">{c.displacedEntityType}</p>
                </button>
            ))}
             {cases.length === 0 && (
                <div className="text-center py-12 text-zinc-400">
                    <Search size={32} className="mx-auto opacity-20 mb-2" />
                    <p className="text-xs">No cases found.</p>
                </div>
            )}
        </div>
    );
};


// --- Main View Component ---
const RelocationView: React.FC = () => {
    const [view, setView] = useState<'list' | 'detail' | 'createCase' | 'addBenefit'>('list');
    const [cases, setCases] = useState<RelocationCase[]>(remisService.getRelocationCases());
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();
    
    const selectedCase = cases.find(c => c.id === selectedCaseId);

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setCases(remisService.getRelocationCases());
        });
        return unsubscribe;
    }, []);

    const filteredCases = cases.filter(c => 
        c.displacedPersonName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = (newCase: RelocationCase) => {
        remisService.addRelocationCase(newCase);
        addToast('Relocation case created successfully.', 'success');
        setView('list');
    };

    const handleUpdate = (updated: RelocationCase) => {
        remisService.updateRelocationCase(updated);
        addToast('Case updated.', 'info');
    };
    
    const handleAddBenefit = (caseId: string, newBenefit: Omit<RelocationBenefit, 'id' | 'status'>) => {
        const caseToUpdate = cases.find(c => c.id === caseId);
        if(!caseToUpdate) return;
        
        const benefitToAdd: RelocationBenefit = {
            id: `BEN-${Date.now().toString().slice(-5)}`,
            ...newBenefit,
            status: 'Pending'
        };

        const updatedCase = {
            ...caseToUpdate,
            benefits: [...caseToUpdate.benefits, benefitToAdd],
            auditLog: [...caseToUpdate.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'REMIS_MGR',
                action: `Benefit Added: ${benefitToAdd.type}`
            }]
        };

        remisService.updateRelocationCase(updatedCase);
        addToast('New benefit added for review.', 'success');
        setView('detail');
    };

    // View Renderer
    const renderContent = () => {
        switch (view) {
            case 'createCase':
                return <RelocationCaseForm onClose={() => setView('list')} onSubmit={handleCreate} />;
            case 'addBenefit':
                if (selectedCase) {
                    return <BenefitForm caseData={selectedCase} onClose={() => setView('detail')} onSave={(benefit) => handleAddBenefit(selectedCase.id, benefit)} />;
                }
                return setView('list');
            case 'detail':
                if (selectedCase) {
                    return <RelocationCaseDetail 
                        caseData={selectedCase} 
                        onUpdate={handleUpdate} 
                        onBack={() => setView('list')} 
                        onNavigateToAddBenefit={() => setView('addBenefit')}
                    />;
                }
                return setView('list');
            case 'list':
            default:
                return (
                    <div className="flex-1 bg-white flex flex-col overflow-hidden">
                        <EmptyState 
                            icon={Users} 
                            title="Relocation Management"
                            description="Select a case from the list to view its lifecycle, manage benefits, and review documentation."
                        />
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
            <div className="w-full md:w-[400px] border-r border-zinc-200 flex flex-col bg-zinc-50">
                <div className="p-4 border-b border-zinc-200 space-y-3 shrink-0">
                    <div className="flex justify-between items-center">
                         <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Users size={16}/> Relocation Cases</h3>
                         <button onClick={() => setView('createCase')} className={`p-1.5 text-white rounded-md ${REMIS_THEME.classes.buttonPrimary}`}><Plus size={16}/></button>
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input type="text" placeholder="Search cases..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-8 pr-2 py-1.5 text-xs border border-zinc-200 rounded-lg"/>
                    </div>
                </div>
                <CaseList 
                    cases={filteredCases} 
                    onSelect={(c) => { setSelectedCaseId(c.id); setView('detail'); }} 
                    selectedId={selectedCaseId} 
                />
            </div>
            
            {renderContent()}
        </div>
    );
};

export default RelocationView;
