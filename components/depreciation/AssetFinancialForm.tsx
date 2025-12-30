import React from 'react';
import { Asset, AssetLifecycleStatus } from '../../types';

interface Props {
  data: Asset;
  onChange: (f: keyof Asset, v: any) => void;
}

const AssetFinancialForm: React.FC<Props> = ({ data, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
    <div className="col-span-1 sm:col-span-2 md:col-span-1">
        <label className="text-[10px] font-bold text-zinc-500">Name</label>
        <input type="text" value={data.name} onChange={e => onChange('name', e.target.value)} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs"/>
    </div>
    <div>
        <label className="text-[10px] font-bold text-zinc-500">Asset Class</label>
        <select value={data.assetClass} onChange={e => onChange('assetClass', e.target.value)} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs bg-white">
            <option>Vessel</option><option>Building</option><option>Equipment</option><option>Software</option><option>Land</option>
        </select>
    </div>
    <div>
        <label className="text-[10px] font-bold text-zinc-500">Acquisition Cost</label>
        <input type="number" value={data.acquisitionCost} onChange={e => onChange('acquisitionCost', Number(e.target.value))} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs"/>
    </div>
    <div>
        <label className="text-[10px] font-bold text-zinc-500">Status</label>
        <select value={data.status} onChange={e => onChange('status', e.target.value as AssetLifecycleStatus)} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs bg-white">
            <option>CIP</option><option>In Service</option><option>Modification</option><option>Disposal</option>
        </select>
    </div>
  </div>
);
export default AssetFinancialForm;