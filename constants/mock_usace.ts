import { USACEProject, FADocument, WorkAllowance } from '../types';

export const MOCK_USACE_PROJECTS: USACEProject[] = [
    { 
        id: 'PROJ-001', 
        name: 'Ohio River Lock & Dam', 
        district: 'LRL', 
        p2Number: '123456', 
        programType: 'Civil Works', 
        appropriation: 'Construction', 
        financials: { 
            currentWorkingEstimate: 12000000, 
            obligated: 4500000, 
            programmed: 12500000, 
            disbursed: 4000000, 
            prc_committed: 500000, 
            contractRetainage: 0 
        }, 
        p2Linkage: true, 
        costShare: { 
            sponsorName: 'State of KY', 
            federalShare: 65, 
            nonFederalShare: 35, 
            totalContributed: 2000000, 
            balanceDue: 2200000 
        }, 
        cwisCode: '01234', 
        milestones: [{ description: 'Award Contract', code: 'AWD', scheduledDate: '2024-05-15', status: 'Pending' }], 
        risks: [], 
        contractMods: [], 
        realEstate: [{ tractNumber: '101', owner: 'Private', status: 'Acquired', cost: 250000, lerrdCredit: true }], 
        weatherDelayDays: 2 
    },
];

// Fix: Added missing MOCK_FADS
export const MOCK_FADS: FADocument[] = [
    { id: 'FAD-24-01', appropriationSymbol: '96X3122', programYear: 2024, publicLaw: 'PL 118-01', totalAuthority: 50000000, fundType: 'Direct', auditLog: [] }
];

// Fix: Added missing MOCK_WORK_ALLOWANCES
export const MOCK_WORK_ALLOWANCES: WorkAllowance[] = [
    { id: 'WA-LRL-24', fadId: 'FAD-24-01', districtEROC: 'LRL', p2ProgramCode: '123456', ppa: 'Navigation', congressionalLineItem: 'Line 1', ccsCode: 'CCS-1', amount: 5000000, obligatedAmount: 2500000, status: 'Active', auditLog: [] }
];
