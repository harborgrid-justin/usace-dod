
import React, { useState, useMemo } from 'react';
import { Download, ExternalLink, FilePieChart, FileText, Landmark, Scale, ShieldCheck, LayoutGrid, Filter } from 'lucide-react';
import ReportPreviewModal from './ReportPreviewModal';
import { useGLData } from '../../hooks/useDomainData';

type ReportType = 'Trial Balance' | 'Balance Sheet' | 'SBR';

interface ReportCardProps {
    title: string;
    desc: string;
    icon: React.ElementType;
    actionText: string;
    isExternal?: boolean;
    onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, desc, icon: Icon, actionText, isExternal, onClick }) => (
    <div className="bg-white p-8 rounded-md border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-2xl hover:border-rose-200 transition-all group border-b-8 border-b-transparent hover:border-b-zinc-900 active:scale-[0.98]">
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-zinc-50 rounded-sm text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-inner border border-zinc-100"><Icon size={24}/></div>
                <h4 className="text-base font-bold text-zinc-900 uppercase tracking-tight">{title}</h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium px-1">{desc}</p>
        </div>
        <button onClick={onClick} className="w-full py-3.5 bg-zinc-100 text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
            {isExternal ? <ExternalLink size={16}/> : <Download size={16}/>} {actionText}
        </button>
    </div>
);

const GLReporting: React.FC = () => {
    const { transactions } = useGLData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
    const [activePeriod, setActivePeriod] = useState('FY24-Q2');

    const handleOpenReport = (type: ReportType) => {
        setSelectedReport(type);
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-zinc-50/50 animate-in fade-in">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-200 pb-8">
                    <div>
                        <h2 className="text-4xl font-bold text-zinc-900 uppercase tracking-tighter">Fiduciary Reporting Suite</h2>
                        <p className="text-sm text-zinc-500 font-medium mt-2">Authoritative USSGL Data Integrity Repository</p>
                    </div>
                    <div className="flex gap-4 items-center w-full md:w-auto">
                        <div className="flex bg-white p-1 rounded-md border border-zinc-200 shadow-sm flex-1 md:flex-none">
                            {['FY24-Q1', 'FY24-Q2', 'FY24-Q3'].map(p => (
                                <button key={p} onClick={() => setActivePeriod(p)} className={`px-5 py-2 rounded-sm text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activePeriod === p ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}>{p}</button>
                            ))}
                        </div>
                        <button className="p-3 bg-white border border-zinc-200 rounded-md text-zinc-500 hover:text-zinc-900 transition-all shadow-sm"><Filter size={18}/></button>
                    </div>
                </div>

                <div className="space-y-16">
                    <section>
                        <div className="flex items-center gap-4 mb-8 px-2">
                             <div className="w-10 h-10 rounded-sm bg-rose-700 text-white flex items-center justify-center shadow-lg"><Scale size={20}/></div>
                             <div>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Operational Accounting Output</h3>
                                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Trial Balance & Real-Time Register Logs</p>
                             </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <ReportCard 
                                title="Adjusted Trial Balance" 
                                desc="Full hierarchical account listing (USSGL) for the current active period. Includes post-closing adjustments." 
                                icon={Scale} 
                                actionText="Download Snapshot" 
                                onClick={() => handleOpenReport('Trial Balance')} 
                            />
                            <ReportCard 
                                title="GL Register (Audit Log)" 
                                desc="Atomic event listing of all system postings with cross-module entity linkage (PID, PR, TX)." 
                                icon={FileText} 
                                actionText="Export Full Ledger" 
                                onClick={() => alert('Full Audit Export Initiated')} 
                            />
                            <ReportCard 
                                title="USSGL 1010/6653 Variance" 
                                desc="Automated tie-point report comparing internal FBwT ledger state against Treasury reports." 
                                icon={ShieldCheck} 
                                actionText="Generate Tie-Point" 
                                onClick={() => alert('Variance Report Triggered')} 
                            />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-8 px-2">
                             <div className="w-10 h-10 rounded-sm bg-zinc-900 text-white flex items-center justify-center shadow-lg"><Landmark size={20}/></div>
                             <div>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Statutory Financial Statements</h3>
                                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">SFFAS Compliant Auditable Reports</p>
                             </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <ReportCard 
                                title="Statement of Net Position" 
                                desc="Proprietary balance sheet detailing assets, liabilities, and cumulative results of operations." 
                                icon={Landmark} 
                                actionText="Draft Statement" 
                                onClick={() => handleOpenReport('Balance Sheet')} 
                            />
                            <ReportCard 
                                title="Budgetary Resources (SBR)" 
                                desc="Mandatory SFFAS 7 output showing the lifecycle of budgetary authority from apportionment to outlay." 
                                icon={FilePieChart} 
                                actionText="Finalize SBR" 
                                onClick={() => handleOpenReport('SBR')} 
                            />
                             <ReportCard 
                                title="GTAS Pre-Submission" 
                                desc="Governmentwide Treasury Account Symbol Adjusted Trial Balance System (GTAS) bulk file generator." 
                                icon={LayoutGrid} 
                                actionText="Validate GTAS" 
                                onClick={() => alert('GTAS Bulk Validator Active')} 
                            />
                        </div>
                    </section>
                </div>
            </div>
            
            {isModalOpen && selectedReport && (
                <ReportPreviewModal 
                    reportType={selectedReport}
                    onClose={() => {setIsModalOpen(false); setSelectedReport(null);}}
                    data={{ transactions }}
                />
            )}
        </div>
    );
};

export default GLReporting;
