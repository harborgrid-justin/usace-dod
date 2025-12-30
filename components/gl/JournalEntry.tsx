
import React, { useState, useMemo, useTransition } from 'react';
import { JournalEntryLine, GLTransaction } from '../../types';
import { MOCK_GL_TRANSACTIONS, REMIS_THEME } from '../../constants';
import { Plus, Send, ShieldCheck, Database, History, Search, ArrowRight, User, Landmark, Scale, FileText } from 'lucide-react';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { useToast } from '../shared/ToastContext';
import LineEntryForm from './LineEntryForm';
import { formatCurrencyExact } from '../../utils/formatting';
import Badge from '../shared/Badge';

const JournalEntry: React.FC = () => {
    const [entries, setEntries] = useState<GLTransaction[]>(MOCK_GL_TRANSACTIONS);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [lines, setLines] = useState<JournalEntryLine[]>([
        { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' },
        { ussglAccount: '211000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' }
    ]);
    const [desc, setDesc] = useState('');
    const { addToast } = useToast();
    const [isPending, startTransition] = useTransition();

    const selectedEntry = useMemo(() => entries.find(e => e.id === selectedId), [entries, selectedId]);

    const handleLineChange = (idx: number, f: keyof JournalEntryLine, v: any) => {
        const next = [...lines];
        (next[idx] as any)[f] = v;
        setLines(next);
    };

    const submit = () => {
        const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
        const totalCredit = lines.reduce((s, l) => s + l.credit, 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            addToast('Ledger Mismatch: Debits must equal Credits.', 'error');
            return;
        }

        const newEntry: GLTransaction = {
            id: `JE-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: desc,
            type: 'Manual Journal',
            totalAmount: totalDebit,
            status: 'Posted',
            createdBy: 'Fiduciary_Admin',
            sourceModule: 'GL',
            referenceDoc: 'MANUAL',
            lines,
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'Fiduciary_Admin',
                action: 'Posted',
                details: 'Manual journal entry finalized.'
            }]
        };

        setEntries([newEntry, ...entries]);
        setIsCreating(false);
        setSelectedId(newEntry.id);
        addToast('Journal Entry Posted to USSGL.', 'success');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden animate-in fade-in">
            {/* Left Rail: Register */}
            <div className="lg:col-span-4 border-r border-zinc-100 bg-zinc-50/50 flex flex-col min-h-0">
                <div className="p-5 border-b border-zinc-100 bg-white flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Journal Register</h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">FY 2024 Audit Stream</p>
                    </div>
                    <button 
                        onClick={() => { setIsCreating(true); setSelectedId(null); }} 
                        className="p-2 bg-zinc-900 text-white rounded-sm shadow-sm hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        <Plus size={16}/>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {entries.map(e => (
                        <button 
                            key={e.id} 
                            onClick={() => { setSelectedId(e.id); setIsCreating(false); }} 
                            className={`w-full text-left p-4 rounded-md border transition-all relative group ${
                                selectedId === e.id 
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-md z-10' 
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-mono font-bold ${selectedId === e.id ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    {e.id}
                                </span>
                                <Badge variant={e.status === 'Posted' ? 'success' : 'warning'}>{e.status}</Badge>
                            </div>
                            <p className="text-xs font-bold truncate pr-4">{e.description}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <p className={`text-[9px] font-mono font-bold ${selectedId === e.id ? 'text-zinc-500' : 'text-zinc-400'}`}>{e.date}</p>
                                <p className={`font-mono font-bold text-xs ${selectedId === e.id ? 'text-emerald-400' : 'text-zinc-900'}`}>
                                    {formatCurrencyExact(e.totalAmount)}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Panel: Workspace */}
            <div className="lg:col-span-8 p-8 overflow-y-auto custom-scrollbar bg-white min-h-0">
                {isCreating ? (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-2">
                        <div>
                            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Manual Posting Protocol</h3>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1.5">SFFAS Double-Entry Transaction Ledger</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Instruction Narrative</label>
                                <textarea 
                                    value={desc} 
                                    onChange={e => setDesc(e.target.value)} 
                                    placeholder="Enter authoritative justification for this fiduciary event..." 
                                    className="w-full p-5 bg-zinc-50 border border-zinc-200 rounded-sm text-sm focus:bg-white focus:ring-4 focus:ring-zinc-100 transition-all outline-none resize-none h-24 shadow-inner" 
                                />
                            </div>

                            <LineEntryForm 
                                lines={lines} 
                                onChange={handleLineChange} 
                                onRemove={i => setLines(lines.filter((_, idx) => idx !== i))} 
                                onAdd={() => setLines([...lines, { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' }])} 
                            />
                        </div>

                        <div className="pt-8 border-t border-zinc-100 flex justify-end gap-3">
                            <button 
                                onClick={() => setIsCreating(false)}
                                className="px-6 py-2.5 bg-white border border-zinc-200 rounded-sm text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all"
                            >
                                Discard
                            </button>
                            <button 
                                onClick={submit} 
                                className="px-10 py-2.5 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-xl active:scale-95 transition-all flex items-center gap-3"
                            >
                                <Send size={14}/> Execute Posting
                            </button>
                        </div>
                    </div>
                ) : selectedEntry ? (
                    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in">
                        <div className="flex justify-between items-start border-b border-zinc-100 pb-8">
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">{selectedEntry.id}</h3>
                                    <Badge variant="success">POSTED</Badge>
                                </div>
                                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{selectedEntry.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Magnitude</p>
                                <p className="text-3xl font-mono font-bold text-zinc-900 tracking-tighter">{formatCurrencyExact(selectedEntry.totalAmount)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-5 bg-zinc-50 rounded-md border border-zinc-100">
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Origin Module</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-sm border border-zinc-200"><Database size={16} className="text-zinc-500"/></div>
                                    <span className="text-xs font-bold text-zinc-700 uppercase tracking-tight">{selectedEntry.sourceModule}</span>
                                </div>
                            </div>
                            <div className="p-5 bg-zinc-50 rounded-md border border-zinc-100">
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Ref Doc</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-sm border border-zinc-200"><FileText size={16} className="text-zinc-500"/></div>
                                    <span className="text-xs font-mono font-bold text-zinc-700">{selectedEntry.referenceDoc}</span>
                                </div>
                            </div>
                            <div className="p-5 bg-zinc-50 rounded-md border border-zinc-100">
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Author</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-sm border border-zinc-200"><User size={16} className="text-zinc-500"/></div>
                                    <span className="text-xs font-bold text-zinc-700 truncate">{selectedEntry.createdBy}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm">
                            <div className="p-4 bg-zinc-900 text-white flex justify-between items-center">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Scale size={14} className="text-emerald-400"/> T-Account Protocol
                                </h4>
                                <span className="text-[10px] font-mono text-zinc-500 font-bold">USSGL_2024_01</span>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4">Account / Narrative</th>
                                        <th className="p-4 text-right">Debit ($)</th>
                                        <th className="p-4 text-right">Credit ($)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50 font-mono">
                                    {selectedEntry.lines.map((l, i) => (
                                        <tr key={i} className="hover:bg-zinc-50/50">
                                            <td className="p-4">
                                                <p className="text-[11px] font-bold text-zinc-900">{l.ussglAccount}</p>
                                                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5">{l.description || 'System Posting'}</p>
                                            </td>
                                            <td className="p-4 text-right text-[11px] font-bold text-zinc-700">{l.debit > 0 ? formatCurrencyExact(l.debit) : '-'}</td>
                                            <td className="p-4 text-right text-[11px] font-bold text-zinc-700">{l.credit > 0 ? formatCurrencyExact(l.credit) : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-zinc-900 text-white font-mono text-xs font-bold">
                                    <tr>
                                        <td className="p-4 uppercase text-[9px] tracking-widest font-bold">In-Balance Verification</td>
                                        <td className="p-4 text-right">{formatCurrencyExact(selectedEntry.totalAmount)}</td>
                                        <td className="p-4 text-right">{formatCurrencyExact(selectedEntry.totalAmount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="space-y-6 pt-6">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <History size={16}/> Forensic Audit Trail
                            </h4>
                            <div className="space-y-4">
                                {selectedEntry.auditLog.map((log, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-md text-xs group hover:border-zinc-300 transition-all">
                                        <div className="font-mono text-zinc-400 font-bold shrink-0">{log.timestamp.split('T')[1].substring(0,5)}</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-zinc-800 uppercase text-[10px] mb-1">{log.action}</p>
                                            <p className="text-zinc-500 leading-relaxed italic">"{log.details}"</p>
                                        </div>
                                        <div className="text-[9px] font-bold text-zinc-400 uppercase bg-white px-2 py-1 rounded-sm border border-zinc-200 h-fit">{log.user}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-300 gap-6 py-20">
                        <div className="p-8 bg-zinc-50 rounded-md border border-zinc-100 shadow-inner">
                             <Database size={48} className="opacity-10" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Workspace Dormant</p>
                            <p className="text-xs text-zinc-400 max-w-[240px] leading-relaxed">Select a posting from the register to initiate forensic review.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalEntry;
