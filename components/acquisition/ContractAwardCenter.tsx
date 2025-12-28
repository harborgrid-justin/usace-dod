import React, { useState, useMemo } from 'react';
import { 
    FileCheck, Search, ShieldCheck, 
    Hammer, Box, Binary, Clock, 
    ArrowRight, CheckCircle2, AlertTriangle, ExternalLink, 
    Fingerprint, Building2, Gavel, Trash2, Edit3, X, Save, DollarSign,
    Calendar, History, Shield, FileText, Activity, BookOpen, Scale, Landmark
} from 'lucide-react';
import { Contract, ContractStatus, ContractMod } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import Modal from '../shared/Modal';
import { acquisitionService } from '../../services/AcquisitionDataService';

interface Props {
    contracts: Contract[];
}

const ContractAwardCenter: React.FC<Props> = ({ contracts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(contracts[0]?.id || null);
    const [activeTab, setActiveTab] = useState<'History' | 'Clauses' | 'Damages'>('History');
    
    // Mod Modal State
    const [showModModal, setShowModModal] = useState(false);
    const [modAmountDelta, setModAmountDelta] = useState<number>(0);
    const [modDescription, setModDescription] = useState('');
    const [modAuthority, setModAuthority] = useState('FAR 43.103');

    const filteredContracts = useMemo(() => contracts.filter(c => 
        c.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [contracts, searchTerm]);

    const selected = useMemo(() => contracts.find(c => c.id === selectedId), [contracts, selectedId]);

    // Opp 47: Logic to determine required clauses
    const requiredClauses = useMemo(() => {
        if (!selected) return [];
        const clauses = [
            { code: '52.204-27', name: 'Prohibition on ByteDance (TikTok)', required: true },
            { code: '52.222-26', name: 'Equal Opportunity', required: true },
            { code: '52.225-13', name: 'Restrictions on Foreign Purchases', required: true },
            { code: '52.232-25', name: 'Prompt Payment', required: true },
        ];
        if (selected.value > 250000) clauses.push({ code: '52.219-9', name: 'Small Business Subcontracting Plan', required: true });
        if (selected.type === 'Construction' || selected.value > 2000) clauses.push({ code: '52.222-6', name: 'Construction Wage Rate (Davis-Bacon)', required: true });
        return clauses;
    }, [selected]);

    const handleExecuteMod = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;

        acquisitionService.executeContractMod(selected.id, {
            amountDelta: modAmountDelta,
            description: modDescription,
            authority: modAuthority
        }, 'KO_ADMIN');

        setShowModModal(false);
        setModAmountDelta(0);
        setModDescription('');
        alert(`Modification Executed. GL Adjusted by ${formatCurrency(modAmountDelta)}`);
    };

    const handleCloseout = () => {
        if (!selected) return;
        if (!confirm("Are you sure you want to finalize and close this contract award? This action is permanent.")) return;

        acquisitionService.closeoutContract(selected.id, 'KO_ADMIN');
        alert("Contract Closed Successfully.");
    };

    const StatusBadge = ({ status }: { status: ContractStatus }) => {
        const styles = {
            'Active': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'Under Mod': 'bg-amber-50 text-amber-700 border-amber-100',
            'Closed': 'bg-zinc-100 text-zinc-500 border-zinc-200',
            'Completed': 'bg-zinc-900 text-white border-zinc-900',
            'Terminated': 'bg-rose-50 text-rose-700 border-rose-200',
            'Canceled': 'bg-rose-50 text-rose-700 border-rose-200'
        };
        return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full animate-in fade-in overflow-hidden bg-white">
            {/* Left Rail - Selection */}
            <div className="w-full md:w-[450px] border-r border-zinc-100 flex flex-col bg-zinc-50/30 shrink-0">
                <div className="p-4 border-b border-zinc-100 space-y-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <FileCheck size={14}/> Awarded Obligations
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                            {filteredContracts.length} ACTIVE
                        </span>
                    </div>
                    <div className="relative group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                        <input 
                            type="text" 
                            placeholder="Search Awards / PIID / Vendor..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 transition-all"
                        />
                    </div>
                    {/* Opp 12: Small Business Goaling */}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex justify-between text-[10px] font-bold text-blue-700 mb-1">
                            <span>Small Business Goal (District)</span>
                            <span>23% / 25%</span>
                        </div>
                        <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-[92%]" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {filteredContracts.map(c => (
                        <button 
                            key={c.id}
                            onClick={() => setSelectedId(c.id)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                selectedId === c.id 
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.01]' 
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-mono font-bold ${selectedId === c.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{c.id}</span>
                                <StatusBadge status={c.status} />
                            </div>
                            <h4 className="text-sm font-bold truncate leading-tight mb-1">{c.vendor}</h4>
                            <p className="text-[10px] opacity-60 mb-3">Award Date: {c.awardedDate}</p>
                            <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Award Value</span>
                                <span className="text-sm font-mono font-bold">{formatCurrency(c.value)}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Detail / Workspace */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
                {selected ? (
                    <div className="p-8 space-y-8 animate-in slide-in-from-right-2">
                        {/* Executive Info Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-zinc-100 pb-8">
                            <div>
                                <h3 className="text-3xl font-bold text-zinc-900 leading-tight mb-1">{selected.vendor}</h3>
                                <div className="flex items-center gap-6 mt-3 text-xs">
                                    <span className="text-zinc-500 flex items-center gap-1.5 font-medium"><Fingerprint size={14} className="text-zinc-300"/> UEI: <span className="font-mono font-bold text-zinc-800">{selected.uei}</span></span>
                                    <span className="text-zinc-500 flex items-center gap-1.5 font-medium"><Shield size={14} className="text-zinc-300"/> Type: <span className="font-bold text-zinc-800">{selected.type}</span></span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setShowModModal(true)}
                                        className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-200"
                                    >
                                        <Hammer size={14}/> Execute Mod (SF 30)
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Obligated Amount</p>
                                    <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(selected.value)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lifecycle/Compliance Panels */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Performance Period</h4>
                                <div className="flex items-center justify-between relative">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 -z-10" />
                                    <div className="bg-white p-2 rounded-lg border border-zinc-200 text-center shadow-sm">
                                        <p className="text-[8px] font-bold text-zinc-400 uppercase">Start</p>
                                        <p className="text-xs font-mono font-bold">{selected.periodOfPerformance.start}</p>
                                    </div>
                                    <ArrowRight size={14} className="text-zinc-300 bg-zinc-50 p-1 rounded-full border border-zinc-100" />
                                    <div className="bg-white p-2 rounded-lg border border-zinc-200 text-center shadow-sm">
                                        <p className="text-[8px] font-bold text-zinc-400 uppercase">End</p>
                                        <p className="text-xs font-mono font-bold text-rose-700">{selected.periodOfPerformance.end}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Treasury Integration</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Landmark size={14}/></div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-900">G-Invoicing</p>
                                                <p className="text-[9px] text-emerald-600 font-bold uppercase">{selected.gInvoicingStatus}</p>
                                            </div>
                                        </div>
                                        <CheckCircle2 size={16} className="text-emerald-500"/>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-zinc-900 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Gavel size={64}/></div>
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Award Compliance</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/10">
                                        <span className="text-xs text-zinc-400">Berry Amendment</span>
                                        {selected.isBerryCompliant ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertTriangle size={14} className="text-rose-400" />}
                                    </div>
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/10">
                                        <span className="text-xs text-zinc-400">PPA Risk</span>
                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="space-y-6">
                            <div className="border-b border-zinc-100 flex gap-8">
                                <button onClick={() => setActiveTab('History')} className={`text-xs font-bold uppercase tracking-widest pb-3 border-b-2 flex items-center gap-2 ${activeTab === 'History' ? 'text-zinc-900 border-rose-700' : 'text-zinc-400 border-transparent'}`}>
                                    <History size={14}/> Modification History
                                </button>
                                <button onClick={() => setActiveTab('Clauses')} className={`text-xs font-bold uppercase tracking-widest pb-3 border-b-2 flex items-center gap-2 ${activeTab === 'Clauses' ? 'text-zinc-900 border-rose-700' : 'text-zinc-400 border-transparent'}`}>
                                    <BookOpen size={14}/> Clause Logic
                                </button>
                                <button onClick={() => setActiveTab('Damages')} className={`text-xs font-bold uppercase tracking-widest pb-3 border-b-2 flex items-center gap-2 ${activeTab === 'Damages' ? 'text-zinc-900 border-rose-700' : 'text-zinc-400 border-transparent'}`}>
                                    <Scale size={14}/> Liquidated Damages
                                </button>
                            </div>

                            {activeTab === 'History' && (
                                <div className="bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden shadow-inner">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-zinc-100/80 backdrop-blur-sm border-b border-zinc-200">
                                            <tr>
                                                <th className="p-4 font-bold text-zinc-500 uppercase">Mod #</th>
                                                <th className="p-4 font-bold text-zinc-500 uppercase">Effective Date</th>
                                                <th className="p-4 font-bold text-zinc-500 uppercase">Authority</th>
                                                <th className="p-4 font-bold text-zinc-500 uppercase">Description</th>
                                                <th className="p-4 font-bold text-zinc-500 uppercase text-right">Value Delta</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200/50 bg-white/40">
                                            {selected.modifications.length > 0 ? (
                                                selected.modifications.map(mod => (
                                                    <tr key={mod.id} className="hover:bg-white/60 transition-colors">
                                                        <td className="p-4 font-mono font-bold text-zinc-900">{mod.modNumber}</td>
                                                        <td className="p-4 text-zinc-600">{mod.date}</td>
                                                        <td className="p-4 text-zinc-600"><span className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-mono text-[10px]">{mod.authority}</span></td>
                                                        <td className="p-4 text-zinc-600 max-w-xs truncate">{mod.description}</td>
                                                        <td className={`p-4 text-right font-mono font-bold ${mod.amountDelta > 0 ? 'text-emerald-600' : mod.amountDelta < 0 ? 'text-rose-600' : 'text-zinc-400'}`}>
                                                            {mod.amountDelta > 0 ? '+' : ''}{formatCurrency(mod.amountDelta)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={5} className="p-8 text-center text-zinc-400 italic">No modifications recorded.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'Clauses' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 flex gap-2">
                                        <BookOpen size={16} className="shrink-0"/>
                                        <p>Clauses automatically determined based on contract type, value ({formatCurrency(selected.value)}), and commerciality status per FAR Matrix.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {requiredClauses.map((clause, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300">
                                                <div>
                                                    <span className="text-[10px] font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">{clause.code}</span>
                                                    <p className="text-xs font-bold text-zinc-800 mt-1">{clause.name}</p>
                                                </div>
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Damages' && (
                                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex gap-6">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-zinc-900 mb-2">Liquidated Damages Calculator</h4>
                                        <p className="text-xs text-zinc-500 mb-4">Estimate potential recovery for schedule slippage.</p>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase">Daily Rate</label>
                                                <p className="text-lg font-mono font-bold text-zinc-900">$1,250.00</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase">Days Late</label>
                                                <input type="number" className="w-full border rounded p-1 text-sm mt-1" defaultValue={0} />
                                            </div>
                                        </div>
                                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs font-bold text-rose-800 flex justify-between">
                                            <span>Potential Recovery</span>
                                            <span>$0.00</span>
                                        </div>
                                    </div>
                                    <div className="w-px bg-zinc-100"/>
                                    <div className="w-1/3 text-xs text-zinc-500">
                                        <p className="mb-2"><strong>Authority:</strong> FAR 11.501</p>
                                        <p>Use only when time of delivery or performance is of the essence and the extent or amount of damage would be difficult or impossible to estimate accurately or prove.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-4 h-full">
                        <div className="p-10 bg-zinc-50 rounded-full border-2 border-dashed border-zinc-200">
                             <FileCheck size={48} className="opacity-10" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Award Center Idle</p>
                            <p className="text-xs max-w-xs leading-relaxed mt-1">Select a contract from the ledger to view performance metrics and execute actions.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Execute Mod Modal */}
            {showModModal && selected && (
                <Modal title="Execute Contract Modification" subtitle={`Amendment to PIID: ${selected.id}`} onClose={() => setShowModModal(false)} maxWidth="max-w-xl">
                    <form onSubmit={handleExecuteMod} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amendment Number</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-sm font-mono focus:outline-none focus:border-rose-400"
                                    defaultValue={`P0000${selected.modifications.length + 1}`}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Statutory Authority</label>
                                <select 
                                    className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-rose-400"
                                    value={modAuthority}
                                    onChange={e => setModAuthority(e.target.value)}
                                >
                                    <option>FAR 43.103 - Administrative</option>
                                    <option>FAR 43.103(a) - Supplemental Agreement</option>
                                    <option>FAR 43.103(b) - Change Order</option>
                                    <option>FAR 52.217-9 - Option Renewal</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount Delta ($)</label>
                            <div className="relative mt-1.5">
                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                <input 
                                    type="number" 
                                    className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono font-bold focus:outline-none focus:border-rose-400"
                                    value={modAmountDelta}
                                    onChange={e => setModAmountDelta(Number(e.target.value))}
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-2 italic">Use negative values for de-obligations.</p>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Modification Narrative</label>
                            <textarea 
                                className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:border-rose-400 resize-none h-32"
                                value={modDescription}
                                onChange={e => setModDescription(e.target.value)}
                                placeholder="Describe the reason and scope of this amendment..."
                                required
                            />
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-800 text-[10px] items-start">
                            <AlertTriangle size={16} className="shrink-0" />
                            <p className="leading-relaxed"><strong>Financial Impact Note:</strong> Executing this modification will automatically trigger a GL re-balancing entry to update the unliquidated obligation (USSGL 480100) and available authority.</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                            <button type="button" onClick={() => setShowModModal(false)} className="px-5 py-2.5 border border-zinc-200 rounded-xl text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50 transition-all">Cancel</button>
                            <button type="submit" className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2">
                                <Save size={14}/> Execute Modification
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default ContractAwardCenter;