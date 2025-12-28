import React, { useState, useMemo, useTransition } from 'react';
import { JournalEntryLine, GLTransaction } from '../../types';
import { MOCK_GL_TRANSACTIONS, MOCK_USSGL_ACCOUNTS, MOCK_FUND_HIERARCHY } from '../../constants';
import { Plus, Send, Check, X, FileCheck, Shield, BookCopy, Link2, AlertOctagon, ShieldCheck, Trash2, Database, History, User } from 'lucide-react';
import { formatCurrencyExact } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { sanitizeInput } from '../../utils/security';
import Badge from '../shared/Badge';
import { useToast } from '../shared/ToastContext';

interface JournalEntryProps {
    onSelectProject: (projectId: string) => void;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ onSelectProject }) => {
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();
    const [entries, setEntries] = useState<GLTransaction[]>(MOCK_GL_TRANSACTIONS);
    const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    
    const [lines, setLines] = useState<JournalEntryLine[]>([
        { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' },
        { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' }
    ]);
    const [description, setDescription] = useState('');
    const [validationMsg, setValidationMsg] = useState<{valid: boolean, message: string} | null>(null);

    const selectedEntry = useMemo(() => entries.find(e => e.id === selectedEntryId), [entries, selectedEntryId]);
    const totalDebits = useMemo(() => lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0), [lines]);
    const totalCredits = useMemo(() => lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0), [lines]);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01 && totalDebits > 0;

    const handleLineChange = (index: number, field: keyof JournalEntryLine, value: any) => {
        const newLines = [...lines];
        (newLines[index] as any)[field] = field === 'description' ? sanitizeInput(value) : value;
        setLines(newLines);
        setValidationMsg(null);
    };

    const handlePreValidate = () => {
        const tempTx: Partial<GLTransaction> = { lines, totalAmount: totalDebits };
        const result = IntegrationOrchestrator.validateGlAgainstAda(tempTx as GLTransaction, MOCK_FUND_HIERARCHY);
        setValidationMsg(result);
    };

    const handleSubmit = () => {
        if (!isBalanced || !description) return;
        startTransition(() => {
            const newEntry: GLTransaction = {
                id: `JE-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                description: sanitizeInput(description),
                type: 'Manual Journal', sourceModule: 'Manual Journal', referenceDoc: 'Manual Entry',
                totalAmount: totalDebits, status: 'Pending Approval', createdBy: 'USACE_RM_ADMIN', lines,
                auditLog: [{ timestamp: new Date().toISOString(), user: 'USACE_RM_ADMIN', action: 'Entry Created' }],
            };
            setEntries([newEntry, ...entries]);
            setIsCreating(false);
            setSelectedEntryId(newEntry.id);
            addToast('Journal Entry submitted for approval.', 'success');
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden animate-in fade-in">
            {/* Sidebar Ledger */}
            <div className="lg:col-span-4 border-r border-zinc-200 flex flex-col bg-zinc-50/30">
                <div className="p-6 border-b border-zinc-100 bg-white flex justify-between items-center shadow-sm">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Journal Register</h3>
                    <button onClick={() => { setIsCreating(true); setSelectedEntryId(null); }} className="p-2 bg-zinc-900 text-white rounded-xl shadow-lg hover:bg-zinc-800 transition-all"><Plus size={18}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {entries.map(entry => (
                        <button 
                            key={entry.id} 
                            onClick={() => { setSelectedEntryId(entry.id); setIsCreating(false); }} 
                            className={`w-full text-left p-5 rounded-2xl border transition-all ${selectedEntryId === entry.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.01]' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-mono font-bold ${selectedEntryId === entry.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{entry.id}</span>
                                <span className="text-sm font-mono font-bold tracking-tight">{formatCurrencyExact(entry.totalAmount)}</span>
                            </div>
                            <p className="text-xs font-bold truncate leading-tight mb-3">{entry.description}</p>
                            <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-1">
                                <Badge variant={entry.status === 'Posted' ? 'success' : 'warning'}>{entry.status}</Badge>
                                <span className="text-[10px] font-mono opacity-60">{entry.date}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Workspace Area */}
            <div className={`lg:col-span-8 p-10 overflow-y-auto custom-scrollbar bg-white transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                {isCreating ? (
                    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-4">
                        <div>
                            <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">Post New Journal Entry</h3>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">SFFAS Manual Adjustment Ledger</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Standard Description (Narrative Justification)</label>
                                <input value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-zinc-900 transition-all" placeholder="e.g., Year-End Accrual for Service Contract W912QR..." />
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-12 gap-3 px-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                    <div className="col-span-3">Account</div>
                                    <div className="col-span-4">Memo / Segment</div>
                                    <div className="col-span-2 text-right">Debit</div>
                                    <div className="col-span-2 text-right">Credit</div>
                                    <div className="col-span-1"></div>
                                </div>
                                {lines.map((line, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-3 items-center bg-zinc-50 p-3 rounded-2xl border border-zinc-100 group">
                                        <select value={line.ussglAccount} onChange={e => handleLineChange(index, 'ussglAccount', e.target.value)} className="col-span-3 bg-white border border-zinc-200 rounded-xl p-2 text-xs font-mono font-bold outline-none">
                                            {MOCK_USSGL_ACCOUNTS.map(acc => <option key={acc.accountNumber} value={acc.accountNumber}>{acc.accountNumber}</option>)}
                                        </select>
                                        <input value={line.description} onChange={e => handleLineChange(index, 'description', e.target.value)} placeholder="WBS / Cost Center" className="col-span-4 bg-white border border-zinc-200 rounded-xl p-2 text-xs outline-none focus:border-zinc-900"/>
                                        <input type="number" value={line.debit || ''} onChange={e => handleLineChange(index, 'debit', parseFloat(e.target.value))} className="col-span-2 bg-white border border-zinc-200 rounded-xl p-2 text-xs text-right font-mono font-bold outline-none focus:border-zinc-900"/>
                                        <input type="number" value={line.credit || ''} onChange={e => handleLineChange(index, 'credit', parseFloat(e.target.value))} className="col-span-2 bg-white border border-zinc-200 rounded-xl p-2 text-xs text-right font-mono font-bold outline-none focus:border-zinc-900"/>
                                        <button onClick={() => setLines(lines.filter((_, i) => i !== index))} className="col-span-1 text-zinc-300 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                                <button onClick={() => setLines([...lines, { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' }])} className="text-[10px] font-bold text-zinc-500 uppercase hover:text-zinc-900 flex items-center gap-2 px-2"><Plus size={14}/> Add Journal Line</button>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 border border-zinc-800">
                             <div className="flex gap-10">
                                <div><p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Total Debits</p><p className="text-xl font-mono font-bold text-white">{formatCurrencyExact(totalDebits)}</p></div>
                                <div><p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Total Credits</p><p className="text-xl font-mono font-bold text-white">{formatCurrencyExact(totalCredits)}</p></div>
                             </div>
                             <div className="flex gap-4">
                                <button onClick={handlePreValidate} disabled={!isBalanced} className="px-6 py-3 border border-white/20 text-white rounded-2xl text-[10px] font-bold uppercase hover:bg-white/5 transition-all flex items-center gap-2 disabled:opacity-30">
                                    <ShieldCheck size={18} className="text-emerald-400"/> Validate Control
                                </button>
                                <button onClick={handleSubmit} disabled={!isBalanced || !description || (validationMsg && !validationMsg.valid)} className="px-10 py-3 bg-white text-zinc-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center gap-2 shadow-xl shadow-white/5 disabled:opacity-30">
                                    <Send size={18}/> Post to Ledger
                                </button>
                             </div>
                        </div>
                    </div>
                ) : selectedEntry ? (
                    <div className="animate-in fade-in space-y-10">
                        <div className="flex justify-between items-start border-b border-zinc-100 pb-8">
                            <div>
                                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{selectedEntry.description}</h3>
                                <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 font-medium">
                                    <span className="font-mono bg-zinc-100 px-2 py-0.5 rounded border">{selectedEntry.id}</span>
                                    <span>Origin: {selectedEntry.sourceModule}</span>
                                    <div className="w-1 h-1 rounded-full bg-zinc-200" />
                                    <span>Posted by {selectedEntry.createdBy}</span>
                                </div>
                            </div>
                            <Badge variant={selectedEntry.status === 'Posted' ? 'success' : 'warning'}>{selectedEntry.status}</Badge>
                        </div>
                        
                        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100">
                                    <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <th className="p-4">USSGL Account</th>
                                        <th className="p-4">Line Memo</th>
                                        <th className="p-4 text-right">Debit</th>
                                        <th className="p-4 text-right">Credit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {selectedEntry.lines.map((line, i) => (
                                        <tr key={i}>
                                            <td className="p-4 font-mono text-sm font-bold text-zinc-800">{line.ussglAccount}</td>
                                            <td className="p-4 text-xs font-medium text-zinc-500">{line.description || '-'}</td>
                                            <td className="p-4 text-right font-mono text-sm">{line.debit > 0 ? formatCurrencyExact(line.debit) : '-'}</td>
                                            <td className="p-4 text-right font-mono text-sm">{line.credit > 0 ? formatCurrencyExact(line.credit) : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-zinc-900 text-white font-mono">
                                    <tr>
                                        <td colSpan={2} className="p-4 text-xs font-bold uppercase tracking-widest">Aggregate Verification</td>
                                        <td className="p-4 text-right text-sm font-bold">{formatCurrencyExact(selectedEntry.totalAmount)}</td>
                                        <td className="p-4 text-right text-sm font-bold">{formatCurrencyExact(selectedEntry.totalAmount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-200">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2"><History size={16}/> Audit Log</h4>
                                <div className="space-y-4">
                                    {selectedEntry.auditLog.map((log, i) => (
                                        <div key={i} className="flex gap-4 text-xs">
                                            <div className="font-mono text-zinc-400 w-24 shrink-0 uppercase tracking-tighter">{formatCurrencyExact(0).replace('$0.00','')} {log.timestamp.split('T')[0]}</div>
                                            <div className="flex-1">
                                                <p className="font-bold text-zinc-800">{log.action}</p>
                                                <p className="text-zinc-500 mt-0.5">{log.details || 'Standard system posting event.'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                                <ShieldCheck size={48} className="text-emerald-500 mb-4" />
                                <h4 className="text-sm font-bold text-zinc-900 uppercase">Fiduciary Lock</h4>
                                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                    This entry is formally posted to the authoritative ledger. Edits must be performed via reversing entry per USSGL requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-300 gap-6">
                        <div className="p-10 rounded-[40px] bg-zinc-50 border-2 border-dashed border-zinc-200"><Database size={64} className="opacity-20" /></div>
                        <div className="text-center">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Journal Register Idle</h4>
                            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mt-2">Select an authoritative entry from the register or initiate a new manual journal worksheet.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalEntry;