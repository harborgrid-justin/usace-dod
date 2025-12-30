
import React from 'react';
import { X, Clock, Server, FileText, CheckCircle2, AlertTriangle, Database, Terminal, ShieldCheck } from 'lucide-react';
import { IDOCInterface } from '../../types';
import Modal from '../shared/Modal';

interface Props {
  idoc: IDOCInterface;
  onClose: () => void;
}

const IdocDetailModal: React.FC<Props> = ({ idoc, onClose }) => {
  return (
    <Modal title={`Interface Transaction: ${idoc.id}`} subtitle="Authoritative Packet Telemetry" onClose={onClose}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
        
        {/* Technical Attributes */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border border-zinc-800">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Server size={80}/></div>
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-6">Packet Metadata</h4>
                <div className="space-y-4 text-xs font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500">Status</span>
                        <span className={idoc.status === 'Success' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{idoc.status.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500">Msg Type</span>
                        <span className="text-zinc-300">{idoc.messageType}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500">Partner</span>
                        <span className="text-zinc-300">{idoc.partner}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Time</span>
                        <span className="text-zinc-300">{idoc.timestamp}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-600"/> Middleware Validation
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Schema (XSD)</span>
                        <CheckCircle2 size={14} className="text-emerald-500"/>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Security Token</span>
                        <CheckCircle2 size={14} className="text-emerald-500"/>
                    </div>
                </div>
            </div>
        </div>

        {/* Payload Visualization */}
        <div className="lg:col-span-8 bg-zinc-950 rounded-[40px] border border-zinc-800 shadow-2xl flex flex-col h-[500px] overflow-hidden relative">
            <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Terminal size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.3em]">Payload Segment 001 / IDOC_XML</span>
                </div>
                <button className="text-[9px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">Raw Data</button>
            </div>
            <div className="flex-1 p-8 font-mono text-[11px] leading-relaxed overflow-y-auto custom-scrollbar text-emerald-400/80">
                <div className="space-y-1">
                    <p className="text-zinc-600">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</p>
                    <p className="text-zinc-600">&lt;IDOC BEGIN="1"&gt;</p>
                    <p className="pl-4">&lt;EDI_DC40 SEGMENT="1"&gt;</p>
                    <p className="pl-8">&lt;TABNAM&gt;EDI_DC40&lt;/TABNAM&gt;</p>
                    <p className="pl-8">&lt;DIRECT&gt;{idoc.direction === 'Inbound' ? '2' : '1'}&lt;/DIRECT&gt;</p>
                    <p className="pl-8">&lt;IDOCTYP&gt;{idoc.messageType}&lt;/IDOCTYP&gt;</p>
                    <p className="pl-8">&lt;MESTYP&gt;{idoc.messageType}_SYNC&lt;/MESTYP&gt;</p>
                    <p className="pl-8">&lt;SNDPRT&gt;LS&lt;/SNDPRT&gt;</p>
                    <p className="pl-8">&lt;SNDPRN&gt;{idoc.partner}&lt;/SNDPRN&gt;</p>
                    <p className="pl-4">&lt;/EDI_DC40&gt;</p>
                    <p className="pl-4 text-emerald-500">&lt;E1EDK01 SEGMENT="1"&gt;</p>
                    <p className="pl-8">&lt;CURCY&gt;USD&lt;/CURCY&gt;</p>
                    <p className="pl-8">&lt;BELNR&gt;{idoc.id}&lt;/BELNR&gt;</p>
                    <p className="pl-8">&lt;RECIP&gt;ARMY_GFEBS_PROD&lt;/RECIP&gt;</p>
                    <p className="pl-4 text-emerald-500">&lt;/E1EDK01&gt;</p>
                    <p className="text-zinc-600">&lt;/IDOC&gt;</p>
                </div>
            </div>
            {idoc.status === 'Error' && (
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4 animate-in slide-in-from-bottom-4">
                    <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Mapping Violation [E_004]</p>
                        <p className="text-[10px] text-rose-300 leading-relaxed mt-1 font-medium italic">Segment E1EDK01 contains an invalid receiving partner ID. Verification failed against internal GFEBS S-Table.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default IdocDetailModal;
