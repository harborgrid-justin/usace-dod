
import React, { useState, useMemo } from 'react';
import { HardHat, Clock, Calendar, CheckCircle2, DollarSign, Briefcase, ChevronLeft, Search, FileText, Plus, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { MOCK_CDO_POOLS } from '../../constants';

interface LaborCostingViewProps {
    onSelectProject: (projectId: string) => void;
}

interface Timecard {
    id: string;
    employeeName: string;
    employeeGrade: string;
    payPeriod: string;
    status: 'Draft' | 'Signed' | 'Certified' | 'Processed';
    totalHours: number;
    totalCost: number;
    entries: { project: string; workItem: string; hours: number[]; rate: number }[];
}

const MOCK_TIMECARDS: Timecard[] = [
    {
        id: 'TC-24-05-001',
        employeeName: 'John Smith',
        employeeGrade: 'GS-12',
        payPeriod: '2024-03-A',
        status: 'Draft',
        totalHours: 80,
        totalCost: 6840,
        entries: [
            { project: '123456 - Ohio River Lock', workItem: 'Eng Services', hours: [8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 0, 0], rate: 85.50 },
            { project: 'CDO - Overhead', workItem: 'General Admin', hours: [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], rate: 85.50 },
        ]
    },
    {
        id: 'TC-24-05-002',
        employeeName: 'Jane Doe',
        employeeGrade: 'GS-11',
        payPeriod: '2024-03-A',
        status: 'Signed',
        totalHours: 80,
        totalCost: 5200,
        entries: [
            { project: '998877 - Miss. River Maint', workItem: 'Field Ops', hours: [9, 9, 9, 9, 4, 0, 0, 9, 9, 9, 9, 4, 0, 0], rate: 65.00 },
        ]
    }
];

const TimecardDetail: React.FC<{ timecard: Timecard; onBack: () => void; onStatusUpdate: (status: Timecard['status']) => void; onSelectProject: (id: string) => void }> = ({ timecard, onBack, onStatusUpdate, onSelectProject }) => {
    const numDays = timecard.entries[0]?.hours.length || 0;
    
    return (
        <div className="flex-1 min-h-0 flex flex-col gap-6 animate-in slide-in-from-right-4">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden flex-1">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">{timecard.employeeName}</h3>
                        <p className="text-xs text-zinc-500">{timecard.payPeriod} • ID: {timecard.id}</p>
                    </div>
                    <div className="flex gap-4 text-xs font-mono">
                        <span>Regular: <span className="font-bold text-zinc-900">80.0</span></span>
                        <span>OT: <span className="font-bold text-zinc-900">0.0</span></span>
                    </div>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-zinc-200 bg-zinc-50">
                                <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase w-64">Project / Work Item</th>
                                {Array.from({length: numDays}).map((_, i) => (
                                    <th key={i} className="p-1 text-[9px] font-bold text-zinc-400 uppercase text-center w-8">D{i+1}</th>
                                ))}
                                <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase text-right">Hrs</th>
                                <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase text-right">Burdened Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {timecard.entries.map((row, idx) => {
                                const totalHours = row.hours.reduce((a,b) => a+b, 0);
                                const baseCost = totalHours * row.rate;
                                const overhead = IntegrationOrchestrator.calculateOverheadAllocation(baseCost, 'Engineering', MOCK_CDO_POOLS);
                                return (
                                    <tr key={idx} className="hover:bg-zinc-50">
                                        <td className="p-3">
                                            <button onClick={() => onSelectProject(row.project.split(' ')[0])} className="text-xs font-bold text-zinc-800 hover:text-rose-700 underline decoration-rose-200">{row.project}</button>
                                            <p className="text-[9px] text-zinc-400">{row.workItem}</p>
                                        </td>
                                        {row.hours.map((h, i) => (
                                            <td key={i} className={`p-1 text-center font-mono text-xs ${h > 0 ? 'text-zinc-900 font-bold' : 'text-zinc-300'}`}>{h}</td>
                                        ))}
                                        <td className="p-3 text-right font-mono text-sm font-bold text-zinc-900">{totalHours}</td>
                                        <td className="p-3 text-right">
                                            <span className="font-mono text-xs font-bold text-emerald-600">{formatCurrency(baseCost + overhead)}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50/50 mt-auto">
                    <button onClick={onBack} className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    {timecard.status === 'Draft' && (
                        <button onClick={() => onStatusUpdate('Signed')} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-zinc-800"><FileText size={14} /> Sign & Submit</button>
                    )}
                    {timecard.status === 'Signed' && (
                        <button onClick={() => onStatusUpdate('Certified')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-emerald-500"><CheckCircle2 size={14} /> Certify (G-8)</button>
                    )}
                </div>
            </div>
        </div>
    );
};

const TimecardList: React.FC<{ timecards: Timecard[]; onSelect: (tc: Timecard) => void }> = React.memo(({ timecards, onSelect }) => (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex-1 overflow-hidden">
        <div className="overflow-y-auto custom-scrollbar h-full">
            <table className="w-full text-left">
                <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0">
                    <tr>
                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Employee</th>
                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pay Period</th>
                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Hrs</th>
                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                        <th className="p-4 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {timecards.map(tc => (
                        <tr key={tc.id} className="group hover:bg-zinc-50/50 transition-colors cursor-pointer" onClick={() => onSelect(tc)}>
                            <td className="p-4">
                                <p className="text-sm font-bold text-zinc-900">{tc.employeeName}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">{tc.id}</p>
                            </td>
                            <td className="p-4 text-xs font-medium text-zinc-700">{tc.payPeriod}</td>
                            <td className="p-4 text-right font-mono text-sm text-zinc-900 font-bold">{tc.totalHours.toFixed(1)}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${
                                    tc.status === 'Draft' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' :
                                    tc.status === 'Signed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    'bg-emerald-50 text-emerald-700 border-emerald-100'
                                }`}>{tc.status}</span>
                            </td>
                            <td className="p-4 text-right">
                                <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-600 inline-block"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
));

const LaborCostingView: React.FC<LaborCostingViewProps> = ({ onSelectProject }) => {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [timecards, setTimecards] = useState<Timecard[]>(MOCK_TIMECARDS);
    const [selectedTimecard, setSelectedTimecard] = useState<Timecard | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectTimecard = (tc: Timecard) => {
        setSelectedTimecard(tc);
        setView('detail');
    };

    const handleStatusUpdate = (newStatus: Timecard['status']) => {
        if (!selectedTimecard) return;
        const updatedTC = { ...selectedTimecard, status: newStatus };
        setTimecards(timecards.map(tc => tc.id === updatedTC.id ? updatedTC : tc));
        setSelectedTimecard(updatedTC);
        if (newStatus === 'Signed' || newStatus === 'Certified') setView('list');
    };

    const filteredTimecards = useMemo(() => timecards.filter(tc => 
        tc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [timecards, searchTerm]);
    
    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <HardHat size={24} className="text-rose-700" /> Labor Costing (LC)
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Time & Attendance (T&A) • Labor Distribution • Overhead Burdens</p>
                </div>
            </div>
            
            {view === 'list' ? (
                <>
                    <div className="bg-white p-4 border border-zinc-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative flex-1 w-full max-w-md">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                            <input type="text" placeholder="Search employees or timecard ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400"/>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800"><Plus size={14}/> New Entry</button>
                    </div>
                    <TimecardList timecards={filteredTimecards} onSelect={handleSelectTimecard} />
                </>
            ) : (
                selectedTimecard && <TimecardDetail timecard={selectedTimecard} onBack={() => setView('list')} onStatusUpdate={handleStatusUpdate} onSelectProject={onSelectProject} />
            )}
        </div>
    );
};

export default LaborCostingView;
