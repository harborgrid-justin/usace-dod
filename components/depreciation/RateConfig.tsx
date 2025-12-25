
import React from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';

const RateConfig = () => {
    const rates = [
        { name: 'Depreciation Method', value: 'Straight-Line', note: 'Mandated by policy.' },
        { name: 'Plant Increment Factor (FY24)', value: '2.5%', note: 'HQUSACE Annual Directive.' },
        { name: 'Insurance Surcharge Rate', value: '0.15%', note: 'Based on historical loss data.' }
    ];

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-full">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Settings size={14} className="text-zinc-400" /> System Rates & Configuration
            </h3>
            <div className="space-y-4">
                {rates.map(rate => (
                    <div key={rate.name} className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl transition-all hover:bg-zinc-50/80">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-semibold text-zinc-800">{rate.name}</p>
                            <p className="text-sm font-mono font-bold text-zinc-900">{rate.value}</p>
                        </div>
                        <p className="text-[10px] text-zinc-400 italic">{rate.note}</p>
                    </div>
                ))}
            </div>
             <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 text-blue-800 text-xs font-medium">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span className="leading-relaxed">Rates are controlled at the HQ level and cannot be modified at the district level. Last synchronized today at 0800.</span>
            </div>
        </div>
    );
};

export default RateConfig;
