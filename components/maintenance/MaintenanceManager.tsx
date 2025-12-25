
import React, { useState } from 'react';
import { 
    ClipboardList, Wrench, CalendarClock, Book, Plus, 
    CheckCircle2, AlertCircle, Play, 
    Clock, User, Briefcase, Package, ArrowUpRight, DollarSign
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import InventoryManager from './InventoryManager';
import WorkOrderDetailModal from './WorkOrderDetailModal';
import { MOCK_INVENTORY, MOCK_VENDORS } from '../../constants';
import { InventoryItem, WorkOrder } from '../../types';

// --- Local Types ---
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
type WOStatus = 'Open' | 'Assigned' | 'In Progress' | 'Completed' | 'Closed';
type SRStatus = 'New' | 'Review' | 'Approved' | 'Rejected';
type MaintenanceType = 'Corrective' | 'Preventive';

interface JobPlan {
    id: string;
    title: string;
    assetClass: string;
    tasks: string[];
    estLaborHours: number;
    requiredMaterials: string[];
}

interface ServiceRequest {
    id: string;
    description: string;
    requestor: string;
    dateSubmitted: string;
    priority: Priority;
    category: string;
    status: SRStatus;
}

interface PMSchedule {
    id: string;
    assetId: string;
    frequencyDays: number;
    lastPerformed: string;
    nextDue: string;
    jobPlanId: string;
}

// --- Mock Data ---
const MOCK_JOB_PLANS: JobPlan[] = [
    { id: 'JP-HVAC-01', title: 'Annual Chiller Service', assetClass: 'Equipment', tasks: ['Inspect compressor', 'Check refrigerant levels', 'Clean condenser coils', 'Lockout/Tagout verification'], estLaborHours: 4, requiredMaterials: ['Refrigerant R-410A', 'Filter Kit'] },
    { id: 'JP-GEN-01', title: 'Generator Load Test', assetClass: 'Equipment', tasks: ['Check oil levels', 'Inspect fuel lines', 'Run load bank test (2hrs)', 'Log output metrics'], estLaborHours: 3, requiredMaterials: ['Diesel Fuel', 'Oil Filter'] },
];

const MOCK_REQUESTS: ServiceRequest[] = [
    { id: 'SR-24-001', description: 'Leaking pipe in Mechanical Room B', requestor: 'Fac. Manager', dateSubmitted: '2024-03-10', priority: 'High', category: 'Plumbing', status: 'New' },
    { id: 'SR-24-002', description: 'Conference Room A lights flickering', requestor: 'Admin', dateSubmitted: '2024-03-11', priority: 'Low', category: 'Electrical', status: 'Review' },
];

const MOCK_WORK_ORDERS: WorkOrder[] = [
    { id: 'WO-24-1001', description: 'Repair AHU-1 Belt', type: 'Corrective', assetId: 'ASSET-002', status: 'In Progress', assignedTo: 'Tech A', dueDate: '2024-03-15', laborEntries: [], materialEntries: [], serviceEntries: [] },
    { id: 'WO-24-1002', description: 'Monthly Fire Alarm Test', type: 'Preventive', assetId: 'ASSET-002', status: 'Open', jobPlanId: 'JP-GEN-01', dueDate: '2024-03-20', laborEntries: [], materialEntries: [], serviceEntries: [] },
];

const MOCK_PM_SCHEDULES: PMSchedule[] = [
    { id: 'PM-001', assetId: 'ASSET-001', frequencyDays: 90, lastPerformed: '2023-12-15', nextDue: '2024-03-15', jobPlanId: 'JP-HVAC-01' },
    { id: 'PM-002', assetId: 'ASSET-003', frequencyDays: 30, lastPerformed: '2024-02-15', nextDue: '2024-03-17', jobPlanId: 'JP-GEN-01' },
];

const MaintenanceManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Requests' | 'WorkOrders' | 'PM' | 'Inventory' | 'JobPlans'>('Requests');
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
    const [pmSchedules, setPmSchedules] = useState(MOCK_PM_SCHEDULES);
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
    const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

    // -- Actions --

    const handleApproveRequest = (sr: ServiceRequest) => {
        const newWO: WorkOrder = {
            id: `WO-${Date.now().toString().slice(-4)}`,
            description: sr.description,
            type: 'Corrective',
            assetId: 'Unassigned',
            status: 'Open',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            laborEntries: [], materialEntries: [], serviceEntries: []
        };
        setWorkOrders([newWO, ...workOrders]);
        setRequests(requests.map(r => r.id === sr.id ? { ...r, status: 'Approved' } : r));
    };

    const handleGeneratePM = () => {
        const duePMs = pmSchedules.filter(pm => new Date(pm.nextDue) <= new Date());
        const newWOs = duePMs.map(pm => ({
            id: `WO-PM-${Date.now().toString().slice(-4)}-${pm.assetId.split('-')[1]}`,
            description: `Scheduled Maintenance: ${pm.jobPlanId}`,
            type: 'Preventive' as MaintenanceType,
            assetId: pm.assetId,
            status: 'Open' as WOStatus,
            jobPlanId: pm.jobPlanId,
            dueDate: pm.nextDue,
            laborEntries: [], materialEntries: [], serviceEntries: []
        }));
        
        if (newWOs.length > 0) {
            setWorkOrders([...newWOs, ...workOrders]);
            setPmSchedules(prev => prev.map(pm => {
                if (newWOs.some(wo => wo.assetId === pm.assetId)) {
                    const nextDate = new Date(new Date(pm.nextDue).getTime() + pm.frequencyDays * 24 * 60 * 60 * 1000);
                    return { ...pm, lastPerformed: new Date().toISOString().split('T')[0], nextDue: nextDate.toISOString().split('T')[0] };
                }
                return pm;
            }));
            alert(`Generated ${newWOs.length} Preventive Maintenance Orders.`);
        } else {
            alert("No PM schedules are currently due.");
        }
    };

    const handleUpdateInventory = (updatedItem: InventoryItem) => {
        setInventory(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    };

    const handleUpdateWO = (updatedWO: WorkOrder, updateStock = false) => {
        setWorkOrders(prev => prev.map(w => w.id === updatedWO.id ? updatedWO : w));
        
        if (updateStock) {
            updatedWO.materialEntries.forEach(entry => {
               const item = inventory.find(i => i.id === entry.inventoryItemId);
               if (item) {
                   // Mock logic
               }
            });
        }
        setSelectedWO(null);
    };

    const getPriorityColor = (p: Priority) => {
        switch(p) {
            case 'Critical': return 'text-rose-700 bg-rose-50 border-rose-100';
            case 'High': return 'text-amber-700 bg-amber-50 border-amber-100';
            case 'Medium': return 'text-blue-700 bg-blue-50 border-blue-100';
            default: return 'text-zinc-600 bg-zinc-100 border-zinc-200';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 w-full">
                    {['Requests', 'WorkOrders', 'PM', 'Inventory', 'JobPlans'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)} 
                            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100'}`}
                        >
                            {tab === 'Requests' && <ClipboardList size={14}/>}
                            {tab === 'WorkOrders' && <Wrench size={14}/>}
                            {tab === 'PM' && <CalendarClock size={14}/>}
                            {tab === 'Inventory' && <Package size={14}/>}
                            {tab === 'JobPlans' && <Book size={14}/>}
                            {tab.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
                
                {/* 1. Service Requests Intake */}
                {activeTab === 'Requests' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">Service Request Intake</h3>
                                <p className="text-xs text-zinc-500">Submit, categorize, and route maintenance requests.</p>
                            </div>
                            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 w-full sm:w-auto">
                                <Plus size={12}/> New Request
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {requests.map(req => (
                                <div key={req.id} className="border border-zinc-200 rounded-xl p-4 hover:shadow-md transition-all bg-white group">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="w-full">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${getPriorityColor(req.priority)}`}>{req.priority}</span>
                                                <span className="text-[10px] font-mono text-zinc-400">{req.id}</span>
                                                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">{req.category}</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-zinc-900">{req.description}</h4>
                                            <p className="text-xs text-zinc-500 mt-1">Requested by {req.requestor} on {req.dateSubmitted}</p>
                                        </div>
                                        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                            {req.status === 'New' && (
                                                <button onClick={() => handleApproveRequest(req)} className="w-full sm:w-auto px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-bold uppercase hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                                                    <CheckCircle2 size={12}/> Approve & Create WO
                                                </button>
                                            )}
                                            {req.status === 'Approved' && <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12}/> Approved</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Work Order Management */}
                {activeTab === 'WorkOrders' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <h3 className="text-lg font-bold text-zinc-900">Work Order Tracking</h3>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <span className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100"><Briefcase size={12}/> Corrective: {workOrders.filter(w => w.type === 'Corrective').length}</span>
                                <span className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-100"><CalendarClock size={12}/> Preventive: {workOrders.filter(w => w.type === 'Preventive').length}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {workOrders.map(wo => (
                                <div key={wo.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all bg-white cursor-pointer gap-4" onClick={() => setSelectedWO(wo)}>
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${wo.type === 'Preventive' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{wo.type}</span>
                                            <span className="text-xs font-mono font-bold text-zinc-800">{wo.id}</span>
                                            {wo.jobPlanId && <span className="text-[9px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 flex items-center gap-1"><Book size={10}/> {wo.jobPlanId}</span>}
                                        </div>
                                        <p className="text-sm font-medium text-zinc-900">{wo.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1"><User size={12}/> {wo.assignedTo || 'Unassigned'}</span>
                                            <span className="flex items-center gap-1"><Clock size={12}/> Due: {wo.dueDate}</span>
                                            {wo.totalCost ? <span className="flex items-center gap-1 text-emerald-600 font-bold">{formatCurrency(wo.totalCost)}</span> : null}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1.5 rounded border ${
                                            wo.status === 'Completed' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 
                                            wo.status === 'In Progress' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-zinc-600 border-zinc-200 bg-zinc-50'
                                        }`}>
                                            {wo.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Preventive Maintenance */}
                {activeTab === 'PM' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">PM Schedule Engine</h3>
                                <p className="text-xs text-zinc-500 mt-1">Automated generation based on calendar intervals.</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-100 transition-colors shadow-sm">
                                    <DollarSign size={14}/> View Budget
                                </button>
                                <button onClick={handleGeneratePM} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors shadow-lg">
                                    <Play size={14}/> Run Batch Generation
                                </button>
                            </div>
                        </div>
                        
                        {/* Desktop Table */}
                        <div className="hidden sm:block border border-zinc-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-200">
                                    <tr>
                                        <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Asset ID</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Frequency</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last Done</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Next Due</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Job Plan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {pmSchedules.map(pm => (
                                        <tr key={pm.id} className="hover:bg-zinc-50">
                                            <td className="p-4 text-xs font-mono font-bold text-zinc-800">{pm.assetId}</td>
                                            <td className="p-4 text-xs text-zinc-600">Every {pm.frequencyDays} Days</td>
                                            <td className="p-4 text-xs text-zinc-500">{pm.lastPerformed}</td>
                                            <td className="p-4">
                                                <span className={`text-xs font-bold px-2 py-1 rounded ${new Date(pm.nextDue) <= new Date() ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                                    {pm.nextDue}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs font-mono text-zinc-600">{pm.jobPlanId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards for PM */}
                        <div className="sm:hidden space-y-3">
                            {pmSchedules.map(pm => (
                                <div key={pm.id} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-zinc-900 font-mono">{pm.assetId}</span>
                                            <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 font-medium">Every {pm.frequencyDays}d</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${new Date(pm.nextDue) <= new Date() ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                            Due: {pm.nextDue}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-zinc-100">
                                        <div className="text-zinc-500">Last: {pm.lastPerformed}</div>
                                        <div className="font-mono text-zinc-700 font-bold">{pm.jobPlanId}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Inventory */}
                {activeTab === 'Inventory' && (
                    <InventoryManager inventory={inventory} onUpdateInventory={handleUpdateInventory} />
                )}

                {/* 5. Job Plans */}
                {activeTab === 'JobPlans' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {MOCK_JOB_PLANS.map(plan => (
                                <div key={plan.id} className="border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-zinc-900">{plan.title}</h4>
                                            <p className="text-[10px] text-zinc-500 font-mono mt-1">{plan.id}</p>
                                        </div>
                                        <span className="text-[9px] font-bold uppercase bg-zinc-100 px-2 py-1 rounded text-zinc-600">{plan.assetClass}</span>
                                    </div>
                                    <div className="space-y-3 mb-4 flex-1">
                                        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-2">Tasks</p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                {plan.tasks.map((t, i) => <li key={i} className="text-xs text-zinc-700">{t}</li>)}
                                            </ul>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1 p-2 bg-blue-50/50 border border-blue-100 rounded-lg">
                                                <p className="text-[10px] font-bold text-blue-400 uppercase">Est. Labor</p>
                                                <p className="text-sm font-bold text-blue-700">{plan.estLaborHours} Hrs</p>
                                            </div>
                                            <div className="flex-1 p-2 bg-purple-50/50 border border-purple-100 rounded-lg">
                                                <p className="text-[10px] font-bold text-purple-400 uppercase">Materials</p>
                                                <p className="text-sm font-bold text-purple-700">{plan.requiredMaterials.length} Items</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                                        Edit Plan
                                    </button>
                                </div>
                            ))}
                            <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-400 gap-2 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all cursor-pointer min-h-[200px]">
                                <Plus size={32} className="opacity-50"/>
                                <span className="text-xs font-bold uppercase">Create Standard Job Plan</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {selectedWO && (
                <WorkOrderDetailModal 
                    workOrder={selectedWO} 
                    inventory={inventory}
                    vendors={MOCK_VENDORS}
                    onClose={() => setSelectedWO(null)}
                    onUpdate={handleUpdateWO}
                />
            )}
        </div>
    );
};

export default MaintenanceManager;
