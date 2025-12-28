
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const getFinancialAdvice = async (query: string, context: any): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Query: ${query}\nG-8 Context: ${JSON.stringify(context)}\nInstructions: You are the D-AFMP G-8 Sentinel. Provide guidance based on DoD 7000.14-R (FMR), PPBE, and FIAR.`,
    });
    return response.text || "No guidance generated.";
  } catch (error: any) {
    return `Sentinel Error: ${error.message}`;
  }
};

export const analyzeBudgetTrends = async (data: any): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this multi-ledger data for ADA risk, anomalies, and PPA compliance: ${JSON.stringify(data)}`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
    return response.text || "Analysis incomplete.";
  } catch (error) {
    return "Audit system degraded.";
  }
};
