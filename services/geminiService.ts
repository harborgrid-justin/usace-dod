export * from './gemini/SentinelAI';
export * from './gemini/AcquisitionAI';
export * from './gemini/BudgetAI';
export * from './gemini/ComplianceAI';

import { GoogleGenAI } from "@google/genai";
import { BracScenario, BracInstallation } from "../types";

export const optimizeBracScenario = async (scenario: BracScenario, installations: BracInstallation[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Optimize BRAC scenario: ${scenario.name}. Losing: ${scenario.losingInstallationId}. Evaluate NPV and community impacts.`;
    try {
        const resp = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
        return resp.text || "Strategic optimization analysis complete.";
    } catch { return "BRAC Optimization engine unavailable."; }
};