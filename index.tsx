
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconCpu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
);
const IconGlobe = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconTerminal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
);
const IconRefresh = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
);
const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const App = function() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Aqui está a mágica: ele aceita os dois nomes agora!
  const apiKey = process.env.API_KEY || (process as any).env.GEMINI_API_KEY || "";
  const hasKey = apiKey.length >= 20; 

  useEffect(function() {
    setChatHistory([{ role: 'ai', text: 'Sistemas da Escola Express 100% operacionais. Como posso ajudar na sua jornada expert hoje?' }]);
  }, []);

  useEffect(function() {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isTyping]);

  const handleSendMessage = async function() {
    if (!chatInput.trim() || !hasKey || isTyping) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // Usamos a chave detectada dinamicamente
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: { systemInstruction: "Você é o Mentor AI da Escola Express. Seja direto, encorajador e técnico quando necessário." }
      });
      setChatHistory(prev => [...prev, { role: 'ai', text: response.text || 'Desculpe, não consegui processar isso.' }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', text: '⚠️ Erro na conexão com a IA. Verifique se sua chave no Vercel é válida.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-black text-slate-300 font-mono p-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-zinc-950 border border-red-900/30 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20"><IconTerminal /></div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Ajuste de Variável</h1>
          </div>
          <div className="space-y-6">
            <div className="bg-red-500/5 p-6 border border-red-500/20 rounded-3xl text-[12px] leading-relaxed text-red-200">
              Quase lá! O Vercel está online, mas ele não encontrou sua chave. Você provavelmente a nomeou como <code className="bg-red-500/20 px-1 rounded text-white">GEMINI_API_KEY</code>.
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                <span className="text-red-500 font-black italic">01</span>
                <p className="text-[11px]">No Painel do Vercel, mude o nome da variável para <b className="text-indigo-400">API_KEY</b></p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                <span className="text-red-500 font-black italic">02</span>
                <p className="text-[11px]">Vá na aba <b className="text-white">Deployments</b>, clique nos três pontinhos e selecione <b className="text-emerald-400 italic">Redeploy</b>.</p>
              </div>
            </div>
            <button onClick={() => window.location.reload()} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-red-500/10">
              <IconRefresh /> Testar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-600 rounded-[1rem] flex items-center justify-center text-white shadow-lg shadow-indigo-600/20"><IconZap /></div>
            <div>
              <h1 className="text-xl font-black uppercase italic text-white leading-none tracking-tighter">Escola Express</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Sistemas Operacionais</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-100px)]">
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-4">
             <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
             <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Master Deploy Ativo</span>
          </div>
          <h2 className="text-6xl font-black text-white uppercase italic leading-[0.9] tracking-tighter">
            SEU APP <br/> ESTÁ <span className="text-indigo-500">VIVO.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed font-medium">
            Você acaba de concluir o ciclo de deploy gratuito na Vercel. Sua IA Mentor da Escola Express está pronta para escalar seu conhecimento.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4"><IconCpu /></div>
              <h4 className="text-white font-bold italic uppercase text-sm">Cérebro Gemini</h4>
              <p className="text-slate-500 text-[11px] mt-1">Processamento de última geração via Google Cloud.</p>
            </div>
            <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4"><IconGlobe /></div>
              <h4 className="text-white font-bold italic uppercase text-sm">Acesso Global</h4>
              <p className="text-slate-500 text-[11px] mt-1">Seu link .vercel.app funciona em qualquer lugar do mundo.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col min-h-0">
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-black italic text-sm">EX</div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Mentor AI</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-5 rounded-[1.5rem] text-[13px] leading-relaxed max-w-[90%] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none font-medium'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5 relative">
              <input 
                type="text" 
                value={chatInput}
                disabled={isTyping}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600 transition-all disabled:opacity-50"
                placeholder="Digite sua dúvida expert..."
              />
              <button 
                onClick={handleSendMessage}
                disabled={isTyping || !chatInput.trim()}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-white transition-colors disabled:opacity-20"
              >
                <IconSend />
              </button>
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
