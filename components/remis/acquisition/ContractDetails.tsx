
import React, { useState } from 'react';
import { Contract } from '../../../types';
import { formatCurrency } from '../../../utils/formatting';
import { ShieldCheck, History, Hammer, Landmark, FileText, Database, ShieldAlert, ArrowRight } from 'lucide-react';
import ContractTabs from './ContractTabs';
import Badge from '../../shared/Badge';

const ContractDetails: React.FC<{ contract: Contract | null }> = ({ contract }) => {
    const [activeTab, setActiveTab] = useState<'History' | 'Clauses' | 'Audit'>('History');

    if (!contract) return <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-4">
        <Database size={48} className="opacity-10" /><p className="text-xs font-bold uppercase tracking-widest">Select Award record</p>
    </div>;

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-zinc-100 pb-8">
                <div>
                    <h3 className="text-3xl font-bold text-zinc-900 leading-tight mb-2">{contract.vendor}</h3>
                    <div className="flex items-center gap-6 text-xs font-medium text-zinc-500">
                        <span className="font-mono bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">PIID: {contract.id}</span>
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span>{contract.type}</span></div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Obligated Capacity</p>
                    <p className="text-3xl font-mono font-bold text-zinc-900">{formatCurrency(contract.value)}</p>
                    <Badge variant="success" className="mt-2">Fiduciary Lock (SFFAS)</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    {l: 'Award Effective', v: contract.awardedDate},
                    {l: 'G-Invoicing Status', v: contract.gInvoicingStatus, c: 'text-emerald-700 font-bold'},
                    {l: 'Compliance Gate', v: contract.isBerryCompliant ? 'Berry Verified' : 'Exceptions Applied'},
                    {l: 'Period of Performance', v: `${contract.periodOfPerformance.start} - ${contract.periodOfPerformance.end}`}
                ].map(i => (
                    <div key={i.l} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-inner">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{i.l}</p>
                        <p className={`text-[11px] font-mono ${i.c || 'text-zinc-900'}`}>{i.v}</p>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                <ShieldAlert size={120} className="absolute -right-8 -bottom-8 opacity-5 rotate-12"/>
                <div className="relative z-10 flex justify-between items-center">
                    <div><h4 className="text-lg font-bold">Contract Governance (FAR/DFARS)</h4><p className="text-xs text-zinc-400">Validated clauses and modifications oversight.</p></div>
                    <button className="px-6 py-2 bg-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 flex items-center gap-2">Execute SF 30 <ArrowRight size={14}/></button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex gap-8 border-b border-zinc-100">
                    {['History', 'Clauses', 'Audit'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t as any)} className={`pb-3 text-xs font-bold uppercase border-b-2 transition-all ${activeTab === t ? 'border-rose-700 text-zinc-900' : 'border-transparent text-zinc-400'}`}>{t}</button>
                    ))}
                </div>
                <ContractTabs activeTab={activeTab} contract={contract} />
            </div>
        </div>
    );
};

export default ContractDetails;
