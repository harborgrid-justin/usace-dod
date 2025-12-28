import React from 'react';
import { MarketResearchReport, SolicitationStatus } from '../../types';
import { Landmark, ArrowUpRight, Search, ShieldCheck, Factory, TrendingUp, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';

interface Props {
    report: MarketResearchReport;
    onAdvance: () => void;
    status: SolicitationStatus;
}

const MarketResearchModule: React.FC<Props> = ({ report, onAdvance, status }) => {
    return (
        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-2">
            <div className="p-5 border-b border-zinc-100 bg-zinc-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Search size={18} className="text-emerald-400" />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Acquisition Intelligence Report</h4>
                </div>
                <div className="flex items-center gap-3 px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">Set-Aside Recommendation</span>
                    <div className={`h-2.5 w-2.5 rounded-full ${report.smallBusinessSetAside ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="space-y-6">
                    <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Selected NAICS</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-mono font-bold text-zinc-900">{report.naicsCode}</span>
                        </div>
                        <p className="text-[9px] text-zinc-400 mt-2 font-medium">Real Estate Services / Land Appraisal</p>
                    </div>
                    <div className="p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5">IGCE Confidence</p>
                        <p className="text-2xl font-mono font-bold text-emerald-700">{formatCurrency(report.estimatedMarketPrice)}</p>
                        <p className="text-[9px] text-emerald-600 mt-2 flex items-center gap-1"><Info size={10}/> Based on 14 similar regional awards.</p>
                    </div>
                    <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Small Business Inclusion</p>
                        <div className="space-y-3">
                            {['WOSB', 'SDVOSB', 'HUBZone'].map(tag => (
                                <div key={tag} className="flex justify-between items-center text-[10px]">
                                    <span className="text-zinc-600 font-bold">{tag} Candidate</span>
                                    <ShieldCheck size={12} className={tag === 'SDVOSB' ? 'text-emerald-500' : 'text-zinc-200'}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-50 rounded-3xl p-8 relative border border-zinc-100 group">
                        <div className="absolute top-6 right-6 p-2 bg-white rounded-xl shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} className="text-emerald-600" />
                        </div>
                        <h5 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                            <Factory size={18} className="text-emerald-700" /> Market Capacity Narrative
                        </h5>
                        <div className="text-sm text-zinc-600 leading-relaxed space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-4">
                            {report.aiNarrative ? (
                                <div className="whitespace-pre-wrap">{report.aiNarrative}</div>
                            ) : (
                                <p className="italic text-zinc-400">Synthesis of historical award data pending...</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                            {report.competitors.map(c => (
                                <div key={c} className="bg-white px-4 py-2.5 rounded-xl border border-zinc-100 text-[10px] font-bold text-zinc-700 flex justify-between items-center hover:border-emerald-200 hover:text-emerald-800 transition-all shadow-sm">
                                    {c} <ArrowUpRight size={12} className="text-zinc-300" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {status === 'Market Research' && (
                        <div className="flex justify-end pt-4">
                             <button 
                                onClick={onAdvance}
                                className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/10 ${REMIS_THEME.classes.buttonPrimary}`}
                             >
                                Certify & Release RFP <ArrowUpRight size={16}/>
                             </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketResearchModule;