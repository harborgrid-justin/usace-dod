import React from 'react';
import { AEAHistoryEvent } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Plus, Minus, History, User, FilePlus, ChevronDown } from 'lucide-react';

interface Props {
    history: AEAHistoryEvent[];
}

const AEA_HistoryTimeline: React.FC<Props> = ({ history }) => {
    const sortedHistory = [...history].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-6 relative animate-in fade-in">
            <div className="absolute top-4 bottom-4 left-6 w-px bg-zinc-100" />
            
            {sortedHistory.map((event, index) => (
                <div key={index} className="flex items-start gap-6 relative z-10 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl shrink-0 transition-all group-hover:scale-110 ${
                        event.action === 'Increased' ? 'bg-emerald-500 text-white' : 
                        event.action === 'Decreased' ? 'bg-rose-500 text-white' : 
                        'bg-zinc-900 text-white'
                    }`}>
                        {event.action === 'Increased' ? <Plus size={20}/> : 
                         event.action === 'Decreased' ? <Minus size={20}/> : 
                         <FilePlus size={20}/>}
                    </div>
                    
                    <div className="flex-1 bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm group-hover:border-zinc-900 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{event.action} Authority</h4>
                                <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{new Date(event.timestamp).toLocaleString()}</p>
                            </div>
                            <p className={`text-base font-mono font-bold ${
                                event.action === 'Increased' ? 'text-emerald-600' : 
                                event.action === 'Decreased' ? 'text-rose-600' : 
                                'text-zinc-900'
                            }`}>
                                {event.action === 'Decreased' ? '-' : '+'}{formatCurrency(event.amount)}
                            </p>
                        </div>
                        
                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 mt-4 text-xs text-zinc-600 leading-relaxed italic">
                            "{event.justification}"
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-50">
                            <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200"><User size={10} className="text-zinc-500"/></div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{event.user}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AEA_HistoryTimeline;
