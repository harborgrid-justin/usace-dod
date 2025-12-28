
import React from 'react';
import { Book, FileText, Shield } from 'lucide-react';

const JobPlanLibrary: React.FC = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <div><h3 className="text-lg font-bold text-zinc-900">Standard Job Plans</h3><p className="text-xs text-zinc-500">Authoritative SOPs for common repair actions.</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
                { id: 'JP-001', name: 'Roof Membrane Repair', category: 'Civil' },
                { id: 'JP-042', name: 'UPS Battery String Replacement', category: 'Electrical' }
            ].map(plan => (
                <div key={plan.id} className="p-5 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-300 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-zinc-50 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-all"><Book size={20}/></div>
                        <span className="text-[9px] font-bold uppercase bg-zinc-100 px-2 py-0.5 rounded">{plan.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900">{plan.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">PLAN_ID: {plan.id}</p>
                </div>
            ))}
        </div>
    </div>
);
export default JobPlanLibrary;
