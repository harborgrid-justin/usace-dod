import React from 'react';

interface Props {
    form: any;
    setForm: (f: any) => void;
}

const ProjectOrderDetailsSection: React.FC<Props> = ({ form, setForm }) => (
    <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Order Number</label>
            <input type="text" value={form.orderNumber} onChange={e => setForm({...form, orderNumber: e.target.value})} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm" placeholder="N00024-..." />
        </div>
        <div className="col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Provider Activity</label>
            <input type="text" value={form.providerId} onChange={e => setForm({...form, providerId: e.target.value})} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm" />
        </div>
        <div className="col-span-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Work Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm" rows={2} />
        </div>
    </div>
);
export default ProjectOrderDetailsSection;