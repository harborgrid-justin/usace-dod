
import React from 'react';
import { POMEntry } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { RefreshCw, Save, TrendingUp, AlertCircle, FileStack } from 'lucide-react';

interface Props {
    entries: POMEntry[];
    rate: number;
    onRateChange: (val: number) => void;
    onUpdate: (data: POMEntry[]) => void;
}

const POMBuilder: React.FC<Props> = ({ entries, rate, onRateChange, onUpdate }) => {

    const handleApplyEscalation = () => {
        const factor = 1 + (rate / 100);
        const updated = entries.map(entry => ({
            ...entry,
            fy2: Math.round(entry.fy1 * factor),
            fy3: Math.round(entry.fy1 * Math.pow(factor, 2)),
            fy4: Math.round(entry.fy1 * Math.pow(factor, 3)),
            fy5: Math.round(entry.fy1 * Math.pow(factor, 4)),
        }));
        onUpdate(updated);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in">
            {/* Escalation Control Bar */}
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 rounded-lg text-white"><TrendingUp size={16}/></div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">5-Year Defense Plan (FYDP)</h3>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white px-4 py-1.5 rounded-2xl border border-zinc-200 shadow-sm w-full sm:w-auto">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Escalation %</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                step="0.1"
                                value={rate} 
                                onChange={e => onRateChange(Number(e.target.value))} 
                                className="w-14 text-sm font-mono font-bold text-rose-700 border-b border-rose-100 focus:border-rose-500 focus:outline-none text-center bg-transparent"
                            />
                            <button 
                                onClick={handleApplyEscalation} 
                                className="text-rose-600 hover:text-rose-700 p-1 rounded-full hover:bg-rose-50 transition-all" 
                                title="Apply Compound Escalation to Outyears"
                            >
                                <RefreshCw size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-50 transition-all">
                        <FileStack size={14}/> Previous POM
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-100">
                        <Save size={14}/> Lock POM Cycle
                    </button>
                </div>
            </div>

            {/* POM Warning Header */}
            <div className="px-6 py-3 bg-rose-50 border-b border-rose-100 flex items-center gap-3">
                <AlertCircle size={14} className="text-rose-600" />
                <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                    Caution: POM Adjustments here will trigger recalculation of workforce demand (FTE) in the WWP module.
                </p>
            </div>

            {/* FYDP Matrix */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left min-w-[1000px] border-collapse">
                            <thead>
                                <tr className="bg-zinc-50 border-b border-zinc-200">
                                    <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Investment Project / Business Line</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-right bg-white border-x border-zinc-200">BY26 (Program Year)</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">FY27</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">FY28</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">FY29</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">FY30</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right bg-zinc-50 border-l border-zinc-200">Total Pipeline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {entries.map(entry => (
                                    <tr key={entry.projectId} className="hover:bg-zinc-50 transition-colors">
                                        <td className="p-4">
                                            <p className="text-xs font-bold text-zinc-900">{entry.projectName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-mono text-zinc-400 px-1.5 py-0.5 bg-zinc-100 rounded">P2: {entry.projectId}</span>
                                                <span className="text-[9px] font-bold text-rose-600 uppercase tracking-tighter">{entry.businessLine}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-xs font-bold text-zinc-900 bg-rose-50/10 border-x border-rose-100">
                                            {formatCurrency(entry.fy1)}
                                        </td>
                                        <td className="p-4 text-right font-mono text-xs text-zinc-600">{formatCurrency(entry.fy2)}</td>
                                        <td className="p-4 text-right font-mono text-xs text-zinc-600">{formatCurrency(entry.fy3)}</td>
                                        <td className="p-4 text-right font-mono text-xs text-zinc-600">{formatCurrency(entry.fy4)}</td>
                                        <td className="p-4 text-right font-mono text-xs text-zinc-600">{formatCurrency(entry.fy5)}</td>
                                        <td className="p-4 text-right font-mono text-xs font-bold text-zinc-900 bg-zinc-50 border-l border-zinc-200">
                                            {formatCurrency(entry.fy1 + entry.fy2 + entry.fy3 + entry.fy4 + entry.fy5)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Outyear Strategy Note */}
                <div className="mt-8 p-6 bg-zinc-900 rounded-2xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><FileStack size={100} /></div>
                    <div className="relative z-10 max-w-2xl">
                        <h4 className="text-base font-bold mb-2">Outyear Strategy Guidance</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                            Per the current Fiscal Guidance (FG), outyear estimates for FY27-FY30 should prioritize 
                            <span className="text-rose-400 font-bold ml-1">Capability 1 (Sustainment)</span> 
                            infrastructure projects. Projects without an identified CWIS code or PPA linkage will be 
                            automatically flagged during the SNaP review cycle.
                        </p>
                        <div className="flex gap-4">
                            <div className="text-[10px] font-bold uppercase px-3 py-1 border border-white/20 rounded-full">31 USC 1105 Compliant</div>
                            <div className="text-[10px] font-bold uppercase px-3 py-1 border border-white/20 rounded-full text-emerald-400">Enactment Likelihood: HIGH</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POMBuilder;
