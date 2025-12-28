import React, { useState } from 'react';
import { USACEProject } from '../../types';
import { List, Plus, AlertCircle, CheckCircle2, ChevronRight, ChevronDown, Activity } from 'lucide-react';
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
    { id: 'WI-001', wbs: '01', description: 'Pre-Construction Engineering', featureCode: '30', budget: 650000, actuals: 645000, status: 'Open' },
    { id: 'WI-001A', wbs: '01.01', description: 'Plans & Specifications', featureCode: '30', budget: 150000, actuals: 145000, status: 'Closed' },
    { id: 'WI-001B', wbs: '01.02', description: 'Engineering During Construction', featureCode: '30', budget: 500000, actuals: 500000, status: 'Open' },
    { id: 'WI-002', wbs: '02', description: 'Construction', featureCode: '04', budget: 12500000, actuals: 4500000, status: 'Open' },
    { id: 'WI-002A', wbs: '02.01', description: 'Mobilization', featureCode: '01', budget: 500000, actuals: 500000, status: 'Closed' },
    { id: 'WI-002B', wbs: '02.02', description: 'Phase 1 Concrete', featureCode: '04', budget: 12000000, actuals: 4000000, status: 'Open' },
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
    const [expandedIds, setExpandedIds] = useState<string[]>(['WI-001', 'WI-002']);

    const handleAdd = (item: WorkItem) => {
        setWorkItems([...workItems, item].sort((a,b) => a.wbs.localeCompare(b.wbs)));
        setIsAdding(false);
    };

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // Helper to determine hierarchy level
    const getLevel = (wbs: string) => wbs.split('.').length - 1;

    // Variance Heatmap Logic
    const getVarianceColor = (budget: number, actuals: number) => {
        const ratio = budget > 0 ? actuals / budget : 0;
        if (ratio > 1.0) return 'text-rose-600 bg-rose-50'; // Overrun
        if (ratio > 0.9) return 'text-amber-600 bg-amber-50'; // Warning
        return 'text-emerald-600 bg-emerald-50'; // Healthy
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm h-full flex flex-col animate-in fade-in overflow-hidden">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <List size={16} className="text-zinc-400"/> Work Items (WI)
                    </h3>
                    <p className="text-xs text-zinc-500">Work Breakdown Structure (WBS) • Feature Cost Codes</p>
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
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-24">WBS</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Feature</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Budget</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actuals</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Var %</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {workItems.map(item => {
                            const level = getLevel(item.wbs);
                            const hasChildren = workItems.some(i => i.wbs.startsWith(item.wbs + '.') && i.id !== item.id);
                            const isExpanded = expandedIds.includes(item.id);
                            const variance = item.budget > 0 ? (item.actuals / item.budget) * 100 : 0;
                            const isParent = hasChildren;

                            // Simple filter for demo: only show if parent is expanded or it's top level
                            // (In a real app, full tree traversal logic would be here)
                            
                            return (
                                <tr key={item.id} className={`hover:bg-zinc-50 transition-colors ${isParent ? 'bg-zinc-50/30' : ''}`}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1" style={{ paddingLeft: `${level * 16}px` }}>
                                            {isParent && (
                                                <button onClick={() => toggleExpand(item.id)} className="text-zinc-400 hover:text-zinc-600">
                                                    {isExpanded ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
                                                </button>
                                            )}
                                            {!isParent && <div className="w-3" />}
                                            <span className={`text-xs font-mono ${isParent ? 'font-bold text-zinc-900' : 'text-zinc-600'}`}>{item.wbs}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs ${isParent ? 'font-bold text-zinc-900' : 'text-zinc-700'}`}>{item.description}</span>
                                    </td>
                                    <td className="p-4 text-center text-xs font-mono text-zinc-500">{item.featureCode}</td>
                                    <td className="p-4 text-right text-xs font-mono text-zinc-900">{formatCurrency(item.budget)}</td>
                                    <td className="p-4 text-right">
                                        <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${getVarianceColor(item.budget, item.actuals)}`}>
                                            {formatCurrency(item.actuals)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <div className="w-12 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                                                <div className={`h-full ${variance > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${Math.min(variance, 100)}%`}}/>
                                            </div>
                                            <span className="text-[9px] font-mono text-zinc-500">{variance.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${item.status === 'Open' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex justify-between items-center text-[10px] text-zinc-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> On Budget</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"/> >90% Spent</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"/> Overrun</span>
                </div>
                <span>Total Work Items: {workItems.length}</span>
            </div>
        </div>
    );
};

export default WorkItemManager;