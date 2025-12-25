
import React, { useState } from 'react';
import { Download, ExternalLink, FilePieChart, FileText, Landmark, Scale } from 'lucide-react';
import ReportPreviewModal from './ReportPreviewModal';
import { MOCK_GL_TRANSACTIONS } from '../../constants';
import { GLTransaction } from '../../types';

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
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
        <div>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600"><Icon size={18}/></div>
                <h4 className="text-sm font-bold text-zinc-900">{title}</h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
        </div>
        <button onClick={onClick} className="w-full mt-6 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-zinc-800">
            {isExternal ? <ExternalLink size={12}/> : <Download size={12}/>} {actionText}
        </button>
    </div>
);

const GLReporting: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

    const handleOpenReport = (type: ReportType) => {
        setSelectedReport(type);
        setIsModalOpen(true);
    };

    const handleCloseReport = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    const standardReports = [
        { title: 'Trial Balance', desc: 'Summary of all GL accounts with debit/credit balances for a selected period.', icon: Scale, actionText: 'Generate', onClick: () => handleOpenReport('Trial Balance') },
        { title: 'GL Detail Report', desc: 'Line-item transaction listing for a specified range of accounts and dates.', icon: FileText, actionText: 'Run Report', onClick: () => alert('Feature pending implementation.') },
    ];
    const finStatements = [
        { title: 'Balance Sheet', desc: 'Statement of financial position showing assets, liabilities, and net position.', icon: Landmark, actionText: 'Generate', onClick: () => handleOpenReport('Balance Sheet') },
        { title: 'Statement of Budgetary Resources', desc: 'Reports on budgetary resources and their status per USSGL requirements.', icon: FilePieChart, actionText: 'Generate', onClick: () => handleOpenReport('SBR') },
    ];
    const externalReports = [
        { title: 'GTAS Reporting Package', desc: 'Generate files required for submission to the Governmentwide Treasury Account Symbol Adjusted Trial Balance System.', icon: ExternalLink, actionText: 'Open DDRS Portal', isExternal: true, onClick: () => {} },
        { title: 'DoD Data Repository Service', desc: 'Prepare and submit financial data to the central DoD repository for oversight.', icon: ExternalLink, actionText: 'Open GTAS Link', isExternal: true, onClick: () => {} },
    ];
    
    return (
        <div className="p-6 h-full overflow-y-auto custom-scrollbar">
            <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Standard GL Reports</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {standardReports.map(r => <ReportCard key={r.title} title={r.title} desc={r.desc} icon={r.icon} actionText={r.actionText} onClick={r.onClick} />)}
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Financial Statements (FASAB Compliant)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {finStatements.map(r => <ReportCard key={r.title} title={r.title} desc={r.desc} icon={r.icon} actionText={r.actionText} onClick={r.onClick} />)}
                    </div>
                </div>
                 <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">External Reporting</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {externalReports.map(r => <ReportCard key={r.title} title={r.title} desc={r.desc} icon={r.icon} actionText={r.actionText} isExternal={r.isExternal} onClick={r.onClick} />)}
                    </div>
                </div>
            </div>
            {isModalOpen && selectedReport && (
                <ReportPreviewModal 
                    reportType={selectedReport}
                    onClose={handleCloseReport}
                    data={{ transactions: MOCK_GL_TRANSACTIONS }}
                />
            )}
        </div>
    );
};

export default GLReporting;
