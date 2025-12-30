import React, { useState } from 'react';
import { DepreciationComponent } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  components: DepreciationComponent[];
  onUpdate: (v: DepreciationComponent[]) => void;
  usefulLife: number;
}

const AssetComponentManager: React.FC<Props> = ({ components, onUpdate, usefulLife }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState<number | ''>('');

  const handleAdd = () => {
    if (!name || !cost) return;
    const item: DepreciationComponent = { id: `C-${Date.now()}`, name, cost: Number(cost), placedInServiceDate: new Date().toISOString(), usefulLife: usefulLife / 2 };
    onUpdate([...components, item]);
    setName(''); setCost('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Components Ledger</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
            {components.map(c => (
                <div key={c.id} className="grid grid-cols-4 gap-2 items-center p-3 bg-white rounded-xl border border-zinc-100">
                    <span className="text-xs font-bold col-span-2 truncate">{c.name}</span>
                    <span className="text-xs font-mono text-right">{formatCurrency(c.cost)}</span>
                    <button onClick={() => onUpdate(components.filter(i => i.id !== c.id))} className="text-right text-zinc-400 hover:text-rose-600 flex justify-end px-2"><Trash2 size={12}/></button>
                </div>
            ))}
        </div>
        <div className="flex gap-2 pt-4 border-t"><input value={name} onChange={e => setName(e.target.value)} placeholder="Component Name" className="flex-1 border rounded p-2 text-xs"/><input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} placeholder="Cost" className="w-24 border rounded p-2 text-xs"/><button onClick={handleAdd} className="px-3 bg-zinc-900 text-white rounded"><Plus size={16}/></button></div>
    </div>
  );
};
export default AssetComponentManager;