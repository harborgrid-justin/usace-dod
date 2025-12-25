
import React, { useState } from 'react';
import { Shield, Activity, Sparkles, Bot } from 'lucide-react';
import { ContingencyOperation } from '../../types';
import { analyzeContingencyReport } from '../../services/geminiService';

interface FiduciarySentinelProps {
    operation: ContingencyOperation;
}

const FiduciarySentinel: React.FC<FiduciarySentinelProps> = ({ operation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [findings, setFindings] = useState<any[]>([]);
    
    const runAnalysis = async () => {
        setIsLoading(true);
        setFindings([]);
        const result = await analyzeContingencyReport(operation);
        setFindings(result);
        setIsLoading(false);
    };

    const getRiskColor = (level: string) => {
        if (level === 'High' || level === 'Critical') return 'border-rose-500/50 bg-rose-50/20';
        if (level === 'Medium') return 'border-amber-500/50 bg-amber-50/20';
        return 'border-emerald-500/50 bg-emerald-50/20';
    }

    return (
        <div className="bg-zinc-900 rounded-xl p-6 text-white shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Shield size={16} className="text-emerald-400" /> Fiduciary Sentinel
                </h4>
                <button onClick={runAnalysis} disabled={isLoading} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? <Activity size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {isLoading ? 'Analyzing...' : 'Run Audit'}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {isLoading && <div className="text-zinc-400 text-xs text-center py-8">Analyzing incremental costs against FMR...</div>}
                {!isLoading && findings.length > 0 && (
                    <div className="space-y-3">
                        {findings.map((finding, index) => (
                            <div key={index} className={`p-3 rounded-lg border animate-in fade-in ${getRiskColor(finding.risk_level)}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-xs font-bold">{finding.finding}</p>
                                    <span className="text-[9px] font-mono bg-zinc-700 px-1.5 py-0.5 rounded">{finding.fmr_reference}</span>
                                </div>
                                <p className="text-xs text-zinc-300">{finding.recommendation}</p>
                            </div>
                        ))}
                    </div>
                )}
                {!isLoading && findings.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
                         <Bot size={24} className="opacity-50"/>
                         <p className="text-xs text-center">Ready to audit against FMR Vol 12, Ch 23.</p>
                      </div>
                )}
            </div>
        </div>
    );
};

export default FiduciarySentinel;
