
import React, { useMemo } from 'react';
import { ShieldCheck, Search, Filter, Play, Info, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { ERP_TCODES } from '../../constants';
import Badge from '../shared/Badge';

interface Props {
    activeModule: string | 'ALL';
    onSelectCommand: (code: string) => void;
}

const TCodeList: React.FC<Props> = ({ activeModule, onSelectCommand }) => {
    const filteredCodes = useMemo(() => 
        ERP_TCODES.filter(tc => activeModule === 'ALL' || tc.module === activeModule),
    [activeModule]);

    return (
        <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                <div>
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <BookOpen size={14} className="text-rose-700"/> SAP Transaction Library (T-Codes)
                    </h3>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                         <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                         <input className="pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] w-48 outline-none focus:border-rose-300 transition-all" placeholder="Search library..." />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10 shadow-sm">
                        <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <th className="p-5">Command Code</th>
                            <th className="p-5">Functional Logic</th>
                            <th className="p-5 text-center">Module</th>
                            <th className="p-5 text-center">Inherent Risk</th>
                            <th className="p-5 text-right">Execution</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filteredCodes.map(tc => (
                            <tr key={tc.code} className="hover:bg-zinc-50 transition-all group">
                                <td className="p-5">
                                    <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded-lg border border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all">
                                        {tc.code}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <p className="text-xs font-bold text-zinc-700">{tc.description}</p>
                                    <p className="text-[9px] text-zinc-400 font-medium uppercase mt-1 tracking-tighter">GFEBS ECC Standard Protocol</p>
                                </td>
                                <td className="p-5 text-center">
                                    <span className="text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-lg border border-zinc-100">{tc.module}</span>
                                </td>
                                <td className="p-5 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {tc.riskLevel === 'High' ? (
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                                <AlertTriangle size={10}/> CRITICAL
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
                                                <ShieldCheck size={10}/> NORMAL
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-5 text-right">
                                    <button 
                                        onClick={() => onSelectCommand(tc.code)}
                                        className="p-2 bg-zinc-50 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-xl transition-all shadow-inner active:scale-90"
                                    >
                                        <Play size={14} fill="currentColor" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 shrink-0 flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Info size={12}/> Double-click code to copy</span>
                    <div className="w-px h-3 bg-zinc-200" />
                    <span className="flex items-center gap-1.5"><ShieldCheck size={12}/> SOD Checks Active</span>
                </div>
                <span>Catalog: ECC 6.0 (EHP8)</span>
            </div>
        </div>
    );
};

export default TCodeList;
