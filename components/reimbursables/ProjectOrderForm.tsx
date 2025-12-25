
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertTriangle, Info, CheckSquare, Square, Gavel } from 'lucide-react';
import Modal from '../shared/Modal';
import { ProjectOrder, ProjectOrderStatus, RuleEvaluationResult } from '../../types';
import { evaluateRules } from '../../utils/rulesEngine';
import { MOCK_BUSINESS_RULES } from '../../constants';

interface Props {
    onClose: () => void;
    onSubmit: (order: ProjectOrder) => void;
}

const ProjectOrderForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    // Basic Info
    const [orderNumber, setOrderNumber] = useState('');
    const [description, setDescription] = useState('');
    const [providerId, setProviderId] = useState('');
    const [requestingAgency, setRequestingAgency] = useState('');
    const [appropriation, setAppropriation] = useState('');
    const [totalAmount, setTotalAmount] = useState<number | ''>('');
    const [pricingMethod, setPricingMethod] = useState<'Fixed Price' | 'Cost Reimbursement'>('Fixed Price');
    
    // Dates
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [completionDate, setCompletionDate] = useState('');

    // Compliance Flags (FMR Ch 2)
    const [isSeverable, setIsSeverable] = useState(false);
    const [percentInHouse, setPercentInHouse] = useState<number>(100);
    const [isSpecificDefiniteCertain, setIsSpecificDefiniteCertain] = useState(false);
    const [isDoDOwned, setIsDoDOwned] = useState(true);
    const [isSameCommander, setIsSameCommander] = useState(false);
    
    // Rule Engine State
    const [ruleResults, setRuleResults] = useState<RuleEvaluationResult[]>([]);
    const [blockingErrors, setBlockingErrors] = useState<number>(0);

    // Real-time Rule Evaluation
    useEffect(() => {
        // Construct a temporary object representing the form state
        const formState = {
            isSeverable,
            percentInHouse,
            isSpecificDefiniteCertain,
            isDoDOwned,
            isSameCommander,
            // Add other fields if rules exist for them
        };

        // Filter for Reimbursables domain rules
        const relevantRules = MOCK_BUSINESS_RULES.filter(r => r.domain === 'Reimbursables' && r.isActive);
        const results = evaluateRules(relevantRules, formState);
        
        setRuleResults(results);
        setBlockingErrors(results.filter(r => !r.passed && r.severity === 'Critical').length);
    }, [isSeverable, percentInHouse, isSpecificDefiniteCertain, isDoDOwned, isSameCommander]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!orderNumber || !description || !providerId || !totalAmount) {
            alert("All mandatory fields must be filled.");
            return;
        }

        if (blockingErrors > 0) {
            return; // Prevent submission if critical rules fail
        }

        const newOrder: ProjectOrder = {
            id: `PO-${Math.floor(Math.random() * 10000)}`,
            orderNumber,
            description,
            providerId,
            requestingAgency,
            appropriation,
            totalAmount: Number(totalAmount),
            obligatedAmount: 0, // Starts at 0 until Accepted
            pricingMethod,
            issueDate,
            completionDate,
            isSeverable,
            percentInHouse,
            isSpecificDefiniteCertain,
            bonaFideNeedYear: new Date().getFullYear(),
            isDoDOwned,
            isSameCommander,
            status: 'Draft (Advance Planning)', // Default Start Status
            documents: {}
        };
        onSubmit(newOrder);
    };

    return (
        <Modal title="Create Project Order (41 U.S.C. 6307)" onClose={onClose} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section 1: Order Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Order Number (FS 7600B)</label>
                        <input type="text" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm" placeholder="N00024-24-F-..." />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Requesting Agency</label>
                        <input type="text" value={requestingAgency} onChange={e => setRequestingAgency(e.target.value)} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm" />
                    </div>
                    <div className="col-span-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Work Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm" rows={2} placeholder="Must be specific, definite, and certain..." />
                    </div>
                </div>

                {/* Section 2: Provider & Financials */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Provider Activity</label>
                        <input type="text" value={providerId} onChange={e => setProviderId(e.target.value)} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm" placeholder="e.g. Tobyhanna Army Depot" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Amount ($)</label>
                        <input type="number" value={totalAmount} onChange={e => setTotalAmount(Number(e.target.value))} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Funding Appropriation</label>
                        <input type="text" value={appropriation} onChange={e => setAppropriation(e.target.value)} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm" placeholder="e.g. 97 1109" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pricing Method</label>
                        <select value={pricingMethod} onChange={e => setPricingMethod(e.target.value as any)} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm bg-white">
                            <option>Fixed Price</option>
                            <option>Cost Reimbursement</option>
                        </select>
                    </div>
                </div>

                {/* Section 3: Compliance Checklist (FMR Vol 11A Ch 2) */}
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-600"/> Determination of Status
                    </h4>
                    
                    <div className="space-y-3">
                        {/* Check 1 */}
                        <div className="flex items-start gap-3">
                            <input 
                                type="checkbox" 
                                checked={isDoDOwned} 
                                onChange={e => setIsDoDOwned(e.target.checked)} 
                                className="mt-1"
                            />
                            <div>
                                <p className="text-xs font-bold text-zinc-800">Is the provider a DoD-owned establishment?</p>
                                <p className="text-[10px] text-zinc-500">Includes WCF activities, labs, and depots.</p>
                            </div>
                        </div>

                        {/* Check 2 */}
                        <div className="flex items-start gap-3">
                            <input 
                                type="checkbox" 
                                checked={isSpecificDefiniteCertain} 
                                onChange={e => setIsSpecificDefiniteCertain(e.target.checked)} 
                                className="mt-1"
                            />
                            <div>
                                <p className="text-xs font-bold text-zinc-800">Is the work Specific, Definite, and Certain?</p>
                                <p className="text-[10px] text-zinc-500">Analogous to commercial contracts.</p>
                            </div>
                        </div>

                        {/* Check 3: Severability - INVERTED Logic for UX (User confirms Non-Severable) */}
                        <div className="flex items-start gap-3">
                            <input 
                                type="checkbox" 
                                checked={!isSeverable} 
                                onChange={e => setIsSeverable(!e.target.checked)} 
                                className="mt-1"
                            />
                            <div>
                                <p className="text-xs font-bold text-zinc-800">Is the requirement Non-Severable ("Entire")?</p>
                                <p className="text-[10px] text-zinc-500">Single unified outcome required. If checked, valid for Project Order.</p>
                            </div>
                        </div>

                        {/* Check 4: Same Commander */}
                        <div className="flex items-start gap-3">
                            <input 
                                type="checkbox" 
                                checked={isSameCommander} 
                                onChange={e => setIsSameCommander(e.target.checked)} 
                                className="mt-1"
                            />
                            <div>
                                <p className="text-xs font-bold text-zinc-800">Are units under the same Commander?</p>
                                <p className="text-[10px] text-zinc-500">Project orders prohibited between components of same command.</p>
                            </div>
                        </div>

                        {/* Check 5: 51% Rule */}
                        <div>
                            <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                                <span>In-House Performance %</span>
                                <span className={percentInHouse < 51 ? "text-rose-600" : "text-emerald-600"}>{percentInHouse}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={percentInHouse} 
                                onChange={e => setPercentInHouse(Number(e.target.value))} 
                                className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-[10px] text-zinc-400 mt-1">Must be at least 51%.</p>
                        </div>
                    </div>
                </div>

                {/* Dynamic Rule Feedback */}
                {ruleResults.length > 0 && (
                    <div className="space-y-2">
                        {ruleResults.filter(r => !r.passed).map((res, idx) => (
                            <div key={idx} className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 animate-in fade-in">
                                <AlertTriangle size={14} className="text-rose-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-rose-700">{res.ruleName}</p>
                                    <p className="text-[10px] text-rose-600">{res.message}</p>
                                </div>
                            </div>
                        ))}
                        {blockingErrors === 0 && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 animate-in fade-in">
                                <CheckSquare size={14} className="text-emerald-600" />
                                <p className="text-xs font-bold text-emerald-700">All Project Order Criteria Met</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-zinc-200 rounded text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button 
                        type="submit" 
                        disabled={blockingErrors > 0}
                        className="px-4 py-2 bg-zinc-900 text-white rounded text-xs font-bold uppercase hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {blockingErrors > 0 && <Gavel size={14} />}
                        Initiate Order
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProjectOrderForm;
