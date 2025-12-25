
import React, { useState, useMemo } from 'react';
import { 
    Briefcase, ShoppingCart, FileCheck, Search, Plus, 
    Filter, LayoutGrid, List, Landmark, ShieldCheck, 
    TrendingUp, AlertCircle, FileText, Database, GitMerge, Hammer 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { PurchaseRequest, Contract, PRStatus } from '../../types';
import PRCenter from '../acquisition/PRCenter';
import ContractAwardCenter from '../acquisition/ContractAwardCenter';
import SolicitationWorkbench from '../acquisition/SolicitationWorkbench';
import { MOCK_PURCHASE_REQUESTS, MOCK_CONTRACTS_LIST, MOCK_FUND_HIERARCHY } from '../../constants';

const AcquisitionView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'PR' | 'Solicitations' | 'Contracts'>('PR');
    
    // Module Level State
    const [prs, setPrs] = useState<PurchaseRequest[]>(MOCK_PURCHASE_REQUESTS.map(pr => ({
        ...pr,
        auditLog: [],
        status: pr.status as PRStatus
    })));
    const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS_LIST.map(c => ({
        ...c,
        prReference: 'PR-24-001',
        uei: 'UEI-8822',
        cageCode: 'C-99',
        periodOfPerformance: { start: '2023-11-15', end: '2024-11-15' },
        isBerryCompliant: true,
        modifications: [],
        auditLog: []
    })));

    // Derived Statistics
    const stats = useMemo(() => ({
        totalPRVolume: prs.reduce((s, p) => s + p.amount, 0),
        pendingCert: prs.filter(p => p.status === 'Pending Certification').length,
        awardedValue: contracts.reduce((s, c) => s + c.value, 0),
        activeCount: contracts.filter(c => c.status === 'Active').length
    }), [prs, contracts]);

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            {/* Executive Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Briefcase size={28} className="text-rose-700" /> Procurement Oversight
                    </h2>
                    <div className="flex items-center gap-4 mt-1.5">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck size={12} className="text-emerald-600"/> FAR/DFARS COMPLIANT • UNCLASSIFIED
                        </p>
                    </div>
                </div>
                
                <div className="flex bg-zinc-100 p-1 rounded-xl shadow-inner border border-zinc-200/50 min-w-max">
                    {[
                        { id: 'PR', icon: ShoppingCart, label: 'PR Center' },
                        { id: 'Solicitations', icon: Hammer, label: 'Solicitation Workbench' },
                        { id: 'Contracts', icon: FileCheck, label: 'Contract Awards' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-white shadow-sm text-rose-700 border border-rose-100' 
                                : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Strategic KPI Stream */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Landmark size={80}/></div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Total Commitment Volume</p>
                    <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(stats.totalPRVolume)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Pending Certification</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-mono font-bold text-blue-600">{stats.pendingCert}</p>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase">Requests</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Awarded Value (FY)</p>
                    <p className="text-2xl font-mono font-bold text-emerald-600">{formatCurrency(stats.awardedValue)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Active Contracts</p>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-mono font-bold text-zinc-900">{stats.activeCount}</p>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                </div>
            </div>

            {/* Main Center */}
            <div className="flex-1 min-h-0 bg-white border border-zinc-200 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                {activeTab === 'PR' && <PRCenter prs={prs} setPrs={setPrs} />}
                {activeTab === 'Solicitations' && <SolicitationWorkbench prs={prs} setPrs={setPrs} contracts={contracts} setContracts={setContracts} />}
                {activeTab === 'Contracts' && <ContractAwardCenter contracts={contracts} setContracts={setContracts} />}
            </div>
        </div>
    );
};

export default AcquisitionView;
