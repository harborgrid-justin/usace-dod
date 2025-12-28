
import { GoogleGenAI } from "@google/genai";
import { BudgetLineItem, SubActivityGroup } from "../../types";

export const generateJSheetNarrative = async (item: BudgetLineItem, context: any): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Draft ENG Form 2201 justification for ${item.projectName} ($${item.amount.toLocaleString()}). Focus on mission criticality and risk.`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text || "";
  } catch { return "Budget justification baseline generated."; }
};

export const generateOandMJustification = async (item: SubActivityGroup, context: any): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Justify O&M SAG ${item.name} for ${context.appropriation}. Focus on readiness targets.`;
  try {
    const resp = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return resp.text || "";
  } catch { return "Readiness funding required."; }
};
