
import React, { useMemo, useState } from 'react';
import { Landmark, MapPin, User, Phone, Mail, Grid, List } from 'lucide-react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';

export const RealEstateStatus = ({ project }: { project: USACEProject }) => {
    const [viewMode, setViewMode] = useState<'List' | 'Map'>('List');

    if (!project.realEstate) return null;

    const totalCredit = useMemo(() => project.realEstate!.reduce((sum, a) => sum + (a.lerrdCredit ? a.cost : 0), 0), [project.realEstate]);

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <Landmark size={14} className="text-zinc-400"/> LERRD Acquisition
                </h4>
                <div className="flex bg-zinc-100 p-0.5 rounded-lg">
                    <button 
                        onClick={() => setViewMode('List')} 
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'List' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        <List size={14}/>
                    </button>
                    <button 
                        onClick={() => setViewMode('Map')} 
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'Map' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        <Grid size={14}/>
                    </button>
                </div>
            </div>

            {viewMode === 'List' ? (
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100">
                                <th className="pb-2 text-[10px] font-bold text-zinc-400 uppercase">Tract</th>
                                <th className="pb-2 text-[10px] font-bold text-zinc-400 uppercase">Status</th>
                                <th className="pb-2 text-[10px] font-bold text-zinc-400 uppercase text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {project.realEstate.map(asset => (
                                <tr key={asset.tractNumber}>
                                    <td className="py-3">
                                        <p className="text-xs font-mono text-zinc-500">{asset.tractNumber}</p>
                                        <p className="text-[10px] text-zinc-900">{asset.owner}</p>
                                    </td>
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
            ) : (
                <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-lg p-4 grid grid-cols-2 gap-2 overflow-y-auto max-h-64">
                    {project.realEstate.map(asset => (
                        <div 
                            key={asset.tractNumber}
                            className={`p-2 rounded border text-center flex flex-col justify-center items-center h-20 ${
                                asset.status === 'Acquired' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 
                                asset.status === 'Condemnation' ? 'bg-rose-100 border-rose-200 text-rose-800' :
                                'bg-white border-zinc-200 text-zinc-600'
                            }`}
                        >
                            <span className="text-[10px] font-mono font-bold">{asset.tractNumber}</span>
                            <span className="text-[8px] uppercase mt-1 opacity-75">{asset.status}</span>
                        </div>
                    ))}
                    {/* Placeholder Grid Items to show map concept */}
                    <div className="p-2 rounded border border-dashed border-zinc-200 bg-zinc-100/50 flex items-center justify-center text-[10px] text-zinc-400">Unsurveyed</div>
                    <div className="p-2 rounded border border-dashed border-zinc-200 bg-zinc-100/50 flex items-center justify-center text-[10px] text-zinc-400">Unsurveyed</div>
                </div>
            )}

            <div className="mt-4 p-3 bg-zinc-50 rounded-lg flex justify-between items-center text-xs border border-zinc-100">
                <span className="text-zinc-500 font-medium">LERRD Credit (Sponsor)</span>
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
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-200">
                {project.costShare?.sponsorName.charAt(0)}
            </div>
            <div>
                <p className="text-sm font-bold text-zinc-900">{project.costShare?.sponsorName}</p>
                <p className="text-[10px] text-zinc-500 bg-zinc-50 px-1.5 py-0.5 rounded inline-block mt-0.5">Project Partnership Agreement (PPA)</p>
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
