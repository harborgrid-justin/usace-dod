
import React from 'react';
import { Expense, Disbursement } from '../../types';
import { formatCurrency, formatCurrencyExact } from '../../utils/formatting';

interface Props {
    expenses: Expense[];
    disbursements: Disbursement[];
}

const ExpenseReports: React.FC<Props> = ({ expenses, disbursements }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-md border border-zinc-200 shadow-sm">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Expense Detail Report</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50"><th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">ID</th><th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Description</th><th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Status</th><th className="p-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Amount</th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {expenses.map(exp => (
                                <tr key={exp.id}>
                                    <td className="p-2 text-xs font-mono">{exp.id}</td>
                                    <td className="p-2 text-xs">{exp.description}</td>
                                    <td className="p-2 text-xs">{exp.status}</td>
                                    <td className="p-2 text-xs font-mono text-right">{formatCurrencyExact(exp.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-md border border-zinc-200 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Accrued Expense Aging</h4>
                     <table className="w-full text-left">
                        <thead><tr className="border-b bg-zinc-50"><th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Description</th><th className="p-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Days Accrued</th></tr></thead>
                        <tbody className="divide-y">
                            {expenses.filter(e => e.status === 'Accrued').map(exp => (
                                <tr key={exp.id}>
                                    <td className="p-2 text-xs">{exp.description}</td>
                                    <td className="p-2 text-xs font-mono text-right">{ Math.floor((new Date().getTime() - new Date(exp.date).getTime()) / (1000 * 3600 * 24)) } days</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white p-6 rounded-md border border-zinc-200 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Disbursement Summary</h4>
                     <table className="w-full text-left">
                        <thead><tr className="border-b bg-zinc-50"><th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Treasury ID</th><th className="p-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Amount</th></tr></thead>
                        <tbody className="divide-y">
                            {disbursements.map(d => (
                                <tr key={d.id}>
                                    <td className="p-2 text-xs font-mono">{d.treasuryConfirmationId}</td>
                                    <td className="p-2 text-xs font-mono text-right">{formatCurrencyExact(d.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpenseReports;
