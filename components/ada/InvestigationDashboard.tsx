
import React, { useState } from 'react';
import { 
    Briefcase, FileText, Users, Scale, Clock, CheckCircle2, 
    AlertTriangle, Plus, Trash2, ChevronRight, FileCheck, Gavel 
} from 'lucide-react';
import { ADAInvestigation, InvestigatingOfficer, EvidenceItem, ResponsibleParty } from '../../types';
import InvestigatingOfficerModal from './InvestigatingOfficerModal';

interface Props {
    investigation: ADAInvestigation | undefined;
    violationOrg: string;
    onUpdate: (inv: ADAInvestigation) => void;
    onCreate: (io: InvestigatingOfficer) => void;
}

const InvestigationDashboard: React.FC<Props> = ({ investigation, violationOrg, onUpdate, onCreate }) => {
    const [activeTab, setActiveTab] = useState<'Evidence' | 'Findings' | 'Responsibility' | 'ROI'>('Evidence');
    const [showIOModal, setShowIOModal] = useState(false);

    // Local form states
    const [newEvidenceDesc, setNewEvidenceDesc] = useState('');
    const [newResponsibleName, setNewResponsibleName] = useState('');
    const [newResponsiblePosition, setNewResponsiblePosition] = useState('');
    const [proximateCause, setProximateCause] = useState('');

    if (!investigation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="bg-zinc-50 p-6 rounded-full border border-zinc-200 mb-6">
                    <Briefcase size={32} className="text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">No Formal Investigation Active</h3>
                <p className="text-sm text-zinc-500 max-w-md mb-6">
                    Initiate a formal investigation to appoint an Investigating Officer (IO) and begin the evidence collection process per DoD FMR Vol 14.
                </p>
                <button 
                    onClick={() => setShowIOModal(true)} 
                    className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-zinc-800 transition-colors shadow-lg"
                >
                    Appoint Investigating Officer
                </button>
                {showIOModal && (
                    <InvestigatingOfficerModal 
                        violationOrg={violationOrg} 
                        onClose={() => setShowIOModal(false)}
                        onAppoint={onCreate}
                    />
                )}
            </div>
        );
    }

    const handleAddEvidence = () => {
        if (!newEvidenceDesc) return;
        const newItem: EvidenceItem = {
            id: `EV-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            description: newEvidenceDesc,
            source: 'Manual Entry',
            supportsConclusion: true,
            dateCollected: new Date().toISOString().split('T')[0]
        };
        onUpdate({ ...investigation, evidence: [...investigation.evidence, newItem] });
        setNewEvidenceDesc('');
    };

    const handleAddResponsibleParty = () => {
        if (!newResponsibleName || !proximateCause) return;
        const newParty: ResponsibleParty = {
            id: `RP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            name: newResponsibleName,
            position: newResponsiblePosition,
            involvementDescription: 'Identified during formal investigation.',
            proximateCauseAnalysis: proximateCause,
            rebuttalReceived: false,
            isConfirmed: false
        };
        onUpdate({ ...investigation, responsibleParties: [...investigation.responsibleParties, newParty] });
        setNewResponsibleName('');
        setNewResponsiblePosition('');
        setProximateCause('');
    };

    const generateROIPreview = () => {
        return `
DOD COMPONENT REPORT OF ANTIDEFICIENCY ACT VIOLATION
Case No: ${investigation.violationId}

1. INVESTIGATING OFFICER
   Name: ${investigation.investigatingOfficer?.name}
   Rank: ${investigation.investigatingOfficer?.rank}
   Date Appointed: ${investigation.investigatingOfficer?.dateAppointed || 'N/A'}

2. EVIDENCE SUMMARY
   ${investigation.evidence.map(e => `- ${e.description} (${e.dateCollected})`).join('\n   ')}

3. FINDINGS OF FACT
   ${investigation.findings.map((f, i) => `${i+1}. ${f}`).join('\n   ')}

4. RESPONSIBLE OFFICIALS
   ${investigation.responsibleParties.map(rp => 
       `Name: ${rp.name}
    Position: ${rp.position}
    Proximate Cause: ${rp.proximateCauseAnalysis}
    Rebuttal Status: ${rp.rebuttalReceived ? 'Received' : 'Pending (2-week suspense)'}`
   ).join('\n\n   ')}

5. CORRECTIVE ACTIONS
   ${investigation.correctiveActions.join('\n   ')}
        `;
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50">
            {/* IO Header */}
            <div className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200">
                        <UserCheckIcon className="text-zinc-600" size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Investigating Officer</p>
                        <p className="text-sm font-bold text-zinc-900">{investigation.investigatingOfficer?.rank} {investigation.investigatingOfficer?.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stage</p>
                        <p className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{investigation.stage}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Suspense</p>
                        <p className="text-xs font-mono font-bold text-zinc-800">{investigation.suspenseDate}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 pt-4 flex gap-1 border-b border-zinc-200 bg-white shrink-0">
                {['Evidence', 'Findings', 'Responsibility', 'ROI'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wide border-b-2 transition-all ${
                            activeTab === tab 
                            ? 'border-zinc-900 text-zinc-900' 
                            : 'border-transparent text-zinc-400 hover:text-zinc-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Workspace Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                
                {activeTab === 'Evidence' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText size={14} /> Physical Evidence Log
                            </h4>
                            <div className="space-y-3 mb-6">
                                {investigation.evidence.map(item => (
                                    <div key={item.id} className="flex items-start justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-zinc-800">{item.description}</p>
                                            <p className="text-[10px] text-zinc-500 mt-1">Source: {item.source} • Collected: {item.dateCollected}</p>
                                        </div>
                                        {item.supportsConclusion && (
                                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Supported
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={newEvidenceDesc}
                                    onChange={(e) => setNewEvidenceDesc(e.target.value)}
                                    placeholder="Enter description of evidence..."
                                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-400"
                                />
                                <button onClick={handleAddEvidence} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800">Add Item</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Findings' && (
                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm animate-in fade-in h-full flex flex-col">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Fact Finding & Analysis</h4>
                        <p className="text-xs text-zinc-500 mb-4">Establish facts by a preponderance of the evidence.</p>
                        <textarea 
                            className="flex-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 resize-none font-mono leading-relaxed"
                            value={investigation.findings.join('\n\n')}
                            onChange={(e) => onUpdate({ ...investigation, findings: e.target.value.split('\n\n') })}
                        />
                    </div>
                )}

                {activeTab === 'Responsibility' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* List */}
                            <div className="space-y-4">
                                {investigation.responsibleParties.map(rp => (
                                    <div key={rp.id} className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm relative group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h5 className="text-sm font-bold text-zinc-900">{rp.name}</h5>
                                                <p className="text-xs text-zinc-500">{rp.position}</p>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${rp.rebuttalReceived ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                                {rp.rebuttalReceived ? 'Rebuttal Received' : 'Rebuttal Pending'}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-zinc-50 rounded border border-zinc-100 text-xs text-zinc-700 mt-2">
                                            <span className="font-bold text-zinc-900">Proximate Cause:</span> {rp.proximateCauseAnalysis}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Form */}
                            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-fit">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Gavel size={14} /> Assign Responsibility
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Name</label>
                                        <input 
                                            type="text" 
                                            value={newResponsibleName}
                                            onChange={e => setNewResponsibleName(e.target.value)}
                                            className="w-full mt-1 bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Position</label>
                                        <input 
                                            type="text" 
                                            value={newResponsiblePosition}
                                            onChange={e => setNewResponsiblePosition(e.target.value)}
                                            className="w-full mt-1 bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Proximate Cause (But-For Test)</label>
                                        <textarea 
                                            value={proximateCause}
                                            onChange={e => setProximateCause(e.target.value)}
                                            rows={3}
                                            className="w-full mt-1 bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs resize-none"
                                            placeholder="Explain how this individual's act or omission directly caused the violation..."
                                        />
                                    </div>
                                    <button 
                                        onClick={handleAddResponsibleParty}
                                        className="w-full py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800"
                                    >
                                        Add Responsible Officer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ROI' && (
                    <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm animate-in fade-in h-full overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                <FileCheck size={14} /> Report of Investigation Preview
                            </h4>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-1 rounded font-bold uppercase">Format: Figure 3-5</span>
                            </div>
                        </div>
                        <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg p-6 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-800">
                            {generateROIPreview()}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

// Helper Icon
const UserCheckIcon = ({size, className}: {size: number, className: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
)

export default InvestigationDashboard;
