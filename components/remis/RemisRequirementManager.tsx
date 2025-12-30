
import React, { useState, useMemo } from 'react';
import { FilePlus, Search, Plus, Database, ArrowRight, Gavel, History, ClipboardCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import EmptyState from '../shared/EmptyState';
import Badge from '../shared/Badge';
import Modal from '../shared/Modal';
import { useToast } from '../shared/ToastContext';
import { remisService } from '../../services/RemisDataService';

interface RPA_Requirement {
    id: string;
    title: string;
    priority: 'Critical' | 'High' | 'Normal';
    estCost: number;
    wbsCode: string;
    status: 'Identifying' | 'Validation' | 'G-8 Review' | 'Ready for Solicitation';
    justification: string;
}

const RemisRequirementManager: React.FC = () => {
    const [reqs, setReqs] = useState<RPA_Requirement[]>([
        { id: 'REQ-101', title: 'Perimeter Security Upgrade - Fort Knox', priority: 'High', estCost: 1250000, wbsCode: 'FK.24.S1', status: 'G-8 Review', justification: 'Mitigation of identified trespass risks at North Gate.' },
        { id: 'REQ-102', title: 'HVAC Modernization - District HQ', priority: 'Normal', estCost: 450000, wbsCode: 'HQ.24.M2', status: 'Validation', justification: 'Energy efficiency mandate compliance.' }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
    const { addToast } = useToast();

    const selectedReq = useMemo(() => reqs.find(r => r.id === selectedReqId), [reqs, selectedReqId]);
    const filtered = reqs.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.includes(searchTerm));

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        
        const req: RPA_Requirement = {
            id: `REQ-${Date.now().toString().slice(-4)}`,
            title: data.get('title') as string,
            wbsCode: data.get('wbsCode') as string,
            estCost: Number(data.get('estCost')),
            priority: data.get('priority') as any,
            status: 'Identifying',
            justification: data.get('justification') as string
        };

        setReqs([req, ...reqs]);
        setIsFormOpen(false);
        addToast(`Requirement ${req.id} established in ledger.`, 'success');
    };

    const handleAdvance = (id: string) => {
        setReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Ready for Solicitation' } : r));
        addToast('Requirement validated for market research.', 'success');
    };

    return (
        <div className="flex flex-col h-full w-full bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <FilePlus size={16} className="text-emerald-700"/> Requirements Ledger
                    </h3>
                    <div className="relative hidden sm:block">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input className="pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-sm text-xs w-64 focus:outline-none focus:border-emerald-500 transition-all" placeholder="Search title or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-sm">
                    <Plus size={14}/> Add Requirement
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map(req => (
                        <div key={req.id} className="bg-white border border-zinc-200 rounded-md p-5 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-sm">{req.id}</span>
                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm border ${
                                        req.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                                        req.priority === 'High' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>{req.priority}</span>
                                </div>
                                <h4 className="text-sm font-bold text-zinc-900">{req.title}</h4>
                                <p className="text-xs text-zinc-500 mt-1">{req.justification}</p>
                            </div>
                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Est. Cost</p>
                                    <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(req.estCost)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Status</p>
                                    <p className="text-xs font-bold text-emerald-600 uppercase">{req.status}</p>
                                </div>
                                {req.status !== 'Ready for Solicitation' && (
                                    <button onClick={() => handleAdvance(req.id)} className="p-2 border border-zinc-200 rounded-sm hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all" title="Advance to Solicitation">
                                        <ArrowRight size={16}/>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="py-12">
                            <EmptyState title="No Requirements Found" description="Use the button above to establish a new Real Property requirement." icon={Database} />
                        </div>
                    )}
                </div>
            </div>

            {isFormOpen && (
                <Modal title="Establish New Requirement" onClose={() => setIsFormOpen(false)} maxWidth="max-w-xl">
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Requirement Title</label>
                            <input name="title" className="w-full mt-1 border rounded-sm p-2 text-sm" required placeholder="e.g. Roof Repair - Building 404" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase">Priority</label>
                                <select name="priority" className="w-full mt-1 border rounded-sm p-2 text-sm bg-white">
                                    <option>Critical</option><option>High</option><option>Normal</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase">Est. Cost ($)</label>
                                <input name="estCost" type="number" className="w-full mt-1 border rounded-sm p-2 text-sm" required placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">WBS Code</label>
                            <input name="wbsCode" className="w-full mt-1 border rounded-sm p-2 text-sm" required placeholder="e.g. 01.04.002" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Justification</label>
                            <textarea name="justification" className="w-full mt-1 border rounded-sm p-2 text-sm h-24 resize-none" required placeholder="Describe mission impact..." />
                        </div>
                        <div className="flex justify-end pt-4 border-t border-zinc-100">
                            <button type="submit" className="px-6 py-2 bg-zinc-900 text-white rounded-sm text-xs font-bold uppercase hover:bg-zinc-800 shadow-lg">Save Record</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default RemisRequirementManager;
