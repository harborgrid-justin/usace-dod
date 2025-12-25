
import React, { useState, useMemo } from 'react';
import { JournalEntryLine, GLTransaction } from '../../types';
import { MOCK_GL_TRANSACTIONS, MOCK_USSGL_ACCOUNTS, MOCK_FUND_HIERARCHY } from '../../constants';
import { Plus, Send, Check, X, FileCheck, Shield, BookCopy, Link2, AlertOctagon, ShieldCheck, Trash2 } from 'lucide-react';
import { formatCurrencyExact } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { sanitizeInput } from '../../utils/security';

interface JournalEntryProps {
    onSelectProject: (projectId: string) => void;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ onSelectProject }) => {
    const [entries, setEntries] = useState<GLTransaction[]>(MOCK_GL_TRANSACTIONS);
    const [selectedEntry, setSelectedEntry] = useState<GLTransaction | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    
    // --- New Entry Form State ---
    const [lines, setLines] = useState<JournalEntryLine[]>([
        { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' },
        { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' }
    ]);
    const [description, setDescription] = useState('');
    const [validationMsg, setValidationMsg] = useState<{valid: boolean, message: string} | null>(null);

    const totalDebits = useMemo(() => lines.reduce((sum, line) => sum + line.debit, 0), [lines]);
    const totalCredits = useMemo(() => lines.reduce((sum, line) => sum + line.credit, 0), [lines]);
    const isBalanced = totalDebits === totalCredits && totalDebits > 0;

    const handleLineChange = (index: number, field: keyof JournalEntryLine, value: any) => {
        const newLines = [...lines];
        if (field === 'description') value = sanitizeInput(value);
        (newLines[index] as any)[field] = value;
        setLines(newLines);
        setValidationMsg(null);
    };

    const addLine = () => setLines([...lines, { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' }]);
    const removeLine = (index: number) => setLines(lines.filter((_, i) => i !== index));

    // Integration #1: Validates if the GL entry would cause an ADA violation
    const handlePreValidate = () => {
        const tempTx: Partial<GLTransaction> = {
            lines: lines,
            totalAmount: totalDebits
        };
        // Calling Domain Service
        const result = IntegrationOrchestrator.validateGlAgainstAda(tempTx as GLTransaction, MOCK_FUND_HIERARCHY);
        setValidationMsg(result);
    };

    const handleSubmit = () => {
        if (!isBalanced || !description) return;
        
        const validation = IntegrationOrchestrator.validateGlAgainstAda({lines, totalAmount: totalDebits} as GLTransaction, MOCK_FUND_HIERARCHY);
        if (!validation.valid) {
            setValidationMsg(validation);
            return;
        }

        const newEntry: GLTransaction = {
            id: `JE-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: sanitizeInput(description),
            type: 'Manual Journal',
            sourceModule: 'Manual Journal',
            referenceDoc: 'Manual Entry',
            totalAmount: totalDebits,
            status: 'Pending Approval',
            createdBy: 'USACE_RM',
            lines,
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'USACE_RM',
                action: 'Entry Created',
                details: 'Initial draft created via manual journal interface.'
            }],
        };
        setEntries([newEntry, ...entries]);
        setIsCreating(false);
        setSelectedEntry(newEntry);
        setLines([
            { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' },
            { ussglAccount: '101000', description: '', debit: 0, credit: 0, fund: '0100', costCenter: 'S11100' }
        ]);
        setDescription('');
        setValidationMsg(null);
    };

    const handleApprove = (id: string) => {
        setEntries(entries.map(e => e.id === id ? { ...e, status: 'Posted', approvedBy: 'RM_LEAD' } : e));
        setSelectedEntry(prev => prev && prev.id === id ? { ...prev, status: 'Posted', approvedBy: 'RM_LEAD' } : prev);
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            <div className="lg:col-span-1 border-r border-zinc-200 flex flex-col bg-zinc-50/50">
                <div className="p-4 border-b border-zinc-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Journal Entries</h3>
                    <button onClick={() => { setIsCreating(true); setSelectedEntry(null); }} className="p-1.5 bg-rose-700 text-white rounded hover:bg-rose-600"><Plus size={14}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {entries.map(entry => (
                        <button key={entry.id} onClick={() => { setSelectedEntry(entry); setIsCreating(false); }} className={`w-full text-left p-4 border-b border-zinc-100 ${selectedEntry?.id === entry.id ? 'bg-rose-50' : 'hover:bg-white'}`}>
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-mono font-bold text-zinc-800">{entry.id}</span>
                                <span className="text-xs font-mono font-bold text-zinc-900">{formatCurrencyExact(entry.totalAmount)}</span>
                            </div>
                            <p className="text-xs text-zinc-600 mt-1 truncate">{entry.description}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${ { 'Draft': 'border-zinc-200 bg-zinc-100 text-zinc-600', 'Pending Approval': 'border-amber-200 bg-amber-50 text-amber-700', 'Posted': 'border-emerald-200 bg-emerald-50 text-emerald-700', 'Rejected': 'border-rose-200 bg-rose-50 text-rose-700' }[entry.status] }`}>{entry.status}</span>
                                <span className="text-[10px] text-zinc-400 font-mono">{entry.date}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-2 p-6 overflow-y-auto custom-scrollbar">
                {isCreating ? (
                    <div className="animate-in fade-in">
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">New Manual Journal Entry</h3>
                        <p className="text-xs text-zinc-500 mb-6">ER 37-1-30 Compliant • Integrated Funds Control Check</p>
                        
                        <div className="mb-4">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Description</label>
                            <input value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 border rounded p-2 text-sm" placeholder="e.g., Q3 Accrual for Utilities"/>
                        </div>

                        {lines.map((line, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
                                <select value={line.ussglAccount} onChange={e => handleLineChange(index, 'ussglAccount', e.target.value)} className="col-span-3 text-xs p-2 border rounded bg-white">
                                    {MOCK_USSGL_ACCOUNTS.slice(0, 10).map(acc => <option key={acc.accountNumber} value={acc.accountNumber}>{acc.accountNumber}</option>)}
                                </select>
                                <input value={line.description} onChange={e => handleLineChange(index, 'description', e.target.value)} placeholder="Line Desc" className="col-span-4 text-xs p-2 border rounded"/>
                                <input type="number" value={line.debit || ''} onChange={e => handleLineChange(index, 'debit', parseFloat(e.target.value))} placeholder="Debit" className="col-span-2 text-xs p-2 border rounded text-right"/>
                                <input type="number" value={line.credit || ''} onChange={e => handleLineChange(index, 'credit', parseFloat(e.target.value))} placeholder="Credit" className="col-span-2 text-xs p-2 border rounded text-right"/>
                                <button onClick={() => removeLine(index)} className="col-span-1 text-zinc-400 hover:text-rose-600"><Trash2 size={14}/></button>
                            </div>
                        ))}
                        <button onClick={addLine} className="text-xs font-bold text-zinc-600 flex items-center gap-1 mt-2"><Plus size={12}/> Add Line</button>
                        
                        <div className="mt-6 pt-4 border-t-2 border-zinc-900 flex justify-between items-center font-mono text-sm">
                            <span className={`font-bold ${!isBalanced ? 'text-rose-600' : 'text-zinc-500'}`}>{!isBalanced && 'UNBALANCED'}</span>
                            <div className="flex gap-6">
                                <span className="font-bold">{formatCurrencyExact(totalDebits)}</span>
                                <span className="font-bold">{formatCurrencyExact(totalCredits)}</span>
                            </div>
                        </div>

                        {validationMsg && (
                            <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-xs font-bold ${validationMsg.valid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                                {validationMsg.valid ? <ShieldCheck size={16} className="shrink-0"/> : <AlertOctagon size={16} className="shrink-0"/>}
                                <span>{validationMsg.message}</span>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={handlePreValidate} disabled={!isBalanced} className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-zinc-50">
                                <ShieldCheck size={14}/> Pre-Validate ADA
                            </button>
                            <button onClick={handleSubmit} disabled={!isBalanced || !description || (validationMsg && !validationMsg.valid)} className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 disabled:opacity-50">
                                <Send size={14}/> Submit for Approval
                            </button>
                        </div>
                    </div>
                ) : selectedEntry ? (
                    <div className="animate-in fade-in">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">{selectedEntry.description}</h3>
                                <p className="text-xs text-zinc-500 font-mono">{selectedEntry.id}</p>
                            </div>
                             <span className={`px-2 py-1 rounded text-sm font-bold uppercase border ${ { 'Draft': 'border-zinc-200 bg-zinc-100 text-zinc-600', 'Pending Approval': 'border-amber-200 bg-amber-50 text-amber-700', 'Posted': 'border-emerald-200 bg-emerald-50 text-emerald-700', 'Rejected': 'border-rose-200 bg-rose-50 text-rose-700' }[selectedEntry.status] }`}>{selectedEntry.status}</span>
                        </div>
                        
                        <div className="mb-6 space-y-2">
                            <div className="text-xs flex items-center gap-2">
                                <strong className="w-24 text-zinc-500">Reference Doc:</strong> 
                                {/^\d{6}$/.test(selectedEntry.referenceDoc) ? (
                                    <button onClick={() => onSelectProject(selectedEntry.referenceDoc)} className="font-mono text-blue-600 hover:underline flex items-center gap-1">
                                        <Link2 size={12}/> {selectedEntry.referenceDoc}
                                    </button>
                                ) : (
                                    <span className="font-mono">{selectedEntry.referenceDoc}</span>
                                )}
                            </div>
                            <div className="text-xs flex"><strong className="w-24 text-zinc-500">Created By:</strong> <span className="font-mono">{selectedEntry.createdBy}</span></div>
                            <div className="text-xs flex"><strong className="w-24 text-zinc-500">Approved By:</strong> <span className="font-mono">{selectedEntry.approvedBy || 'N/A'}</span></div>
                        </div>

                        <table className="w-full text-left mb-6">
                            <thead className="bg-zinc-50"><tr>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">USSGL</th>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Description</th>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Debit</th>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Credit</th>
                            </tr></thead>
                            <tbody className="divide-y divide-zinc-100">
                                {selectedEntry.lines.map((line, i) => (
                                    <tr key={i}>
                                        <td className="p-2 font-mono text-xs">{line.ussglAccount}</td>
                                        <td className="p-2 text-xs">{line.description}</td>
                                        <td className="p-2 font-mono text-xs text-right">{line.debit > 0 ? formatCurrencyExact(line.debit) : ''}</td>
                                        <td className="p-2 font-mono text-xs text-right">{line.credit > 0 ? formatCurrencyExact(line.credit) : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t-2 border-zinc-900"><tr>
                                <td colSpan={2} className="p-2 font-bold text-right">TOTALS</td>
                                <td className="p-2 font-mono font-bold text-right">{formatCurrencyExact(selectedEntry.lines.reduce((s, l) => s + l.debit, 0))}</td>
                                <td className="p-2 font-mono font-bold text-right">{formatCurrencyExact(selectedEntry.lines.reduce((s, l) => s + l.credit, 0))}</td>
                            </tr></tfoot>
                        </table>

                        {selectedEntry.status === 'Pending Approval' && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex justify-between items-center">
                                <p className="text-xs text-amber-800 font-bold flex items-center gap-2"><Shield size={14}/> Awaiting approval from RM_LEAD (Segregation of Duties)</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApprove(selectedEntry.id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold flex items-center gap-1"><Check size={12}/> Approve</button>
                                    <button className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold flex items-center gap-1"><X size={12}/> Reject</button>
                                </div>
                            </div>
                        )}

                        {selectedEntry.status === 'Posted' && (
                             <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-emerald-700 text-xs font-bold">
                                <FileCheck size={14} /> This transaction is posted to the General Ledger and cannot be deleted.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
                        <BookCopy size={24} className="opacity-50" />
                        <p className="text-xs">Select an entry or create a new one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalEntry;
