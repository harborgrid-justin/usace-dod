import React, { useState } from 'react';
import { Users, Search, Plus, Home, FileCheck, DollarSign, Calendar } from 'lucide-react';
import { HAPCase, HAPCaseStatus } from '../../types';
import { MOCK_HAP_CASES } from '../../constants';
import { formatCurrency } from '../../utils/formatting';
import HAPCaseDetail from '../hap/HAPCaseDetail';

const HAPCasesView: React.FC = () => {
    const [cases, setCases] = useState<HAPCase[]>(MOCK_HAP_CASES);
    const [selectedCase, setSelectedCase] = useState<HAPCase | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCases = cases.filter(c => 
        c.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateCase = (updatedCase: HAPCase) => {
        setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
        setSelectedCase(updatedCase);
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

    if (selectedCase) {
        return <HAPCaseDetail hapCase={selectedCase} onBack={() => setSelectedCase(null)} onUpdate={handleUpdateCase} />;
    }

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Users size={24} className="text-teal-700" /> HAP Applicant Management
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">
                        Homeowners Assistance Program (32 CFR Part 239)
                    </p>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Search applicants..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400 transition-all"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors shadow-sm whitespace-nowrap">
                        <Plus size={14}/> New Application
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-4">
                    {filteredCases.map(c => (
                        <div 
                            key={c.id} 
                            onClick={() => setSelectedCase(c)}
                            className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 text-zinc-500">
                                        <Home size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-bold text-zinc-900">{c.applicantName}</h3>
                                            <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 bg-zinc-50 rounded border">{c.id}</span>
                                        </div>
                                        <p className="text-xs text-zinc-600 font-medium mb-1">{c.propertyAddress}</p>
                                        <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                                            <span className="flex items-center gap-1"><FileCheck size={10}/> {c.programType}</span>
                                            <span className="flex items-center gap-1"><Calendar size={10}/> Filed: {c.submissionDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                    <StatusBadge status={c.status} />
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Est. Benefit</p>
                                        <p className="text-sm font-mono font-bold text-zinc-900">
                                            {c.benefitAmount ? formatCurrency(c.benefitAmount) : 'Pending Calc'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HAPCasesView;