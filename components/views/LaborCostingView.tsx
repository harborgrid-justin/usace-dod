import React, { useState, useMemo } from 'react';
import { HardHat, Clock, Calendar, CheckCircle2, DollarSign, Briefcase, ChevronLeft, Search, FileText, Plus, ChevronRight, User, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { MOCK_CDO_POOLS } from '../../constants';
import { useLaborData } from '../../hooks/useDomainData';
import { laborService } from '../../services/LaborDataService';
import { Timecard } from '../../types';

interface LaborCostingViewProps {
    onSelectProject: (id: string) => void;
}

const TimecardDetail: React.FC<{ timecard: Timecard; onBack: () => void; onStatusUpdate: (status: Timecard['status']) => void; onSelectProject: (id: string) => void }> = ({ timecard, onBack, onStatusUpdate, onSelectProject }) => {
    const numDays = timecard.entries[0]?.hours.length || 0;
    
    return (
        <div className="flex-1 min-h-0 flex flex-col gap-6 animate-in slide-in-from-right-4">
            <div className="bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden flex-1">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">{timecard.employeeName}</h3>
                            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border ${
                                timecard.status === 'Draft' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' :
                                timecard.status === 'Signed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>{timecard.status}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{timecard.payPeriod} • ID: {timecard.id}</p>
                    </div>
                    <div className="flex gap-6 text-xs">
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Regular</p>
                            <p className="font-mono font-bold text-zinc-900">80.0 HRS</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Overtime</p>
                             <p className="font-mono font-bold text-zinc-900">0.0 HRS</p>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-zinc-200 bg-zinc-50">
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-64">Project / Work Item</th>
                                {Array.from({length: numDays}).map((_, i) => (
                                    <th key={i} className="p-2 text-[9px] font-bold text-zinc-400 uppercase text-center w-8 border-l border-zinc-100">D{i+1}</th>
                                ))}
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right border-l border-zinc-200">Total Hrs</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Burdened Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {timecard.entries.map((row, idx) => {
                                const totalHours = row.hours.reduce((a,b) => a+b, 0);
                                const baseCost = totalHours * row.rate;
                                const overhead = IntegrationOrchestrator.calculateOverheadAllocation(baseCost, 'Engineering', MOCK_CDO_POOLS);
                                return (
                                    <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                                        <td className="p-4">
                                            <button onClick={() => onSelectProject(row.project.split(' ')[0])} className="text-xs font-bold text-zinc-800 hover:text-rose-700 hover:underline decoration-rose-200 underline-offset-4 transition-all text-left block">
                                                {row.project}
                                            </button>
                                            <p className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1">{row.workItem}</p>
                                        </td>
                                        {row.hours.map((h, i) => (
                                            <td key={i} className={`p-2 text-center font-mono text-xs border-l border-zinc-50 ${h > 0 ? 'text-zinc-900 font-bold bg-zinc-50/50' : 'text-zinc-200'}`}>{h > 0 ? h : '-'}</td>
                                        ))}
                                        <td className="p-4 text-right font-mono text-sm font-bold text-zinc-900 border-l border-zinc-100 bg-zinc-50/30">{totalHours}</td>
                                        <td className="p-4 text-right">
                                            <span className="font-mono text-xs font-bold text-emerald-600">{formatCurrency(baseCost + overhead)}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50/50">
                    <button onClick={onBack} className="px-6 py-2.5 border border-zinc-200 rounded-sm text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50 transition-all">Cancel</button>
                    {timecard.status === 'Draft' && (
                        <button onClick={() => onStatusUpdate('Signed')} className="px-6 py-2.5 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-zinc-800 shadow-lg active:scale-95 transition-all">
                            <FileText size={14} /> Sign & Submit
                        </button>
                    )}
                    {timecard.status === 'Signed' && (
                        <button onClick={() => onStatusUpdate('Certified')} className="px-6 py-2.5 bg-emerald-600 text-white rounded-sm text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-emerald-500 shadow-lg active:scale-95 transition-all">
                            <CheckCircle2 size={14} /> Certify (G-8)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const TimecardList: React.FC<{ timecards: Timecard[]; onSelect: (tc: Timecard) => void }> = React.memo(({ timecards, onSelect }) => (
    <div className="bg-white border border-zinc-200 rounded-md shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
                <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10">
                    <tr>
                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Employee Identity</th>
                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pay Period</th>
                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Total Hours</th>
                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Status</th>
                        <th className="p-4 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {timecards.map(tc => (
                        <tr key={tc.id} className="group hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => onSelect(tc)}>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 rounded-sm text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                        <User size={14}/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900">{tc.employeeName}</p>
                                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{tc.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-xs font-medium text-zinc-700">{tc.payPeriod}</td>
                            <td className="p-4 text-right font-mono text-sm font-bold text-zinc-900">{tc.totalHours.toFixed(1)}</td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border ${
                                    tc.status === 'Draft' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' :
                                    tc.status === 'Signed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    'bg-emerald-50 text-emerald-700 border-emerald-100'
                                }`}>{tc.status}</span>
                            </td>
                            <td className="p-4 text-right">
                                <ChevronRight size={16} className="text-zinc-300 group-hover:text-emerald-600 transition-all"/>
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
    const { timecards } = useLaborData();
    const [selectedTimecard, setSelectedTimecard] = useState<Timecard | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectTimecard = (tc: Timecard) => {
        setSelectedTimecard(tc);
        setView('detail');
    };

    const handleStatusUpdate = (newStatus: Timecard['status']) => {
        if (!selectedTimecard) return;
        const updatedTC = { ...selectedTimecard, status: newStatus };
        laborService.updateTimecard(updatedTC);
        setSelectedTimecard(updatedTC);
        if (newStatus === 'Signed' || newStatus === 'Certified') setView('list');
    };

    const filteredTimecards = useMemo(() => timecards.filter(tc => 
        tc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [timecards, searchTerm]);
    
    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/50 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <HardHat size={28} className="text-rose-700" /> Labor Costing (LC)
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">Time & Attendance (T&A) • Labor Distribution • Overhead Burdens</p>
                </div>
            </div>
            
            {view === 'list' ? (
                <>
                    <div className="bg-white p-4 border border-zinc-200 rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative flex-1 w-full max-w-md">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                            <input 
                                type="text" 
                                placeholder="Search employees or timecard ID..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-sm text-xs focus:outline-none focus:border-rose-400 transition-all shadow-inner"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-md active:scale-95">
                            <Plus size={14}/> New Entry
                        </button>
                    </div>
                    <TimecardList timecards={filteredTimecards} onSelect={handleSelectTimecard} />
                </>
            ) : (
                selectedTimecard && (
                    <div className="flex flex-col h-full overflow-hidden">
                         <div className="mb-4">
                            <button onClick={() => setView('list')} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-colors">
                                <ArrowLeft size={16}/> Back to Roster
                            </button>
                        </div>
                        <TimecardDetail timecard={selectedTimecard} onBack={() => setView('list')} onStatusUpdate={handleStatusUpdate} onSelectProject={onSelectProject} />
                    </div>
                )
            )}
        </div>
    );
};

export default LaborCostingView;