
import React, { useState, useMemo, useDeferredValue, useTransition, useCallback } from 'react';
import { Building, Search, Plus, Key, ArrowRight, ShieldCheck, AlertCircle, Calendar, DollarSign, LayoutGrid } from 'lucide-react';
import { LGHLease, LeaseStatus } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { formatCurrency } from '../../utils/formatting';
import { useService } from '../../hooks/useService';
import LeaseDetailModal from './LeaseDetailModal';
import LeaseForm from './LeaseForm';
import { REMIS_THEME } from '../../constants';

const LGHPortfolioView: React.FC = () => {
    const leases = useService<LGHLease[]>(remisService, useCallback(() => remisService.getLGHLeases(), []));
    const [selectedLeaseId, setSelectedLeaseId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [view, setView] = useState<'list' | 'detail' | 'form'>('list');
    const [isPending, startTransition] = useTransition();

    const filteredLeases = useMemo(() => leases.filter(l => 
        l.propertyName.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        l.leaseNumber.toLowerCase().includes(deferredSearch.toLowerCase())
    ), [leases, deferredSearch]);

    const selectedLease = useMemo(() => 
        leases.find(l => l.id === selectedLeaseId),
    [leases, selectedLeaseId]);

    const handleSaveLease = (updatedLease: LGHLease) => {
        startTransition(() => {
            const exists = leases.some(l => l.id === updatedLease.id);
            if (exists) remisService.updateLGHLease(updatedLease);
            else remisService.addLGHLease(updatedLease);
            setView('list');
        });
    };

    const StatusBadge = ({ status }: { status: LeaseStatus }) => {
        const styles = {
            'Active': 'bg-emerald-50 text-emerald-800 border-emerald-200',
            'Expiring': 'bg-amber-50 text-amber-800 border-amber-200',
            'Holdover': 'bg-rose-50 text-rose-800 border-rose-200',
            'Terminated': 'bg-zinc-100 text-zinc-600 border-zinc-200',
            'Pending Renewal': 'bg-blue-50 text-blue-800 border-blue-200',
        };
        // @ts-ignore
        return <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border whitespace-nowrap ${styles[status]}`}>{status}</span>;
    };
    
    if (view === 'form') {
        return <LeaseForm onClose={() => setView('list')} onSubmit={handleSaveLease} />;
    }

    return (
        <div className="flex flex-col h-full w-full min-w-0 bg-zinc-50/50 animate-in fade-in overflow-hidden">
            {/* Header Section */}
            <div className="px-6 py-5 border-b border-zinc-200 bg-white flex flex-col lg:flex-row lg:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Key size={28} className="text-cyan-700" /> LGH Portfolio Monitor
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-widest">
                        Leased Government Housing (10 U.S.C. 2835) • OSD Central Registry
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64 group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                        <input 
                            type="text" placeholder="Search portfolio..." value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-sm text-xs focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                        />
                    </div>
                    <button onClick={() => {setSelectedLeaseId(null); setView('form');}} className={`flex items-center justify-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-sm text-xs font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg active:scale-95 whitespace-nowrap ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Plus size={14}/> Register Asset
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-300 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                    {filteredLeases.map(lease => (
                         <div 
                            key={lease.id} 
                            onClick={() => { startTransition(() => { setSelectedLeaseId(lease.id); setView('detail'); }); }}
                            className="bg-white border border-zinc-200 rounded-md p-6 hover:shadow-xl hover:border-cyan-300 transition-all cursor-pointer group flex flex-col min-h-[320px]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-cyan-50 text-cyan-700 rounded-sm group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-inner border border-cyan-100"><Building size={24} /></div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-zinc-900 line-clamp-1 group-hover:text-cyan-800 transition-colors uppercase tracking-tight">{lease.propertyName}</h4>
                                        <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">{lease.leaseNumber}</p>
                                    </div>
                                </div>
                                <StatusBadge status={lease.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-zinc-50 rounded-sm border border-zinc-100 group-hover:bg-white group-hover:border-cyan-100 transition-all shadow-inner">
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1"><DollarSign size={10}/> Annual Outlay</p>
                                    <p className="text-lg font-mono font-bold text-zinc-900 tracking-tight">{formatCurrency(lease.annualRent)}</p>
                                </div>
                                <div className="p-4 bg-zinc-50 rounded-sm border border-zinc-100 group-hover:bg-white group-hover:border-cyan-100 transition-all shadow-inner">
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1"><LayoutGrid size={10}/> Auth Units</p>
                                    <p className="text-lg font-mono font-bold text-zinc-900 tracking-tight">{lease.units}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4 flex-1">
                                <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] px-1">
                                    <span className="flex items-center gap-1"><Calendar size={10}/> Expiry</span>
                                    <span className={`font-mono text-xs ${new Date(lease.expirationDate) < new Date() ? 'text-rose-600' : 'text-cyan-600'}`}>{lease.expirationDate}</span>
                                </div>
                                <div className="space-y-2 px-1">
                                     <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-zinc-400 uppercase tracking-wider">Occupancy Performance</span>
                                        <span className="text-zinc-900">{lease.occupancyRate}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner border border-zinc-100">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${lease.occupancyRate > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                            style={{width: `${lease.occupancyRate}%`}} 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-zinc-50 flex justify-between items-center">
                                <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest ${lease.scoring === 'Capital' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {lease.scoring === 'Capital' ? <AlertCircle size={14}/> : <ShieldCheck size={14}/>}
                                    <span>{lease.scoring} Score</span>
                                </div>
                                <div className="p-2 bg-zinc-50 rounded-full text-zinc-300 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-all border border-zinc-100">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredLeases.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-200 rounded-md bg-white">
                             <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">No Portfolio Records Found</p>
                        </div>
                    )}
                </div>
            </div>

            {view === 'detail' && (
                <LeaseDetailModal 
                    lease={selectedLease || null} 
                    onClose={() => setView('list')} 
                    onSave={handleSaveLease} 
                />
            )}
        </div>
    );
};
export default LGHPortfolioView;
