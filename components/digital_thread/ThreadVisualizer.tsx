
import React from 'react';
import { Target, Briefcase, Zap, Truck, ShieldAlert, Scale, Banknote, Users, Hash, Landmark, FileText, User, Fingerprint, FileKey, ArrowRightLeft, Lock, Activity, Timer, Box, Binary, ShieldHalf, TrendingUp, CheckCircle2, Factory, AlertOctagon, FileWarning, Database, BookOpen, GitMerge, AlertTriangle } from 'lucide-react';
import { DigitalThread, NavigationTab, RuleEvaluationResult } from '../../types';
import EntityNode from '../shared/EntityNode';
import OrbitSector from '../shared/OrbitSector';

interface Props {
  thread: DigitalThread;
  ruleResults: RuleEvaluationResult[];
  setActiveTab: (tab: NavigationTab) => void;
}

const ThreadVisualizer: React.FC<Props> = ({ thread, ruleResults, setActiveTab }) => {
  return (
    <div className="min-w-[1500px] h-full grid grid-cols-6 relative bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'linear-gradient(#f4f4f5 1px, transparent 1px)', backgroundSize: '100% 40px' }} />
        
        <OrbitSector title="1. Planning" icon={Target} colorClass="text-zinc-600" bgClass="bg-zinc-100">
            <EntityNode label="Appropriation" value={thread.appropriation} icon={Banknote} fieldKey="approp" highlight onClick={() => setActiveTab(NavigationTab.APPROPRIATIONS)} />
            <EntityNode label="Unit" value={thread.unit} icon={Users} fieldKey="unit" onClick={() => setActiveTab(NavigationTab.APPROPRIATIONS)} />
            <EntityNode label="Program Element" value={thread.programElement} icon={Hash} fieldKey="pe" />
            <EntityNode label="Cost Center" value={thread.costCenter} icon={Landmark} fieldKey="cc" />
            <EntityNode label="FAD Number" value={thread.fadNumber} icon={FileText} fieldKey="fad" />
        </OrbitSector>
        
        <OrbitSector title="2. Sourcing" icon={Briefcase} colorClass="text-zinc-600" bgClass="bg-zinc-100">
            <EntityNode label="Vendor Name" value={thread.vendorName} icon={User} fieldKey="vendor" onClick={() => setActiveTab(NavigationTab.ERP_CORE)} />
            <EntityNode label="UEI" value={thread.vendorUEI} icon={Fingerprint} fieldKey="uei" />
            <EntityNode label="Contract Vehicle" value={thread.contractVehicle} icon={FileKey} fieldKey="vehicle" />
            <EntityNode label="MIPR Ref" value={thread.miprReference} icon={ArrowRightLeft} fieldKey="mipr" />
            <EntityNode label="Socio-Econ" value={thread.socioEconomicStatus} icon={Users} fieldKey="socio" />
        </OrbitSector>

        <OrbitSector title="3. Execution" icon={Zap} colorClass="text-zinc-600" bgClass="bg-zinc-100">
            <EntityNode label="Obligation" value={`$${(thread.obligationAmt/1e6).toFixed(2)}M`} icon={Lock} fieldKey="oblig" highlight onClick={() => setActiveTab(NavigationTab.ERP_CORE)} />
            <EntityNode label="Disbursement" value={`$${(thread.disbursementAmt/1e6).toFixed(2)}M`} icon={Banknote} fieldKey="disb" onClick={() => setActiveTab(NavigationTab.DISBURSEMENT)} />
            <EntityNode label="TAS Symbol" value={thread.tasSymbol} icon={Landmark} fieldKey="tas" onClick={() => setActiveTab(NavigationTab.FBWT_RECONCILIATION)} />
            <EntityNode label="EFT Status" value={thread.eftStatus} icon={Activity} fieldKey="eft" />
            <EntityNode label="ULO" value={`$${(thread.unliquidatedAmt/1e6).toFixed(2)}M`} icon={Timer} fieldKey="ulo" />
        </OrbitSector>

        <OrbitSector title="4. Logistics" icon={Truck} colorClass="text-zinc-600" bgClass="bg-zinc-100">
            <EntityNode label="Supply Class" value={thread.supplyClass} icon={Box} fieldKey="class" />
            <EntityNode label="NIIN" value={thread.niinNsn} icon={Hash} fieldKey="nsn" />
            <EntityNode label="Serial Num" value={thread.serialNumber} icon={Binary} fieldKey="serial" />
            <EntityNode label="UIC" value={thread.uicCode} icon={ShieldHalf} fieldKey="uic" />
            <EntityNode label="Readiness" value={thread.readinessImpact} icon={TrendingUp} fieldKey="ready" />
        </OrbitSector>

        <OrbitSector title="5. Compliance" icon={ShieldAlert} colorClass="text-zinc-600" bgClass="bg-zinc-100">
            <div className="space-y-2 mb-2">
                {ruleResults.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-rose-50 border border-rose-100 rounded text-[10px] animate-in fade-in">
                        <AlertTriangle size={12} className="text-rose-600 shrink-0 mt-0.5" />
                        <div><p className="font-bold text-rose-700">{r.ruleName}</p><p className="text-rose-600">{r.severity} Violation</p></div>
                    </div>
                ))}
                {ruleResults.length === 0 && <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-100 rounded text-[10px]"><CheckCircle2 size={12} className="text-emerald-600" /><span className="font-bold text-emerald-700">No Active Violations</span></div>}
            </div>
            <EntityNode label="Bona Fide Need" value={thread.bonaFideValid} icon={CheckCircle2} fieldKey="bonafide" onClick={() => setActiveTab(NavigationTab.GOVERNANCE)} />
            <EntityNode label="Berry Compliant" value={thread.berryCompliant} icon={Factory} fieldKey="berry" isAlert={!thread.berryCompliant} onClick={() => setActiveTab(NavigationTab.GOVERNANCE)} />
            <EntityNode label="PPA Risk" value={thread.ppaInterestRisk} icon={AlertOctagon} fieldKey="ppa" isAlert={thread.ppaInterestRisk} onClick={() => setActiveTab(NavigationTab.DISBURSEMENT)} />
            <EntityNode label="CAP ID" value={thread.capId} icon={FileWarning} fieldKey="cap" isAlert={!!thread.auditFindingId} onClick={() => setActiveTab(NavigationTab.COMPLIANCE)}/>
        </OrbitSector>

        <OrbitSector title="6. Audit" icon={Scale} colorClass="text-zinc-600" bgClass="bg-zinc-100">
            <EntityNode label="USSGL 1010" value={thread.gl1010} icon={Database} fieldKey="1010" onClick={() => setActiveTab(NavigationTab.GAAP_AUDIT)} />
            <EntityNode label="GAAP Std" value={thread.gaapStandard} icon={BookOpen} fieldKey="gaap" onClick={() => setActiveTab(NavigationTab.GAAP_AUDIT)} />
            <EntityNode label="Audit Finding" value={thread.auditFindingId} icon={FileWarning} fieldKey="audit" isAlert={!!thread.auditFindingId} onClick={() => setActiveTab(NavigationTab.GAAP_AUDIT)} />
            <EntityNode label="Control Obj" value={thread.controlObjective} icon={Target} fieldKey="control"/>
            <EntityNode label="Blockchain Hash" value={thread.blockchainHash.substring(0,8)} icon={GitMerge} fieldKey="hash" />
        </OrbitSector>
    </div>
  );
};

export default ThreadVisualizer;
