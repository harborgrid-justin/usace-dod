
import React from 'react';
import { BracInstallation } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Scale, Users, Building, ShieldAlert, Zap, Globe, Shield } from 'lucide-react';

interface Props {
    installations: BracInstallation[];
}

const InstallationComparison: React.FC<Props> = ({ installations }) => {
    return (
        <div className="space-y-8 animate-in fade-in h-full flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                {installations.map(inst => (
                    <div key={inst.id} className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm flex flex-col group hover:border-indigo-400 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-zinc-900 text-white rounded-sm shadow-xl group-hover:scale-105 transition-transform">
                                    <Building size={20}/>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-900 tracking-tight">{inst.name}</h4>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{inst.service} • {inst.region}</p>
                                </div>
                            </div>
                            {inst.isJointBase && (
                                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-sm border border-emerald-100 text-[9px] font-bold uppercase tracking-wide">Joint</div>
                            )}
                        </div>

                        <div className="space-y-6 flex-1">
                            {/* Capacity Metrics */}
                            <div>
                                <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                    <span>Troop Density</span>
                                    <span>{inst.currentTroopDensity.toLocaleString()} / {inst.totalForceCapacity.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200 shadow-inner">
                                    <div 
                                        className="h-full bg-zinc-800 rounded-full transition-all duration-1000" 
                                        style={{ width: `${(inst.currentTroopDensity / inst.totalForceCapacity) * 100}%` }} 
                                    />
                                </div>
                            </div>

                            {/* Infrastructure Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-zinc-50 rounded-sm border border-zinc-100 group-hover:bg-white group-hover:border-indigo-100 transition-all shadow-inner">
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Facility Condition</p>
                                    <p className="text-lg font-mono font-bold text-zinc-900">{inst.conditionCode}%</p>
                                </div>
                                <div className="p-3 bg-zinc-50 rounded-sm border border-zinc-100 group-hover:bg-white group-hover:border-indigo-100 transition-all shadow-inner">
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Econ Dependency</p>
                                    <p className="text-lg font-mono font-bold text-zinc-900">{(inst.economicData.defenseDependencyIndex * 100).toFixed(0)}%</p>
                                </div>
                            </div>

                            {/* Risk Indicators */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 rounded-sm border bg-zinc-50 border-zinc-100">
                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Environmental Liability</span>
                                    {inst.environmental.hasSuperfundSite ? (
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-rose-600">
                                            <ShieldAlert size={12}/> HIGH RISK
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                                            <Shield size={12}/> CLEAR
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-sm border bg-zinc-50 border-zinc-100">
                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Community Capacity</span>
                                    <div className={`flex items-center gap-1 text-[9px] font-bold ${inst.infrastructure.schoolCapacityPct > 90 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {inst.infrastructure.schoolCapacityPct}% LOAD
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Available Land</span>
                                <span className="text-xs font-mono font-bold text-zinc-900">{inst.availableAcreage.toLocaleString()} AC</span>
                            </div>
                            <button className="px-4 py-2 bg-zinc-100 hover:bg-zinc-900 hover:text-white rounded-sm text-[9px] font-bold uppercase transition-all shadow-sm active:scale-95">View RPUID Inventory</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstallationComparison;
