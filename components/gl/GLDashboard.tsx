
import React, { useMemo } from 'react';
import { MOCK_GL_TRANSACTIONS } from '../../constants';
import { formatCurrencyExact } from '../../utils/formatting';
import { AlertCircle, CheckCircle } from 'lucide-react';

const GLDashboard: React.FC = () => {
    // Opp 8: Memoize expensive aggregations
    const { totalDebits, totalCredits, inBalance } = useMemo(() => {
        const debits = MOCK_GL_TRANSACTIONS.reduce((sum, tx) => sum + tx.lines.reduce((lineSum, line) => lineSum + line.debit, 0), 0);
        const credits = MOCK_GL_TRANSACTIONS.reduce((sum, tx) => sum + tx.lines.reduce((lineSum, line) => lineSum + line.credit, 0), 0);
        return {
            totalDebits: debits,
            totalCredits: credits,
            inBalance: debits === credits
        };
    }, []); // Empty dependency array as MOCK_GL_TRANSACTIONS is constant in this file scope context (or pass as prop)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-full overflow-y-auto custom-scrollbar">
            {/* Left: Trial Balance Summary */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Trial Balance</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                            <span className="text-sm font-semibold text-zinc-700">Total Debits</span>
                            {/* Opp 16: Animate number could go here with a library, for now we use optimized rendering */}
                            <span className="text-sm font-mono font-bold">{formatCurrencyExact(totalDebits)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                            <span className="text-sm font-semibold text-zinc-700">Total Credits</span>
                            <span className="text-sm font-mono font-bold">{formatCurrencyExact(totalCredits)}</span>
                        </div>
                    </div>
                    <div className={`mt-4 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold border ${
                        inBalance ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                        {inBalance ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                        {inBalance ? 'In Balance' : 'Out of Balance'}
                    </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">ADA Monitoring</h4>
                    <div className="p-4 bg-white rounded-lg border text-center">
                        <p className="text-sm text-zinc-500 mb-2">Fund Status 21 2020 (CW)</p>
                        <p className="text-3xl font-bold text-emerald-600">98.2%</p>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Obligated vs. Authority</p>
                    </div>
                </div>
            </div>

            {/* Right: Transaction Feed */}
            <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-xl p-6 flex flex-col">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Recent GL Activity</h4>
                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                    {MOCK_GL_TRANSACTIONS.map(tx => (
                        <div key={tx.id} className="bg-white p-4 rounded-lg border border-zinc-100 hover:border-zinc-200 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-zinc-800">{tx.description}</span>
                                        <span className="text-[9px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded border">{tx.sourceModule}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Ref: {tx.referenceDoc} • {tx.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono font-bold">{formatCurrencyExact(tx.totalAmount)}</p>
                                    <p className="text-[10px] text-zinc-400">User: {tx.createdBy}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GLDashboard;
