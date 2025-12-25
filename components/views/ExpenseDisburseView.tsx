
import React, { useState } from 'react';
import { TrendingDown, LayoutDashboard, Workflow, BarChart3, Users } from 'lucide-react';
import { MOCK_OBLIGATIONS, MOCK_EXPENSES, MOCK_DISBURSEMENTS, MOCK_GL_TRANSACTIONS } from '../../constants';
import { Obligation, Expense, Disbursement, ExpenseUserRole, GLTransaction } from '../../types';
import ExpenseDashboard from '../expense/ExpenseDashboard';
import ExpenseManager from '../expense/ExpenseManager';
import ExpenseReports from '../expense/ExpenseReports';
import UserRoleSwitcher from '../expense/UserRoleSwitcher';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';

const ExpenseDisburseView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'workflow' | 'reports'>('workflow');
    const [activeUser, setActiveUser] = useState<ExpenseUserRole>('Clerk');
    
    // State Management for the entire module
    const [obligations, setObligations] = useState<Obligation[]>(MOCK_OBLIGATIONS);
    const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
    const [disbursements, setDisbursements] = useState<Disbursement[]>(MOCK_DISBURSEMENTS);
    const [glTransactions, setGlTransactions] = useState<GLTransaction[]>(MOCK_GL_TRANSACTIONS);

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
        setExpenses(prev => [newExpense, ...prev]);
    };

    const handleApproveExpense = (expenseId: string) => {
        setExpenses(prev => prev.map(exp => {
            if (exp.id === expenseId) {
                // Update expense status and audit log
                const updatedExpense = {
                    ...exp,
                    status: 'Accrued' as 'Accrued',
                    approvedBy: 'Approver' as 'Approver',
                    auditLog: [...exp.auditLog, {
                        timestamp: new Date().toISOString(),
                        user: 'Approver' as 'Approver',
                        action: 'Expense Approved',
                        details: 'Approved for payment. Accrual entry posted.'
                    }]
                };

                // Liquidate obligation
                setObligations(obls => obls.map(obl => {
                    if (obl.id === exp.obligationId) {
                        return { ...obl, unliquidatedAmount: obl.unliquidatedAmount - exp.amount };
                    }
                    return obl;
                }));

                // Integration #4: Create GL Transaction for Accrual via Orchestrator
                const newGlTx = IntegrationOrchestrator.generateAccrualFromExpense(updatedExpense);
                setGlTransactions(gls => [newGlTx, ...gls]);
                console.log("Integration: Generated Accrual", newGlTx);

                return updatedExpense;
            }
            return exp;
        }));
    };

    const handleDisburseExpense = (expenseId: string) => {
        setExpenses(prev => prev.map(exp => {
            if (exp.id === expenseId) {
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
                setDisbursements(d => [newDisbursement, ...d]);

                // Update expense status and audit log
                const updatedExpense = {
                    ...exp,
                    status: 'Paid' as 'Paid',
                    disbursedBy: 'Disbursing Officer' as 'Disbursing Officer',
                    disbursementId: newDisbursementId,
                    auditLog: [...exp.auditLog, {
                        timestamp: new Date().toISOString(),
                        user: 'Disbursing Officer' as 'Disbursing Officer',
                        action: 'Disbursed',
                        details: `Payment sent via EFT. Treasury ID: ${newDisbursement.treasuryConfirmationId}`
                    }]
                };

                // Update obligation
                setObligations(obls => obls.map(obl => {
                    if (obl.id === exp.obligationId) {
                        return { ...obl, disbursedAmount: obl.disbursedAmount + exp.amount };
                    }
                    return obl;
                }));

                // Integration #5: Create GL Transaction for Disbursement via Orchestrator
                const newGlTx = IntegrationOrchestrator.generateDisbursementFromExpense(updatedExpense, newDisbursementId);
                setGlTransactions(gls => [newGlTx, ...gls]);
                console.log("Integration: Generated Outlay", newGlTx);
                
                return updatedExpense;
            }
            return exp;
        }));
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
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-full mx-auto h-full flex flex-col">
             <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <TrendingDown size={24} className="text-rose-700" /> Expense & Disburse (2101)
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Accrual-to-Disbursement Lifecycle Management</p>
                </div>
                
                <div className="flex items-center gap-4">
                     <UserRoleSwitcher activeUser={activeUser} setActiveUser={setActiveUser} />
                     <div className="flex bg-zinc-100 p-1 rounded-lg">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                    activeTab === tab.id ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                            >
                                <tab.icon size={12} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {renderContent()}
            </div>
        </div>
    );
};

export default ExpenseDisburseView;
