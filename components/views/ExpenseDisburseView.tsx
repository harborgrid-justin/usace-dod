
import React, { useState, useEffect } from 'react';
import { TrendingDown, LayoutDashboard, Workflow, BarChart3, Users } from 'lucide-react';
import { Obligation, Expense, Disbursement, ExpenseUserRole, GLTransaction } from '../../types';
import ExpenseDashboard from '../expense/ExpenseDashboard';
import ExpenseManager from '../expense/ExpenseManager';
import ExpenseReports from '../expense/ExpenseReports';
import UserRoleSwitcher from '../expense/UserRoleSwitcher';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { expenseDisburseService } from '../../services/ExpenseDisburseDataService';
import { obligationsService } from '../../services/ObligationsDataService';
import { glService } from '../../services/GLDataService';

const ExpenseDisburseView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'workflow' | 'reports'>('workflow');
    const [activeUser, setActiveUser] = useState<ExpenseUserRole>('Clerk');
    
    // State Management for the entire module from services
    const [obligations, setObligations] = useState<Obligation[]>(obligationsService.getObligations());
    const [expenses, setExpenses] = useState<Expense[]>(expenseDisburseService.getExpenses());
    const [disbursements, setDisbursements] = useState<Disbursement[]>(expenseDisburseService.getDisbursements());

    useEffect(() => {
        const unsubObl = obligationsService.subscribe(() => setObligations([...obligationsService.getObligations()]));
        const unsubExp = expenseDisburseService.subscribe(() => {
            setExpenses([...expenseDisburseService.getExpenses()]);
            setDisbursements([...expenseDisburseService.getDisbursements()]);
        });
        return () => {
            unsubObl();
            unsubExp();
        };
    }, []);


    // --- Business Logic Handlers ---

    const handleCreateExpense = (newExpenseData: Omit<Expense, 'id' | 'status' | 'createdBy' | 'auditLog'>) => {
        const newExpense: Expense = {
            ...newExpenseData,
            id: `EXP-${Date.now().toString().slice(-5)}`,
            status: 'Pending Approval',
            createdBy: 'Clerk',
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'Clerk',
                action: 'Expense Created',
                details: `Created expense for ${newExpenseData.description}`
            }]
        };
        expenseDisburseService.addExpense(newExpense);
    };

    const handleApproveExpense = (expenseId: string) => {
        const exp = expenses.find(e => e.id === expenseId);
        if (!exp) return;

        // Update expense status and audit log
        const updatedExpense: Expense = {
            ...exp,
            status: 'Accrued',
            approvedBy: 'Approver',
            auditLog: [...exp.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'Approver',
                action: 'Expense Approved',
                details: 'Approved for payment. Accrual entry posted.'
            }]
        };
        expenseDisburseService.updateExpense(updatedExpense);
        
        // Liquidate obligation
        const obl = obligationsService.getObligations().find(o => o.id === exp.obligationId);
        if (obl) {
            obligationsService.updateObligation({ ...obl, unliquidatedAmount: obl.unliquidatedAmount - exp.amount });
        }

        // Integration #4: Create GL Transaction for Accrual via Orchestrator
        const newGlTx = IntegrationOrchestrator.generateAccrualFromExpense(updatedExpense);
        glService.addTransaction(newGlTx);
        console.log("Integration: Generated Accrual", newGlTx);
    };

    const handleDisburseExpense = (expenseId: string) => {
        const exp = expenses.find(e => e.id === expenseId);
        if (!exp) return;

        const newDisbursementId = `DISB-${Date.now().toString().slice(-5)}`;
        
        // Create Disbursement Record
        const newDisbursement: Disbursement = {
            id: newDisbursementId,
            expenseId: exp.id,
            amount: exp.amount,
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'EFT',
            treasuryConfirmationId: `T${new Date().getFullYear()}${Date.now().toString().slice(-8)}`
        };
        expenseDisburseService.addDisbursement(newDisbursement);

        // Update expense status
        const updatedExpense: Expense = {
            ...exp,
            status: 'Paid',
            disbursedBy: 'Disbursing Officer',
            disbursementId: newDisbursementId,
            auditLog: [...exp.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'Disbursing Officer',
                action: 'Disbursed',
                details: `Payment sent via EFT. Treasury ID: ${newDisbursement.treasuryConfirmationId}`
            }]
        };
        expenseDisburseService.updateExpense(updatedExpense);
        
        // Update obligation
        const obl = obligationsService.getObligations().find(o => o.id === exp.obligationId);
        if (obl) {
            obligationsService.updateObligation({ ...obl, disbursedAmount: obl.disbursedAmount + exp.amount });
        }

        // Integration #5: Create GL Transaction for Disbursement via Orchestrator
        const newGlTx = IntegrationOrchestrator.generateDisbursementFromExpense(updatedExpense, newDisbursementId);
        glService.addTransaction(newGlTx);
        console.log("Integration: Generated Outlay", newGlTx);
    };
    
    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard':
                return <ExpenseDashboard obligations={obligations} expenses={expenses} />;
            case 'workflow':
                return <ExpenseManager 
                            activeUser={activeUser}
                            obligations={obligations}
                            expenses={expenses}
                            onNewExpense={handleCreateExpense}
                            onApprove={handleApproveExpense}
                            onDisburse={handleDisburseExpense}
                        />;
            case 'reports':
                return <ExpenseReports expenses={expenses} disbursements={disbursements} />;
            default:
                return null;
        }
    }

    const TABS = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'workflow', label: 'Expense Workflow', icon: Workflow },
        { id: 'reports', label: 'Reporting', icon: BarChart3 }
    ];

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col overflow-hidden">
             <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0 px-2">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <TrendingDown size={28} className="text-zinc-800" /> Expense & Disburse (2101)
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                        Accrual-to-Disbursement Lifecycle Management
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                     <UserRoleSwitcher activeUser={activeUser} setActiveUser={setActiveUser} />
                     <div className="flex bg-zinc-100 p-1 rounded-md shadow-inner">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                    activeTab === tab.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
                                }`}
                            >
                                <tab.icon size={12} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

export default ExpenseDisburseView;
