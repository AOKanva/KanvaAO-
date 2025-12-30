
/**
 * Serviço de Remoção de Fundo Profissional
 * Utiliza o modelo de ponta briaai/RMBG-1.4
 */

const HF_TOKEN = process.env.HF_TOKEN || ""; // Reutiliza o token do Hugging Face
const MODEL_ID = "briaai/RMBG-1.4";

export const removeBackground = async (base64Image: string): Promise<string> => {
  if (!HF_TOKEN) {
    throw new Error("Token do Hugging Face não configurado para remoção de fundo.");
  }

  try {
    // 1. Converter Base64 para Blob (arquivo binário)
    const base64Data = base64Image.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // 2. Chamar API do Hugging Face
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "image/png",
        },
        method: "POST",
        body: blob,
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao processar remoção de fundo.");
    }

    // 3. Converter o resultado de volta para Base64
    const resultBlob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(resultBlob);
    });
  } catch (error) {
    console.error("Erro na remoção de fundo:", error);
    throw error;
  }
};
