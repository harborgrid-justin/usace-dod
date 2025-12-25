
import React from 'react';
import { WorkforcePlan, LaborCategory } from '../../types';
import { Users, Building2, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
    plans: WorkforcePlan[];
    onUpdatePlan: (plan: WorkforcePlan) => void;
}

const WorkforcePlanner: React.FC<Props> = ({ plans, onUpdatePlan }) => {
    
    const handleFTEChange = (plan: WorkforcePlan, category: LaborCategory, field: 'fundedFTE' | 'unfundedFTE', val: number) => {
        const updatedEntries = plan.entries.map(e => 
            e.laborCategory === category ? { ...e, [field]: val } : e
        );
        onUpdatePlan({ ...plan, entries: updatedEntries });
    };

    return (
        <div className="animate-in fade-in space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-zinc-700 border border-zinc-200">
                    <Users size={24}/>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Workforce Distribution</h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Modify funded and unfunded (overhire) FTE allocations by labor category. Changes here reflect in the "Labor Cost" and "Gap Analysis" projections.
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {plans.map(plan => {
                    const totalFTE = plan.entries.reduce((sum, e) => sum + e.fundedFTE + e.unfundedFTE, 0);

                    return (
                        <div key={plan.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="p-4 bg-zinc-50/80 border-b border-zinc-200 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Building2 size={18} className="text-zinc-400"/>
                                    <div>
                                        <h4 className="font-bold text-sm text-zinc-900">{plan.organization}</h4>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase">{plan.functionalArea}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase">Total Plan</p>
                                    <p className="text-lg font-mono font-bold text-zinc-900">{totalFTE.toFixed(1)}</p>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead className="bg-white border-b border-zinc-100">
                                        <tr>
                                            <th className="p-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Labor Category</th>
                                            <th className="p-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest text-center">Funded FTE</th>
                                            <th className="p-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest text-center">Unfunded FTE</th>
                                            <th className="p-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest text-right bg-zinc-50">Total Auth</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {plan.entries.map(entry => (
                                            <tr key={entry.laborCategory} className="hover:bg-zinc-50/50 transition-colors">
                                                <td className="p-4">
                                                    <span className="font-semibold text-xs text-zinc-700">{entry.laborCategory}</span>
                                                </td>
                                                <td className="p-4">
                                                    <input 
                                                        type="number" 
                                                        step="0.1"
                                                        value={entry.fundedFTE}
                                                        onChange={e => handleFTEChange(plan, entry.laborCategory, 'fundedFTE', Number(e.target.value))}
                                                        className="w-20 mx-auto block text-center font-mono text-sm font-bold text-emerald-600 bg-emerald-50/30 border border-emerald-100 rounded py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <input 
                                                        type="number" 
                                                        step="0.1"
                                                        value={entry.unfundedFTE}
                                                        onChange={e => handleFTEChange(plan, entry.laborCategory, 'unfundedFTE', Number(e.target.value))}
                                                        className="w-20 mx-auto block text-center font-mono text-sm font-bold text-amber-600 bg-amber-50/30 border border-amber-100 rounded py-1 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                                    />
                                                </td>
                                                <td className="p-4 text-right font-mono text-sm text-zinc-900 font-bold bg-zinc-50/50">
                                                    {(entry.fundedFTE + entry.unfundedFTE).toFixed(1)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 text-emerald-800 text-xs items-center shadow-sm">
                <ShieldCheck size={16} className="shrink-0"/>
                <p><strong>Note:</strong> FTE changes must align with TDA (Table of Distributions and Allowances) caps defined in Module Configuration.</p>
            </div>
        </div>
    );
};

export default WorkforcePlanner;
