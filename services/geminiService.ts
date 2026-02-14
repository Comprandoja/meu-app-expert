import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateWelcomeMessage(parentName: string, studentNames: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é o assistente virtual do app "Escola Express". 
      Gere uma mensagem de boas-vindas curta (máximo 2 linhas) e muito amigável para o pai/mãe chamado(a) ${parentName}. 
      Ele(a) acabou de cadastrar o(s) aluno(s): ${studentNames.join(', ')}. 
      Mencione que a segurança da saída escolar ficou mais ágil com o Escola Express.`,
    });
    return response.text || `Olá ${parentName}! Bem-vindo ao Escola Express. O cadastro de ${studentNames.join(', ')} foi realizado com sucesso.`;
  } catch (error) {
    console.error("Erro Gemini:", error);
    return `Olá ${parentName}! Bem-vindo ao Escola Express. O cadastro de ${studentNames.join(', ')} foi realizado com sucesso.`;
  }
}