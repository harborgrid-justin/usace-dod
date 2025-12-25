
import React from 'react';
import { Calculator, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { ReimbursableCustomerType } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { useCostEstimator } from './useCostEstimator';

// Sub-component for input fields to reduce main component clutter
const CostInputGroup = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
    <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label} ($)</label>
        <input 
            type="number" 
            value={value} 
            onChange={e => onChange(Number(e.target.value))} 
            className="w-full mt-1 bg-white border border-zinc-200 rounded-lg p-2 text-sm focus:outline-none focus:border-zinc-400 transition-all" 
        />
    </div>
);

const CostEstimator: React.FC = () => {
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
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
            {/* Input Panel */}
            <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-zinc-100 bg-zinc-50/50 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calculator size={18} className="text-zinc-600"/>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Cost Inputs</h3>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Customer Type</label>
                    <select 
                        value={customerType} 
                        onChange={(e) => setCustomerType(e.target.value as ReimbursableCustomerType)}
                        className="w-full mt-1.5 bg-white border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400"
                    >
                        <option value="Intra-DoD">Intra-DoD (Component to Component)</option>
                        <option value="Inter-Agency">Inter-Agency (DoD to Federal)</option>
                        <option value="Private Party">Private Party / Public</option>
                        <option value="FMS">Foreign Military Sales (FMS)</option>
                    </select>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={flags.isDwcf} 
                                onChange={e => handleFlagChange('isDwcf', e.target.checked)} 
                                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" 
                            />
                            <span className="text-xs font-medium text-zinc-700">Performing Activity is DWCF</span>
                        </label>
                        
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={flags.isNonReimbursable} 
                                onChange={e => handleFlagChange('isNonReimbursable', e.target.checked)} 
                                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" 
                            />
                            <span className="text-xs font-medium text-zinc-700">Non-Reimbursable Support (Exception)</span>
                        </label>

                        {flags.isNonReimbursable && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                                <span><strong>FMR 11A 1.3.4 Compliance:</strong> Non-reimbursable support is prohibited unless required by statute.</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <CostInputGroup label="Civilian Labor" value={inputs.labor} onChange={v => handleInputChange('labor', v)} />
                        <CostInputGroup label="Military Labor" value={inputs.milLabor} onChange={v => handleInputChange('milLabor', v)} />
                        <CostInputGroup label="Material/Supply" value={inputs.material} onChange={v => handleInputChange('material', v)} />
                        <CostInputGroup label="Contract Cost" value={inputs.contract} onChange={v => handleInputChange('contract', v)} />
                    </div>
                </div>
            </div>

            {/* Output Panel */}
            <div className="w-full md:w-1/2 p-6 flex flex-col bg-white">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Billable To Customer</h3>
                    <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 text-[10px] font-bold uppercase">
                        FMR 11A Compliant
                    </div>
                </div>

                <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-600">Base Cost (Funded)</span>
                        <span className="font-mono font-medium">{formatCurrency(breakdown.baseCost)}</span>
                    </div>
                    
                    {breakdown.assetUseCharge > 0 && (
                        <div className="flex justify-between items-center text-xs p-2 bg-blue-50 rounded border border-blue-100">
                            <span className="text-blue-800 font-medium flex items-center gap-2"><Info size={12}/> Asset Use Charge (4%)</span>
                            <span className="font-mono font-bold text-blue-800">+{formatCurrency(breakdown.assetUseCharge)}</span>
                        </div>
                    )}

                    {breakdown.milLaborAccel > 0 && (
                        <div className="flex justify-between items-center text-xs text-zinc-600">
                            <span>Mil Labor Acceleration</span>
                            <span className="font-mono font-medium">+{formatCurrency(breakdown.milLaborAccel)}</span>
                        </div>
                    )}

                    {breakdown.unfundedCivRetirement > 0 && (
                        <div className="flex justify-between items-center text-xs text-zinc-600">
                            <span>Unfunded Civ Retirement (18%)</span>
                            <span className="font-mono font-medium">+{formatCurrency(breakdown.unfundedCivRetirement)}</span>
                        </div>
                    )}

                    {breakdown.unfundedHealthBenefits > 0 && (
                        <div className="flex justify-between items-center text-xs text-zinc-600">
                            <span>Post-Retirement Health (6.5%)</span>
                            <span className="font-mono font-medium">+{formatCurrency(breakdown.unfundedHealthBenefits)}</span>
                        </div>
                    )}

                    {customerType === 'Intra-DoD' && !flags.isDwcf && inputs.milLabor > 0 && (
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-800 flex gap-2">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                            <span>Military labor cost excluded per 10 U.S.C. 2571. Direct appropriation funding assumed.</span>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-100">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Reimbursement</span>
                        <span className={`text-2xl font-mono font-bold ${flags.isNonReimbursable ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>{formatCurrency(breakdown.totalBillable)}</span>
                    </div>
                    {flags.isNonReimbursable && (
                        <div className="mt-2 text-right text-xs text-rose-600 font-bold uppercase tracking-wide">
                            Waived (Exception Required)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CostEstimator;
