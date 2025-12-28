import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { 
    ContingencyOperation, 
    SubActivityGroup, 
    BudgetLineItem, 
    PurchaseRequest, 
    Contract, 
    Solicitation,
    ContingencyFinding,
    FiarInsight,
    BracInstallation,
    BracScenario
} from "../types";

// Type Guard helper for safer error handling
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export interface GenAIContext {
  [key: string]: string | number | boolean | undefined | object;
}

export const getFinancialAdvice = async (query: string, context: GenAIContext): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: `
        User Query: ${query}
        G-8 Context: ${JSON.stringify(context)}
        Instructions: You are the D-AFMP G-8 Sentinel. Provide definitive guidance based on DoD 7000.14-R (FMR), PPBE guidelines, and FIAR requirements.
        Reference specific topics like:
        - Antideficiency Act (ADA)
        - Bona Fide Need Rule
        - Period of Performance (PoP)
        - Severable vs Non-Severable Services
        - Prompt Payment Act Interest
        - Continuing Resolution (CR) Authority
      `,
    });
    return response.text || "No guidance generated.";
  } catch (error: unknown) {
    console.error("Gemini Service Error:", error);
    if (isError(error)) {
        return `Sentinel Error: ${error.message}`;
    }
    return "An unknown error occurred while retrieving financial guidance.";
  }
};

export const optimizeBracScenario = async (scenario: BracScenario, installations: BracInstallation[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    const prompt = `
        As a BRAC Analysis Expert for OSD, optimize this realignment scenario:
        Scenario: ${JSON.stringify(scenario)}
        Installations: ${JSON.stringify(installations)}
        
        Requirements:
        1. Evaluate MILCON cost vs long-term savings.
        2. Identify community infrastructure risks (Schools, Hospitals).
        3. Suggest alternative gaining installations based on excess capacity and mission synergy.
        4. Provide a 20-year NPV summary.
    `;
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text || "Strategic optimization analysis pending.";
    } catch (error: unknown) {
        return "BRAC Optimization engine currently unavailable.";
    }
};

export const generateMarketResearch = async (solicitation: Solicitation): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    const prompt = `
        As a Federal Contracting Officer, perform detailed market research for this requirement:
        Title: ${solicitation.title}
        PR ID: ${solicitation.prId}
        Estimated Amount: ${solicitation.quotes[0]?.amount || 'Unknown'}
        
        Requirements:
        1. Identify likely NAICS codes.
        2. Evaluate Small Business Set-Aside potential.
        3. Identify at least 3 potential vendors in the defense space.
        4. Provide an Independent Government Cost Estimate (IGCE) rationale based on the title.
        
        Format your response as a professional acquisition report.
    `;
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({ model, contents: prompt });
        return response.text || "Analysis pending.";
    } catch (error: unknown) {
        return "Market research service unavailable.";
    }
};

export const generateStatementOfWork = async (solicitation: Solicitation): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const prompt = `
        Draft a high-level Statement of Work (SOW) for the following requirement:
        Title: ${solicitation.title}
        PR Reference: ${solicitation.prId}
        
        Focus on:
        - Scope of Work
        - Performance Requirements
        - Deliverables
        - Quality Assurance
        - Period of Performance
    `;
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({ model, contents: prompt });
        return response.text || "";
    } catch (error: unknown) {
        return "SOW generation unavailable.";
    }
};

export const runLegalComplianceScan = async (contract: Contract): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  const prompt = `
    Analyze this contract for legal compliance issues against FAR and DFARS.
    Contract Data: ${JSON.stringify(contract)}
    Check for:
    1. Berry Amendment (Clothing/Textiles/Specialty Metals)
    2. Buy American Act
    3. Cyber Flow-down clauses (NIST 800-171)
    4. Sam.gov Exclusion status requirement
    5. G-Invoicing (FS Form 7600) compliance
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({ model, contents: prompt });
    return response.text || "Scan completed with no output.";
  } catch (error: unknown) {
    return "Legal scan service temporary offline. Manual review required.";
  }
};

export const generateJSheetNarrative = async (item: BudgetLineItem, context: GenAIContext): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  const prompt = `
    As a DoD Budget Analyst, write a formal justification for a budget line item.
    This narrative will be used in an ENG Form 2201 (J-Sheet) or Exhibit O-1/P-1.
    
    Project: ${item.projectName}
    P2 ID: ${item.projectId}
    Business Line: ${item.businessLine}
    Capability Level: ${item.capabilityLevel}
    Amount: $${item.amount.toLocaleString()}
    Object Class: ${item.objectClass}
    
    District Context: ${context.district || 'USACE'}
    Mission Priorities: ${context.priorities || 'Mission readiness and critical infrastructure maintenance.'}

    Requirements:
    1. Focus on why this specific capability level is critical.
    2. Reference the impact on mission readiness if not funded.
    3. Use technical but professional language.
    4. Keep it between 100-150 words.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini J-Sheet Error:", error);
    return "The required funding is critical for infrastructure stability and mission alignment. Failure to authorize will result in deferred maintenance risks.";
  }
};

export const generateOandMJustification = async (item: SubActivityGroup, context: { appropriation: string; budgetActivity: string }): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  const prompt = `
    As a DoD Budget Analyst, write a formal justification for an O&M Sub-Activity Group (SAG).
    SAG: ${item.name}
    Appropriation: ${context.appropriation}
    Budget Activity: ${context.budgetActivity}
    Current Budget: $${item.budget.toLocaleString()}
    
    Requirements:
    1. Explain why this funding is necessary for mission readiness.
    2. Reference DoD FMR Vol 2A requirements.
    3. Keep it between 100-150 words.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini O&M Justification Error:", error);
    return "Funding is required to sustain operational tempo and meet readiness targets. Failure to fund will result in mission degradation.";
  }
};

export const analyzeContingencyReport = async (operation: ContingencyOperation): Promise<ContingencyFinding[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: `Audit this contingency operation report against FMR Vol 12, Ch 23. Detect anomalies in incremental cost reporting. Data: ${JSON.stringify(operation)}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                finding: { type: Type.STRING },
                risk_level: { type: Type.STRING },
                fmr_reference: { type: Type.STRING },
                recommendation: { type: Type.STRING }
                },
                required: ["finding", "risk_level", "fmr_reference", "recommendation"]
            }
            }
        }
        });
        
        return JSON.parse(response.text || '[]');
    } catch {
      return [];
    }
};

export const analyzeBudgetTrends = async (data: any): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  const prompt = `
    As the G-8 Strategic Financial Intelligence Engine, analyze this multi-ledger data:
    1. ADA RISK: Are any WBS or SAG elements approaching allocation ceilings? Check CR Authority limits.
    2. ANOMALY DETECTION: Identify transactions with high riskScore (>80), UMDs, or NULOs.
    3. PPA COMPLIANCE: Evaluate disbursement velocity and any Interest Penalties paid.
    4. SPEND PLAN VARIANCE: Compare 'planned' vs 'actual' in spendPlan arrays.
    5. DORMANCY: Flag funds with 'Current' status but no recent activity (Dormant Account Review).
    
    Data: ${JSON.stringify(data)}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Analysis incomplete.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Audit system degraded. Manual review required.";
  }
};

export const getStructuredInsights = async (data: any): Promise<FiarInsight[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: `Analyze Army sub-ledgers for FIAR readiness. Detect fraud/waste/abuse patterns. Look for split disbursements, Berry Amendment violations, and incorrect Object Class codes. Data: ${JSON.stringify(data)}`,
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                severity: { type: Type.STRING },
                message: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                impactArea: { type: Type.STRING }
            },
            required: ["title", "severity", "message", "recommendation", "impactArea"]
            }
        }
        }
    });
  
    return JSON.parse(response.text || '[]');
  } catch {
    return [];
  }
};
