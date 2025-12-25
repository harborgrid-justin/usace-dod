
import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

const ProjectOrderValidator: React.FC = () => {
    const [criteria, setCriteria] = useState({
        specificWork: false,
        nonSeverable: false,
        dodOwned: false,
        bonaFideNeed: false,
        capabilityExists: false
    });

    const isProjectOrder = Object.values(criteria).every(Boolean);

    const toggle = (key: keyof typeof criteria) => {
        setCriteria(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldCheck size={16}/> Authority Validator
            </h3>
            
            <div className="flex-1 space-y-4">
                <div 
                    onClick={() => toggle('specificWork')}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
                >
                    {criteria.specificWork ? <CheckSquare size={18} className="text-emerald-600 mt-0.5" /> : <Square size={18} className="text-zinc-300 mt-0.5" />}
                    <div>
                        <p className="text-xs font-bold text-zinc-800">Specific & Definite Work Scope</p>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">The order calls for the manufacture of specific materials or a specific service task.</p>
                    </div>
                </div>

                <div 
                    onClick={() => toggle('nonSeverable')}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
                >
                    {criteria.nonSeverable ? <CheckSquare size={18} className="text-emerald-600 mt-0.5" /> : <Square size={18} className="text-zinc-300 mt-0.5" />}
                    <div>
                        <p className="text-xs font-bold text-zinc-800">Non-Severable Requirement</p>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">The entire undertaking is necessary to receive the benefit (e.g., overhaul of an engine).</p>
                    </div>
                </div>

                <div 
                    onClick={() => toggle('dodOwned')}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
                >
                    {criteria.dodOwned ? <CheckSquare size={18} className="text-emerald-600 mt-0.5" /> : <Square size={18} className="text-zinc-300 mt-0.5" />}
                    <div>
                        <p className="text-xs font-bold text-zinc-800">DoD-Owned Establishment</p>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">The performing activity is a DoD government-owned and operated facility (e.g., Depot, Arsenal).</p>
                    </div>
                </div>

                <div 
                    onClick={() => toggle('bonaFideNeed')}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
                >
                    {criteria.bonaFideNeed ? <CheckSquare size={18} className="text-emerald-600 mt-0.5" /> : <Square size={18} className="text-zinc-300 mt-0.5" />}
                    <div>
                        <p className="text-xs font-bold text-zinc-800">Bona Fide Need of Current FY</p>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">The requirement exists in the fiscal year the order is issued.</p>
                    </div>
                </div>
            </div>

            <div className={`mt-6 p-4 rounded-xl border ${isProjectOrder ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-zinc-500">Determination</p>
                <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${isProjectOrder ? 'text-emerald-700' : 'text-blue-700'}`}>
                        {isProjectOrder ? 'Project Order' : 'Economy Act Order'}
                    </span>
                    <ArrowRight size={16} className={isProjectOrder ? 'text-emerald-400' : 'text-blue-400'} />
                </div>
                <p className="text-xs mt-2 font-medium opacity-80">
                    {isProjectOrder 
                        ? 'Authority: 41 U.S.C. 6307. Funds do not expire at FY end if obligated by performer.'
                        : 'Authority: 31 U.S.C. 1535. Funds are subject to de-obligation if not performed by FY end.'}
                </p>
            </div>
        </div>
    );
};

export default ProjectOrderValidator;
