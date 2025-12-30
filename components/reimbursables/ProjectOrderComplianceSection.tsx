import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface Props {
    form: any;
    setForm: (f: any) => void;
}

const ProjectOrderComplianceSection: React.FC<Props> = ({ form, setForm }) => (
    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-600"/> Determination of Status</h4>
        <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isDoDOwned} onChange={e => setForm({...form, isDoDOwned: e.target.checked})} className="mt-1" />
                <div className="text-xs font-bold text-zinc-800">Is the provider a DoD-owned establishment?</div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isSpecificDefiniteCertain} onChange={e => setForm({...form, isSpecificDefiniteCertain: e.target.checked})} className="mt-1" />
                <div className="text-xs font-bold text-zinc-800">Is the work Specific, Definite, and Certain?</div>
            </label>
        </div>
    </div>
);
export default ProjectOrderComplianceSection;