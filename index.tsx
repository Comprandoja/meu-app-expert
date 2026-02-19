
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// ========================================================================
// 🎯 ÁREA DE PERSONALIZAÇÃO
// ========================================================================
const MEU_PROJETO = {
  NOME: "Escola Express",             
  SUBTITULO: "NÍVEL ESPECIALISTA V3.5",    
  PROMPT_ORIGINAL: "Você é o Mentor AI da Escola Express. Responda de forma profissional e ajude o usuário em suas tarefas.",
  MENSAGEM_BOAS_VINDAS: "Sistemas Escola Express ativos. Sou seu Mentor AI. Como posso acelerar seu projeto hoje?",
  SUGESTOES: [
    "Como escalar meu negócio digital?",
    "Ideias de automação com IA",
    "Dicas de marketing para iniciantes",
    "Como melhorar meu código React?"
  ]
};

const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

const App = function() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(function() {
    const saved = localStorage.getItem('expert_chat_history_v3');
    if (saved) {
      setChatHistory(JSON.parse(saved));
    } else {
      setChatHistory([{ role: 'ai', text: MEU_PROJETO.MENSAGEM_BOAS_VINDAS }]);
    }
  }, []);

  useEffect(function() {
    if (chatHistory.length > 0) {
      localStorage.setItem('expert_chat_history_v3', JSON.stringify(chatHistory));
    }
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isTyping]);

  const clearHistory = () => {
    if (window.confirm("Deseja limpar toda a conversa?")) {
      const initial = [{ role: 'ai', text: MEU_PROJETO.MENSAGEM_BOAS_VINDAS }];
      setChatHistory(initial);
      localStorage.setItem('expert_chat_history_v3', JSON.stringify(initial));
    }
  };

  const handleSendMessage = async function(customMsg?: string) {
    const text = customMsg || chatInput;
    if (!text.trim() || isTyping) return;

    // Log para depuração no console do navegador (F12)
    console.log("Tentando enviar mensagem...");
    
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: text }]);
    setIsTyping(true);

    try {
      // 1. Verificar se a chave existe antes de chamar
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === 'undefined' || apiKey.length < 5) {
        throw new Error("CHAVE_NAO_CONFIGURADA");
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      // Usando gemini-3-flash-preview conforme diretrizes
      const result = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: text,
        config: { 
          systemInstruction: MEU_PROJETO.PROMPT_ORIGINAL,
          temperature: 0.7
        }
      });
      
      let fullText = "";
      setChatHistory(prev => [...prev, { role: 'ai', text: '' }]);

      for await (const chunk of result) {
        fullText += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: 'ai', text: fullText };
          return newHistory;
        });
      }
    } catch (error: any) {
      console.error("ERRO DETALHADO:", error);
      
      let mensagemErro = "⚠️ Ocorreu um erro inesperado.";
      
      if (error.message === "CHAVE_NAO_CONFIGURADA") {
        mensagemErro = "❌ Chave API não detectada. Vá no Vercel > Settings > Environment Variables, adicione API_KEY e depois faça um REDEPLOY na aba Deployments.";
      } else if (error.message?.includes("API key not valid")) {
        mensagemErro = "❌ Sua chave API do Google é inválida. Verifique se copiou corretamente do Google AI Studio.";
      } else if (error.message?.includes("User location is not supported")) {
        mensagemErro = "❌ O Google Gemini ainda não suporta sua região ou o Vercel está em um servidor não suportado.";
      } else {
        mensagemErro = `⚠️ Erro técnico: ${error.message || "Erro de conexão"}. Tente fazer um 'Redeploy' no Vercel.`;
      }

      setChatHistory(prev => [...prev, { role: 'ai', text: mensagemErro }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <IconZap />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase italic text-white leading-none tracking-tighter">{MEU_PROJETO.NOME}</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{MEU_PROJETO.SUBTITULO}</p>
            </div>
          </div>
          <button onClick={clearHistory} className="text-slate-500 hover:text-red-400 transition-all flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 text-[10px] font-bold uppercase">
            <IconTrash /> Limpar Chat
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-90px)]">
        <div className="lg:col-span-5 flex flex-col justify-center space-y-10 py-10">
          <div className="space-y-6">
            <h2 className="text-7xl font-black text-white uppercase italic leading-[0.8] tracking-tighter">
              A IA QUE <br/> 
              <span className="text-indigo-500 italic">CONSTRÓI.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Sua estrutura está pronta. Se o erro persistir, faça o <b>Redeploy</b> no painel do Vercel.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {MEU_PROJETO.SUGESTOES.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleSendMessage(s)}
                className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-4 py-3 rounded-full hover:bg-indigo-600 hover:text-white transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col min-h-0 py-4">
          <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] flex-1 flex flex-col overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-6 rounded-[2rem] text-[15px] leading-relaxed max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-800/80 text-slate-100 border border-white/5 rounded-tl-none whitespace-pre-wrap'
                  }`}>
                    {msg.text || "..."}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-slate-950/40 border-t border-white/10">
              <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl p-1">
                <input 
                  type="text" 
                  value={chatInput}
                  disabled={isTyping}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent px-5 py-4 text-sm text-white focus:outline-none"
                  placeholder="Envie um comando..."
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={isTyping || !chatInput.trim()}
                  className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-20"
                >
                  {isTyping ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <IconSend />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
