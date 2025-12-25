
import React, { useState } from 'react';
import { USACEProject } from '../../types';
import { List, Plus, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    project: USACEProject;
}

interface WorkItem {
    id: string;
    wbs: string;
    description: string;
    featureCode: string;
    budget: number;
    actuals: number;
    status: 'Open' | 'Closed' | 'Draft';
}

const MOCK_WORK_ITEMS: WorkItem[] = [
    { id: 'WI-001', wbs: '01.01', description: 'Plans & Specifications', featureCode: '30', budget: 150000, actuals: 145000, status: 'Closed' },
    { id: 'WI-002', wbs: '02.01', description: 'Mobilization', featureCode: '01', budget: 500000, actuals: 500000, status: 'Open' },
    { id: 'WI-003', wbs: '03.01', description: 'Construction - Phase 1', featureCode: '04', budget: 12000000, actuals: 4000000, status: 'Open' },
];

const WorkItemForm = ({ onAdd, onCancel }: { onAdd: (item: WorkItem) => void, onCancel: () => void }) => {
    const [newWI, setNewWI] = useState<Partial<WorkItem>>({});
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if(!newWI.wbs || !newWI.description || !newWI.featureCode) {
            setError('WBS, Description, and Feature Code are required.');
            return;
        }
        
        const item: WorkItem = {
            id: `WI-${Date.now().toString().slice(-3)}`,
            wbs: newWI.wbs,
            description: newWI.description,
            featureCode: newWI.featureCode,
            budget: Number(newWI.budget) || 0,
            actuals: 0,
            status: 'Open'
        };
        onAdd(item);
    };

    return (
        <div className="p-4 bg-zinc-50 border-b border-zinc-100 space-y-3 animate-in fade-in">
            <div className="flex gap-2 items-start">
                <div className="w-24">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">WBS</label>
                    <input className="w-full text-xs p-2 border rounded" placeholder="01.01" value={newWI.wbs || ''} onChange={e => setNewWI({...newWI, wbs: e.target.value})} />
                </div>
                <div className="flex-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">Description</label>
                    <input className="w-full text-xs p-2 border rounded" placeholder="Item Name" value={newWI.description || ''} onChange={e => setNewWI({...newWI, description: e.target.value})} />
                </div>
                <div className="w-20">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">Feature</label>
                    <input className="w-full text-xs p-2 border rounded" placeholder="XX" value={newWI.featureCode || ''} onChange={e => setNewWI({...newWI, featureCode: e.target.value})} />
                </div>
                <div className="w-28">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">Budget ($)</label>
                    <input type="number" className="w-full text-xs p-2 border rounded" placeholder="0.00" value={newWI.budget || ''} onChange={e => setNewWI({...newWI, budget: Number(e.target.value)})} />
                </div>
            </div>
            {error && <p className="text-xs text-rose-600 font-medium flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="px-3 py-1.5 border rounded text-xs font-bold text-zinc-600 hover:bg-white">Cancel</button>
                <button onClick={handleSubmit} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> Add Item</button>
            </div>
        </div>
    );
};

const WorkItemManager: React.FC<Props> = ({ project }) => {
    const [workItems, setWorkItems] = useState<WorkItem[]>(MOCK_WORK_ITEMS);
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = (item: WorkItem) => {
        setWorkItems([...workItems, item]);
        setIsAdding(false);
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm h-full flex flex-col animate-in fade-in overflow-hidden">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <List size={16} className="text-zinc-400"/> Work Items (WI)
                    </h3>
                    <p className="text-xs text-zinc-500">Work Breakdown Structure (WBS)</p>
                </div>
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors shadow-sm">
                        <Plus size={12}/> New Work Item
                    </button>
                )}
            </div>

            {isAdding && <WorkItemForm onAdd={handleAdd} onCancel={() => setIsAdding(false)} />}

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-zinc-100 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">WBS</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Feature Code</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Budget</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actuals</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {workItems.map(item => (
                            <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="p-4 text-xs font-mono font-bold text-zinc-800">{item.wbs}</td>
                                <td className="p-4 text-xs font-medium text-zinc-700">{item.description}</td>
                                <td className="p-4 text-xs font-mono text-zinc-500">{item.featureCode}</td>
                                <td className="p-4 text-right text-xs font-mono text-zinc-900">{formatCurrency(item.budget)}</td>
                                <td className="p-4 text-right text-xs font-mono text-zinc-900">{formatCurrency(item.actuals)}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${item.status === 'Open' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkItemManager;
