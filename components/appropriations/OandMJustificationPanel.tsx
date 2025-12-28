
import React from 'react';
import { Info, Sparkles, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

const OandMJustificationPanel: React.FC<any> = ({ sag, onUpdate }) => (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 h-full flex flex-col">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 border-b pb-3">Justification Panel</h3>
        {sag ? (
            <div className="flex flex-col flex-1 gap-4 animate-in fade-in">
                <div className="flex justify-between items-baseline"><span className="text-xs font-semibold text-zinc-500">SAG:</span><span className="text-sm font-bold text-zinc-900 text-right">{sag.name}</span></div>
                <div className="flex justify-between items-baseline border-b border-zinc-100 pb-2"><span className="text-xs font-semibold text-zinc-500">Value:</span><span className="text-sm font-mono font-bold text-zinc-800">{formatCurrency(sag.budget)}</span></div>
                <textarea className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs flex-1 resize-none outline-none focus:border-rose-400" value={sag.justificationNotes || ''} placeholder="Draft narrative..." onChange={e => onUpdate({...sag, justificationNotes: e.target.value})} />
                <button className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg"><Sparkles size={14} className="text-emerald-400"/> Sentiel-3 AI Justification</button>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400 gap-2"><Info size={24} className="opacity-30"/><p className="text-xs font-medium">Select a budget row for strategic justification.</p></div>
        )}
    </div>
);
export default OandMJustificationPanel;
