
import React, { useState, useEffect, useMemo, useTransition, useDeferredValue } from 'react';
import { 
    FileSignature, Plus, Search, 
    LayoutDashboard, List, ShieldAlert, Filter, Database, Landmark, ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { Obligation } from '../../types';
import ObligationDashboard from '../obligations/ObligationDashboard';
import ObligationForm from '../obligations/ObligationForm';
import DormantAccountReview from '../obligations/DormantAccountReview';
import { obligationsService } from '../../services/ObligationsDataService';

const ObligationsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'Ledger' | 'DAR'>('Dashboard');
    const [obligations, setObligations] = useState<Obligation[]>(obligationsService.getObligations());
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const unsubscribe = obligationsService.subscribe(() => {
            setObligations([...obligationsService.getObligations()]);
        });
        return unsubscribe;
    }, []);

    const filteredObligations = useMemo(() => obligations.filter(o => 
        o.vendor.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        o.documentNumber.toLowerCase().includes(deferredSearch.toLowerCase())
    ), [obligations, deferredSearch]);

    const handleCreate = (newObligation: Obligation) => {
        obligationsService.addObligation(newObligation);
        setIsFormOpen(false);
    };

    const handleUpdate = (updatedObligation: Obligation) => {
        obligationsService.updateObligation(updatedObligation);
    };

    const handleTabChange = (tab: any) => {
        startTransition(() => {
            setActiveTab(tab);
        });
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/50 overflow-hidden">
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <FileSignature size={28} className="text-rose-700" /> Obligations Authority
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Undelivered Orders (4801) • Unliquidated Obligations (ULO) Monitoring</p>
                </div>
                
                <div className="flex items-center gap-2 bg-zinc-200/50 p-1 rounded-xl shadow-inner overflow-x-auto">
                    {[
                        { id: 'Dashboard', icon: LayoutDashboard },
                        { id: 'Ledger', icon: List, label: 'Ledger' },
                        { id: 'DAR', icon: ShieldAlert, label: 'JRP Review' }
                    ].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                activeTab === tab.id ? 'bg-white shadow-sm text-zinc-900 border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            <tab.icon size={14}/> {tab.label || tab.id}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`flex-1 min-h-0 overflow-hidden flex flex-col transition-opacity duration-300 ${isPending ? 'opacity-50 grayscale-[0.2]' : 'opacity-100'}`}>
                {activeTab === 'Dashboard' && (
                    <div className="h-full overflow-y-auto custom-scrollbar pr-1 pb-10">
                         <ObligationDashboard obligations={obligations} />
                    </div>
                )}

                {activeTab === 'Ledger' && (
                    <div className="bg-white border border-zinc-200 rounded-[32px] shadow-sm flex flex-col overflow-hidden h-full">
                        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
                            <div className="flex items-center gap-6 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none w-full sm:w-80 group">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                                    <input 
                                        type="text" 
                                        placeholder="Search vendor, PIID, or document #..." 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-rose-300 shadow-inner"
                                    />
                                </div>
                                <button className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all shadow-sm">
                                    <Filter size={16}/>
                                </button>
                            </div>
                            <button 
                                onClick={() => setIsFormOpen(true)}
                                className="flex items-center justify-center gap-3 px-6 py-2.5 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl whitespace-nowrap active:scale-95"
                            >
                                <Plus size={16}/> Record Obligation
                            </button>
                        </div>
                        <div className="flex-1 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10 shadow-sm">
                                    <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <th className="p-6">Authoritative Document</th>
                                        <th className="p-6">Fiduciary Entity / Type</th>
                                        <th className="p-6 text-right">Magnitude</th>
                                        <th className="p-6 text-right">Disbursed</th>
                                        <th className="p-6 text-right">ULO Risk</th>
                                        <th className="p-6 text-center">Protocol Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {filteredObligations.map(o => (
                                        <tr key={o.id} className="hover:bg-zinc-50/80 transition-colors group cursor-default">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 bg-zinc-100 rounded-xl border border-zinc-200 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-inner">
                                                        <Database size={16}/>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-mono font-bold text-zinc-900">{o.documentNumber}</p>
                                                        <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Recorded: {o.date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-xs font-bold text-zinc-800 truncate max-w-[200px]">{o.vendor}</p>
                                                <span className="text-[9px] bg-white text-zinc-400 px-2 py-0.5 rounded-lg border border-zinc-100 font-bold uppercase mt-1.5 inline-block">{o.obligationType}</span>
                                            </td>
                                            <td className="p-6 text-right text-sm font-mono font-bold text-zinc-900">{formatCurrency(o.amount)}</td>
                                            <td className="p-6 text-right text-sm font-mono font-bold text-emerald-600">{formatCurrency(o.disbursedAmount)}</td>
                                            <td className="p-6 text-right">
                                                <p className={`text-sm font-mono font-bold ${o.unliquidatedAmount > (o.amount * 0.5) ? 'text-rose-700' : 'text-zinc-900'}`}>{formatCurrency(o.unliquidatedAmount)}</p>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`px-3 py-1 rounded-xl text-[9px] font-bold border uppercase shadow-sm ${
                                                    o.status === 'Open' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                                    o.status === 'Closed' ? 'bg-zinc-100 text-zinc-500 border-zinc-200' :
                                                    'bg-rose-50 text-rose-700 border-rose-200'
                                                }`}>{o.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-zinc-50 border-t border-zinc-100 shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-6 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Landmark size={12}/> USSGL: 480100 (UDO)</span>
                                <div className="w-px h-3 bg-zinc-200" />
                                <span className="flex items-center gap-1.5"><ShieldCheck size={12}/> FIAR Validated</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Population Count: {filteredObligations.length}</span>
                        </div>
                    </div>
                )}

                {activeTab === 'DAR' && (
                    <div className="h-full overflow-hidden flex flex-col">
                        <DormantAccountReview obligations={obligations} onUpdate={handleUpdate} />
                    </div>
                )}
            </div>

            {isFormOpen && <ObligationForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />}
        </div>
    );
};

export default ObligationsView;
