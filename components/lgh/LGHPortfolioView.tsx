
import React, { useState } from 'react';
import { Building, Search, Plus, MapPin, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { LGHLease, LeaseStatus } from '../../types';
import { MOCK_LGH_LEASES } from '../../constants';
import { formatCurrency } from '../../utils/formatting';
import LeaseDetailModal from './LeaseDetailModal';

const LGHPortfolioView: React.FC = () => {
    const [leases, setLeases] = useState<LGHLease[]>(MOCK_LGH_LEASES);
    const [selectedLease, setSelectedLease] = useState<LGHLease | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const filteredLeases = leases.filter(l => 
        l.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.leaseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveLease = (updatedLease: LGHLease) => {
        setLeases(prev => {
            const exists = prev.some(l => l.id === updatedLease.id);
            if (exists) return prev.map(l => l.id === updatedLease.id ? updatedLease : l);
            return [updatedLease, ...prev];
        });
        setIsDetailOpen(false);
    };

    const StatusBadge = ({ status }: { status: LeaseStatus }) => {
        const styles = {
            'Active': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'Expiring': 'bg-amber-50 text-amber-700 border-amber-100',
            'Holdover': 'bg-rose-50 text-rose-700 border-rose-100',
            'Terminated': 'bg-zinc-100 text-zinc-500 border-zinc-200',
            'Pending Renewal': 'bg-blue-50 text-blue-700 border-blue-100',
        };
        return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${styles[status]}`}>{status}</span>;
    };

    const handleCreate = () => {
        setSelectedLease(null);
        setIsDetailOpen(true);
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Building size={24} className="text-cyan-700" /> Lease Portfolio Management
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">
                        Leased Government Housing (Section 801/802)
                    </p>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Search leases..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400 transition-all"
                        />
                    </div>
                    <button onClick={handleCreate} className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors shadow-sm whitespace-nowrap">
                        <Plus size={14}/> Add Lease
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredLeases.map(lease => (
                        <div 
                            key={lease.id} 
                            onClick={() => { setSelectedLease(lease); setIsDetailOpen(true); }}
                            className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100 text-zinc-500">
                                        <Building size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{lease.propertyName}</h4>
                                        <p className="text-[10px] text-zinc-500 font-mono">{lease.leaseNumber}</p>
                                    </div>
                                </div>
                                <StatusBadge status={lease.status} />
                            </div>

                            <div className="space-y-3 flex-1">
                                <div className="flex items-start gap-2 text-xs text-zinc-600">
                                    <MapPin size={14} className="text-zinc-400 shrink-0 mt-0.5"/>
                                    <span className="line-clamp-2">{lease.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-600">
                                    <Calendar size={14} className="text-zinc-400 shrink-0"/>
                                    <span>Exp: {lease.expirationDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-600">
                                    <DollarSign size={14} className="text-zinc-400 shrink-0"/>
                                    <span>Annual: {formatCurrency(lease.annualRent)}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-center">
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Occupancy</div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-16 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${lease.occupancyRate > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width: `${lease.occupancyRate}%`}} />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-zinc-900">{lease.occupancyRate}%</span>
                                </div>
                            </div>
                            
                            {lease.scoring === 'Capital' && (
                                <div className="mt-3 bg-rose-50 border border-rose-100 p-2 rounded text-[10px] text-rose-800 flex items-center gap-2 font-medium">
                                    <AlertCircle size={12}/> OMB A-11: Capital Lease
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {isDetailOpen && (
                <LeaseDetailModal 
                    lease={selectedLease} 
                    onClose={() => setIsDetailOpen(false)} 
                    onSave={handleSaveLease} 
                />
            )}
        </div>
    );
};

export default LGHPortfolioView;
