
import React, { useState } from 'react';
import { ArrowLeft, Home, FileText, DollarSign, Scale, CheckCircle2, AlertTriangle, Building, Calculator } from 'lucide-react';
import { HAPCase, HAPCaseStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    hapCase: HAPCase;
    onBack: () => void;
    onUpdate: (updatedCase: HAPCase) => void;
}

const HAPCaseDetail: React.FC<Props> = ({ hapCase, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Valuation' | 'Benefit' | 'Documents'>('Overview');

    // Benefit Calculation Logic (Simplified 32 CFR Part 239)
    // Benefit = (Prior Fair Market Value * 95% or 90%) - Current Fair Market Value - Closing Costs (omitted for simplicity)
    // Or Mortgage Payoff aid.
    const priorFMV = hapCase.purchasePrice; // Using purchase price as proxy for Prior FMV for demo
    const currentFMV = hapCase.currentFairMarketValue || 0;
    const mortgage = hapCase.mortgageBalance;
    
    // Expanded Program Calculation (Private Sale)
    // Gov pays difference between 95% of Prior FMV and Sale Price (Current FMV)
    const expandedBenefit = Math.max(0, (priorFMV * 0.95) - currentFMV);
    
    const handleApprove = () => {
        onUpdate({ ...hapCase, status: 'Approved', benefitAmount: expandedBenefit });
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50">
            {/* Header */}
            <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col gap-4 sticky top-0 z-20">
                <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-colors w-fit">
                    <ArrowLeft size={14} /> Back to Cases
                </button>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-50 text-teal-700 rounded-xl border border-teal-100">
                            <Home size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900">{hapCase.applicantName}</h2>
                            <p className="text-xs text-zinc-500 font-mono">{hapCase.id} • {hapCase.programType}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-zinc-900 text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                            {hapCase.status}
                        </span>
                        <p className="text-xs text-zinc-500">Officer: {hapCase.assignedOfficer}</p>
                    </div>
                </div>
                
                <div className="flex gap-6 text-xs border-t border-zinc-100 pt-4 mt-2">
                    <div>
                        <span className="text-zinc-400 font-bold uppercase block mb-1">Property</span>
                        <span className="text-zinc-900 font-medium">{hapCase.propertyAddress}</span>
                    </div>
                    <div>
                        <span className="text-zinc-400 font-bold uppercase block mb-1">Applicant Type</span>
                        <span className="text-zinc-900 font-medium">{hapCase.applicantType}</span>
                    </div>
                    <div>
                        <span className="text-zinc-400 font-bold uppercase block mb-1">PCS Date</span>
                        <span className="text-zinc-900 font-medium">{hapCase.pcsOrderDate}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                
                {/* Workflow Stepper */}
                <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex justify-between items-center overflow-x-auto">
                    {['New', 'Valuation Review', 'Benefit Calculation', 'Approved', 'Paid'].map((step, i) => {
                        const statuses = ['New', 'Valuation Review', 'Benefit Calculation', 'Legal Review', 'Approved', 'Paid'];
                        const currentIdx = statuses.indexOf(hapCase.status);
                        const stepIdx = statuses.indexOf(step);
                        const isComplete = currentIdx > stepIdx;
                        const isCurrent = currentIdx === stepIdx;

                        return (
                            <div key={step} className="flex items-center gap-2 min-w-max px-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                    isComplete ? 'bg-teal-600 border-teal-600 text-white' :
                                    isCurrent ? 'bg-white border-teal-600 text-teal-700' :
                                    'bg-zinc-50 border-zinc-200 text-zinc-400'
                                }`}>
                                    {isComplete ? <CheckCircle2 size={16}/> : i + 1}
                                </div>
                                <span className={`text-xs font-bold uppercase ${isCurrent ? 'text-teal-700' : 'text-zinc-500'}`}>{step}</span>
                                {i < 4 && <div className="h-0.5 w-12 bg-zinc-200 ml-4 hidden md:block" />}
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Detail Card */}
                    <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="border-b border-zinc-100 flex">
                            <button onClick={() => setActiveTab('Overview')} className={`flex-1 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'Overview' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-zinc-500 hover:bg-zinc-50'}`}>Overview</button>
                            <button onClick={() => setActiveTab('Valuation')} className={`flex-1 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'Valuation' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-zinc-500 hover:bg-zinc-50'}`}>Valuation</button>
                            <button onClick={() => setActiveTab('Benefit')} className={`flex-1 py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'Benefit' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-zinc-500 hover:bg-zinc-50'}`}>Benefit Calc</button>
                        </div>
                        
                        <div className="p-6">
                            {activeTab === 'Overview' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Financial Snapshot</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Purchase Price</p>
                                                <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(hapCase.purchasePrice)}</p>
                                                <p className="text-[10px] text-zinc-400 mt-1">Date: {hapCase.purchaseDate}</p>
                                            </div>
                                            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Mortgage Balance</p>
                                                <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(hapCase.mortgageBalance)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl flex gap-3">
                                        <Scale size={18} className="text-blue-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h5 className="text-sm font-bold text-blue-900">Program Eligibility: {hapCase.programType}</h5>
                                            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                                                Based on PCS orders dated {hapCase.pcsOrderDate}, applicant qualifies for Expanded HAP due to housing market decline in the {hapCase.propertyAddress.split(',')[1]} area.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Valuation' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Appraisal Data</h4>
                                        <button className="text-xs text-teal-600 font-bold hover:underline">+ Add Appraisal</button>
                                    </div>
                                    <div className="border border-zinc-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                                <tr>
                                                    <th className="p-3 font-bold text-zinc-500">Type</th>
                                                    <th className="p-3 font-bold text-zinc-500">Date</th>
                                                    <th className="p-3 font-bold text-zinc-500">Appraiser</th>
                                                    <th className="p-3 font-bold text-zinc-500 text-right">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="p-3">Primary Appraisal</td>
                                                    <td className="p-3 text-zinc-500">2024-02-10</td>
                                                    <td className="p-3">USACE District</td>
                                                    <td className="p-3 text-right font-mono font-bold">{formatCurrency(currentFMV)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3">Review Appraisal</td>
                                                    <td className="p-3 text-zinc-500">2024-02-15</td>
                                                    <td className="p-3">Independent</td>
                                                    <td className="p-3 text-right font-mono font-bold">{formatCurrency(currentFMV + 2000)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-4 bg-zinc-100 rounded-lg text-center">
                                        <p className="text-xs text-zinc-500 mb-1">Established Prior Fair Market Value (PFMV)</p>
                                        <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(priorFMV)}</p>
                                        <p className="text-[10px] text-zinc-400">Based on purchase price (verified)</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Benefit' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-lg">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Calculator size={20} className="text-teal-400" />
                                            <h3 className="text-lg font-bold">Benefit Calculation</h3>
                                        </div>
                                        
                                        <div className="space-y-3 font-mono text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Prior FMV</span>
                                                <span>{formatCurrency(priorFMV)}</span>
                                            </div>
                                            <div className="flex justify-between text-teal-400">
                                                <span>x 95% (Expanded Rule)</span>
                                                <span>{formatCurrency(priorFMV * 0.95)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Less: Current FMV</span>
                                                <span className="text-rose-400">({formatCurrency(currentFMV)})</span>
                                            </div>
                                            <div className="border-t border-zinc-700 my-2 pt-2 flex justify-between font-bold text-lg">
                                                <span>Total Benefit</span>
                                                <span className="text-emerald-400">{formatCurrency(expandedBenefit)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {hapCase.status === 'Benefit Calculation' && (
                                        <div className="flex justify-end gap-3">
                                            <button className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold uppercase hover:bg-zinc-50">Reject</button>
                                            <button onClick={handleApprove} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-teal-700 shadow-lg shadow-teal-100 flex items-center gap-2">
                                                <CheckCircle2 size={14}/> Approve Benefit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText size={14} className="text-zinc-400"/> Case Files
                            </h4>
                            <ul className="space-y-3">
                                {['DD Form 1607 - Application', 'PCS Orders', 'Mortgage Statement', 'Deed'].map(doc => (
                                    <li key={doc} className="flex items-center gap-3 text-xs text-zinc-600 hover:text-teal-700 cursor-pointer transition-colors p-2 hover:bg-zinc-50 rounded">
                                        <FileText size={14} /> {doc}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full mt-4 py-2 border border-dashed border-zinc-300 rounded-lg text-xs font-bold text-zinc-400 hover:text-zinc-600 hover:border-zinc-400 transition-all">
                                Upload Document
                            </button>
                        </div>

                        {hapCase.benefitAmount && hapCase.benefitAmount > 0 && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <DollarSign size={14}/> Funds Reserved
                                </h4>
                                <p className="text-sm text-emerald-900 mb-4">Obligation recorded in HAP Fund (0517).</p>
                                <div className="h-1.5 w-full bg-emerald-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-600 w-full animate-pulse" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HAPCaseDetail;
