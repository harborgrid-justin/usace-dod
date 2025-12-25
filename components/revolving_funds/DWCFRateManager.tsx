
import React, { useState } from 'react';
import { DWCFRateProfile, DWCFActivity } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Settings, Save, AlertTriangle, TrendingUp, Info } from 'lucide-react';

interface Props {
    activities: DWCFActivity[];
}

const INITIAL_RATES: DWCFRateProfile[] = [
    { id: 'RATE-24-SUP', activityId: 'ACT-SUP', fiscalYear: 2024, compositeRate: 115.00, overheadRate: 18.5, surchargeRate: 12.0, accumulatedOperatingResult: -500000, netOperatingResult: 125000, status: 'Active' },
    { id: 'RATE-24-IND', activityId: 'ACT-IND', fiscalYear: 2024, compositeRate: 210.00, overheadRate: 22.0, surchargeRate: 15.0, accumulatedOperatingResult: 200000, netOperatingResult: -50000, status: 'Active' },
];

const DWCFRateManager: React.FC<Props> = ({ activities }) => {
    const [rates, setRates] = useState<DWCFRateProfile[]>(INITIAL_RATES);
    const [selectedRate, setSelectedRate] = useState<DWCFRateProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formState, setFormState] = useState<Partial<DWCFRateProfile>>({});

    const handleEdit = (rate: DWCFRateProfile) => {
        setSelectedRate(rate);
        setFormState(rate);
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!selectedRate) return;
        setRates(prev => prev.map(r => r.id === selectedRate.id ? { ...r, ...formState } as DWCFRateProfile : r));
        setIsEditing(false);
        setSelectedRate(null);
    };

    const getActivityName = (id: string) => activities.find(a => a.id === id)?.name || id;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-in fade-in">
            {/* List */}
            <div className="lg:col-span-1 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Rate Profiles (FY24)</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {rates.map(rate => (
                        <div 
                            key={rate.id} 
                            onClick={() => handleEdit(rate)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedRate?.id === rate.id ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{getActivityName(rate.activityId)}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${selectedRate?.id === rate.id ? 'bg-zinc-700 text-white' : 'bg-emerald-50 text-emerald-700'}`}>{rate.status}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] opacity-60 uppercase">Composite Rate</p>
                                    <p className="text-lg font-mono font-bold">{formatCurrency(rate.compositeRate)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] opacity-60 uppercase">AOR</p>
                                    <p className={`text-xs font-mono font-bold ${rate.accumulatedOperatingResult < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{formatCurrency(rate.accumulatedOperatingResult)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm p-6 flex flex-col">
                {isEditing && formState ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">Adjust Stabilized Rates</h3>
                                <p className="text-xs text-zinc-500">Activity: {getActivityName(formState.activityId!)}</p>
                            </div>
                            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors">
                                <Save size={14}/> Save Changes
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Composite Sales Rate ($)</label>
                                <input 
                                    type="number" 
                                    value={formState.compositeRate} 
                                    onChange={e => setFormState({...formState, compositeRate: Number(e.target.value)})} 
                                    className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm font-mono font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">General Overhead (%)</label>
                                <input 
                                    type="number" 
                                    value={formState.overheadRate} 
                                    onChange={e => setFormState({...formState, overheadRate: Number(e.target.value)})} 
                                    className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Capital Surcharge (%)</label>
                                <input 
                                    type="number" 
                                    value={formState.surchargeRate} 
                                    onChange={e => setFormState({...formState, surchargeRate: Number(e.target.value)})} 
                                    className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm font-mono"
                                />
                            </div>
                        </div>

                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-zinc-500 font-medium mb-1">Net Operating Result (Current)</p>
                                <p className={`text-xl font-mono font-bold ${Number(formState.netOperatingResult) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {formatCurrency(formState.netOperatingResult!)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-medium mb-1">Accumulated Operating Result (AOR)</p>
                                <p className={`text-xl font-mono font-bold ${Number(formState.accumulatedOperatingResult) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {formatCurrency(formState.accumulatedOperatingResult!)}
                                </p>
                            </div>
                        </div>

                        {Number(formState.accumulatedOperatingResult) < 0 && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800 text-xs items-start">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5"/>
                                <div>
                                    <p className="font-bold mb-1">AOR Recovery Required</p>
                                    <p>The accumulated operating result is negative. FMR Vol 2B requires rate adjustments in the upcoming budget cycle to return AOR to zero.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2">
                        <Settings size={32} className="opacity-20"/>
                        <p className="text-xs font-medium">Select a rate profile to adjust.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DWCFRateManager;
