
import { USACEProject } from '../../types';

export class TraceabilityService {
    static getProjectTraceability(project: USACEProject) {
        return {
            funding: {
                fad: { id: 'FAD-CW-24-001', amount: 50000000 },
                allowance: { id: 'WA-LRL-24-A', amount: 5000000 },
                resourceEstimate: { id: `RE-FY26-${project.p2Number}`, status: 'Approved' },
                costShare: { id: 'PPA-2018-001', sponsor: project.costShare?.sponsorName }
            },
            acquisition: {
                pr: { id: 'PR-24-001', status: 'Certified' },
                solicitation: { id: 'SOL-24-0012', status: 'Closed' },
                contract: { id: 'W912QR-24-C-0001', vendor: 'V-NEX SOLUTIONS' },
                mod: { id: 'P00001', type: 'Administrative' }
            },
            execution: {
                workItems: project.id === 'PROJ-001' ? 12 : 4,
                labor: { hours: 1240, cost: 105400 },
                travel: { id: 'TO-24-001', status: 'Completed' },
                inventory: { id: 'TX-ISS-9912', item: 'Concrete' }
            },
            accounting: {
                obligation: { id: 'GL-OBL-8821', amount: project.financials.obligated },
                expense: { id: 'EXP-001', status: 'Accrued' },
                disbursement: { id: 'DISB-001', status: 'Paid' },
                costTransfer: { id: 'CT-24-002', status: 'Posted' }
            },
            assets: {
                realEstate: '101',
                capitalAsset: { id: 'RPUID-662104', status: 'CIP' },
                workOrder: { id: 'WO-24-1001', type: 'PM' },
                auditLog: { count: 12 }
            }
        };
    }
}
