
import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { MOCK_ADA_VIOLATIONS, MOCK_INVESTIGATIONS } from '../../constants';
import { ADAViolation, ADAInvestigation, InvestigatingOfficer } from '../../types';
import ViolationList from './ViolationList';
import ViolationForm from './ViolationForm';
import InvestigationDashboard from './InvestigationDashboard';

const ViolationManager: React.FC = () => {
  const [violations, setViolations] = useState<ADAViolation[]>(MOCK_ADA_VIOLATIONS);
  const [investigations, setInvestigations] = useState<ADAInvestigation[]>(MOCK_INVESTIGATIONS);
  const [selectedViolation, setSelectedViolation] = useState<ADAViolation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const activeInvestigation = useMemo(() => 
    investigations.find(i => i.violationId === selectedViolation?.id), 
  [selectedViolation, investigations]);

  const filteredViolations = useMemo(() => violations.filter(v => 
    v.id.includes(searchTerm) || v.type.includes(searchTerm)
  ), [violations, searchTerm]);

  const handleCreateViolation = (newViolation: ADAViolation) => {
    setViolations(prev => [newViolation, ...prev]);
    setIsFormOpen(false);
  };

  const handleCreateInvestigation = (io: InvestigatingOfficer) => {
    if (!selectedViolation) return;
    const newInv: ADAInvestigation = {
      id: `INV-${Date.now()}`,
      violationId: selectedViolation.id,
      stage: 'IO Appointment',
      investigatingOfficer: io,
      startDate: new Date().toISOString().split('T')[0],
      suspenseDate: 'TBD', // Logic for 14-month calc would go here
      evidence: [], findings: [], responsibleParties: [], correctiveActions: [],
      legalReviewStatus: 'Pending', advanceDecisionStatus: 'Pending'
    };
    setInvestigations(prev => [...prev, newInv]);
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* List Panel - Hidden on mobile if specific violation selected */}
      <div className={`w-full md:w-80 border-r border-zinc-200 flex flex-col bg-white ${selectedViolation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-zinc-100 flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"/>
            <input type="text" placeholder="Search Case ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400"/>
          </div>
          <button onClick={() => setIsFormOpen(true)} className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"><Plus size={16}/></button>
        </div>
        <ViolationList violations={filteredViolations} selectedId={selectedViolation?.id} onSelect={setSelectedViolation} />
      </div>

      {/* Detail Panel */}
      <div className={`flex-1 bg-zinc-50/50 flex flex-col overflow-hidden ${!selectedViolation ? 'hidden md:flex' : 'flex'}`}>
        {selectedViolation ? (
          <div className="flex-1 flex flex-col min-h-0">
             {/* Mobile Back Button */}
             <div className="md:hidden p-4 border-b border-zinc-200 bg-white">
                <button onClick={() => setSelectedViolation(null)} className="text-xs font-bold text-blue-600">← Back to List</button>
             </div>
             <InvestigationDashboard 
                investigation={activeInvestigation} 
                violationOrg={selectedViolation.organization}
                onUpdate={(updated) => setInvestigations(invs => invs.map(i => i.id === updated.id ? updated : i))}
                onCreate={handleCreateInvestigation}
             />
          </div>
        ) : (
            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">Select a violation to manage investigation.</div>
        )}
      </div>
      {isFormOpen && <ViolationForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreateViolation} />}
    </div>
  );
};

export default ViolationManager;
