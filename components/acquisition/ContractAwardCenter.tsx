
import React, { useState, useMemo } from 'react';
import { 
    FileCheck, Search, Filter, ShieldCheck, 
    Hammer, Landmark, Box, Binary, Clock, 
    ArrowRight, CheckCircle2, AlertTriangle, ExternalLink, 
    Fingerprint, Building2, Gavel, Trash2, Edit3, X, Save, DollarSign,
    Calendar, History, Shield, FileText, Activity
} from 'lucide-react';
import { Contract, ContractStatus, ContractMod } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { AcquisitionOrchestrator } from '../../services/AcquisitionOrchestrator';
import Modal from '../shared/Modal';

interface Props {
    contracts: Contract[];
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
}

const ContractAwardCenter: React.FC<Props> = ({ contracts, setContracts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(contracts[0]?.id || null);
    
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

    const handleExecuteMod = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;

        const result = AcquisitionOrchestrator.executeModification(selected, {
            amountDelta: modAmountDelta,
            description: modDescription,
            authority: modAuthority
        }, 'KO_ADMIN');

        setContracts(prev => prev.map(c => c.id === selected.id ? result.contract : c));
        setShowModModal(false);
        setModAmountDelta(0);
        setModDescription('');
        alert(`Modification Executed. GL Adjusted by ${formatCurrency(modAmountDelta)}`);
    };

    const handleCloseout = () => {
        if (!selected) return;
        if (!confirm("Are you sure you want to finalize and close this contract award? This action is permanent.")) return;

        const updated = AcquisitionOrchestrator.closeoutContract(selected, 'KO_ADMIN');
        setContracts(prev => prev.map(c => c.id === selected.id ? updated : c));
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
                    {filteredContracts.length === 0 && (
                        <div className="py-20 text-center text-zinc-400">
                             <Box size={32} className="mx-auto mb-4 opacity-10" />
                             <p className="text-xs font-medium px-4">No awards found for criteria.</p>
                        </div>
                    )}
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
                                    <span className="text-zinc-500 flex items-center gap-1.5 font-medium"><Building2 size={14} className="text-zinc-300"/> CAGE: <span className="font-mono font-bold text-zinc-800">{selected.cageCode}</span></span>
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
                                    <button 
                                        onClick={handleCloseout}
                                        disabled={selected.status === 'Closed'}
                                        className="p-2.5 border border-zinc-200 rounded-xl text-zinc-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Contract Closeout"
                                    >
                                        <X size={18}/>
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Obligated Amount</p>
                                    <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(selected.value)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Grid: Lifecycle & Compliance */}
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
                                <div className="mt-6 flex justify-between items-center text-[10px] text-zinc-500">
                                    <span>Progress</span>
                                    <span className="font-bold">72% Time Used</span>
                                </div>
                                <div className="mt-1 h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-zinc-800" style={{width: '72%'}} />
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
                                    <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-50 text-zinc-400 rounded-lg"><Binary size={14}/></div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-900">USSGL 480100</p>
                                                <p className="text-[9px] text-zinc-400 uppercase">Current Obligation</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-zinc-600">{formatCurrency(selected.value)}</span>
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
                                    <button className="w-full mt-2 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all">
                                        Run Compliance Scan
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs / Logs Section */}
                        <div className="space-y-6">
                            <div className="border-b border-zinc-100 flex gap-8">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest pb-3 border-b-2 border-rose-700 flex items-center gap-2">
                                    <History size={14} className="text-zinc-400"/> Modification History (SF 30)
                                </h4>
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pb-3 border-b-2 border-transparent hover:text-zinc-900 transition-colors flex items-center gap-2 cursor-pointer">
                                    <FileText size={14}/> Award Clauses
                                </h4>
                            </div>

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
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-zinc-400 italic">No modifications recorded for this award.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* System Log */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} className="text-zinc-400"/> Audit Trail
                            </h4>
                            <div className="space-y-2">
                                {selected.auditLog.map((log, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs hover:bg-white hover:border-zinc-200 transition-all group">
                                        <div className="font-mono text-zinc-400 shrink-0 border-r border-zinc-200 pr-4">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        <div className="flex-1">
                                            <span className="font-bold text-zinc-800 uppercase text-[10px] group-hover:text-rose-700 transition-colors">{log.action}:</span> {log.details}
                                        </div>
                                        <div className="text-[10px] font-bold text-zinc-400 uppercase bg-white px-2 py-1 rounded border border-zinc-100">{log.user}</div>
                                    </div>
                                ))}
                            </div>
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
