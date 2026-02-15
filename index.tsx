
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Ícones Modernos
const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconTerminal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
);
const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const App = function() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Tentativa múltipla de capturar a chave (Vercel + Vite + Shims)
  const apiKey = process.env.API_KEY || (process as any).env?.GEMINI_API_KEY || "";
  const hasKey = apiKey && apiKey.length > 10;

  useEffect(function() {
    setChatHistory([{ role: 'ai', text: 'Sistemas da Escola Express 100% operacionais. Mentor AI pronto para sua consulta.' }]);
  }, []);

  useEffect(function() {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isTyping]);

  const handleSendMessage = async function() {
    if (!chatInput.trim() || isTyping) return;
    
    if (!hasKey) {
      setChatHistory(prev => [...prev, { role: 'ai', text: '⚠️ Sistema sem chave de acesso. Realize o REDEPLOY no Vercel conforme as instruções.' }]);
      return;
    }

    const userMessage = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: { 
            systemInstruction: "Você é o Mentor AI da Escola Express. Responda de forma curta, direta e motivadora em Português do Brasil." 
        }
      });
      setChatHistory(prev => [...prev, { role: 'ai', text: response.text }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'ai', text: '❌ Erro de comunicação. Verifique se sua chave do Google AI Studio está ativa e se você fez o REDEPLOY no Vercel.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-indigo-500/20 rounded-[2rem] p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-600/40">
            <IconTerminal />
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Ação Necessária</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Sua chave foi configurada, mas o site atual ainda não a "conhece". 
            Siga o passo final para ativar o sistema:
          </p>
          <div className="bg-black/40 rounded-2xl p-6 text-left space-y-4 border border-white/5 mb-8">
            <div className="flex gap-4 items-start">
              <span className="bg-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded">PASSO 1</span>
              <p className="text-[12px] text-slate-300">Vá na aba <b className="text-white">Deployments</b> no Vercel.</p>
            </div>
            <div className="flex gap-4 items-start">
              <span className="bg-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded">PASSO 2</span>
              <p className="text-[12px] text-slate-300">Clique nos <b className="text-white">...</b> do último deploy e selecione <b className="text-emerald-400 italic">Redeploy</b>.</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-white text-black font-black py-4 rounded-xl uppercase text-[11px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
          >
            Já fiz o redeploy! Atualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><IconZap /></div>
            <h1 className="text-lg font-black uppercase italic text-white tracking-tighter">Escola Express</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Mentor AI Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 h-[calc(100vh-80px)] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-6 pb-8 scroll-smooth pr-2">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-5 rounded-[1.5rem] text-[14px] leading-relaxed max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10' 
                  : 'bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 flex gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="pb-6">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-2 flex items-center shadow-2xl focus-within:border-indigo-500/50 transition-all">
            <input 
              type="text" 
              value={chatInput}
              disabled={isTyping}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-transparent px-6 py-4 text-sm text-white focus:outline-none placeholder:text-slate-600"
              placeholder="Pergunte qualquer coisa ao Mentor AI..."
            />
            <button 
              onClick={handleSendMessage}
              disabled={isTyping || !chatInput.trim()}
              className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-500 transition-colors disabled:opacity-20 mr-1 shadow-lg shadow-indigo-600/20"
            >
              <IconSend />
            </button>
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
