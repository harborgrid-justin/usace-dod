
import React, { useState, useEffect } from 'react';
import { 
    FileSignature, Plus, Search, 
    LayoutDashboard, List, ShieldAlert 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { Obligation } from '../../types';
import ObligationDashboard from '../obligations/ObligationDashboard';
import ObligationForm from '../obligations/ObligationForm';
import DormantAccountReview from '../obligations/DormantAccountReview';
import { obligationsService } from '../../services/ObligationsDataService';

const ObligationsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'Ledger' | 'DAR'>('Dashboard');
    
    // Live Data from Service
    const [obligations, setObligations] = useState<Obligation[]>(obligationsService.getObligations());
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = obligationsService.subscribe(() => {
            setObligations([...obligationsService.getObligations()]);
        });
        return unsubscribe;
    }, []);

    const filteredObligations = obligations.filter(o => 
        o.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = (newObligation: Obligation) => {
        obligationsService.addObligation(newObligation);
        setIsFormOpen(false);
    };

    const handleUpdate = (updatedObligation: Obligation) => {
        obligationsService.updateObligation(updatedObligation);
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <FileSignature size={24} className="text-rose-700" /> Obligations Management
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Undelivered Orders (4801) • Unliquidated Obligations (ULO)</p>
                </div>
                
                <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg overflow-x-auto">
                    {[
                        { id: 'Dashboard', icon: LayoutDashboard },
                        { id: 'Ledger', icon: List },
                        { id: 'DAR', icon: ShieldAlert, label: 'JRP Review' }
                    ].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                activeTab === tab.id ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            <tab.icon size={14}/> {tab.label || tab.id}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                {activeTab === 'Dashboard' && (
                    <div className="h-full overflow-y-auto custom-scrollbar">
                         <ObligationDashboard obligations={obligations} />
                    </div>
                )}

                {activeTab === 'Ledger' && (
                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="relative flex-1 max-w-md w-full">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                <input 
                                    type="text" 
                                    placeholder="Search vendor or document #..." 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400"
                                />
                            </div>
                            <button 
                                onClick={() => setIsFormOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors shadow-sm whitespace-nowrap"
                            >
                                <Plus size={14}/> Record Obligation
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10">
                                    <tr className="shadow-sm">
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase">Document</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase">Vendor / Type</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase text-right">Total</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase text-right">Disbursed</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase text-right">ULO</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {filteredObligations.map(o => (
                                        <tr key={o.id} className="hover:bg-zinc-50 transition-colors group">
                                            <td className="p-4">
                                                <p className="text-xs font-mono font-bold text-zinc-900">{o.documentNumber}</p>
                                                <p className="text-[9px] text-zinc-400">{o.date}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-xs font-medium text-zinc-700">{o.vendor}</p>
                                                <span className="text-[9px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border">{o.obligationType}</span>
                                            </td>
                                            <td className="p-4 text-right text-xs font-mono font-bold text-zinc-900">{formatCurrency(o.amount)}</td>
                                            <td className="p-4 text-right text-xs font-mono text-emerald-600">{formatCurrency(o.disbursedAmount)}</td>
                                            <td className="p-4 text-right text-xs font-mono font-bold text-rose-600">{formatCurrency(o.unliquidatedAmount)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                                                    o.status === 'Open' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                                    o.status === 'Closed' ? 'bg-zinc-100 text-zinc-500 border-zinc-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>{o.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'DAR' && (
                    <DormantAccountReview obligations={obligations} onUpdate={handleUpdate} />
                )}
            </div>

            {isFormOpen && <ObligationForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />}
        </div>
    );
};

export default ObligationsView;
