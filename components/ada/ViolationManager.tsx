import React, { useState, useMemo, useTransition } from 'react';
import { Search, Plus, Gavel, Filter } from 'lucide-react';
import { MOCK_ADA_VIOLATIONS, MOCK_INVESTIGATIONS } from '../../constants';
import { ADAViolation, ADAInvestigation, InvestigatingOfficer } from '../../types';
import ViolationList from './ViolationList';
import ViolationForm from './ViolationForm';
import InvestigationDashboard from './InvestigationDashboard';

const ViolationManager: React.FC = () => {
  const [violations, setViolations] = useState<ADAViolation[]>(MOCK_ADA_VIOLATIONS);
  const [investigations, setInvestigations] = useState<ADAInvestigation[]>(MOCK_INVESTIGATIONS);
  const [selectedViolationId, setSelectedViolationId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const selectedViolation = useMemo(() => 
    violations.find(v => v.id === selectedViolationId),
  [violations, selectedViolationId]);

  const activeInvestigation = useMemo(() => 
    investigations.find(i => i.violationId === selectedViolationId), 
  [selectedViolationId, investigations]);

  const handleCreateViolation = (newViolation: ADAViolation) => {
    setViolations(prev => [newViolation, ...prev]);
    setIsFormOpen(false);
  };

  const handleCreateInvestigation = (io: InvestigatingOfficer) => {
    if (!selectedViolationId) return;
    const newInv: ADAInvestigation = {
      id: `INV-${Date.now()}`,
      violationId: selectedViolationId,
      stage: 'IO Appointment',
      investigatingOfficer: io,
      startDate: new Date().toISOString().split('T')[0],
      suspenseDate: 'TBD',
      evidence: [], findings: [], responsibleParties: [], correctiveActions: [],
      legalReviewStatus: 'Pending', advanceDecisionStatus: 'Pending'
    };
    setInvestigations(prev => [...prev, newInv]);
  };

  const handleSelectViolation = (v: ADAViolation) => {
    startTransition(() => {
        setSelectedViolationId(v.id);
    });
  };

  return (
    <div className={`flex flex-col md:flex-row h-full overflow-hidden transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
      <div className={`w-full md:w-80 border-r border-zinc-200 flex flex-col bg-white ${selectedViolationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-zinc-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Gavel size={14}/> Case Ledger
            </h3>
            <button onClick={() => setIsFormOpen(true)} className="p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
              <Plus size={14}/>
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"/>
            <input 
              type="text" 
              placeholder="Search Case ID..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full pl-8 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400 transition-all"
            />
          </div>
        </div>
        <ViolationList 
          violations={violations.filter(v => v.id.includes(searchTerm))} 
          selectedId={selectedViolationId || undefined} 
          onSelect={handleSelectViolation} 
        />
      </div>

      <div className={`flex-1 bg-zinc-50/50 flex flex-col overflow-hidden ${!selectedViolationId ? 'hidden md:flex' : 'flex'}`}>
        {selectedViolation ? (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in">
             <div className="md:hidden p-4 border-b border-zinc-200 bg-white">
                <button onClick={() => setSelectedViolationId(null)} className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1">← Back to Ledger</button>
             </div>
             <InvestigationDashboard 
                investigation={activeInvestigation} 
                violationOrg={selectedViolation.organization}
                onUpdate={(updated) => setInvestigations(invs => invs.map(i => i.id === updated.id ? updated : i))}
                onCreate={handleCreateInvestigation}
             />
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4">
              <div className="p-6 bg-zinc-100 rounded-full border border-zinc-200 border-dashed">
                <Gavel size={48} className="opacity-20"/>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest">Select an ADA Case to Review</p>
            </div>
        )}
      </div>
      {isFormOpen && <ViolationForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreateViolation} />}
    </div>
  );
};

export default ViolationManager;