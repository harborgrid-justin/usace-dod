
import React from 'react';
import { 
    FileText, Download, Printer, ChevronRight, 
    Table as TableIcon
} from 'lucide-react';
import { useWWPData } from '../../hooks/useDomainData';
import { exportToCSV } from '../../utils/formatting';

const WWPReports: React.FC = () => {
    const { workforcePlans } = useWWPData();
    
    const reports = [
        { id: 'R1', name: 'Manpower Requirement Summary', type: 'Strategic', status: 'Available', desc: 'Consolidated demand by labor category and business line.' },
        { id: 'R2', name: 'FTE Funding Mix (Baseline)', type: 'Financial', status: 'Available', desc: 'Ratio of funded vs unfunded authorizations across all districts.' },
        { id: 'R3', name: 'Labor Burden Analysis', type: 'Costing', status: 'Generated', desc: 'Detailed breakdown of direct labor vs overhead allocations.' },
        { id: 'R4', name: 'Authorized vs On-Board (AOB)', type: 'HR', status: 'Ready', desc: 'Current strength report against TDA authorizations.' },
    ];

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        const data = workforcePlans.flatMap(p => p.entries.map(e => ({
            Org: p.organization,
            Area: p.functionalArea,
            Category: e.laborCategory,
            Funded: e.fundedFTE,
            Unfunded: e.unfundedFTE
        })));
        exportToCSV(data, 'manpower_summary');
    };

    return (
        <div className="p-2 h-full flex flex-col animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Report Catalog (Hidden on print) */}
                <div className="lg:col-span-1 flex flex-col gap-4 print:hidden">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Report Catalog</h3>
                    <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2">
                        {reports.map(report => (
                            <button 
                                key={report.id}
                                className="w-full text-left p-4 bg-white border border-zinc-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase">{report.type}</span>
                                    <FileText size={14} className="text-zinc-300 group-hover:text-rose-600 transition-colors" />
                                </div>
                                <h4 className="text-sm font-bold text-zinc-900 mb-1">{report.name}</h4>
                                <p className="text-[10px] text-zinc-500 leading-tight">{report.desc}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-zinc-100 text-zinc-400">{report.status}</span>
                                    <ChevronRight size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview Area (Full width on print) */}
                <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden print:col-span-4 print:border-none print:shadow-none">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center print:hidden">
                        <div className="flex items-center gap-3">
                            <TableIcon size={16} className="text-zinc-400" />
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Report Preview: Manpower Summary</h3>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrint} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors" title="Print"><Printer size={16}/></button>
                            <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors shadow-sm">
                                <Download size={14}/> Export CSV
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-zinc-50/30 print:bg-white print:p-0 print:overflow-visible">
                        {/* Report Content ... (Same as before) ... */}
                        <div className="max-w-4xl mx-auto bg-white p-10 shadow-lg border border-zinc-200 rounded min-h-[800px] font-serif text-sm print:shadow-none print:border-none">
                            <div className="text-center mb-10 pb-6 border-b-2 border-zinc-900">
                                <h2 className="text-xl font-bold uppercase mb-1">Manpower Requirement Summary</h2>
                                <p className="text-xs uppercase tracking-widest">U.S. Army Corps of Engineers • Fiscal Year 2024</p>
                                <p className="text-[10px] text-zinc-400 mt-2">Generated: {new Date().toLocaleString()}</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-bold text-sm mb-4 border-l-4 border-rose-700 pl-3">I. Executive Summary</h4>
                                    <p className="text-xs leading-relaxed text-zinc-700">
                                        This report outlines the total FTE requirements and funding status across the district based on the current Approved Annual Work Plan (AAWP). 
                                        The analysis indicates a sustainable funding ratio for critical mission categories (Engineering and Science) while highlighting a 
                                        marginal overhire risk in Administrative support functions.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-sm mb-4 border-l-4 border-rose-700 pl-3">II. Labor Force Composition</h4>
                                    <table className="w-full border-collapse border border-zinc-300">
                                        <thead>
                                            <tr className="bg-zinc-100 text-[10px] uppercase print:bg-gray-100">
                                                <th className="border border-zinc-300 p-2 text-left">Category</th>
                                                <th className="border border-zinc-300 p-2 text-right">Authorized</th>
                                                <th className="border border-zinc-300 p-2 text-right">Funded</th>
                                                <th className="border border-zinc-300 p-2 text-right">Unfunded</th>
                                                <th className="border border-zinc-300 p-2 text-right">Gap</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[11px]">
                                            {workforcePlans[0]?.entries.map(e => (
                                                <tr key={e.laborCategory}>
                                                    <td className="border border-zinc-300 p-2">{e.laborCategory}</td>
                                                    <td className="border border-zinc-300 p-2 text-right font-mono">{(e.fundedFTE + e.unfundedFTE + 0.5).toFixed(1)}</td>
                                                    <td className="border border-zinc-300 p-2 text-right font-mono">{e.fundedFTE.toFixed(1)}</td>
                                                    <td className="border border-zinc-300 p-2 text-right font-mono">{e.unfundedFTE.toFixed(1)}</td>
                                                    <td className="border border-zinc-300 p-2 text-right font-mono text-rose-600">(0.5)</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* ... Rest of report ... */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WWPReports;
