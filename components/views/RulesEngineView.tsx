
import React, { useState } from 'react';
import { 
    Cpu, Plus, Search, Play, AlertTriangle, CheckCircle, 
    ShieldAlert, FileCode, RotateCcw, GitBranch, ArrowRightLeft, ShieldCheck, BookOpen
} from 'lucide-react';
import { MOCK_BUSINESS_RULES, MOCK_DIGITAL_THREADS, MOCK_PROJECT_ORDERS, MOCK_TRANSFERS } from '../../constants';
import { BusinessRule, RuleEvaluationResult, DigitalThread, ProjectOrder } from '../../types';
import { evaluateRules } from '../../utils/rulesEngine';
import DecisionEngine from '../rules/DecisionEngine';
import TransferDecisionEngine from '../rules/TransferDecisionEngine';

const RulesEngineView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'simulator' | 'decision'>('decision');
    const [activeDecisionEngine, setActiveDecisionEngine] = useState<'projectOrder' | 'transfer'>('projectOrder');
    const [rules, setRules] = useState<BusinessRule[]>(MOCK_BUSINESS_RULES);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedObject, setSelectedObject] = useState<any | null>(null);
    const [simulationResults, setSimulationResults] = useState<RuleEvaluationResult[]>([]);

    // Combine Data Sources for Simulation
    const combinedData = [
        ...MOCK_DIGITAL_THREADS.map(t => ({ ...t, _type: 'Transaction', _label: `${t.id} - ${t.vendorName}` })),
        ...MOCK_PROJECT_ORDERS.map(p => ({ ...p, _type: 'Project Order', _label: `${p.orderNumber} (${p.status})` })),
        ...MOCK_TRANSFERS.map(t => ({ ...t, _type: 'Transfer', _label: `${t.id} (${t.authorityType})` }))
    ];

    const handleRunSimulation = () => {
        if (!selectedObject) return;
        const results = evaluateRules(rules, selectedObject);
        setSimulationResults(results);
    };

    const filteredRules = rules.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Cpu size={24} className="text-zinc-400" /> Business Rules Engine
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Automated Policy Enforcement & Decision Support</p>
                </div>
                <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
                    <div className="flex bg-zinc-100 p-1 rounded-lg min-w-max">
                        <button 
                            onClick={() => setActiveTab('decision')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'decision' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            <GitBranch size={14} /> Decision Expert
                        </button>
                        <button 
                            onClick={() => setActiveTab('simulator')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'simulator' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            <Play size={14} /> Policy Simulator
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                
                {/* Left Panel: Rule Library (Always Visible) */}
                <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Active Policy Logic</h3>
                        <button className="p-1.5 bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors">
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="p-4 border-b border-zinc-100">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                            <input 
                                type="text" 
                                placeholder="Search rules (e.g., ADA, FMR)..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {filteredRules.map(rule => (
                            <div key={rule.id} className="p-3 border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${rule.isActive ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                                        <span className="text-xs font-bold text-zinc-900">{rule.code}</span>
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                                        rule.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                        rule.severity === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>{rule.severity}</span>
                                </div>
                                <p className="text-sm font-medium text-zinc-800 mb-1">{rule.name}</p>
                                <p className="text-[10px] text-zinc-500 line-clamp-2 mb-2">{rule.description}</p>
                                <div className="p-2 bg-zinc-100 rounded border border-zinc-200 font-mono text-[10px] text-zinc-600 truncate mb-2">
                                    {rule.logicString}
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
                                    <span className="text-[9px] font-medium text-zinc-400">{rule.linkedFmrVolumeId || 'FMR'}</span>
                                    {/* Visual link only, as navigation state is managed by parent */}
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600 cursor-pointer hover:underline">
                                        <BookOpen size={10} /> View Policy
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Content Area */}
                <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
                    
                    {activeTab === 'decision' ? (
                        <div className="flex flex-col h-full gap-4">
                            {/* Engine Switcher */}
                            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 sm:pb-0">
                                <button 
                                    onClick={() => setActiveDecisionEngine('projectOrder')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-all whitespace-nowrap ${
                                        activeDecisionEngine === 'projectOrder' 
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'
                                    }`}
                                >
                                    <ShieldCheck size={14} /> Project Order Validator
                                </button>
                                <button 
                                    onClick={() => setActiveDecisionEngine('transfer')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-all whitespace-nowrap ${
                                        activeDecisionEngine === 'transfer' 
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'
                                    }`}
                                >
                                    <ArrowRightLeft size={14} /> Transfer Authority Validator
                                </button>
                            </div>

                            {activeDecisionEngine === 'projectOrder' ? <DecisionEngine /> : <TransferDecisionEngine />}
                        </div>
                    ) : (
                        <>
                            {/* Simulator Control */}
                            <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 p-6 opacity-10"><Play size={64}/></div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <FileCode size={20} className="text-emerald-400"/> Compliance Simulator
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target Object</label>
                                        <select 
                                            className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                                            onChange={(e) => {
                                                // Find in combined data
                                                const obj = combinedData.find(d => (d.id === e.target.value) || (d as any).orderNumber === e.target.value);
                                                setSelectedObject(obj || null);
                                                setSimulationResults([]);
                                            }}
                                        >
                                            <option value="">Select an object to test...</option>
                                            <optgroup label="Transactions">
                                                {MOCK_DIGITAL_THREADS.map(t => <option key={t.id} value={t.id}>{t.id} - {t.vendorName}</option>)}
                                            </optgroup>
                                            <optgroup label="Project Orders">
                                                {MOCK_PROJECT_ORDERS.map(p => <option key={p.id} value={p.id}>{p.orderNumber} ({p.status})</option>)}
                                            </optgroup>
                                            <optgroup label="Transfers">
                                                {MOCK_TRANSFERS.map(t => <option key={t.id} value={t.id}>{t.id} ({t.authorityType})</option>)}
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button 
                                            onClick={handleRunSimulation}
                                            disabled={!selectedObject}
                                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Play size={14} fill="currentColor" /> Run Test
                                        </button>
                                    </div>
                                </div>

                                {selectedObject && (
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-[10px] font-mono text-zinc-300 grid grid-cols-2 gap-2">
                                        {Object.entries(selectedObject)
                                            .filter(([k]) => !['id', 'documents', 'children', 'distributions', '_type', '_label'].includes(k) && typeof selectedObject[k] !== 'object')
                                            .slice(0, 6)
                                            .map(([k, v]) => (
                                                <div key={k} className="truncate"><span className="text-zinc-500">{k}:</span> {String(v)}</div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Results Output */}
                            <div className="flex-1 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Evaluation Results</h3>
                                    {simulationResults.length > 0 && (
                                        <button onClick={() => setSimulationResults([])} className="text-zinc-400 hover:text-zinc-600"><RotateCcw size={14}/></button>
                                    )}
                                </div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                                    {simulationResults.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
                                            <ShieldAlert size={32} className="opacity-20"/>
                                            <p className="text-xs">Run a simulation to see results.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {simulationResults.map((res, idx) => (
                                                <div key={idx} className={`p-3 rounded-lg border flex items-start gap-3 ${res.passed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                                                    <div className="mt-0.5">
                                                        {res.passed ? <CheckCircle size={16} className="text-emerald-500"/> : <AlertTriangle size={16} className="text-rose-500"/>}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <p className={`text-xs font-bold ${res.passed ? 'text-emerald-900' : 'text-rose-900'}`}>{res.ruleName}</p>
                                                            <span className="text-[9px] font-mono text-zinc-400">{res.ruleId}</span>
                                                        </div>
                                                        <p className={`text-[11px] mt-1 ${res.passed ? 'text-emerald-700' : 'text-rose-700'}`}>{res.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default RulesEngineView;
