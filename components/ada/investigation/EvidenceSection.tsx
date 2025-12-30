import React from 'react';
import { FileText, CheckCircle2, Plus } from 'lucide-react';
import { EvidenceItem } from '../../../types';

interface Props {
  evidence: EvidenceItem[];
  onAdd: () => void;
  newDesc: string;
  setNewDesc: (v: string) => void;
}

const EvidenceSection: React.FC<Props> = ({ evidence, onAdd, newDesc, setNewDesc }) => (
  <div className="space-y-6 animate-in fade-in">
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <FileText size={14} className="text-zinc-400" /> Physical Evidence Log
      </h4>
      <div className="space-y-3 mb-8">
        {evidence.map(item => (
          <div key={item.id} className="flex items-start justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-xl group hover:border-zinc-300 transition-all">
            <div className="flex gap-4">
              <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0"><FileText size={16}/></div>
              <div><p className="text-sm font-medium text-zinc-800">{item.description}</p><p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">Source: {item.source} • Collected: {item.dateCollected}</p></div>
            </div>
            {item.supportsConclusion && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1 uppercase tracking-tighter"><CheckCircle2 size={10} /> Verified</span>}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Evidence description..." className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs outline-none" />
        <button onClick={onAdd} className="px-5 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 shadow-sm">Add Item</button>
      </div>
    </div>
  </div>
);
export default EvidenceSection;