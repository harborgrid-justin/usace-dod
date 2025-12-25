
import React from 'react';
import Modal from '../shared/Modal';
import { GLTransaction } from '../../types';
import { formatCurrencyExact } from '../../utils/formatting';

type ReportType = 'Trial Balance' | 'Balance Sheet' | 'SBR';

interface Props {
    reportType: ReportType;
    data: { transactions: GLTransaction[] };
    onClose: () => void;
}

const ReportPreviewModal: React.FC<Props> = ({ reportType, data, onClose }) => {
    // Mock Data Generation
    const totalDebits = data.transactions.reduce((s, t) => s + t.lines.reduce((ls, l) => ls + l.debit, 0), 0);
    const totalCredits = data.transactions.reduce((s, t) => s + t.lines.reduce((ls, l) => ls + l.credit, 0), 0);

    const renderContent = () => {
        switch (reportType) {
            case 'Trial Balance':
                return (
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Account</th>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Debit</th>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Credit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {/* Mock aggregated data */}
                            <tr>
                                <td className="p-2 text-xs font-mono">101000 - FBwT</td>
                                <td className="p-2 text-xs font-mono text-right">{formatCurrencyExact(500000)}</td>
                                <td className="p-2 text-xs font-mono text-right"></td>
                            </tr>
                             <tr>
                                <td className="p-2 text-xs font-mono">211000 - A/P</td>
                                <td className="p-2 text-xs font-mono text-right"></td>
                                <td className="p-2 text-xs font-mono text-right">{formatCurrencyExact(485000)}</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-xs font-mono">610000 - Expenses</td>
                                <td className="p-2 text-xs font-mono text-right">{formatCurrencyExact(15000)}</td>
                                <td className="p-2 text-xs font-mono text-right"></td>
                            </tr>
                        </tbody>
                        <tfoot className="border-t-2 border-zinc-900">
                            <tr>
                                <td className="p-2 font-bold text-right">TOTALS</td>
                                <td className="p-2 font-mono font-bold text-right">{formatCurrencyExact(totalDebits)}</td>
                                <td className="p-2 font-mono font-bold text-right">{formatCurrencyExact(totalCredits)}</td>
                            </tr>
                        </tfoot>
                    </table>
                );
            case 'Balance Sheet':
                return (
                    <div className="space-y-4">
                        <h4 className="font-bold text-zinc-800">Assets</h4>
                        <div className="pl-4 space-y-2 text-xs">
                            <div className="flex justify-between"><span>Fund Balance with Treasury</span><span className="font-mono">{formatCurrencyExact(500000)}</span></div>
                        </div>
                        <h4 className="font-bold text-zinc-800">Liabilities</h4>
                        <div className="pl-4 space-y-2 text-xs">
                             <div className="flex justify-between"><span>Accounts Payable</span><span className="font-mono">{formatCurrencyExact(485000)}</span></div>
                        </div>
                    </div>
                );
            default:
                return <p>Report type not implemented.</p>;
        }
    };
    
    return (
        <Modal title={reportType} onClose={onClose} maxWidth="max-w-2xl">
            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 min-h-[300px]">
                {renderContent()}
            </div>
            <div className="pt-4 flex justify-end">
                <button onClick={onClose} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800">Close</button>
            </div>
        </Modal>
    );
};

export default ReportPreviewModal;
