
import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { Lead, UserProfile, AppLanguage } from "../types";

// Always initialize the GoogleGenAI client with a named parameter for the API key.
const createAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const callWithRetry = async (fn: () => Promise<any>, retries = 1, delay = 800): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    const msg = error.message?.toLowerCase() || "";
    const isQuota = msg.includes('429') || msg.includes('quota') || msg.includes('limit');
    if (retries > 0 && isQuota) {
      await new Promise(r => setTimeout(r, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Rodney v30: Generates synthesized speech bytes for tactical audio feedback.
 * Fallback: Returns undefined instantly if quota limit (429) is detected.
 */
export const generateRodneySpeech = async (text: string): Promise<string | undefined> => {
  const ai = createAIInstance();
  const phoneticText = text
    .replace(/AgentPulse/gi, "Éid-jent Púl-se")
    .replace(/Rodney/gi, "Ród-ni")
    .replace(/Alpha/gi, "Ál-fa")
    .replace(/v30/gi, "Versão Trinta")
    .replace(/OSINT/gi, "ô-sint");

  try {
    // Timeout-like abort for TTS if it takes too long or hits quota
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: phoneticText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts[0]?.inlineData?.data;
  } catch (e: any) {
    const isQuota = e.message?.includes('429');
    if (isQuota) {
      console.warn("Rodney Alpha v30: QUOTA 429 - Protocolo de Fallback Visual Ativado.");
    }
    return undefined;
  }
};

/**
 * Rodney v30: Generates a persuasive WhatsApp script for lead approach.
 */
export const generateWhatsAppScript = async (lead: Lead, profile: UserProfile): Promise<string> => {
  const ai = createAIInstance();
  const prompt = `Atue como o corretor de elite ${profile.brokerName} da imobiliária ${profile.agencyName}. 
  Gere um script de abordagem inicial para WhatsApp curto, humano e persuasivo para o lead ${lead.name}.
  A necessidade do lead é: "${lead.need}". 
  Tipo de lead: ${lead.type === 'buyer' ? 'Comprador' : 'Proprietário'}.
  Instruções Adicionais do Corretor: ${profile.customInstructions || 'Nenhuma'}.
  
  Regras: 
  1. Use uma saudação natural.
  2. Demonstre que você conhece a necessidade dele.
  3. Termine com uma pergunta aberta.
  4. Retorne APENAS o texto da mensagem.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Olá, vi seu interesse em imóveis e gostaria de ajudar.";
  } catch (err) {
    return "Olá, vi seu interesse em imóveis e gostaria de ajudar.";
  }
};

/**
 * Rodney v30: Deep OSINT scan for leads using Google Search and Maps grounding.
 */
export const searchLeads = async (
  niche: string, 
  location: string, 
  profile: UserProfile, 
  type: 'buyer' | 'owner' = 'buyer',
  coords?: { latitude: number, longitude: number }
): Promise<{ leads: Lead[], sources: any[] }> => {
  const ai = createAIInstance();
  const model = 'gemini-2.5-flash';
  const prompt = `Atue como Engenheiro Rodney Alpha v30. Varredura OSINT para leads ${type} de ${niche} em ${location}. Retorne estritamente JSON: { "leads": [{"name": "...", "need": "...", "location": "...", "foundAt": "...", "score": 90, "publicProfileUrl": "..."}] }`;

  try {
    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          toolConfig: coords ? { retrievalConfig: { latLng: { latitude: coords.latitude, longitude: coords.longitude } } } : undefined,
        }
      });
    });

    let text = response.text || '{"leads":[]}';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);
    const leads = (data.leads || []).map((l: any) => ({ 
      ...l, 
      id: Math.random().toString(36).substring(2, 9), 
      type, 
      status: 'Novo',
      lastInteraction: new Date().toISOString()
    }));
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { leads, sources };
  } catch (err) {
    return { leads: [], sources: [] };
  }
};

/**
 * Rodney v30: Real-time market intelligence report with Google Search grounding.
 */
export const generateMarketReport = async (address: string, details: string, lang: AppLanguage): Promise<{ text: string, sources: any[] }> => {
  const ai = createAIInstance();
  const prompt = `Gere um relatório de análise de mercado imobiliário para: ${address}. Contexto: ${details}. Idioma: ${lang}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || "Relatório indisponível.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (err) {
    return { text: "Erro na inteligência de mercado.", sources: [] };
  }
};

/**
 * Rodney v30: Initializes an AI chat session.
 */
export const initChatSession = (profile: UserProfile): Chat => {
  const ai = createAIInstance();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Você é RODNEY ALPHA v30. Fala curta, técnica, autoritária e focada no mercado imobiliário.`
    }
  });
};
