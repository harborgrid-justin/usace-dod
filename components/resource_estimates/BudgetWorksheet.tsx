
import React, { useState } from 'react';
import { BudgetLineItem, CapabilityLevel, BusinessLine, REStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Plus, Search, Save, Filter, Trash2, Calculator, CheckCircle2, History, Database } from 'lucide-react';
import { MOCK_USACE_PROJECTS } from '../../constants';

interface Props {
    items: BudgetLineItem[];
    onAdd: (item: BudgetLineItem) => void;
    onDelete: (id: string) => void;
}

const BudgetWorksheet: React.FC<Props> = ({ items, onAdd, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // Controlled Form State
    const [form, setForm] = useState<Partial<BudgetLineItem>>({
        fiscalYear: 2026,
        capabilityLevel: 'Capability 1',
        status: 'Draft',
        objectClass: '11.1 - Civilian Labor'
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.projectId || !form.amount) return;

        const project = MOCK_USACE_PROJECTS.find(p => p.p2Number === form.projectId || p.id === form.projectId);
        
        const newItem: BudgetLineItem = {
            id: `BL-${Date.now()}`,
            projectId: project?.p2Number || form.projectId!,
            projectName: project?.name || 'Manual Project Entry',
            businessLine: (project?.programType === 'Civil Works' ? 'Navigation' : 'Environment') as BusinessLine,
            fiscalYear: form.fiscalYear!,
            capabilityLevel: form.capabilityLevel as CapabilityLevel,
            objectClass: form.objectClass!,
            amount: Number(form.amount),
            justification: form.justification || '',
            status: 'Draft' as REStatus,
            isInflationAdjusted: true,
            lastModified: new Date().toISOString()
        };

        onAdd(newItem);
        setForm({ ...form, amount: '', justification: '', projectId: '' });
    };

    const handleSaveWorkspace = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800); // Simulate network latency
    };

    const filteredItems = items.filter(i => 
        i.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.projectId.includes(searchTerm)
    );

    return (
        <div className="flex flex-col h-full animate-in fade-in">
            {/* Worksheet Controls */}
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none w-full md:w-80 group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                        <input 
                            type="text" 
                            placeholder="Search WBS, Project, or Name..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs w-full focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm">
                        <Filter size={14}/> <span>View Filters</span>
                    </button>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-100 transition-all">
                        <History size={14}/> Change Log
                    </button>
                    <button 
                        onClick={handleSaveWorkspace}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg ${
                            isSaving ? 'bg-zinc-400' : 'bg-rose-700 text-white hover:bg-rose-800'
                        }`}
                    >
                        {isSaving ? <History size={14} className="animate-spin"/> : <Save size={14}/>}
                        {isSaving ? 'Syncing...' : 'Save Workspace'}
                    </button>
                </div>
            </div>

            {/* Quick Entry Ribbon */}
            <form onSubmit={handleFormSubmit} className="p-4 bg-zinc-100 border-b border-zinc-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end shrink-0 shadow-inner">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">P2 Program Code</label>
                    <input 
                        type="text" 
                        required
                        value={form.projectId || ''} 
                        onChange={e => setForm({...form, projectId: e.target.value})} 
                        className="w-full p-2.5 text-xs border border-zinc-300 rounded-lg focus:border-rose-500 focus:outline-none bg-white font-mono"
                        placeholder="e.g. 123456"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Capability</label>
                    <select 
                        value={form.capabilityLevel} 
                        onChange={e => setForm({...form, capabilityLevel: e.target.value as CapabilityLevel})} 
                        className="w-full p-2.5 text-xs border border-zinc-300 rounded-lg bg-white focus:border-rose-500 focus:outline-none font-medium"
                    >
                        <option>Capability 1</option>
                        <option>Capability 2</option>
                        <option>Capability 3</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Object Class</label>
                    <select 
                        value={form.objectClass} 
                        onChange={e => setForm({...form, objectClass: e.target.value})} 
                        className="w-full p-2.5 text-xs border border-zinc-300 rounded-lg bg-white focus:border-rose-500 focus:outline-none font-medium"
                    >
                        <option>11.1 - Civilian Labor</option>
                        <option>21 - Travel</option>
                        <option>25.1 - Contracts</option>
                        <option>26 - Supplies</option>
                        <option>31.0 - Equipment</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Amount ($)</label>
                    <input 
                        type="number" 
                        required
                        value={form.amount || ''} 
                        onChange={e => setForm({...form, amount: e.target.value})} 
                        className="w-full p-2.5 text-xs border border-zinc-300 rounded-lg focus:border-rose-500 focus:outline-none bg-white font-mono font-bold"
                        placeholder="0.00"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Justification</label>
                    <input 
                        type="text" 
                        value={form.justification || ''} 
                        onChange={e => setForm({...form, justification: e.target.value})} 
                        className="w-full p-2.5 text-xs border border-zinc-300 rounded-lg focus:border-rose-500 focus:outline-none bg-white"
                        placeholder="Brief requirement note..."
                    />
                </div>
                <div>
                    <button type="submit" className="w-full py-2.5 bg-rose-700 text-white rounded-lg text-xs font-bold uppercase hover:bg-rose-600 flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transition-all active:scale-95">
                        <Plus size={16}/> Record Entry
                    </button>
                </div>
            </form>

            {/* Data Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left min-w-[1000px] border-collapse">
                    <thead className="bg-white border-b border-zinc-100 sticky top-0 shadow-sm z-10">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Project / WBS</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Capability</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Object Class</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Requirement ($)</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Justification</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filteredItems.map(item => (
                            <tr key={item.id} className="hover:bg-rose-50/30 transition-colors group">
                                <td className="p-4">
                                    <p className="text-xs font-bold text-zinc-900 line-clamp-1">{item.projectName}</p>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.projectId}</p>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                                        item.capabilityLevel === 'Capability 1' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                                        item.capabilityLevel === 'Capability 2' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                        'bg-zinc-100 text-zinc-600 border-zinc-200'
                                    }`}>{item.capabilityLevel}</span>
                                </td>
                                <td className="p-4 text-xs font-mono text-zinc-700">{item.objectClass}</td>
                                <td className="p-4 text-right">
                                    <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(item.amount)}</p>
                                    {item.isInflationAdjusted && <span className="text-[8px] text-emerald-600 font-bold uppercase">Adj OK</span>}
                                </td>
                                <td className="p-4">
                                    <p className="text-xs text-zinc-500 italic line-clamp-1 max-w-[200px]" title={item.justification}>{item.justification || 'No narrative provided.'}</p>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Presidential Budget' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase">{item.status}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center items-center gap-3">
                                        <button className="p-1.5 text-zinc-300 hover:text-rose-700 transition-colors opacity-0 group-hover:opacity-100" title="Delete">
                                            <Trash2 size={14} onClick={() => onDelete(item.id)} />
                                        </button>
                                        <button className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors opacity-0 group-hover:opacity-100" title="Audit">
                                            <Database size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-20 text-center text-zinc-400">
                                    <Database size={32} className="mx-auto mb-4 opacity-10" />
                                    <p className="text-sm font-medium">No budget records match your filter.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Totaliser Footer */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800 text-white flex justify-between items-center shrink-0">
                <div className="flex gap-8">
                    <div>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Total Worksheet Value</p>
                        <p className="text-lg font-mono font-bold">{formatCurrency(filteredItems.reduce((s, i) => s + i.amount, 0))}</p>
                    </div>
                    <div className="border-l border-zinc-800 pl-8">
                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Selected Record Count</p>
                        <p className="text-lg font-mono font-bold">{filteredItems.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 size={18} className="text-emerald-400"/>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase">AAWP Reconciled • {new Date().toLocaleTimeString()} </p>
                </div>
            </div>
        </div>
    );
};

export default BudgetWorksheet;
