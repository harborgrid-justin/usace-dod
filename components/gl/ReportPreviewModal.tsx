import React from 'react';
import Modal from '../shared/Modal';
import { GLTransaction } from '../../types';
import { formatCurrencyExact } from '../../utils/formatting';
import { FileText, Printer, Share2, Download, Landmark } from 'lucide-react';

type ReportType = 'Trial Balance' | 'Balance Sheet' | 'SBR';

interface Props {
    reportType: ReportType;
    data: { transactions: GLTransaction[] };
    onClose: () => void;
}

const ReportPreviewModal: React.FC<Props> = ({ reportType, data, onClose }) => {
    const totalDebits = data.transactions.reduce((s, t) => s + t.lines.reduce((ls, l) => ls + l.debit, 0), 0);
    const totalCredits = data.transactions.reduce((s, t) => s + t.lines.reduce((ls, l) => ls + l.credit, 0), 0);

    return (
        <Modal title={reportType} subtitle="Formal Report Preview" onClose={onClose} maxWidth="max-w-4xl">
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 min-h-[600px] flex flex-col font-serif shadow-inner">
                <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-6 mb-8 shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <Landmark size={24} className="text-zinc-900" />
                             <h2 className="text-xl font-bold uppercase tracking-tight">D-AFMP General Ledger</h2>
                        </div>
                        <p className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-widest">Office of the G-8 • Financial Reporting</p>
                    </div>
                    <div className="text-right font-sans">
                        <p className="text-xs font-bold text-zinc-900 uppercase">{reportType}</p>
                        <p className="text-[10px] text-zinc-500">Date: {new Date().toLocaleDateString()}</p>
                        <p className="text-[10px] text-zinc-500">Classification: UNCLASSIFIED</p>
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                    {reportType === 'Trial Balance' && (
                        <table className="w-full text-left border-collapse font-sans">
                            <thead>
                                <tr className="bg-zinc-100 border-b border-zinc-300">
                                    <th className="p-3 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">USSGL Account</th>
                                    <th className="p-3 text-[10px] font-bold text-zinc-600 uppercase tracking-wider text-right">Debit</th>
                                    <th className="p-3 text-[10px] font-bold text-zinc-600 uppercase tracking-wider text-right">Credit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                <tr className="hover:bg-zinc-50">
                                    <td className="p-3">
                                        <p className="text-sm font-bold text-zinc-900">101000 - Fund Balance with Treasury</p>
                                        <p className="text-[9px] text-zinc-400 uppercase font-bold">Standard Asset Account</p>
                                    </td>
                                    <td className="p-3 text-sm font-mono font-bold text-zinc-800 text-right">{formatCurrencyExact(totalDebits)}</td>
                                    <td className="p-3 text-sm font-mono text-zinc-300 text-right">-</td>
                                </tr>
                                <tr className="hover:bg-zinc-50">
                                    <td className="p-3">
                                        <p className="text-sm font-bold text-zinc-900">211000 - Accounts Payable</p>
                                        <p className="text-[9px] text-zinc-400 uppercase font-bold">Liability Account</p>
                                    </td>
                                    <td className="p-3 text-sm font-mono text-zinc-300 text-right">-</td>
                                    <td className="p-3 text-sm font-mono font-bold text-zinc-800 text-right">{formatCurrencyExact(totalCredits)}</td>
                                </tr>
                            </tbody>
                            <tfoot className="border-t-2 border-zinc-900 bg-zinc-50/50">
                                <tr className="font-bold">
                                    <td className="p-3 text-xs uppercase tracking-widest">Grand Totals</td>
                                    <td className="p-3 text-sm font-mono text-right">{formatCurrencyExact(totalDebits)}</td>
                                    <td className="p-3 text-sm font-mono text-right">{formatCurrencyExact(totalCredits)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                    
                    {reportType === 'Balance Sheet' && (
                        <div className="space-y-12 font-sans px-4">
                            <div>
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-[0.2em] border-b border-zinc-300 pb-2 mb-4">I. Assets</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-600 font-medium">Fund Balance with Treasury</span>
                                        <span className="font-mono font-bold">{formatCurrencyExact(totalDebits)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold border-t border-zinc-100 pt-2">
                                        <span className="text-zinc-900">TOTAL ASSETS</span>
                                        <span className="font-mono">{formatCurrencyExact(totalDebits)}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-[0.2em] border-b border-zinc-300 pb-2 mb-4">II. Liabilities</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-600 font-medium">Accounts Payable</span>
                                        <span className="font-mono font-bold">{formatCurrencyExact(totalCredits)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold border-t border-zinc-100 pt-2">
                                        <span className="text-zinc-900">TOTAL LIABILITIES</span>
                                        <span className="font-mono">{formatCurrencyExact(totalCredits)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-8 border-t border-zinc-200 flex flex-col sm:flex-row gap-4 justify-between font-sans print:hidden">
                    <div className="flex gap-2">
                        <button className="p-2 border border-zinc-200 rounded-xl text-zinc-500 hover:bg-zinc-50 transition-colors"><Printer size={18}/></button>
                        <button className="p-2 border border-zinc-200 rounded-xl text-zinc-500 hover:bg-zinc-50 transition-colors"><Share2 size={18}/></button>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={onClose} className="px-6 py-2 border border-zinc-200 rounded-xl text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Close Preview</button>
                         <button className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2 shadow-lg">
                            <Download size={14}/> Download Signed Copy
                         </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ReportPreviewModal;