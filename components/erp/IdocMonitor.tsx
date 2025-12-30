
import React, { useState, useEffect, useMemo } from 'react';
import { Server, Activity, ArrowDownLeft, ArrowUpRight, CheckCircle2, AlertTriangle, Cpu, Globe, Database, Terminal, Maximize2 } from 'lucide-react';
import { IDOCInterface } from '../../types';
import Badge from '../shared/Badge';
import IdocDetailModal from './IdocDetailModal';

const IdocMonitor: React.FC = () => {
    const [selectedIdoc, setSelectedIdoc] = useState<IDOCInterface | null>(null);
    const [idocs, setIdocs] = useState<IDOCInterface[]>([
        { id: '5501229', status: 'Success', direction: 'Inbound', partner: 'GSA_BUY', messageType: 'SHP_CON', timestamp: '14:20:11' },
        { id: '5501230', status: 'Warning', direction: 'Outbound', partner: 'TREASURY', messageType: 'PAY_ADV', timestamp: '14:21:45' },
        { id: '5501231', status: 'Success', direction: 'Inbound', partner: 'DFAS_IN', messageType: 'GL_POST', timestamp: '14:22:05' },
        { id: '5501232', status: 'Error', direction: 'Outbound', partner: 'WAWF', messageType: 'INV_RCV', timestamp: '14:24:12' }
    ]);

    // Simulated Real-time Intake
    useEffect(() => {
        const interval = setInterval(() => {
            const partners = ['GSA_X', 'DFAS_COL', 'TREASURY', 'NAVY_ERP'];
            const types = ['ORD_ACK', 'GL_SUB', 'ADJ_ENT', 'PAY_STA'];
            const newIdoc: IDOCInterface = {
                id: (5501233 + Math.floor(Math.random() * 1000)).toString(),
                status: Math.random() > 0.1 ? 'Success' : 'Error',
                direction: Math.random() > 0.5 ? 'Inbound' : 'Outbound',
                partner: partners[Math.floor(Math.random() * partners.length)],
                messageType: types[Math.floor(Math.random() * types.length)],
                timestamp: new Date().toLocaleTimeString([], { hour12: false })
            };
            setIdocs(prev => [newIdoc, ...prev].slice(0, 8));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white border border-zinc-200 rounded-[40px] shadow-sm overflow-hidden h-full flex flex-col animate-in fade-in">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl border border-zinc-100 text-zinc-500 shadow-sm"><Cpu size={18}/></div>
                    <div>
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest leading-none">Interface Hub (ALE/IDOC)</h3>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1.5 tracking-tighter">Middleware Logic Monitor</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Pulse Active</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                <div className="divide-y divide-zinc-50">
                    {idocs.map(doc => (
                        <div 
                            key={doc.id} 
                            onClick={() => setSelectedIdoc(doc)}
                            className="p-5 hover:bg-zinc-50 transition-all group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl transition-all shadow-sm ${
                                        doc.direction === 'Inbound' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                                    }`}>
                                        {doc.direction === 'Inbound' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-zinc-900 uppercase tracking-tight">{doc.messageType}</p>
                                        <p className="text-[10px] text-zinc-400 font-mono tracking-[0.2em] mt-1">ID: {doc.id}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <p className="text-[9px] font-mono font-bold text-zinc-400 mb-2">{doc.timestamp}</p>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border shadow-inner ${
                                        doc.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                        doc.status === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-rose-50 text-rose-700 border-rose-100'
                                    }`}>{doc.status}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 pl-14">
                                <span className="flex items-center gap-2"><Globe size={12} className="opacity-40"/> Partner: <span className="text-zinc-600">{doc.partner}</span></span>
                                <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-emerald-600 font-black">
                                    INSPECT PACKET <Maximize2 size={10}/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-5 bg-zinc-50 border-t border-zinc-100 shrink-0">
                <button className="w-full py-3 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-all flex items-center justify-center gap-3 shadow-inner active:scale-95">
                    <Database size={14}/> Cross-System Audit
                </button>
            </div>

            {selectedIdoc && <IdocDetailModal idoc={selectedIdoc} onClose={() => setSelectedIdoc(null)} />}
        </div>
    );
};

export default IdocMonitor;
