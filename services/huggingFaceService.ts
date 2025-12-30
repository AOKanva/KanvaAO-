
/**
 * Serviço de Integração com Hugging Face para o modelo FLUX.1-schnell
 * Otimizado com a Metodologia de "Prompt Mãe" para resultados de agência.
 */

const HF_TOKEN = process.env.HF_TOKEN || "";
const MODEL_ID = "black-forest-labs/FLUX.1-schnell";

interface PromptContext {
  category: string;
  objective: string;
  audience: string;
  mainIdea: string;
  colors: string;
  style: string;
}

export const generateFluxImage = async (context: PromptContext) => {
  if (!HF_TOKEN) {
    console.error("HF_TOKEN não configurado.");
    throw new Error("Chave de API (HF_TOKEN) não encontrada.");
  }

  // Mapeamento de categorias para termos técnicos de design (Inglês para melhor performance do FLUX)
  const categoryMap: Record<string, string> = {
    branding: "Corporate Brand Identity & Logo Design",
    digital: "High-end UI/UX & Digital Marketing Banner",
    editorial: "Premium Editorial Layout & Poster Design"
  };

  /**
   * CONSTRUÇÃO DO PROMPT MÃE (Mother Prompt)
   * Seguindo rigorosamente a estrutura de Contexto, Direção e Qualidade.
   */
  const motherPrompt = `
    TASK: Create an extremely professional graphic design image.
    
    CONTEXT:
    - Design Type: ${categoryMap[context.category] || context.category}
    - Concept Idea: ${context.mainIdea}
    - Design Goal: ${context.objective}
    - Target Audience: ${context.audience}
    - Color Palette: ${context.colors}

    CREATIVE DIRECTION:
    - Style: ${context.style} premium aesthetic
    - Modern and clean design, balanced composition
    - Professional use of typography and color theory
    - Commercial-ready visual appeal
    - NO TEXT unless it is high-quality logo lettering

    QUALITY REQUIREMENTS:
    - Ultra-high resolution, 8k, sharp focus
    - Perfect studio lighting, professional finish
    - International agency level execution
    - Format: High-quality professional digital asset
  `.trim();

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: motherPrompt }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro na geração FLUX.");
    }

    const blob = await response.blob();
    
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Erro no serviço FLUX:", error);
    throw error;
  }
};
