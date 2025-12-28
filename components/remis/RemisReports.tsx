import React, { useState, useMemo } from 'react';
import { FileText, Download, Filter, Search, Table as TableIcon, History, ShieldCheck, Printer, Calendar, Database } from 'lucide-react';
import { remisService, AUTHORITATIVE_SOURCE_ID } from '../../services/RemisDataService';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';

const RemisReports: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [reportType, setReportType] = useState<'Inventory' | 'Revenue' | 'A-123' | 'RetrievalLog'>('Inventory');

    const assets = remisService.getAllAssetsIncludeRetired();
    const outgrants = remisService.getOutgrants();
    const retrievalLogs = remisService.getRetrievalLogs();

    const reportData = useMemo(() => {
        if (reportType === 'Inventory') return assets;
        if (reportType === 'Revenue') return outgrants;
        if (reportType === 'RetrievalLog') return retrievalLogs;
        return assets; // Fallback
    }, [reportType, assets, outgrants, retrievalLogs]);

    const handleGenerate = () => {
        const meta = remisService.generateStandardReport(reportType, { query: searchTerm });
        alert(`Fiduciary snapshot published (ID: ${meta.id}). Authoritative integrity verified via SHA-256.`);
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 animate-in fade-in">
            <div className="p-4 bg-white border-b border-zinc-200 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-20 shadow-sm">
                <div className="flex bg-zinc-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto">
                    {(['Inventory', 'Revenue', 'A-123', 'RetrievalLog'] as const).map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setReportType(tab)}
                            className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${reportType === tab ? 'bg-white shadow-sm text-emerald-800' : 'text-zinc-500 hover:text-zinc-800'}`}
                        >
                            {tab === 'A-123' ? 'Internal Controls' : tab === 'RetrievalLog' ? 'Audit Log' : tab}
                        </button>
                    ))}
                </div>
                <button onClick={handleGenerate} className={`w-full lg:w-auto px-6 py-2.5 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 ${REMIS_THEME.classes.buttonPrimary}`}>
                    <FileText size={16}/> Publish Official Report
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-6xl mx-auto space-y-6 pb-20">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                            <input 
                                type="text" 
                                placeholder="Filter report data..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className={`w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none ${REMIS_THEME.classes.inputFocus}`}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <TableIcon size={14} /> Fiduciary Ledger View
                            </h4>
                            <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
                                <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500"/> SIGNED</span>
                                <span className="flex items-center gap-1"><Database size={12}/> {AUTHORITATIVE_SOURCE_ID}</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-zinc-50 border-b border-zinc-100">
                                    <tr className="text-zinc-500 font-bold uppercase">
                                        <th className="p-4">Reference</th>
                                        <th className="p-4">Entity Context</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Fiduciary Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {reportType === 'Inventory' && (reportData as any[]).map(a => (
                                        <tr key={a.rpuid} className="hover:bg-zinc-50/50 transition-colors">
                                            <td className="p-4 font-mono font-bold text-zinc-800">{a.rpuid}</td>
                                            <td className="p-4 font-medium text-zinc-600">{a.rpaName}</td>
                                            <td className="p-4 uppercase text-[10px] font-bold text-zinc-400">{a.status}</td>
                                            <td className="p-4 text-right font-mono font-bold text-zinc-900">{formatCurrency(a.currentValue)}</td>
                                        </tr>
                                    ))}
                                    {reportType === 'Revenue' && (reportData as any[]).map(o => (
                                        <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                                            <td className="p-4 font-mono font-bold text-zinc-800">{o.id}</td>
                                            <td className="p-4 font-medium text-zinc-600">{o.grantee}</td>
                                            <td className="p-4 uppercase text-[10px] font-bold text-zinc-400">{o.status}</td>
                                            <td className="p-4 text-right font-mono font-bold text-emerald-700">{formatCurrency(o.annualRent)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemisReports;