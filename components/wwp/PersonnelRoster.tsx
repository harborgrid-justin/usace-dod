
import React, { useState } from 'react';
import { User, Search, Plus, MapPin, Award, Edit, Shield, FileText, X, CheckCircle2 } from 'lucide-react';
import Modal from '../shared/Modal';

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
}

const MOCK_EMPLOYEES: Employee[] = [
    { id: 'E-1001', name: 'Smith, John', grade: 'GS-12', series: '0810 - Civil Engineer', org: 'LRL-ED-D', location: 'Louisville District', status: 'Active', clearance: 'Secret', positionNum: 'TDA-009912', fundingType: 'Direct' },
    { id: 'E-1002', name: 'Doe, Jane', grade: 'GS-11', series: '0501 - Financial Mgmt', org: 'LRL-RM', location: 'Louisville District', status: 'Active', clearance: 'Secret', positionNum: 'TDA-008821', fundingType: 'Direct' },
    { id: 'E-1003', name: 'Johnson, Mike', grade: 'GS-13', series: '0810 - Civil Engineer', org: 'LRL-ED-C', location: 'Olmsted Project Office', status: 'Detail', clearance: 'TS/SCI', positionNum: 'TDA-005541', fundingType: 'Reimbursable' },
];

const PersonnelRoster: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const filtered = employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSave = (updated: Employee) => {
        setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
        setSelectedEmployee(null);
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Personnel Roster (HR)</h3>
                    <p className="text-xs text-zinc-500">Manage TDA/MTOE Positions</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search personnel..." 
                            className="pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs w-full sm:w-64 focus:outline-none focus:border-zinc-400"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors">
                        <Plus size={12}/> Add Personnel
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-zinc-100 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Employee</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">TDA Mapping</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Security</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filtered.map(emp => (
                            <tr key={emp.id} className="hover:bg-zinc-50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 text-xs font-bold uppercase">
                                            {emp.name.split(',')[1].trim().charAt(0)}{emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900">{emp.name}</p>
                                            <p className="text-[10px] font-mono text-zinc-400">{emp.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-zinc-700 flex items-center gap-1"><FileText size={12} className="text-zinc-400"/> {emp.positionNum}</span>
                                        <span className="text-[10px] text-zinc-500">{emp.series} • {emp.grade}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Shield size={12} className={emp.clearance === 'TS/SCI' ? 'text-indigo-600' : 'text-zinc-400'} />
                                        <span className="text-xs font-medium text-zinc-600">{emp.clearance}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                        emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        emp.status === 'Detail' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        'bg-zinc-100 text-zinc-600 border-zinc-200'
                                    }`}>{emp.status}</span>
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => setSelectedEmployee(emp)}
                                        className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-all"
                                    >
                                        <Edit size={14}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedEmployee && (
                <EmployeeEditModal 
                    employee={selectedEmployee} 
                    onClose={() => setSelectedEmployee(null)} 
                    onSave={handleSave} 
                />
            )}
        </div>
    );
};

const EmployeeEditModal: React.FC<{ employee: Employee, onClose: () => void, onSave: (e: Employee) => void }> = ({ employee, onClose, onSave }) => {
    const [formData, setFormData] = useState(employee);

    return (
        <Modal title="Employee Profile" subtitle={`Service Record: ${employee.id}`} onClose={onClose} maxWidth="max-w-lg">
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name (Last, First)</label>
                        <input 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Grade</label>
                        <select 
                            value={formData.grade} 
                            onChange={e => setFormData({...formData, grade: e.target.value})}
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm bg-white"
                        >
                            <option>GS-11</option><option>GS-12</option><option>GS-13</option><option>GS-14</option><option>GS-15</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Position Type</label>
                        <select 
                            value={formData.fundingType} 
                            onChange={e => setFormData({...formData, fundingType: e.target.value as any})}
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm bg-white"
                        >
                            <option>Direct</option>
                            <option>Reimbursable</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TDA Position Num</label>
                        <input 
                            value={formData.positionNum} 
                            onChange={e => setFormData({...formData, positionNum: e.target.value})}
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Security Clearance</label>
                        <select 
                            value={formData.clearance} 
                            onChange={e => setFormData({...formData, clearance: e.target.value as any})}
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm bg-white"
                        >
                            <option>Public Trust</option><option>Secret</option><option>TS/SCI</option>
                        </select>
                    </div>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3">
                    <h4 className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <Shield size={14} className="text-zinc-400" /> Compliance Status
                    </h4>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-600">Cyber Security Training</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Current</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-600">Financial Disclosure (OGE 450)</span>
                        <span className="text-amber-600 font-bold flex items-center gap-1"><X size={12}/> Overdue</span>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-xs font-bold uppercase hover:bg-zinc-50">Cancel</button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800">Save Changes</button>
                </div>
            </div>
        </Modal>
    );
};

export default PersonnelRoster;
