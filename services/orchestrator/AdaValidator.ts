
import { GLTransaction, FundControlNode } from '../../types';

export class AdaValidator {
    static validateGlAgainstAda(transaction: GLTransaction, fundNodes: FundControlNode[]): { valid: boolean; message: string } {
        const fundCode = transaction.lines[0]?.fund;
        const targetNode = this.findNodeByFundCode(fundNodes, fundCode);
        if (!targetNode) return { valid: true, message: "Funds Control: Pass with warning." };

        const available = targetNode.totalAuthority - targetNode.amountObligated;
        if (transaction.totalAmount > available) {
            return { 
                valid: false, 
                message: `ADA VIOLATION: $${transaction.totalAmount.toLocaleString()} exceeds available $${available.toLocaleString()} for ${targetNode.name}.` 
            };
        }
        return { valid: true, message: "Compliance Verified." };
    }

    private static findNodeByFundCode(nodes: FundControlNode[], code: string | undefined): FundControlNode | null {
        if (!code) return null;
        for (const node of nodes) {
            if (node.name.includes(code) || (code === '0100' && node.level === 'Allocation')) return node;
            if (node.children) {
                const found = this.findNodeByFundCode(node.children, code);
                if (found) return found;
            }
        }
        return null;
    }
}
