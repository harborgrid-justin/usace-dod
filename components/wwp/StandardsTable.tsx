import React from 'react';
import { Clock } from 'lucide-react';
import { LaborStandard } from '../../types';

const StandardsTable: React.FC<{ standards: LaborStandard[] }> = ({ standards }) => (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 font-bold text-sm uppercase"><Clock className="inline mr-2" size={16}/> Benchmarks</div>
        <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b"><tr><th className="p-4">Unit</th><th className="p-4">Category</th><th className="p-4 text-right">Hrs/Unit</th></tr></thead>
            <tbody className="divide-y divide-zinc-50">
                {standards.map((s, i) => (
                    <tr key={i} className="hover:bg-zinc-50">
                        <td className="p-4 font-semibold">{s.workloadUnit}</td>
                        <td className="p-4">{s.laborCategory}</td>
                        <td className="p-4 text-right font-mono font-bold">{s.hoursPerUnit}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
export default StandardsTable;