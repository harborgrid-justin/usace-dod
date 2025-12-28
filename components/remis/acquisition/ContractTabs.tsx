
import React from 'react';
import { Contract } from '../../../types';
import { formatCurrency } from '../../../utils/formatting';
import { FileText, CheckCircle2, Shield } from 'lucide-react';

interface Props {
    activeTab: 'History' | 'Clauses' | 'Audit';
    contract: Contract;
}

const ContractTabs: React.FC<Props> = ({ activeTab, contract }) => {
    return (
        <div className="animate-in fade-in">
            {activeTab === 'History' && (
                <div className="bg-zinc-50/50 rounded-2xl border border-zinc-100 overflow-hidden shadow-inner">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-100 font-bold uppercase tracking-widest text-zinc-500">
                            <tr><th className="p-4">Mod #</th><th className="p-4">Date</th><th className="p-4">Authority</th><th className="p-4 text-right">Delta</th></tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {contract.modifications.map(m => (
                                <tr key={m.id} className="hover:bg-white"><td className="p-4 font-mono font-bold text-zinc-900">{m.modNumber}</td><td className="p-4">{m.date}</td><td className="p-4 text-zinc-500">{m.authority}</td><td className="p-4 text-right font-mono font-bold text-emerald-600">+{formatCurrency(m.amountDelta)}</td></tr>
                            ))}
                        </tbody>
                    </table>
                    {contract.modifications.length === 0 && <div className="p-10 text-center text-zinc-400 font-medium">No system-recorded modifications.</div>}
                </div>
            )}
            {activeTab === 'Clauses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[ {c: '52.204-27', n: 'ByteDance Prohibition'}, {c: '52.222-26', n: 'Equal Opportunity'}, {c: '52.225-13', n: 'Foreign Purchases'}, {c: '52.232-25', n: 'Prompt Payment'} ].map(cl => (
                        <div key={cl.c} className="p-4 bg-white border border-zinc-200 rounded-xl flex justify-between items-center"><div className="flex items-center gap-3"><FileText size={16} className="text-zinc-400"/><div className="text-xs"><p className="font-mono font-bold text-zinc-500">{cl.c}</p><p className="font-bold text-zinc-800">{cl.n}</p></div></div><CheckCircle2 size={16} className="text-emerald-500" /></div>
                    ))}
                </div>
            )}
            {activeTab === 'Audit' && (
                <div className="space-y-4">{contract.auditLog.map((l, i) => (
                    <div key={i} className="flex gap-4 p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs"><div className="p-2 bg-white rounded-lg h-fit border border-zinc-200"><Shield size={14} className="text-zinc-400"/></div><div className="flex-1"><p className="font-bold text-zinc-900 uppercase text-[10px]">{l.action}</p><p className="text-zinc-500 mt-1">{l.details}</p></div></div>
                ))}</div>
            )}
        </div>
    );
};

export default ContractTabs;
