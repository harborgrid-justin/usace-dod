import { GoogleGenAI, Type } from "@google/genai";
import { ContingencyOperation, FiarInsight } from "../../types";

export const getStructuredInsights = async (data: any): Promise<FiarInsight[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze Army sub-ledgers for FIAR readiness: ${JSON.stringify(data)}`,
        config: { responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT,
            properties: { title: {type:Type.STRING}, severity: {type:Type.STRING}, message: {type:Type.STRING}, recommendation: {type:Type.STRING}, impactArea: {type:Type.STRING} },
            required: ["title", "severity", "message", "recommendation", "impactArea"] } } }
    });
    return JSON.parse(response.text || '[]');
  } catch { return []; }
};

// Added missing analyzeContingencyReport
export const analyzeContingencyReport = async (operation: ContingencyOperation): Promise<any[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze contingency operation for FMR compliance: ${JSON.stringify(operation)}`,
        config: { responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT,
            properties: { finding: {type:Type.STRING}, risk_level: {type:Type.STRING}, fmr_reference: {type:Type.STRING}, recommendation: {type:Type.STRING} },
            required: ["finding", "risk_level", "fmr_reference", "recommendation"] } } }
    });
    return JSON.parse(response.text || '[]');
  } catch { return []; }
};