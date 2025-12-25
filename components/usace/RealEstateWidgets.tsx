
import React, { useMemo } from 'react';
import { Landmark, MapPin, User, Phone, Mail } from 'lucide-react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';

export const RealEstateStatus = ({ project }: { project: USACEProject }) => {
    if (!project.realEstate) return null;

    // Opportunity 14: Memoized calculation
    const totalCredit = useMemo(() => project.realEstate!.reduce((sum, a) => sum + (a.lerrdCredit ? a.cost : 0), 0), [project.realEstate]);

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Landmark size={14} className="text-zinc-400"/> LERRD Acquisition Status
            </h4>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-zinc-100">
                            <th className="pb-2 text-[10px] font-bold text-zinc-400 uppercase">Tract</th>
                            <th className="pb-2 text-[10px] font-bold text-zinc-400 uppercase">Owner</th>
                            <th className="pb-2 text-[10px] font-bold text-zinc-400 uppercase">Status</th>
                            <th className="pb-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Cost</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {project.realEstate.map(asset => (
                            <tr key={asset.tractNumber}>
                                <td className="py-3 text-xs font-mono text-zinc-500">{asset.tractNumber}</td>
                                <td className="py-3 text-xs font-medium text-zinc-800">{asset.owner}</td>
                                <td className="py-3">
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                                        asset.status === 'Acquired' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        asset.status === 'Condemnation' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>{asset.status}</span>
                                </td>
                                <td className="py-3 text-xs font-mono text-right">{formatCurrency(asset.cost)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 p-3 bg-zinc-50 rounded-lg flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-medium">Total LERRD Credit</span>
                <span className="font-mono font-bold text-zinc-900">{formatCurrency(totalCredit)}</span>
            </div>
        </div>
    );
};

export const LocalSponsorCard = ({ project }: { project: USACEProject }) => (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-fit">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User size={14} className="text-zinc-400"/> Non-Federal Sponsor
        </h4>
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                {project.costShare?.sponsorName.charAt(0)}
            </div>
            <div>
                <p className="text-sm font-bold text-zinc-900">{project.costShare?.sponsorName}</p>
                <p className="text-[10px] text-zinc-500">Project Partnership Agreement (PPA) Active</p>
            </div>
        </div>
        <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-zinc-600">
                <User size={14} className="text-zinc-400"/>
                <span>POC: Jane Doe, Chief Engineer</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-600">
                <Phone size={14} className="text-zinc-400"/>
                <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-600">
                <Mail size={14} className="text-zinc-400"/>
                <span>jdoe@sponsor.gov</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-600">
                <MapPin size={14} className="text-zinc-400"/>
                <span>100 Main St, Capital City</span>
            </div>
        </div>
        <div className="mt-6 pt-4 border-t border-zinc-100">
            <button className="w-full py-2 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg text-[10px] font-bold uppercase tracking-wide text-zinc-600 transition-colors">
                View Correspondence
            </button>
        </div>
    </div>
);
