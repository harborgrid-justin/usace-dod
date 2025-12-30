
import React, { useState } from 'react';
import { DWCFRateProfile, DWCFActivity } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Settings, Save, AlertTriangle, TrendingUp, Info, Check, X, Percent, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
    rates: DWCFRateProfile[];
    activities: DWCFActivity[];
    onUpdateRate: (rate: DWCFRateProfile) => void;
}

const DWCFRateManager: React.FC<Props> = ({ rates, activities, onUpdateRate }) => {
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
        const updatedRate = { ...selectedRate, ...formState } as DWCFRateProfile;
        onUpdateRate(updatedRate);
        setIsEditing(false);
        setSelectedRate(null);
    };

    const getActivityName = (id: string) => activities.find(a => a.id === id)?.name || id;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-in fade-in">
            {/* List */}
            <div className="lg:col-span-1 bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <Settings size={14} className="text-emerald-700"/> Rate Profiles (FY24)
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {rates.map(rate => (
                        <div 
                            key={rate.id} 
                            onClick={() => handleEdit(rate)}
                            className={`p-5 rounded-sm border cursor-pointer transition-all ${
                                selectedRate?.id === rate.id 
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' 
                                : 'bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs font-bold uppercase tracking-wider ${selectedRate?.id === rate.id ? 'opacity-100' : 'text-zinc-700'}`}>
                                    {getActivityName(rate.activityId)}
                                </span>
                                <span className={`text-[8px] px-2 py-0.5 rounded-sm font-bold uppercase border ${
                                    selectedRate?.id === rate.id 
                                    ? 'bg-zinc-800 border-zinc-700 text-zinc-300' 
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                }`}>{rate.status}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${selectedRate?.id === rate.id ? 'text-zinc-500' : 'text-zinc-400'}`}>Composite Rate</p>
                                    <p className="text-lg font-mono font-bold tracking-tighter">{formatCurrency(rate.compositeRate)}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${selectedRate?.id === rate.id ? 'text-zinc-500' : 'text-zinc-400'}`}>AOR</p>
                                    <p className={`text-xs font-mono font-bold ${
                                        rate.accumulatedOperatingResult < 0 
                                        ? 'text-rose-400' 
                                        : (selectedRate?.id === rate.id ? 'text-emerald-400' : 'text-emerald-600')
                                    }`}>{formatCurrency(rate.accumulatedOperatingResult)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden">
                {isEditing && formState ? (
                    <div className="flex flex-col h-full">
                         <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Adjust Stabilized Rates</h3>
                                <p className="text-[10px] text-zinc-500 font-medium mt-1">Activity: {getActivityName(formState.activityId!)}</p>
                            </div>
                            <button 
                                onClick={handleSave} 
                                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors shadow-lg active:scale-95"
                            >
                                <Save size={14}/> Save Changes
                            </button>
                        </div>

                        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Composite Sales Rate ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                                        <input 
                                            type="number" 
                                            value={formState.compositeRate} 
                                            onChange={e => setFormState({...formState, compositeRate: Number(e.target.value)})} 
                                            className="w-full bg-white border border-zinc-200 rounded-sm py-3 pl-8 pr-3 text-sm font-mono font-bold focus:border-emerald-500 focus:outline-none transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">General Overhead (%)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={formState.overheadRate} 
                                            onChange={e => setFormState({...formState, overheadRate: Number(e.target.value)})} 
                                            className="w-full bg-white border border-zinc-200 rounded-sm py-3 px-3 text-sm font-mono font-bold focus:border-emerald-500 focus:outline-none transition-all shadow-inner"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">%</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Capital Surcharge (%)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={formState.surchargeRate} 
                                            onChange={e => setFormState({...formState, surchargeRate: Number(e.target.value)})} 
                                            className="w-full bg-white border border-zinc-200 rounded-sm py-3 px-3 text-sm font-mono font-bold focus:border-emerald-500 focus:outline-none transition-all shadow-inner"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-zinc-50 p-6 rounded-sm border border-zinc-100">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">Net Operating Result (Current)</p>
                                    <p className={`text-2xl font-mono font-bold tracking-tighter ${Number(formState.netOperatingResult) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {formatCurrency(formState.netOperatingResult!)}
                                    </p>
                                </div>
                                <div className="bg-zinc-50 p-6 rounded-sm border border-zinc-100">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">Accumulated Operating Result (AOR)</p>
                                    <p className={`text-2xl font-mono font-bold tracking-tighter ${Number(formState.accumulatedOperatingResult) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {formatCurrency(formState.accumulatedOperatingResult!)}
                                    </p>
                                </div>
                            </div>

                            {Number(formState.accumulatedOperatingResult) < 0 && (
                                <div className="p-5 bg-amber-50 border border-amber-200 rounded-sm flex gap-4 text-amber-900 animate-in slide-in-from-bottom-2">
                                    <div className="p-2 bg-white rounded-sm border border-amber-100 shadow-sm text-amber-600 h-fit"><AlertTriangle size={18} /></div>
                                    <div>
                                        <h5 className="text-xs font-bold uppercase tracking-wide mb-1">AOR Recovery Required</h5>
                                        <p className="text-xs leading-relaxed opacity-90">The accumulated operating result is negative. FMR Vol 2B requires rate adjustments in the upcoming budget cycle to return AOR to zero.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-4">
                        <div className="p-8 bg-zinc-50 rounded-full border-2 border-dashed border-zinc-200">
                             <Settings size={48} className="opacity-10"/>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest">Rate Profile Workspace</p>
                        <p className="text-xs font-medium opacity-60">Select an activity to adjust rates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DWCFRateManager;
