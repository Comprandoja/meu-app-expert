
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Ícones manuais em SVG para evitar erro de importação no Vercel
const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconCpu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
);
const IconGlobe = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconActivity = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const IconTerminal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
);
const IconRefresh = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
);
const IconArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

const App = function() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(function() {
    setChatHistory([{ role: 'ai', text: 'Sistemas da Escola Express online. Pronto para iniciar.' }]);
  }, []);

  const apiKey = process.env.API_KEY || "";
  const hasKey = apiKey.length >= 10; 

  const scrollToBottom = function() {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(function() {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async function() {
    if (!chatInput.trim() || !hasKey) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatHistory(function(prev) { return [...prev, { role: 'user', text: userMessage }]; });
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: { systemInstruction: "Você é o Mentor AI da Escola Express." }
      });
      setChatHistory(function(prev) { return [...prev, { role: 'ai', text: response.text || 'Processado.' }]; });
    } catch (error) {
      setChatHistory(function(prev) { return [...prev, { role: 'ai', text: 'Erro na API_KEY no Vercel.' }]; });
    } finally {
      setIsTyping(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-black text-slate-300 font-mono p-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-zinc-950 border border-red-900/30 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-red-500"><IconTerminal /></div>
            <h1 className="text-xl font-bold text-white uppercase italic">Configuração do Vercel</h1>
          </div>
          <div className="space-y-6">
            <div className="bg-red-500/5 p-5 border border-red-500/20 rounded-2xl text-[11px] leading-relaxed">
              O build foi um sucesso! Seu site está online. Agora falta apenas adicionar a sua <b>API_KEY</b> do Google nas configurações do Vercel para a IA funcionar.
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">1. No Vercel, vá em <b>Settings</b>.</div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">2. Clique em <b>Environment Variables</b>.</div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">3. Adicione Nome: <span className="text-indigo-400">API_KEY</span></div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">4. Valor: cole sua chave do Gemini.</div>
            </div>
            <button onClick={function() { window.location.reload(); }} className="w-full bg-red-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 text-white">
              <IconRefresh /> Revalidar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <header className="border-b border-white/5 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><IconZap /></div>
            <div>
              <h1 className="text-lg font-black uppercase italic text-white leading-none">Escola Express</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Deploy Master Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
              <div className="text-indigo-400 mb-3"><IconCpu /></div>
              <p className="text-white font-bold text-sm italic">IA Operacional</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
              <div className="text-blue-400 mb-3"><IconGlobe /></div>
              <p className="text-white font-bold text-sm italic">Escala Global</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
              <div className="text-emerald-400 mb-3"><IconActivity /></div>
              <p className="text-white font-bold text-sm italic">Uptime 100%</p>
            </div>
          </div>
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl font-black text-white uppercase italic leading-none mb-4">Site Ativo com Sucesso.</h2>
            <p className="text-indigo-100 text-sm opacity-90 leading-relaxed font-medium">Este aplicativo foi configurado para rodar na infraestrutura da Vercel de forma gratuita e perpétua.</p>
          </div>
        </div>

        <div className="lg:col-span-4 h-[600px] flex flex-col">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-slate-800/30 border-b border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white italic">EX</div>
              <h3 className="text-xs font-black text-white uppercase tracking-tight">Mentor Escola Express</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.map(function(msg, i) {
                return (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl text-[12px] max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <div className="p-5 border-t border-white/5 relative">
              <input 
                type="text" value={chatInput}
                onChange={function(e) { setChatInput(e.target.value); }}
                onKeyPress={function(e) { if (e.key === 'Enter') handleSendMessage(); }}
                className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white"
                placeholder="Pergunte algo..."
              />
              <button onClick={handleSendMessage} className="absolute right-7 top-7 text-indigo-400"><IconArrowRight /></button>
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
