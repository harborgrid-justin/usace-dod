
import { GoogleGenAI } from "@google/genai";
import { BudgetLineItem, Solicitation, BracScenario, BracInstallation, ContingencyOperation } from "../types";

// Re-export specific logic from domain-specific AI modules
export { getFinancialAdvice, performDeepAudit, generateStrategicBriefing } from './gemini/SentinelAI';
export { generateMarketResearch, generateStatementOfWork } from './gemini/AcquisitionAI';
export { generateJSheetNarrative } from './gemini/BudgetAI';
export { analyzeContingencyReport } from './gemini/ComplianceAI';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeBracScenario = async (scenario: BracScenario, installations: BracInstallation[]): Promise<string> => {
    try {
        const resp = await ai.models.generateContent({ 
          model: 'gemini-3-pro-preview', 
          contents: `Optimize BRAC scenario: ${scenario.name}. Evaluate NPV and community impacts per 10 USC 2687. Installations Context: ${JSON.stringify(installations)}`,
          config: { thinkingConfig: { thinkingBudget: 2000 } }
        });
        return resp.text || "Strategic optimization analysis complete.";
    } catch { return "BRAC Optimization engine unavailable."; }
};
