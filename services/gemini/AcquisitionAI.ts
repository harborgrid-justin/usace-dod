import { GoogleGenAI } from "@google/genai";
import { Solicitation, Contract } from "../../types";

export const generateMarketResearch = async (solicitation: Solicitation): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Perform market research for: ${solicitation.title}. Identify NAICS, Set-Aside potential, and vendors.`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
        return response.text || "Analysis pending.";
    } catch { return "Market research service unavailable."; }
};

// Added missing generateStatementOfWork
export const generateStatementOfWork = async (solicitation: Solicitation): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Draft a high-level Statement of Work (SOW) for solicitation: ${solicitation.title}. Focus on technical requirements and performance standards.`;
  try {
      const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
      return response.text || "SOW drafting in progress...";
  } catch { return "SOW generation service unavailable."; }
};

export const runLegalComplianceScan = async (contract: Contract): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze contract ${contract.id} for Berry Amendment, Buy American, and G-Invoicing compliance.`;
  try {
    const resp = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
    return resp.text || "Scan completed with no output.";
  } catch { return "Legal scan service offline."; }
};