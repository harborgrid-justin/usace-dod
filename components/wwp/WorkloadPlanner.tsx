
import React from 'react';
import { WorkloadItem } from '../../types';
import { Link, Briefcase, TrendingUp, ChevronRight } from 'lucide-react';
import { MOCK_USACE_PROJECTS } from '../../constants';

interface Props {
    items: WorkloadItem[];
    onSelectProject: (projectId: string) => void;
    onUpdateItem: (item: WorkloadItem) => void;
}

const WorkloadPlanner: React.FC<Props> = ({ items, onSelectProject, onUpdateItem }) => {
    return (
        <div className="animate-in fade-in space-y-6">
            <div className="bg-zinc-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h4 className="text-lg font-bold">Mission Demand Modeling</h4>
                        <p className="text-xs text-zinc-400">Adjust workload quantities to see impact on FTE requirements.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Active Items</p>
                        <p className="text-2xl font-mono font-bold">{items.length}</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Briefcase size={80} /></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.map(item => {
                    const project = MOCK_USACE_PROJECTS.find(p => p.id === item.projectId);
                    return (
                        <div key={item.id} className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-all group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-400 group-hover:text-rose-700 transition-colors">
                                    <Briefcase size={20}/>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-zinc-900">{item.name}</h4>
                                        <span className="text-[10px] font-mono text-zinc-400">ID: {item.id}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">{item.workloadType}</span>
                                        {project && (
                                            <button onClick={() => onSelectProject(project.id)} className="text-[10px] text-blue-600 hover:underline flex items-center gap-1">
                                                <Link size={10}/> P2: {project.p2Number}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                                <div className="flex flex-col items-end">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Volume Quantity</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            value={item.quantity}
                                            onChange={e => onUpdateItem({...item, quantity: Number(e.target.value)})}
                                            className="w-20 text-right font-mono font-bold text-zinc-900 border-b-2 border-zinc-200 focus:border-rose-700 focus:outline-none bg-transparent"
                                        />
                                        <span className="text-xs font-medium text-zinc-500">{item.unit}</span>
                                    </div>
                                </div>
                                <button className="p-2 text-zinc-300 hover:text-zinc-600">
                                    <ChevronRight size={18}/>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkloadPlanner;
