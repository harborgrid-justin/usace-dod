
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const getFinancialAdvice = async (query: string, context: any): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `User Query: ${query}\nG-8 Context: ${JSON.stringify(context)}\nInstructions: You are the D-AFMP G-8 Sentinel. Provide guidance based on DoD 7000.14-R (FMR), PPBE, and FIAR. Maintain a formal, authoritative tone. Detect potential ADA (Antideficiency Act) violations or JRP (Joint Review Program) discrepancies.`,
      config: { thinkingConfig: { thinkingBudget: 1000 } }
    });
    return response.text || "No guidance generated.";
  } catch (error: any) {
    return `Sentinel Error: ${error.message}`;
  }
};

export const generateStrategicBriefing = async (stats: any): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate a high-level Strategic Financial Readiness Briefing for a General Officer. 
    Context: ${JSON.stringify(stats)}. 
    Format: Executive Summary, Fiscal Risk Vectors (ADA/PPA), and Recommendations. 
    Tone: Authoritative, Military, concise. Focus on mission readiness and statutory compliance.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { temperature: 0.7 }
        });
        return response.text || "Unable to synthesize briefing at this time.";
    } catch {
        return "Command logic node disconnected. Standard protocols apply.";
    }
};

export const performDeepAudit = async (domain: string, records: any[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Perform a forensic audit of the following ${domain} records: ${JSON.stringify(records.slice(0, 10))}. Identify 3-5 specific risks related to USSGL integrity, documentation sufficiency, and statutory compliance.`;
  try {
    const response = await ai.models.generateContent({ 
        model: 'gemini-3-pro-preview', 
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 2000 } }
    });
    return response.text || "Audit analysis incomplete.";
  } catch (error) {
    return "Forensic audit system degraded. Attempting local rule-based verification...";
  }
};
