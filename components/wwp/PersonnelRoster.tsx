
import React, { useState, useTransition } from 'react';
import { User, Search, Plus, MapPin, Award, Edit, Shield, FileText, X, CheckCircle2, ChevronRight, Briefcase, Landmark, History, Clock } from 'lucide-react';
import Modal from '../shared/Modal';
import Badge from '../shared/Badge';

interface Employee {
    id: string;
    name: string;
    grade: string;
    series: string;
    org: string;
    location: string;
    status: 'Active' | 'On Leave' | 'Detail';
    clearance: 'Secret' | 'TS/SCI' | 'Public Trust';
    positionNum: string;
    fundingType: 'Direct' | 'Reimbursable';
    hireDate: string;
    trainingStatus: {
        cyber: 'Current' | 'Overdue';
        ethics: 'Current' | 'Overdue';
        fiscalLaw: 'Current' | 'Overdue' | 'N/A';
    };
    auditLog: any[];
}

const MOCK_EMPLOYEES: Employee[] = [
    { 
        id: 'E-1001', name: 'Smith, John', grade: 'GS-12', series: '0810 - Civil Engineer', 
        org: 'LRL-ED-D', location: 'Louisville District', status: 'Active', 
        clearance: 'Secret', positionNum: 'TDA-009912', fundingType: 'Direct',
        hireDate: '2015-06-12',
        trainingStatus: { cyber: 'Current', ethics: 'Current', fiscalLaw: 'Current' },
        auditLog: []
    },
    { 
        id: 'E-1002', name: 'Doe, Jane', grade: 'GS-11', series: '0501 - Financial Mgmt', 
        org: 'LRL-RM', location: 'Louisville District', status: 'Active', 
        clearance: 'Secret', positionNum: 'TDA-008821', fundingType: 'Direct',
        hireDate: '2018-03-20',
        trainingStatus: { cyber: 'Current', ethics: 'Overdue', fiscalLaw: 'Current' },
        auditLog: []
    },
    { 
        id: 'E-1003', name: 'Johnson, Mike', grade: 'GS-13', series: '0810 - Civil Engineer', 
        org: 'LRL-ED-C', location: 'Olmsted Project Office', status: 'Detail', 
        clearance: 'TS/SCI', positionNum: 'TDA-005541', fundingType: 'Reimbursable',
        hireDate: '2012-11-05',
        trainingStatus: { cyber: 'Current', ethics: 'Current', fiscalLaw: 'Overdue' },
        auditLog: []
    },
];

const PersonnelRoster: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const filtered = employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

    const handleSave = (updated: Employee) => {
        setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
        setSelectedEmployeeId(null);
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm h-full flex flex-col overflow-hidden animate-in fade-in transition-opacity">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                    <h3 className="text-base font-bold text-zinc-900 uppercase tracking-widest">Personnel Authoritative Roster</h3>
                    <span className="hidden sm:inline text-zinc-200">|</span>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">TDA Position Management</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Filter strength report..." 
                            className="pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs w-full sm:w-64 focus:outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-300 transition-all"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors shadow-lg active:scale-95 whitespace-nowrap">
                        <Plus size={14}/> Onboard Personnel
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10 shadow-sm">
                        <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <th className="p-5">Employee & Service Record</th>
                            <th className="p-5">TDA Position Mapping</th>
                            <th className="p-5">Credential Status</th>
                            <th className="p-5 text-center">Execution Status</th>
                            <th className="p-5 text-right w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filtered.map(emp => (
                            <tr 
                                key={emp.id} 
                                onClick={() => setSelectedEmployeeId(emp.id)}
                                className="hover:bg-rose-50/20 transition-colors group cursor-pointer"
                            >
                                <td className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-sm uppercase group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all">
                                            {emp.name.split(',')[1].trim().charAt(0)}{emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900">{emp.name}</p>
                                            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter mt-0.5">{emp.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5"><FileText size={12} className="text-zinc-300"/> {emp.positionNum}</span>
                                        <span className="text-[10px] text-zinc-400 font-medium uppercase truncate max-w-[180px]">{emp.series} • {emp.grade}</span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2">
                                        <Shield size={12} className={emp.clearance === 'TS/SCI' ? 'text-indigo-600' : 'text-zinc-400'} />
                                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-tighter">{emp.clearance}</span>
                                    </div>
                                </td>
                                <td className="p-5 text-center">
                                    <Badge variant={
                                        emp.status === 'Active' ? 'success' :
                                        emp.status === 'Detail' ? 'info' :
                                        'neutral'
                                    }>{emp.status}</Badge>
                                </td>
                                <td className="p-5 text-right">
                                    <ChevronRight size={18} className="text-zinc-200 group-hover:text-rose-700 transition-all ml-auto"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedEmployee && (
                <EmployeeWorkspace 
                    employee={selectedEmployee} 
                    onClose={() => setSelectedEmployeeId(null)} 
                    onSave={handleSave} 
                />
            )}
        </div>
    );
};

const EmployeeWorkspace: React.FC<{ employee: Employee, onClose: () => void, onSave: (e: Employee) => void }> = ({ employee, onClose, onSave }) => {
    const [formData, setFormData] = useState(employee);
    const [activeTab, setActiveTab] = useState<'Profile' | 'TDA' | 'Compliance'>('Profile');

    return (
        <Modal title="Strength Record Maintenance" subtitle={`Service Record: ${employee.id}`} onClose={onClose}>
            <div className="space-y-10 animate-in fade-in">
                <div className="flex items-center gap-8 mb-10">
                    <div className="w-24 h-24 rounded-[40px] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white text-3xl font-bold shadow-2xl relative">
                        {employee.name.split(',')[1].trim().charAt(0)}{employee.name.charAt(0)}
                        <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-full shadow-lg border-4 border-white"><CheckCircle2 size={16}/></div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-zinc-900 tracking-tighter">{employee.name}</h2>
                        <div className="flex items-center gap-6 mt-3">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14}/> {employee.location}</span>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Award size={14}/> {employee.grade}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 border-b border-zinc-100 pb-3">
                    {['Profile', 'TDA', 'Compliance'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab as any)}
                            className={`text-xs font-bold uppercase tracking-[0.2em] border-b-2 transition-all pb-2 ${activeTab === tab ? 'border-rose-700 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="min-h-[400px]">
                    {activeTab === 'Profile' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-2">
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Personnel Category</label>
                                    <select 
                                        value={formData.fundingType} 
                                        onChange={e => setFormData({...formData, fundingType: e.target.value as any})}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-sm font-bold focus:bg-white outline-none transition-all"
                                    >
                                        <option>Direct</option><option>Reimbursable</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Duty Status</label>
                                    <div className="flex gap-2 p-1 bg-zinc-100 rounded-2xl w-fit">
                                        {['Active', 'On Leave', 'Detail'].map(s => (
                                            <button key={s} onClick={() => setFormData({...formData, status: s as any})} className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${formData.status === s ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-800'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-50 rounded-[40px] p-8 border border-zinc-100 relative overflow-hidden">
                                <Landmark size={120} className="absolute -right-8 -bottom-8 opacity-5" />
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10"><History size={16}/> Record Lineage</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-baseline"><span className="text-xs text-zinc-500">Service Entry</span><span className="text-xs font-mono font-bold text-zinc-900">{formData.hireDate}</span></div>
                                    <div className="flex justify-between items-baseline"><span className="text-xs text-zinc-500">Last Org Update</span><span className="text-xs font-mono font-bold text-zinc-900">2023-11-15</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'TDA' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-2">
                             <div className="space-y-8">
                                <div className="p-6 bg-zinc-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                                    <FileText size={80} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-6">Position Control</h4>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Authorized TDA Number</p>
                                    <input value={formData.positionNum} onChange={e => setFormData({...formData, positionNum: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500 transition-all" />
                                </div>
                                <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
                                     <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Organizational Parent</h4>
                                     <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-zinc-200"><Briefcase size={20} className="text-zinc-400"/></div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900">{formData.org}</p>
                                            <p className="text-[10px] text-zinc-500 font-medium">Division: LRD • Region: Great Lakes</p>
                                        </div>
                                     </div>
                                </div>
                             </div>
                             <div className="p-8 bg-white border border-zinc-200 rounded-[40px] shadow-sm flex flex-col justify-center text-center gap-4">
                                <Clock size={48} className="mx-auto text-zinc-100" strokeWidth={1} />
                                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Timekeeping Linkage</h4>
                                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed font-medium">
                                    This record is synced with <strong>LC (Labor Costing)</strong> module. Any WBS assignments in LC will automatically burden the funding type defined in this profile.
                                </p>
                             </div>
                        </div>
                    )}

                    {activeTab === 'Compliance' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-2">
                             <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-8 flex items-center gap-3"><Shield size={20} className="text-rose-700"/> Statutory Readiness Check</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { l: 'Cyber Awareness', s: formData.trainingStatus.cyber },
                                        { l: 'Ethics Protocol', s: formData.trainingStatus.ethics },
                                        { l: 'G-8 Fiscal Law', s: formData.trainingStatus.fiscalLaw }
                                    ].map(tr => (
                                        <div key={tr.l} className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-rose-200 transition-all">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{tr.l}</p>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] font-bold uppercase ${tr.s === 'Current' ? 'text-emerald-600' : 'text-rose-600'}`}>{tr.s}</span>
                                                {tr.s === 'Current' ? <CheckCircle2 size={18} className="text-emerald-500"/> : <X size={18} className="text-rose-500 animate-pulse"/>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                             <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex gap-4 text-rose-900">
                                <Shield size={24} className="shrink-0 mt-1"/>
                                <div>
                                    <h5 className="font-bold text-sm">Action Required: Training Breach</h5>
                                    <p className="text-xs mt-1 leading-relaxed font-medium">Personnel access to GFEBS/CEFMS modules will be automatically restricted if mandatory training exceeds 30-day overdue threshold.</p>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-10 border-t border-zinc-100">
                    <button onClick={onClose} className="px-8 py-3 border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-50">Discard</button>
                    <button onClick={() => onSave(formData)} className="px-12 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-2xl active:scale-95 transition-all">Save Strength Updates</button>
                </div>
            </div>
        </Modal>
    );
};

export default PersonnelRoster;
