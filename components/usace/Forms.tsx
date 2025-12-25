
import React from 'react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';

export const EngForm93Preview = ({ project }: { project: USACEProject }) => {
    // Dynamic Calculations
    const retainageAmount = project.financials.contractRetainage || 0;
    const totalEarnings = project.financials.obligated; // Simplified assumption for demo
    const previousPayments = Math.max(0, project.financials.disbursed - 500000); // Mock previous
    const amountDue = totalEarnings - retainageAmount - previousPayments;

    return (
        <div className="bg-white p-8 border border-zinc-200 rounded-xl shadow-lg font-mono text-xs text-zinc-800">
            <div className="text-center border-b-2 border-zinc-800 pb-4 mb-6">
                <h1 className="text-lg font-bold uppercase">Payment Estimate - Contract Performance</h1>
                <p>ENG FORM 93</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="space-y-1">
                    <p><span className="font-bold">Contractor:</span> Acme Construction, Inc.</p>
                    <p><span className="font-bold">Address:</span> 123 Builder Lane, Industry City</p>
                </div>
                <div className="space-y-1 text-right">
                    <p><span className="font-bold">Contract No:</span> W912QR-23-C-0001</p>
                    <p><span className="font-bold">Date:</span> {new Date().toISOString().split('T')[0]}</p>
                    <p><span className="font-bold">Estimate No:</span> 12</p>
                </div>
            </div>

            <table className="w-full border-collapse border border-zinc-300 mb-6">
                <thead>
                    <tr className="bg-zinc-100">
                        <th className="border border-zinc-300 p-2 text-left">Item Description</th>
                        <th className="border border-zinc-300 p-2 text-right">Contract Amount</th>
                        <th className="border border-zinc-300 p-2 text-right">Previous Earnings</th>
                        <th className="border border-zinc-300 p-2 text-right">Current Earnings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-zinc-300 p-2">0001 Mobilization</td>
                        <td className="border border-zinc-300 p-2 text-right">$500,000.00</td>
                        <td className="border border-zinc-300 p-2 text-right">$500,000.00</td>
                        <td className="border border-zinc-300 p-2 text-right">$0.00</td>
                    </tr>
                    <tr>
                        <td className="border border-zinc-300 p-2">0002 Concrete Works</td>
                        <td className="border border-zinc-300 p-2 text-right">$12,000,000.00</td>
                        <td className="border border-zinc-300 p-2 text-right">$4,000,000.00</td>
                        <td className="border border-zinc-300 p-2 text-right">$1,200,000.00</td>
                    </tr>
                    <tr>
                        <td className="border border-zinc-300 p-2 font-bold">TOTAL GROSS EARNINGS</td>
                        <td className="border border-zinc-300 p-2 text-right font-bold">$12,500,000.00</td>
                        <td className="border border-zinc-300 p-2 text-right font-bold">$4,500,000.00</td>
                        <td className="border border-zinc-300 p-2 text-right font-bold">{formatCurrency(totalEarnings)}</td>
                    </tr>
                </tbody>
            </table>

            <div className="flex justify-end mb-8">
                <div className="w-1/3 border border-zinc-300 p-4">
                    <div className="flex justify-between mb-2">
                        <span>Total Earnings:</span>
                        <span>{formatCurrency(totalEarnings)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-rose-700">
                        <span>Less Retainage (10%):</span>
                        <span>({formatCurrency(retainageAmount)})</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Less Previous Payments:</span>
                        <span>{formatCurrency(previousPayments)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-zinc-300 font-bold bg-zinc-50 p-1">
                        <span>AMOUNT DUE:</span>
                        <span>{formatCurrency(amountDue)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-8">
                <div className="w-1/3 border-t border-zinc-800 pt-2 text-center">
                    <p>Contractor Certification</p>
                </div>
                <div className="w-1/3 border-t border-zinc-800 pt-2 text-center">
                    <p>Contracting Officer Representative</p>
                </div>
            </div>
        </div>
    );
};
