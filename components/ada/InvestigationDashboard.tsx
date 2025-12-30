import React, { useState, useTransition } from 'react';
import { UserCheck } from 'lucide-react';
import { ADAInvestigation, InvestigatingOfficer } from '../../types';
import EvidenceSection from './investigation/EvidenceSection';
import ResponsibilitySection from './investigation/ResponsibilitySection';
import InvestigatingOfficerModal from './InvestigatingOfficerModal';

interface Props {
    investigation: ADAInvestigation | undefined;
    violationOrg: string;
    onUpdate: (inv: ADAInvestigation) => void;
    onCreate: (io: InvestigatingOfficer) => void;
}

const InvestigationDashboard: React.FC<Props> = ({ investigation, violationOrg, onUpdate, onCreate }) => {
    const [activeTab, setActiveTab] = useState<'Evidence' | 'Responsibility'>('Evidence');
    const [showIOModal, setShowIOModal] = useState(false);
    const [newEvidenceDesc, setNewEvidenceDesc] = useState('');
    const [respForm, setRespForm] = useState({ name: '', pos: '', cause: '' });
    const [isPending, startTransition] = useTransition();

    if (!investigation) return <div className="p-12 text-center flex flex-col items-center justify-center gap-4 h-full"><button onClick={() => setShowIOModal(true)} className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest">Appoint IO</button>{showIOModal && <InvestigatingOfficerModal violationOrg={violationOrg} onClose={() => setShowIOModal(false)} onAppoint={onCreate} />}</div>;

    const handleAddEvidence = () => {
        const item = { id: `EV-${Date.now()}`, description: newEvidenceDesc, source: 'Manual', supportsConclusion: true, dateCollected: new Date().toISOString() };
        startTransition(() => { onUpdate({ ...investigation, evidence: [...investigation.evidence, item] }); setNewEvidenceDesc(''); });
    };

    const handleAddResp = () => {
        const party = { id: `RP-${Date.now()}`, name: respForm.name, position: respForm.pos, involvementDescription: 'Identified', proximateCauseAnalysis: respForm.cause, rebuttalReceived: false, isConfirmed: false };
        startTransition(() => { onUpdate({ ...investigation, responsibleParties: [...investigation.responsibleParties, party] }); setRespForm({ name: '', pos: '', cause: '' }); });
    };

    return (
        <div className={`flex flex-col h-full bg-zinc-50/50 transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center border border-zinc-200"><UserCheck size={20} /></div><div><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">IO</p><p className="text-sm font-bold text-zinc-900">{investigation.investigatingOfficer?.rank} {investigation.investigatingOfficer?.name}</p></div></div>
                <div className="flex gap-4">{['Evidence', 'Responsibility'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400'}`}>{tab}</button>))}</div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'Evidence' && <EvidenceSection evidence={investigation.evidence} onAdd={handleAddEvidence} newDesc={newEvidenceDesc} setNewDesc={setNewEvidenceDesc} />}
                {activeTab === 'Responsibility' && <ResponsibilitySection parties={investigation.responsibleParties} onAdd={handleAddResp} form={respForm} setForm={setRespForm} />}
            </div>
        </div>
    );
};
export default InvestigationDashboard;