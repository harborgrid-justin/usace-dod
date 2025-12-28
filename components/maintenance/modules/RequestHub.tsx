
import React from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';

const RequestHub: React.FC = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <div><h3 className="text-lg font-bold text-zinc-900">Request Intake</h3><p className="text-xs text-zinc-500">Route maintenance requirements to shop work.</p></div>
            <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800"><Plus size={12}/> New Request</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
            <div className="border border-zinc-200 rounded-xl p-4 hover:shadow-md transition-all bg-white group flex justify-between items-center">
                <div><span className="px-2 py-0.5 rounded border text-[9px] font-bold uppercase text-amber-700 bg-amber-50">High</span><h4 className="text-sm font-bold text-zinc-900 mt-1">Leaking pipe in Mechanical Room B</h4></div>
                <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Approve</button>
            </div>
        </div>
    </div>
);
export default RequestHub;
