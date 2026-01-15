
import { GoogleGenAI } from "@google/genai";
import { checkUsageLimit, incrementUsage, getSessionPassword } from "./authService";

const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

interface DesignContext {
  category: string;
  objective: string;
  audience: string;
  mainIdea: string;
  colors: string;
  style: string;
}

const analyzeImageQuality = async (base64Image: string, context: DesignContext) => {
  const ai = getAI();
  const prompt = `
    Aja como um Diretor de Arte Sênior. Avalie esta imagem gerada por IA:
    - Categoria: ${context.category}
    - Ideia: ${context.mainIdea}
    
    Responda apenas JSON: {"status": "APROVADO" ou "REPROVADO", "motivo": "..."}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/png", data: base64Image.split(',')[1] } }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { status: "APROVADO" };
  }
};

export const generatePremiumDesign = async (context: DesignContext, attempt: number = 1): Promise<string> => {
  const password = getSessionPassword();
  const { allowed } = checkUsageLimit(password);

  if (!allowed) {
    throw new Error("LIMITE_EXCEDIDO: Você atingiu o limite de gerações da sua chave.");
  }

  const ai = getAI();
  const MAX_ATTEMPTS = 2;

  const motherPrompt = `
    TAREFA: Design Gráfico Profissional.
    Contexto: ${context.mainIdea} | Objetivo: ${context.objective} | Estilo: ${context.style}
    Qualidade: 4k, profissional, nível agência.
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: motherPrompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("IA não retornou imagem.");

    const base64Image = `data:image/png;base64,${part.inlineData.data}`;

    if (attempt < MAX_ATTEMPTS) {
      const evaluation = await analyzeImageQuality(base64Image, context);
      if (evaluation.status === "REPROVADO") {
        return await generatePremiumDesign(context, attempt + 1);
      }
    }

    // Se chegou aqui, a geração foi concluída com sucesso. Incrementamos o uso.
    incrementUsage(password);
    return base64Image;
  } catch (error) {
    console.error("Erro na geração:", error);
    throw error;
  }
};

export const generateIdeaExpansion = async (title: string, currentContent: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Expanda esta ideia: "${title}" - ${currentContent}.`,
    });
    return response.text || "Sem resposta.";
  } catch (error) {
    return "Erro na expansão.";
  }
};
