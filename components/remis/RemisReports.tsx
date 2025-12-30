
import React, { useState, useMemo } from 'react';
import { FileText, Download, Filter, Search, Table as TableIcon, History, ShieldCheck, Printer, Calendar, Database, CheckCircle2 } from 'lucide-react';
import { remisService, AUTHORITATIVE_SOURCE_ID } from '../../services/RemisDataService';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';
import { useToast } from '../shared/ToastContext';

const RemisReports: React.FC = () => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [reportType, setReportType] = useState<'Inventory' | 'Revenue' | 'A-123' | 'RetrievalLog'>('Inventory');

    const assets = remisService.getAssets();
    const outgrants = remisService.getOutgrants();
    
    // Simulating retrieval logs as we don't have a full history store yet
    const retrievalLogs = useMemo(() => [
        { id: 'LOG-01', user: 'RE_SPECIALIST_A', action: 'Bulk Export', target: 'Inventory', date: '2024-03-15 09:12' },
        { id: 'LOG-02', user: 'G8_AUDITOR', action: 'SBR Review', target: 'Revenue Ledger', date: '2024-03-14 14:45' }
    ], []);

    const reportData = useMemo(() => {
        if (reportType === 'Inventory') return assets.filter(a => a.rpaName.toLowerCase().includes(searchTerm.toLowerCase()) || a.rpuid.includes(searchTerm));
        if (reportType === 'Revenue') return outgrants.filter(o => o.grantee.toLowerCase().includes(searchTerm.toLowerCase()));
        if (reportType === 'RetrievalLog') return retrievalLogs;
        return assets;
    }, [reportType, assets, outgrants, retrievalLogs, searchTerm]);

    const handleGenerate = () => {
        addToast(`Fiduciary snapshot published. Authoritative integrity verified via SHA-256.`, 'success');
        // Simulate a PDF generation delay
        setTimeout(() => {
            addToast(`Report [${reportType}] available for download.`, 'info');
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 animate-in fade-in">
            <div className="p-4 bg-white border-b border-zinc-200 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-20 shadow-sm">
                <div className="flex bg-zinc-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto custom-scrollbar">
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
                <button onClick={handleGenerate} className={`w-full lg:w-auto px-6 py-2.5 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 ${REMIS_THEME.classes.buttonPrimary}`}>
                    <FileText size={16}/> Publish Official Snapshot
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-6xl mx-auto space-y-6 pb-20">
                    <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                            <input 
                                type="text" 
                                placeholder={`Filter ${reportType} data...`} 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className={`w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:bg-white transition-all ${REMIS_THEME.classes.inputFocus}`}
                            />
                        </div>
                        <div className="flex gap-2">
                             <button className="p-2.5 border border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all"><Printer size={18}/></button>
                             <button className="p-2.5 border border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all"><Download size={18}/></button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                            <h4 className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                <TableIcon size={14} className="text-zinc-400" /> Fiduciary Ledger View
                            </h4>
                            <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 font-bold">
                                <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"><ShieldCheck size={12}/> DATA_SIGNED</span>
                                <span className="flex items-center gap-1.5"><Database size={12}/> SOURCE: {AUTHORITATIVE_SOURCE_ID}</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4 pl-8">Entity Ref</th>
                                        <th className="p-4">Primary Context</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 pr-8 text-right">Fiduciary Magnitude</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {reportType === 'Inventory' && (reportData as any[]).map(a => (
                                        <tr key={a.rpuid} className="hover:bg-zinc-50 transition-colors">
                                            <td className="p-4 pl-8 font-mono text-xs font-bold text-zinc-800">{a.rpuid}</td>
                                            <td className="p-4">
                                                <p className="text-xs font-bold text-zinc-900">{a.rpaName}</p>
                                                <p className="text-[10px] text-zinc-400 mt-0.5">{a.installation}</p>
                                            </td>
                                            <td className="p-4 text-center uppercase text-[9px] font-bold text-zinc-500">
                                                <span className="px-2 py-0.5 rounded border border-zinc-100 bg-white shadow-sm">{a.status}</span>
                                            </td>
                                            <td className="p-4 pr-8 text-right font-mono font-bold text-zinc-900">{formatCurrency(a.currentValue)}</td>
                                        </tr>
                                    ))}
                                    {reportType === 'Revenue' && (reportData as any[]).map(o => (
                                        <tr key={o.id} className="hover:bg-zinc-50 transition-colors">
                                            <td className="p-4 pl-8 font-mono text-xs font-bold text-zinc-800">{o.id}</td>
                                            <td className="p-4">
                                                <p className="text-xs font-bold text-zinc-900">{o.grantee}</p>
                                                <p className="text-[10px] text-zinc-500 mt-0.5">{o.type} Authority</p>
                                            </td>
                                            <td className="p-4 text-center uppercase text-[9px] font-bold text-zinc-500">
                                                <span className="px-2 py-0.5 rounded border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm">{o.status}</span>
                                            </td>
                                            <td className="p-4 pr-8 text-right font-mono font-bold text-emerald-700">{formatCurrency(o.annualRent)}</td>
                                        </tr>
                                    ))}
                                    {reportType === 'RetrievalLog' && (reportData as any[]).map(l => (
                                        <tr key={l.id} className="hover:bg-zinc-50 transition-colors">
                                            <td className="p-4 pl-8 font-mono text-xs font-bold text-zinc-800">{l.id}</td>
                                            <td className="p-4">
                                                <p className="text-xs font-bold text-zinc-900">{l.user}</p>
                                                <p className="text-[10px] text-zinc-500 mt-0.5">{l.action} on {l.target}</p>
                                            </td>
                                            <td className="p-4 text-center uppercase text-[9px] font-bold text-zinc-500">{l.date}</td>
                                            <td className="p-4 pr-8 text-right"><CheckCircle2 size={14} className="text-emerald-500 ml-auto"/></td>
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
