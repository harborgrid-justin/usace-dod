
import React from 'react';
import { JournalEntryLine } from '../../types';
import { MOCK_USSGL_ACCOUNTS } from '../../constants';
import { Trash2, Plus } from 'lucide-react';

interface Props {
    lines: JournalEntryLine[];
    onChange: (idx: number, f: keyof JournalEntryLine, v: any) => void;
    onRemove: (idx: number) => void;
    onAdd: () => void;
}

const LineEntryForm: React.FC<Props> = ({ lines, onChange, onRemove, onAdd }) => (
    <div className="space-y-3">
        <div className="grid grid-cols-12 gap-3 px-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
            <div className="col-span-3">Account</div><div className="col-span-4">Memo</div><div className="col-span-2 text-right">Debit</div><div className="col-span-2 text-right">Credit</div>
        </div>
        {lines.map((line, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-zinc-50 p-3 rounded-md border border-zinc-100 group">
                <select value={line.ussglAccount} onChange={e => onChange(idx, 'ussglAccount', e.target.value)} className="col-span-3 bg-white border rounded-sm p-2 text-xs font-mono font-bold">
                    {MOCK_USSGL_ACCOUNTS.map(acc => <option key={acc.accountNumber} value={acc.accountNumber}>{acc.accountNumber}</option>)}
                </select>
                <input value={line.description} onChange={e => onChange(idx, 'description', e.target.value)} className="col-span-4 bg-white border rounded-sm p-2 text-xs"/>
                <input type="number" value={line.debit || ''} onChange={e => onChange(idx, 'debit', Number(e.target.value))} className="col-span-2 bg-white border rounded-sm p-2 text-xs text-right font-mono"/>
                <input type="number" value={line.credit || ''} onChange={e => onChange(idx, 'credit', Number(e.target.value))} className="col-span-2 bg-white border rounded-sm p-2 text-xs text-right font-mono"/>
                <button onClick={() => onRemove(idx)} className="col-span-1 text-zinc-300 hover:text-rose-600"><Trash2 size={16}/></button>
            </div>
        ))}
        <button onClick={onAdd} className="text-[10px] font-bold text-zinc-500 uppercase hover:text-zinc-900 flex items-center gap-2 px-2 pt-2"><Plus size={14}/> Add Line</button>
    </div>
);
export default LineEntryForm;
