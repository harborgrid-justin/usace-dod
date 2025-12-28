import React, { useState, useTransition } from 'react';
import { 
    Briefcase, FileText, Users, Scale, Clock, CheckCircle2, 
    AlertTriangle, Plus, Trash2, ChevronRight, FileCheck, Gavel, UserCheck
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
    const [isPending, startTransition] = useTransition();

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
                <p className="text-sm text-zinc-500 max-w-md mb-6 leading-relaxed">
                    Initiate a formal investigation to appoint an Investigating Officer (IO) and begin the evidence collection process per DoD FMR Vol 14.
                </p>
                <button 
                    onClick={() => setShowIOModal(true)} 
                    className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg"
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
            id: `EV-${Date.now().toString().slice(-4)}`,
            description: newEvidenceDesc,
            source: 'Manual Entry',
            supportsConclusion: true,
            dateCollected: new Date().toISOString().split('T')[0]
        };
        startTransition(() => {
            onUpdate({ ...investigation, evidence: [...investigation.evidence, newItem] });
            setNewEvidenceDesc('');
        });
    };

    const handleAddResponsibleParty = () => {
        if (!newResponsibleName || !proximateCause) return;
        const newParty: ResponsibleParty = {
            id: `RP-${Date.now().toString().slice(-4)}`,
            name: newResponsibleName,
            position: newResponsiblePosition,
            involvementDescription: 'Identified during formal investigation.',
            proximateCauseAnalysis: proximateCause,
            rebuttalReceived: false,
            isConfirmed: false
        };
        startTransition(() => {
            onUpdate({ ...investigation, responsibleParties: [...investigation.responsibleParties, newParty] });
            setNewResponsibleName('');
            setNewResponsiblePosition('');
            setProximateCause('');
        });
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
        <div className={`flex flex-col h-full bg-zinc-50/50 transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center border border-zinc-200">
                        <UserCheck className="text-zinc-600" size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Investigating Officer</p>
                        <p className="text-sm font-bold text-zinc-900">{investigation.investigatingOfficer?.rank} {investigation.investigatingOfficer?.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stage</p>
                        <p className="text-xs font-bold text-blue-600 uppercase mt-1">{investigation.stage}</p>
                    </div>
                    <div className="h-8 w-px bg-zinc-100" />
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Suspense</p>
                        <p className="text-xs font-mono font-bold text-rose-700 mt-1">{investigation.suspenseDate || 'TBD'}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 pt-2 flex gap-1 border-b border-zinc-200 bg-white shrink-0">
                {['Evidence', 'Findings', 'Responsibility', 'ROI'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                            activeTab === tab 
                            ? 'border-zinc-900 text-zinc-900' 
                            : 'border-transparent text-zinc-400 hover:text-zinc-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                
                {activeTab === 'Evidence' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <FileText size={14} className="text-zinc-400" /> Physical Evidence Log
                            </h4>
                            <div className="space-y-3 mb-8">
                                {investigation.evidence.map(item => (
                                    <div key={item.id} className="flex items-start justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-xl group hover:border-zinc-300 transition-all">
                                        <div className="flex gap-4">
                                            <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-400 group-hover:text-zinc-900 transition-colors"><FileText size={16}/></div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-800">{item.description}</p>
                                                <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">Source: {item.source} • Collected: {item.dateCollected}</p>
                                            </div>
                                        </div>
                                        {item.supportsConclusion && (
                                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1 uppercase tracking-tighter">
                                                <CheckCircle2 size={10} /> Verified
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
                                    placeholder="Enter description of evidence (e.g. CEFMS Transaction Log)..."
                                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-zinc-400 transition-all"
                                />
                                <button onClick={handleAddEvidence} className="px-5 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-all shadow-sm">Add Item</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Findings' && (
                    <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm animate-in fade-in h-full flex flex-col">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Findings of Fact & Logic</h4>
                        <p className="text-xs text-zinc-500 mb-6 italic">Establish facts by a preponderance of the evidence per FMR Vol 14 Ch 3.</p>
                        <textarea 
                            className="flex-1 w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 resize-none font-mono leading-relaxed shadow-inner"
                            value={investigation.findings.join('\n\n')}
                            onChange={(e) => onUpdate({ ...investigation, findings: e.target.value.split('\n\n') })}
                            placeholder="Enter findings here..."
                        />
                    </div>
                )}

                {activeTab === 'Responsibility' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-4">
                                {investigation.responsibleParties.map(rp => (
                                    <div key={rp.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative group hover:border-rose-200 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h5 className="text-base font-bold text-zinc-900">{rp.name}</h5>
                                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{rp.position}</p>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase border shadow-sm ${rp.rebuttalReceived ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                                {rp.rebuttalReceived ? 'Rebuttal Received' : 'Rebuttal Pending'}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-700 leading-relaxed shadow-inner">
                                            <span className="font-bold text-zinc-900 uppercase tracking-tighter text-[10px] block mb-1">Proximate Cause (But-For Test):</span> 
                                            {rp.proximateCauseAnalysis}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm h-fit sticky top-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Gavel size={16} className="text-rose-600" /> Assign Responsibility
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Official Name</label>
                                        <input 
                                            type="text" 
                                            value={newResponsibleName}
                                            onChange={e => setNewResponsibleName(e.target.value)}
                                            className="w-full mt-1.5 border rounded-xl p-2.5 text-xs bg-zinc-50 focus:bg-white focus:border-zinc-400 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Position / Grade</label>
                                        <input 
                                            type="text" 
                                            value={newResponsiblePosition}
                                            onChange={e => setNewResponsiblePosition(e.target.value)}
                                            className="w-full mt-1.5 border rounded-xl p-2.5 text-xs bg-zinc-50 focus:bg-white focus:border-zinc-400 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Proximate Cause Basis</label>
                                        <textarea 
                                            value={proximateCause}
                                            onChange={e => setProximateCause(e.target.value)}
                                            rows={4}
                                            className="w-full mt-1.5 border rounded-xl p-2.5 text-xs bg-zinc-50 focus:bg-white focus:border-zinc-400 outline-none transition-all resize-none"
                                            placeholder="Determine how this official's act caused the violation..."
                                        />
                                    </div>
                                    <button 
                                        onClick={handleAddResponsibleParty}
                                        className="w-full py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                                    >
                                        Post Responsibility Entry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ROI' && (
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm animate-in fade-in h-full overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-100">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                <FileCheck size={18} className="text-emerald-600" /> Report of Investigation (ROI) Preview
                            </h4>
                            <div className="flex gap-3">
                                <span className="text-[9px] bg-zinc-100 text-zinc-500 px-3 py-1.5 rounded-lg font-bold uppercase border border-zinc-200">Regulatory Format: Figure 3-5</span>
                                <button className="p-2 border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-900 transition-all"><FileText size={16}/></button>
                            </div>
                        </div>
                        <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-800 shadow-inner">
                            {generateROIPreview()}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default InvestigationDashboard;