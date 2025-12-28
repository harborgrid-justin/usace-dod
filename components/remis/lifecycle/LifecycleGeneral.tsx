
import React from 'react';
import { FileText, Bookmark, MapPin } from 'lucide-react';
import { RealPropertyAsset } from '../../../types';

const LifecycleGeneral: React.FC<{data: RealPropertyAsset, onChange: (d: RealPropertyAsset) => void}> = ({ data, onChange }) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm space-y-10">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-10 flex items-center gap-3 border-b pb-4 border-zinc-50"><FileText size={18}/> Authoritative Attribute Registry</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Asset Name</label>
                    <input className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold" value={data.rpaName} onChange={e => onChange({...data, rpaName: e.target.value})} />
                </div>
                <div className="space-y-6">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">CATCODE</label>
                    <input className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-mono" value={data.catcode} onChange={e => onChange({...data, catcode: e.target.value})} />
                </div>
            </div>
        </div>
        <div className="lg:col-span-4 bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl relative border border-zinc-800">
             <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-10 flex items-center gap-3"><Bookmark size={18}/> Accountability</h4>
             <div className="space-y-6">
                <div className="p-5 bg-white/5 border border-white/10 rounded-3xl shadow-inner"><p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">District</p><p className="text-base font-bold uppercase">{data.accountableDistrict}</p></div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-3xl shadow-inner"><p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">Source</p><p className="text-base font-bold uppercase">{data.sourceSystem}</p></div>
             </div>
        </div>
    </div>
);
export default LifecycleGeneral;
