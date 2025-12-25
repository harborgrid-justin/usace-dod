import { BusinessRule, RuleEvaluationResult, RuleCondition } from '../types';

/**
 * Safely accesses nested object properties using dot notation string.
 * e.g., getValueFromPath(obj, 'documents.fs7600a')
 */
const getValueFromPath = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const evaluateCondition = (data: any, condition: RuleCondition): boolean => {
    const value = getValueFromPath(data, condition.field);
    const target = condition.value;

    switch (condition.operator) {
        case 'EQUALS':
            return value === target;
        case 'NOT_EQUALS':
            return value !== target;
        case 'GREATER_THAN':
            return Number(value) > Number(target);
        case 'LESS_THAN':
            return Number(value) < Number(target);
        case 'CONTAINS':
            return String(value).includes(String(target));
        case 'NOT_CONTAINS':
            return !String(value).includes(String(target));
        case 'IS_TRUE':
            return Boolean(value) === true;
        case 'IS_FALSE':
            return Boolean(value) === false;
        default:
            return false;
    }
};

export const evaluateRules = (rules: BusinessRule[], contextData: any): RuleEvaluationResult[] => {
    const results: RuleEvaluationResult[] = [];

    rules.forEach(rule => {
        if (!rule.isActive) return;

        // All conditions must be met to trigger the rule (Implicit AND)
        // Note: In typical BREs, a rule "firing" usually means a negative condition was met (a violation).
        // e.g. IF amount > limit THEN violation.
        const conditionsMet = rule.conditions.every(condition => evaluateCondition(contextData, condition));

        if (conditionsMet) {
            results.push({
                ruleId: rule.id,
                ruleName: rule.name,
                passed: false, // Rule fired = Violation detected
                severity: rule.severity,
                message: `${rule.description} (Ref: ${rule.citation})`,
                timestamp: new Date().toISOString()
            });
        } else {
            results.push({
                ruleId: rule.id,
                ruleName: rule.name,
                passed: true,
                severity: 'Info',
                message: 'Compliant',
                timestamp: new Date().toISOString()
            });
        }
    });

    return results;
};