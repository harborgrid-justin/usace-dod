
import React, { useState } from 'react';
import { 
    Hammer, Plus, Filter, FileText, AlertCircle, CheckCircle2, 
    ArrowRight, Clock, Building2, Link2
} from 'lucide-react';
import { ProjectOrder, ProjectOrderStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import ProjectOrderForm from './ProjectOrderForm';
import ProjectOrderLifecycleModal from './ProjectOrderLifecycleModal';
import { reimbursableService } from '../../services/ReimbursableDataService';

interface ProjectOrderManagerProps {
    projectOrders: ProjectOrder[];
    onSelectProject?: (projectId: string) => void;
}

const ProjectOrderManager: React.FC<ProjectOrderManagerProps> = ({ projectOrders, onSelectProject }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedOrderForLifecycle, setSelectedOrderForLifecycle] = useState<ProjectOrder | null>(null);

    const handleCreateOrder = (newOrder: ProjectOrder) => {
        reimbursableService.addProjectOrder(newOrder);
        setIsFormOpen(false);
    };

    const handleUpdateOrder = (updatedOrder: ProjectOrder) => {
        reimbursableService.updateProjectOrder(updatedOrder);
    };

    const StatusBadge = ({ status }: { status: ProjectOrderStatus }) => {
        const styles = {
            'Draft (Advance Planning)': 'bg-zinc-100 text-zinc-500 border-zinc-200',
            'Issued': 'bg-blue-50 text-blue-700 border-blue-200',
            'Accepted': 'bg-purple-50 text-purple-700 border-purple-200',
            'Work In Progress': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Completed': 'bg-zinc-800 text-white border-zinc-900',
            'Canceled': 'bg-rose-50 text-rose-700 border-rose-200'
        };
        return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="flex flex-col bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <Hammer size={16} /> Project Order Management
                    </h3>
                    <p className="text-xs text-zinc-500">Authority: 41 U.S.C. 6307 • FMR Vol 11A, Ch 2</p>
                </div>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors"
                >
                    <Plus size={12} /> New Project Order
                </button>
            </div>

            {/* List */}
            <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                    {projectOrders.map(order => (
                        <div key={order.id} className="border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-all hover:shadow-md bg-white group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-sm font-bold text-zinc-900">{order.orderNumber}</h4>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <p className="text-xs text-zinc-600 font-medium">{order.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Value</p>
                                    <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(order.totalAmount)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-zinc-100 border-b border-dashed mb-4">
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Provider (DoD Owned)</p>
                                    <p className="text-xs font-semibold text-zinc-800 flex items-center gap-1">
                                        <Building2 size={12} className="text-zinc-400"/> {order.providerId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Performance</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 bg-zinc-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${order.percentInHouse >= 51 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{width: `${order.percentInHouse}%`}} />
                                        </div>
                                        <span className={`text-xs font-mono font-bold ${order.percentInHouse >= 51 ? 'text-emerald-600' : 'text-rose-600'}`}>{order.percentInHouse}% In-House</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Timeline</p>
                                    <p className="text-xs font-mono text-zinc-600">{order.issueDate} <span className="text-zinc-300">→</span> {order.completionDate}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Pricing</p>
                                    <p className="text-xs font-medium text-zinc-700 bg-zinc-50 px-2 py-0.5 rounded inline-block border border-zinc-100">{order.pricingMethod}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    {order.documents.fs7600a && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-mono font-medium">GT&C: {order.documents.fs7600a}</span>}
                                    {!order.isSeverable && <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 font-bold flex items-center gap-1"><CheckCircle2 size={10}/> Non-Severable</span>}
                                    {order.linkedP2Number && onSelectProject && (
                                        <button onClick={() => onSelectProject(order.linkedP2Number!)} className="text-[10px] bg-rose-50 text-rose-700 px-2 py-1 rounded border border-rose-100 font-mono font-bold flex items-center gap-1 hover:bg-rose-100">
                                            <Link2 size={10}/> P2: {order.linkedP2Number}
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setSelectedOrderForLifecycle(order)}
                                    className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1 hover:text-zinc-900 transition-colors"
                                >
                                    Manage Lifecycle <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {projectOrders.length === 0 && (
                        <div className="p-8 text-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
                            <p className="text-sm font-bold">No Project Orders Found</p>
                        </div>
                    )}
                </div>
            </div>

            {isFormOpen && (
                <ProjectOrderForm 
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleCreateOrder}
                />
            )}

            {selectedOrderForLifecycle && (
                <ProjectOrderLifecycleModal 
                    order={selectedOrderForLifecycle}
                    onClose={() => setSelectedOrderForLifecycle(null)}
                    onUpdate={handleUpdateOrder}
                />
            )}
        </div>
    );
};

export default ProjectOrderManager;
