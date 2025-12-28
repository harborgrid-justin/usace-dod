import React, { useState, useMemo, useDeferredValue, useTransition } from 'react';
import { Users, Search, Plus, Home, FileCheck, DollarSign, Calendar, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { HAPCase, HAPCaseStatus } from '../../types';
import { MOCK_HAP_CASES } from '../../constants';
import { formatCurrency } from '../../utils/formatting';
import HAPCaseDetail from './HAPCaseDetail';
import Badge from '../shared/Badge';

const HAPCasesView: React.FC = () => {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [cases, setCases] = useState<HAPCase[]>(MOCK_HAP_CASES);
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [isPending, startTransition] = useTransition();

    const filteredCases = useMemo(() => cases.filter(c => 
        c.applicantName.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        c.id.toLowerCase().includes(deferredSearch.toLowerCase())
    ), [cases, deferredSearch]);

    const selectedCase = useMemo(() => 
        cases.find(c => c.id === selectedCaseId),
    [cases, selectedCaseId]);

    const handleSelect = (c: HAPCase) => {
        startTransition(() => {
            setSelectedCaseId(c.id);
            setView('detail');
        });
    };

    const StatusBadge = ({ status }: { status: HAPCaseStatus }) => {
        const styles = {
            'New': 'bg-blue-50 text-blue-700 border-blue-100',
            'Valuation Review': 'bg-purple-50 text-purple-700 border-purple-100',
            'Benefit Calculation': 'bg-amber-50 text-amber-700 border-amber-100',
            'Legal Review': 'bg-zinc-100 text-zinc-700 border-zinc-200',
            'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'Paid': 'bg-teal-50 text-teal-700 border-teal-100',
            'Denied': 'bg-rose-50 text-rose-700 border-rose-100',
            'Closed': 'bg-gray-100 text-gray-500 border-gray-200',
        };
        return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${styles[status]}`}>{status}</span>;
    };

    if (view === 'detail' && selectedCase) {
        return <HAPCaseDetail 
            hapCase={selectedCase} 
            onBack={() => setView('list')} 
            onUpdate={(updated) => {
                setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
                setSelectedCaseId(updated.id);
            }} 
        />;
    }

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/50">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Home size={28} className="text-teal-700" /> HAP Intake Management
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-widest">
                        Homeowners Assistance Program (32 CFR Part 239) • Relocation Center
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64 group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                        <input 
                            type="text" placeholder="Search applicants..." value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-teal-400 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg active:scale-95">
                        <Plus size={14}/> New Intake Case
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                    {filteredCases.map(c => (
                        <div 
                            key={c.id} 
                            onClick={() => handleSelect(c)}
                            className="bg-white border border-zinc-200 rounded-[32px] p-6 hover:shadow-2xl hover:border-teal-300 transition-all cursor-pointer group flex flex-col h-[280px]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl group-hover:bg-teal-600 group-hover:text-white transition-all shadow-inner border border-teal-100"><Home size={24} /></div>
                                    <div>
                                        <h3 className="text-base font-bold text-zinc-900 truncate max-w-[150px]">{c.applicantName}</h3>
                                        <p className="text-[10px] font-mono text-zinc-400 tracking-widest mt-0.5 uppercase">{c.id}</p>
                                    </div>
                                </div>
                                <StatusBadge status={c.status} />
                            </div>

                            <div className="space-y-4 flex-1">
                                <div className="flex items-start gap-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                                    <MapPin size={14} className="text-zinc-300 shrink-0 mt-0.5"/>
                                    <span className="line-clamp-2 font-medium">{c.propertyAddress}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-50">
                                    <div>
                                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Personnel Segment</p>
                                        <p className="text-[10px] font-bold text-zinc-700">{c.applicantType}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1 text-right">Filed Date</p>
                                        <p className="text-[10px] font-bold text-zinc-700 font-mono">{c.submissionDate}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 flex justify-between items-center border-t border-zinc-50">
                                <div>
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Benefit Estimate</p>
                                    <p className="text-lg font-mono font-bold text-teal-600">{c.benefitAmount > 0 ? formatCurrency(c.benefitAmount) : 'CALC PENDING'}</p>
                                </div>
                                <div className="p-2 bg-zinc-50 rounded-full text-zinc-300 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all border border-zinc-100">
                                    <ArrowRight size={20}/>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredCases.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-200 rounded-[32px] bg-white">
                             <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">No Applications Found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HAPCasesView;