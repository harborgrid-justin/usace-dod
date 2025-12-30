import React from 'react';
import { Gavel, Plus } from 'lucide-react';
import { ResponsibleParty } from '../../../types';

interface Props {
  parties: ResponsibleParty[];
  onAdd: () => void;
  form: { name: string; pos: string; cause: string };
  setForm: (f: any) => void;
}

const ResponsibilitySection: React.FC<Props> = ({ parties, onAdd, form, setForm }) => (
  <div className="space-y-6 animate-in fade-in">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-4">
        {parties.map(rp => (
          <div key={rp.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative group hover:border-rose-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div><h5 className="text-base font-bold text-zinc-900">{rp.name}</h5><p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{rp.position}</p></div>
              <div className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase border shadow-sm ${rp.rebuttalReceived ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{rp.rebuttalReceived ? 'Rebuttal Received' : 'Rebuttal Pending'}</div>
            </div>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-700 leading-relaxed shadow-inner"><span className="font-bold text-zinc-900 uppercase tracking-tighter text-[10px] block mb-1">Proximate Cause (But-For Test):</span>{rp.proximateCauseAnalysis}</div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm h-fit">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2"><Gavel size={16} className="text-rose-600" /> Assign Responsibility</h4>
        <div className="space-y-6">
          <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Official Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full mt-1.5 border rounded-xl p-2.5 text-xs bg-zinc-50" /></div>
          <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Position</label><input type="text" value={form.pos} onChange={e => setForm({...form, pos: e.target.value})} className="w-full mt-1.5 border rounded-xl p-2.5 text-xs bg-zinc-50" /></div>
          <button onClick={onAdd} className="w-full py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800">Post Entry</button>
        </div>
      </div>
    </div>
  </div>
);
export default ResponsibilitySection;