
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// ========================================================================
// 🎯 CONFIGURAÇÃO DA MARCA (ESCOLA EXPRESS)
// ========================================================================
const BRAND = {
  NAME: "Escola Express",
  VERSION: "NÍVEL ESPECIALISTA V3.5",
  PRIMARY_COLOR: "#6366f1", // Indigo 500
  WELCOME: "Sistemas Escola Express ativos. Sou seu Mentor AI especializado em escala e automação. Como posso acelerar seu projeto hoje?",
  SYSTEM_PROMPT: "Você é o Mentor AI da Escola Express. Sua personalidade é: Profissional, estrategista, focado em resultados rápidos e escala digital. Use linguagem clara e motivadora.",
  SUGGESTIONS: [
    "Plano de escala para infoprodutos",
    "Melhores ferramentas de automação 2024",
    "Como estruturar um funil de vendas High Ticket",
    "Análise estratégica de copy"
  ]
};

// Componentes de Ícones
const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carregar histórico
  useEffect(() => {
    const saved = localStorage.getItem('ee_history_v3');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'ai', text: BRAND.WELCOME }]);
    }
  }, []);

  // Scroll automático
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 0) {
      localStorage.setItem('ee_history_v3', JSON.stringify(messages));
    }
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const content = textOverride || input;
    if (!content.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: content }]);
    setLoading(true);

    try {
      // O segredo do Vercel: Garantir que a instância pegue a chave do process.env no momento exato
      const key = process.env.API_KEY;
      
      if (!key || key === 'undefined') {
        throw new Error("SISTEMA_OFFLINE_NO_VERCEL");
      }

      const ai = new GoogleGenAI({ apiKey: key });
      const model = 'gemini-3-flash-preview';

      const response = await ai.models.generateContentStream({
        model: model,
        contents: content,
        config: { 
          systemInstruction: BRAND.SYSTEM_PROMPT,
          temperature: 0.8
        },
      });

      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);

      for await (const chunk of response) {
        fullResponse += chunk.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'ai', text: fullResponse };
          return updated;
        });
      }
    } catch (err: any) {
      console.error("Erro Escola Express:", err);
      let errorMsg = "⚠️ Falha na conexão neural.";
      
      if (err.message === "SISTEMA_OFFLINE_NO_VERCEL") {
        errorMsg = "❌ ERRO DE CONFIGURAÇÃO: O site foi publicado antes de você adicionar a API_KEY. \n\nSOLUÇÃO: Vá no painel do Vercel > Deployments > Clique em 'Redeploy' para ativar sua chave.";
      } else if (err.message.includes("API key not valid")) {
        errorMsg = "❌ CHAVE INVÁLIDA: A chave API configurada no Vercel não é aceita pelo Google. Verifique se copiou a chave correta no AI Studio.";
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 font-sans">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-80 bg-slate-900/50 border-r border-white/5 flex-col p-6 backdrop-blur-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <IconZap />
          </div>
          <div>
            <h1 className="font-black italic text-xl tracking-tighter text-white uppercase">{BRAND.NAME}</h1>
            <p className="text-[10px] font-bold text-indigo-400 tracking-widest">{BRAND.VERSION}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Sugestões de Escala</p>
          {BRAND.SUGGESTIONS.map((s, i) => (
            <button 
              key={i}
              onClick={() => handleSend(s)}
              className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all text-sm font-medium group"
            >
              <span className="text-slate-400 group-hover:text-white transition-colors">{s}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <IconShield />
            <span className="text-xs font-bold uppercase">Status de Conexão</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sistemas criptografados e integrados via Google GenAI Engine.
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header Mobile */}
        <header className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded flex items-center justify-center text-white scale-75">
              <IconZap />
            </div>
            <span className="font-black italic text-sm text-white uppercase tracking-tighter">{BRAND.NAME}</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-8 lg:p-12 space-y-10">
          <div className="max-w-3xl mx-auto space-y-10">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`relative max-w-[90%] lg:max-w-[80%] p-6 rounded-[2rem] text-sm lg:text-[15px] leading-relaxed shadow-2xl ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/50 border border-white/5 text-slate-100 rounded-tl-none backdrop-blur-sm'
                }`}>
                  <span className="whitespace-pre-wrap">{m.text}</span>
                  {m.role === 'ai' && i === messages.length - 1 && loading && (
                    <div className="mt-4 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75" />
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150" />
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 lg:p-10 bg-gradient-to-t from-[#030712] via-[#030712]/90 to-transparent">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Qual o próximo nível, Mentor?"
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-white placeholder:text-slate-600 font-medium"
              />
              <button 
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-30 disabled:grayscale active:scale-90"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <IconSend />
                )}
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-600 uppercase tracking-[0.4em] font-black mt-6">
              Escola Express Digital Architecture • Secured Intelligence
            </p>
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
