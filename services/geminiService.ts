
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Lead, UserProfile, AppLanguage } from "../types";

const extractJson = (text: string) => {
  try {
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      const cleaned = jsonMatch[0].replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    }
    return null;
  } catch (e) {
    console.error("Erro no parser Rodney:", e);
    return null;
  }
};

const callWithRetry = async (fn: () => Promise<any>, retries = 2, delay = 1000): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const searchLeadsDeep = async (
  niche: string, 
  location: string, 
  profile: UserProfile, 
  type: 'buyer' | 'owner' = 'buyer'
): Promise<{ leads: Lead[], sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const strategy = type === 'buyer' 
    ? `EXTRAÇÃO DE COMPRADORES: Busque pessoas postando intenção de compra de '${niche}' em '${location}'.`
    : `EXTRAÇÃO DE PROPRIETÁRIOS: Busque donos vendendo direto (FSBO) '${niche}' em '${location}'.`;

  const prompt = `
    VOCÊ É O ANALISTA OSINT RODNEY ALPHA v51.0. 
    MISSÃO: Localizar leads e EXTRAIR CONTATOS REAIS (Celular, WhatsApp, Telegram, Email).
    
    ESTRATÉGIA: ${strategy}
    
    REQUISITO CRÍTICO: Varra comentários, bios, rodapés de páginas e anúncios para achar o NÚMERO DE CONTATO.
    
    RETORNE APENAS JSON:
    {
      "leads": [
        {
          "name": "Nome do Lead",
          "need": "O que ele quer exatamente",
          "location": "Bairro/Cidade",
          "contact": "Número de WhatsApp/Celular com DDD (obrigatório se achar)",
          "email": "Email se disponível",
          "telegram": "Username do Telegram se disponível",
          "foundAt": "Link da postagem original",
          "score": 95,
          "contextSignals": {
            "hasPets": boolean,
            "profession": "Profissão",
            "urgency": "Alta/Média"
          }
        }
      ]
    }
  `;

  try {
    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
    });

    const data = extractJson(response.text);
    if (!data || !data.leads) throw new Error("Falha na extração de dados.");

    const leads = data.leads.map((l: any) => ({ 
      ...l, 
      id: Math.random().toString(36).substring(2, 9).toUpperCase(), 
      type, 
      status: 'Novo',
      lastInteraction: new Date().toISOString(),
      triggers: [l.contextSignals?.profession, l.contextSignals?.hasPets ? 'Pet Friendly' : null].filter(Boolean)
    }));
    
    return { leads, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (err) {
    console.error("Rodney OSINT Fatal Error:", err);
    throw err;
  }
};

export const generateTripleScript = async (lead: any, profile: UserProfile): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = lead.need + (lead.contextSignals ? ` Profissão: ${lead.contextSignals.profession}. Pets: ${lead.contextSignals.hasPets ? 'Sim' : 'Não'}.` : '');
  
  const prompt = `Gere 3 variações de script para WhatsApp para o lead ${lead.name}. Contexto: ${context}. Corretor: ${profile.brokerName}. Retorne apenas um array JSON de strings.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (err) {
    return [`Olá ${lead.name}, sou o ${profile.brokerName}. Vi seu interesse em ${lead.location}.`];
  }
};

export const generateWhatsAppScript = async (lead: any, profile: UserProfile): Promise<string> => {
  const scripts = await generateTripleScript(lead, profile);
  return scripts[0];
};

export const generateMarketReport = async (address: string, details: string, lang: AppLanguage): Promise<{ text: string, sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Análise de mercado para: ${address}. Detalhes: ${details}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (err) {
    return { text: "Erro na análise.", sources: [] };
  }
};

export const initChatSession = (profile: UserProfile): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction: `Rodney Alpha v51.0. Auxilie ${profile.brokerName}.` },
  });
};
