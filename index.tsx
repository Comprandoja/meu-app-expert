
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Definições de Marca
const BRAND = {
  NAME: "Escola Express",
  VERSION: "NÍVEL ESPECIALISTA V3.5",
  WELCOME: "Sistemas Escola Express ativos. Sou seu Mentor AI. Como posso acelerar seu projeto hoje?",
  SYSTEM_PROMPT: "Você é o Mentor AI da Escola Express. Responda de forma profissional e estratégica.",
  SUGGESTIONS: [
    "Plano de escala para infoprodutos",
    "Melhores ferramentas de automação",
    "Estratégia de funil High Ticket"
  ]
};

const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconKey = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.5-2.5"/></svg>
);

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificar se a chave está disponível no ambiente
    const key = process.env.API_KEY;
    if (!key || key === 'undefined') {
      setHasKey(false);
    }
    
    const saved = localStorage.getItem('ee_chat_v3');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ role: 'ai', text: BRAND.WELCOME }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 0) localStorage.setItem('ee_chat_v3', JSON.stringify(messages));
  }, [messages, loading]);

  const handleOpenKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
      // Recarregar a página ou apenas prosseguir
      window.location.reload();
    } catch (e) {
      alert("Erro ao selecionar a chave. Verifique se você está logado no Google.");
    }
  };

  const handleSend = async (textOverride?: string) => {
    const content = textOverride || input;
    if (!content.trim() || loading) return;

    // Verificar chave novamente antes de enviar
    // @ts-ignore
    const isKeySelected = await window.aistudio.hasSelectedApiKey();
    if (!process.env.API_KEY && !isKeySelected) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "❌ CHAVE NÃO ATIVA: O Vercel bloqueou o acesso automático por segurança. Clique no botão 'ATIVAR MENTOR' abaixo para liberar o acesso." 
      }]);
      setHasKey(false);
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: content }]);
    setLoading(true);

    try {
      // Criar nova instância sempre para garantir que pegue a chave mais atual
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';

      const response = await ai.models.generateContentStream({
        model: model,
        contents: content,
        config: { systemInstruction: BRAND.SYSTEM_PROMPT },
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
      let errorMsg = `⚠️ Erro de Conexão: ${err.message}`;
      if (err.message.includes("not found")) {
        setHasKey(false);
        errorMsg = "❌ Chave expirada ou não encontrada. Por favor, reconecte clicando em 'ATIVAR MENTOR'.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-slate-900/40 border-r border-white/5 flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-indigo-500/20 shadow-lg"><IconZap /></div>
          <div>
            <h1 className="font-black italic text-lg text-white uppercase leading-none">{BRAND.NAME}</h1>
            <p className="text-[9px] font-bold text-indigo-400 tracking-widest mt-1">{BRAND.VERSION}</p>
          </div>
        </div>

        {!hasKey && (
          <button 
            onClick={handleOpenKey}
            className="w-full mb-8 flex items-center justify-center gap-2 py-4 bg-amber-500/10 border border-amber-500/50 text-amber-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all animate-pulse"
          >
            <IconKey /> Ativar Mentor
          </button>
        )}

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atalhos de Escala</p>
          {BRAND.SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => handleSend(s)} className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all text-xs font-medium text-slate-400 hover:text-white">
              {s}
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold text-center">
            Escola Express • 2024<br/>Elite Digital AI
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-transparent to-indigo-900/10">
        <header className="lg:hidden p-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between">
          <span className="font-black italic text-white uppercase tracking-tighter">{BRAND.NAME}</span>
          {!hasKey && (
            <button onClick={handleOpenKey} className="px-3 py-1.5 bg-amber-500 rounded-lg text-[10px] font-black text-white uppercase">Ativar</button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8 lg:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-6 rounded-[2rem] text-sm leading-relaxed max-w-[85%] shadow-xl ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800/80 border border-white/5 text-slate-100 rounded-tl-none backdrop-blur-md'
                }`}>
                  <span className="whitespace-pre-wrap">{m.text}</span>
                  {m.text.includes("ATIVAR MENTOR") && (
                    <button onClick={handleOpenKey} className="mt-4 block w-full py-3 bg-amber-500 text-white font-black rounded-xl uppercase text-xs tracking-widest shadow-lg">Clique aqui para Ativar</button>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </div>

        <div className="p-4 lg:p-10">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-indigo-500 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition"></div>
            <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl p-1.5 shadow-2xl">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Qual o próximo nível, Mentor?"
                className="flex-1 bg-transparent px-5 py-4 text-sm text-white focus:outline-none font-medium"
              />
              <button 
                onClick={() => handleSend()} 
                disabled={loading || !input.trim()}
                className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-20 active:scale-95"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <IconSend />}
              </button>
            </div>
            <div className="flex justify-center mt-6 gap-4">
               <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[9px] text-slate-600 uppercase tracking-widest font-bold hover:text-indigo-400">Documentação de Faturamento</a>
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
