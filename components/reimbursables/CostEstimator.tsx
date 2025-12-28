import React, { useMemo, useTransition } from 'react';
import { Calculator, AlertTriangle, Info, ShieldAlert, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import { ReimbursableCustomerType } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { useCostEstimator } from './useCostEstimator';

const CostInputGroup = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
            <input 
                type="number" 
                value={value || ''} 
                onChange={e => onChange(Number(e.target.value))} 
                placeholder="0.00"
                className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all" 
            />
        </div>
    </div>
);

const CostEstimator: React.FC = () => {
    const [isPending, startTransition] = useTransition();
    const {
        customerType,
        setCustomerType,
        inputs,
        flags,
        breakdown,
        handleInputChange,
        handleFlagChange
    } = useCostEstimator();

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm flex flex-col gap-8">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-900 text-white rounded-2xl shadow-xl"><Calculator size={24}/></div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">Cost Determination (FMR 11A)</h3>
                                <p className="text-xs text-zinc-500 font-medium">Reimbursable Order Calculation Matrix</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Sponsor / Customer Profile</label>
                            <select 
                                value={customerType} 
                                onChange={(e) => startTransition(() => setCustomerType(e.target.value as ReimbursableCustomerType))}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-bold text-zinc-800 focus:outline-none focus:border-zinc-400 transition-all"
                            >
                                <option value="Intra-DoD">Intra-DoD (Component to Component)</option>
                                <option value="Inter-Agency">Inter-Agency (DoD to Federal)</option>
                                <option value="Private Party">Private Party / Non-Federal Public</option>
                                <option value="FMS">Foreign Military Sales (FMS)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <CostInputGroup label="Direct Civilian Labor" value={inputs.labor} onChange={v => handleInputChange('labor', v)} />
                            <CostInputGroup label="Direct Military Labor" value={inputs.milLabor} onChange={v => handleInputChange('milLabor', v)} />
                            <CostInputGroup label="Direct Material & Supplies" value={inputs.material} onChange={v => handleInputChange('material', v)} />
                            <CostInputGroup label="Contractual Services" value={inputs.contract} onChange={v => handleInputChange('contract', v)} />
                        </div>

                        <div className="pt-4 border-t border-zinc-100 flex flex-wrap gap-4">
                            <label className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200 cursor-pointer hover:bg-zinc-100 transition-all group flex-1">
                                <input type="checkbox" checked={flags.isDwcf} onChange={e => handleFlagChange('isDwcf', e.target.checked)} className="rounded-lg border-zinc-300 text-zinc-900 focus:ring-0 w-5 h-5" />
                                <span className="text-xs font-bold text-zinc-700 uppercase tracking-tight">Performing Org is DWCF</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200 cursor-pointer hover:bg-zinc-100 transition-all group flex-1">
                                <input type="checkbox" checked={flags.isNonReimbursable} onChange={e => handleFlagChange('isNonReimbursable', e.target.checked)} className="rounded-lg border-zinc-300 text-zinc-900 focus:ring-0 w-5 h-5" />
                                <span className="text-xs font-bold text-zinc-700 uppercase tracking-tight">Waive Reimbursement</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
                <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-2xl flex flex-col relative overflow-hidden h-full min-h-[500px]">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><DollarSign size={120} /></div>
                    
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Estimate Summary</h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                            <ShieldAlert size={12}/> AUDIT READY
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10 flex-1">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-xs text-zinc-400 font-medium">Direct Costs (Funded)</span>
                            <span className="font-mono font-bold text-sm">{formatCurrency(breakdown.baseCost)}</span>
                        </div>

                        {breakdown.assetUseCharge > 0 && (
                            <div className="flex justify-between items-center group cursor-help">
                                <span className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
                                    Asset Use Charge (4%) <Info size={12} className="opacity-40 group-hover:opacity-100" />
                                </span>
                                <span className="font-mono text-xs font-bold text-emerald-400">+{formatCurrency(breakdown.assetUseCharge)}</span>
                            </div>
                        )}

                        {breakdown.milLaborAccel > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-400 font-medium">Mil Labor Acceleration</span>
                                <span className="font-mono text-xs font-bold text-emerald-400">+{formatCurrency(breakdown.milLaborAccel)}</span>
                            </div>
                        )}

                        {breakdown.unfundedCivRetirement > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-400 font-medium">Unfunded Civ Retirement (18%)</span>
                                <span className="font-mono text-xs font-bold text-emerald-400">+{formatCurrency(breakdown.unfundedCivRetirement)}</span>
                            </div>
                        )}

                        {breakdown.unfundedHealthBenefits > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-400 font-medium">Post-Retirement Health (6.5%)</span>
                                <span className="font-mono text-xs font-bold text-emerald-400">+{formatCurrency(breakdown.unfundedHealthBenefits)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-6 border-t-2 border-white/20">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Reimbursement</span>
                                {flags.isNonReimbursable && <span className="text-[8px] text-rose-400 font-bold uppercase mt-1">SUPPORT WAIVED</span>}
                            </div>
                            <span className={`text-4xl font-mono font-bold transition-all ${flags.isNonReimbursable ? 'text-zinc-700 line-through' : 'text-white'}`}>
                                {formatCurrency(breakdown.totalBillable)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-12 relative z-10">
                        <button className="w-full py-4 bg-white text-zinc-900 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                             Establish FS 7600A <ArrowUpRight size={18}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostEstimator;