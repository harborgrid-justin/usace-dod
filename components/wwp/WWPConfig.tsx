
import React, { useState } from 'react';
import { LaborRate, LaborStandard, LaborCategory } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Settings, Plus, Save, Trash2, Edit, Check, X, ShieldAlert, DollarSign, Clock, Building2, BarChart3 } from 'lucide-react';

interface Props {
    laborRates: LaborRate[];
    laborStandards: LaborStandard[];
}

interface OrgCap {
    org: string;
    authFTE: number;
    budgetLimit: number;
}

const MOCK_ORG_CAPS: OrgCap[] = [
    { org: 'LRL-ED', authFTE: 145.0, budgetLimit: 12500000 },
    { org: 'LRL-OPS', authFTE: 280.0, budgetLimit: 18400000 },
    { org: 'LRL-RM', authFTE: 12.0, budgetLimit: 1200000 },
];

const WWPConfig: React.FC<Props> = ({ laborRates: initialRates, laborStandards: initialStandards }) => {
    const [rates, setRates] = useState<LaborRate[]>(initialRates);
    const [standards, setStandards] = useState<LaborStandard[]>(initialStandards);
    const [orgCaps, setOrgCaps] = useState<OrgCap[]>(MOCK_ORG_CAPS);
    
    const [editingRate, setEditingRate] = useState<string | null>(null);
    const [rateValue, setRateValue] = useState<number>(0);

    const handleEditRate = (rate: LaborRate) => {
        setEditingRate(rate.laborCategory);
        setRateValue(rate.rate);
    };

    const handleSaveRate = () => {
        if (!editingRate) return;
        setRates(prev => prev.map(r => r.laborCategory === editingRate ? { ...r, rate: rateValue } : r));
        setEditingRate(null);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in h-full overflow-y-auto custom-scrollbar p-2 pb-10">
            
            {/* Org Caps Section */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden xl:col-span-2">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border text-zinc-500 shadow-sm"><Building2 size={16}/></div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Organizational FTE & Budget Caps</h3>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors">
                        <Save size={12}/> Update Master Caps
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {orgCaps.map(cap => (
                        <div key={cap.org} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 group hover:bg-white transition-all">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-zinc-900">{cap.org}</span>
                                <Edit size={14} className="text-zinc-300 group-hover:text-zinc-600 cursor-pointer" />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase mb-1">
                                        <span>Auth FTE Limit</span>
                                        <span className="text-zinc-900">{cap.authFTE}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-200 rounded-full" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase mb-1">
                                        <span>Annual Budget Cap</span>
                                        <span className="text-zinc-900 font-mono">{formatCurrency(cap.budgetLimit)}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-200 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Labor Rates Section */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border text-zinc-500 shadow-sm"><DollarSign size={16}/></div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Burdened Rates (FY24)</h3>
                    </div>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden sm:block flex-1 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-100">
                            <tr>
                                <th className="p-4 text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Category</th>
                                <th className="p-4 text-[10px] font-bold uppercase text-zinc-500 tracking-widest text-right">Rate/Hr</th>
                                <th className="p-4 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {rates.map(rate => (
                                <tr key={rate.laborCategory} className="group hover:bg-zinc-50/50 transition-colors">
                                    <td className="p-4 font-semibold text-sm text-zinc-700">{rate.laborCategory}</td>
                                    <td className="p-4 text-right">
                                        {editingRate === rate.laborCategory ? (
                                            <input 
                                                type="number" 
                                                value={rateValue} 
                                                onChange={e => setRateValue(Number(e.target.value))}
                                                className="w-20 p-1 border rounded text-right text-sm font-mono focus:border-rose-700 focus:outline-none"
                                            />
                                        ) : (
                                            <span className="font-mono text-sm text-zinc-900 font-bold">{formatCurrency(rate.rate)}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-1">
                                            {editingRate === rate.laborCategory ? (
                                                <button onClick={handleSaveRate} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={14}/></button>
                                            ) : (
                                                <button onClick={() => handleEditRate(rate)} className="p-1.5 text-zinc-400 hover:text-zinc-800 opacity-0 group-hover:opacity-100"><Edit size={14}/></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards for Rates */}
                <div className="sm:hidden p-4 space-y-3">
                    {rates.map(rate => (
                        <div key={rate.laborCategory} className="bg-white border border-zinc-100 rounded-lg p-3 shadow-sm flex items-center justify-between">
                            <span className="text-sm font-bold text-zinc-700">{rate.laborCategory}</span>
                            <div className="flex items-center gap-3">
                                {editingRate === rate.laborCategory ? (
                                    <input 
                                        type="number" 
                                        value={rateValue} 
                                        onChange={e => setRateValue(Number(e.target.value))}
                                        className="w-24 p-1 border rounded text-right text-sm font-mono focus:border-rose-700 focus:outline-none"
                                    />
                                ) : (
                                    <span className="font-mono text-sm font-bold text-zinc-900">{formatCurrency(rate.rate)}/hr</span>
                                )}
                                {editingRate === rate.laborCategory ? (
                                    <button onClick={handleSaveRate} className="p-1.5 text-emerald-600 bg-emerald-50 rounded"><Check size={14}/></button>
                                ) : (
                                    <button onClick={() => handleEditRate(rate)} className="p-1.5 text-zinc-400 hover:text-zinc-800"><Edit size={14}/></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Standards Section */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border text-zinc-500 shadow-sm"><Clock size={16}/></div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Efficiency Benchmarks</h3>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block flex-1 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-100">
                            <tr>
                                <th className="p-4 text-[10px] font-bold uppercase text-zinc-500">Unit Type</th>
                                <th className="p-4 text-[10px] font-bold uppercase text-zinc-500">Category</th>
                                <th className="p-4 text-[10px] font-bold uppercase text-zinc-500 text-right">Hrs/Unit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {standards.map((std, idx) => (
                                <tr key={idx} className="hover:bg-zinc-50/50">
                                    <td className="p-4 font-semibold text-sm text-zinc-700">{std.workloadUnit}</td>
                                    <td className="p-4"><span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded border uppercase">{std.laborCategory}</span></td>
                                    <td className="p-4 text-right font-mono text-sm text-zinc-900 font-bold">{std.hoursPerUnit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards for Standards */}
                <div className="sm:hidden p-4 space-y-3">
                    {standards.map((std, idx) => (
                        <div key={idx} className="bg-white border border-zinc-100 rounded-lg p-3 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-zinc-800">{std.workloadUnit}</span>
                                <span className="text-xs font-mono font-bold bg-zinc-50 px-2 py-1 rounded border border-zinc-200">{std.hoursPerUnit} Hrs/Unit</span>
                            </div>
                            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded border uppercase">{std.laborCategory}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WWPConfig;
