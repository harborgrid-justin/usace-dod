
import React, { useState } from 'react';
import { 
    ArrowLeft, PieChart, Scale, Activity, History, 
    FileText, User, DollarSign, Plus, AlertCircle, TrendingUp 
} from 'lucide-react';
import { CostShareRecord, CostShareStatus, CostShareAdjustment } from '../../types';
import { formatCurrency, formatRelativeTime } from '../../utils/formatting';
import Modal from '../shared/Modal';
import { REMIS_THEME } from '../../constants';

interface Props {
    record: CostShareRecord;
    onBack: () => void;
    onUpdate: (record: CostShareRecord) => void;
    onAdjust: (id: string, adj: CostShareAdjustment) => void;
}

const CostShareDetail: React.FC<Props> = ({ record, onBack, onUpdate, onAdjust }) => {
    const [activeTab, setActiveTab] = useState<'Ledger' | 'History'>('Ledger');
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    
    const [adjType, setAdjType] = useState<CostShareAdjustment['type']>('Contribution');
    const [adjAmount, setAdjAmount] = useState<number | ''>('');
    const [adjDesc, setAdjDesc] = useState('');

    const targetContribution = record.totalValue * (record.percentage.nonFederal / 100);
    const balanceDue = targetContribution - record.contributedValue;
    const contributionPercent = targetContribution > 0 ? (record.contributedValue / targetContribution) * 100 : 0;

    const submitAdjustment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!adjAmount || !adjDesc) return;

        const newAdj: CostShareAdjustment = {
            id: `ADJ-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: adjType,
            amountDelta: adjType === 'Contribution' ? Number(adjAmount) : Number(adjAmount) - record.totalValue,
            justification: adjDesc,
            authorizedBy: 'CurrentUser'
        };
        onAdjust(record.id, newAdj);
        setIsAdjustModalOpen(false);
        setAdjAmount('');
        setAdjDesc('');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50">
            {/* Header */}
            <div className="bg-white border-b border-zinc-200 px-4 sm:px-6 py-4 flex flex-col gap-4 flex-shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase w-fit">
                    <ArrowLeft size={14}/> Back to List
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${REMIS_THEME.classes.iconContainer} ${REMIS_THEME.classes.iconColor}`}>
                            <PieChart size={24}/>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold text-zinc-900 truncate max-w-xs">{record.sponsorName}</h2>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
                                <span className="font-mono bg-zinc-100 px-1.5 rounded border whitespace-nowrap">{record.id}</span>
                                <span>•</span>
                                <span className="truncate max-w-[200px]">{record.authority}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
                <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Total Project Value</p>
                            <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(record.totalValue)}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Federal Share ({record.percentage.federal}%)</p>
                            <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(record.totalValue * (record.percentage.federal/100))}</p>
                        </div>
                         <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Non-Fed Share ({record.percentage.nonFederal}%)</p>
                            <p className="text-2xl font-mono font-bold text-emerald-700">{formatCurrency(targetContribution)}</p>
                        </div>
                    </div>

                    {/* Contribution Progress */}
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center text-xs mb-2">
                            <span className="font-bold text-zinc-900">Sponsor Contribution Status</span>
                            <span className={balanceDue > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                                {balanceDue > 0 ? `${formatCurrency(balanceDue)} Due` : `Met (+${formatCurrency(Math.abs(balanceDue))})`}
                            </span>
                        </div>
                        <div className="h-4 w-full bg-zinc-100 rounded overflow-hidden border border-zinc-200">
                             <div className={`h-full ${REMIS_THEME.colors.primary.replace('bg-', 'bg-')} transition-all duration-500`} style={{ width: `${Math.min(contributionPercent, 100)}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] mt-1 text-zinc-500 font-medium">
                            <span>Contributed: {formatCurrency(record.contributedValue)}</span>
                            <span>Target: {formatCurrency(targetContribution)}</span>
                        </div>
                    </div>
                    
                    {/* Main content with tabs */}
                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col min-h-[400px]">
                        <div className="border-b border-zinc-100 flex gap-1 p-2">
                            <button onClick={() => setActiveTab('Ledger')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'Ledger' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}>Adjustment Ledger</button>
                            <button onClick={() => setActiveTab('History')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'History' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}>Audit History</button>
                        </div>

                        {activeTab === 'Ledger' && (
                            <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in">
                                <div className="p-4 flex justify-end">
                                    <button onClick={() => setIsAdjustModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-md text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors">
                                        <Plus size={12}/> Record Adjustment
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="bg-zinc-50 border-y border-zinc-100 sticky top-0">
                                            <tr>
                                                <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase">Date</th>
                                                <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase">Type</th>
                                                <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase">Justification</th>
                                                <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {record.adjustments.map(adj => (
                                                <tr key={adj.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                                                    <td className="p-3 text-xs font-mono text-zinc-500">{adj.date}</td>
                                                    <td className="p-3 text-xs text-zinc-800">{adj.type}</td>
                                                    <td className="p-3 text-xs text-zinc-600 truncate max-w-xs">{adj.justification}</td>
                                                    <td className={`p-3 text-xs font-mono text-right font-bold ${adj.amountDelta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {adj.amountDelta > 0 ? '+' : ''}{formatCurrency(adj.amountDelta)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'History' && (
                            <div className="p-6 overflow-y-auto custom-scrollbar animate-in fade-in">
                                <div className="space-y-4 relative">
                                    <div className="absolute top-2 bottom-2 left-[19px] w-px bg-zinc-100"/>
                                    {record.auditLog.map((log, i) => (
                                        <div key={i} className="flex items-start gap-4 relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-400">
                                                <FileText size={16}/>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs font-bold text-zinc-900">{log.action}</p>
                                                    <p className="text-[10px] font-mono text-zinc-400">{formatRelativeTime(log.timestamp)}</p>
                                                </div>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">{log.details}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                                                    <User size={10}/> {log.user}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isAdjustModalOpen && (
                <Modal title="Record Adjustment" onClose={() => setIsAdjustModalOpen(false)}>
                    <form onSubmit={submitAdjustment} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Adjustment Type</label>
                            <select className="w-full mt-1 border rounded p-2 text-sm bg-white" value={adjType} onChange={e => setAdjType(e.target.value as any)}>
                                <option>Contribution</option>
                                <option>Valuation Change</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Amount ($)</label>
                            <input type="number" className="w-full mt-1 border rounded p-2 text-sm" value={adjAmount} onChange={e => setAdjAmount(Number(e.target.value))} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Justification</label>
                            <textarea className="w-full mt-1 border rounded p-2 text-sm h-24" value={adjDesc} onChange={e => setAdjDesc(e.target.value)} required />
                        </div>
                        <div className="flex justify-end pt-4 border-t border-zinc-100">
                            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase">Save Adjustment</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CostShareDetail;
