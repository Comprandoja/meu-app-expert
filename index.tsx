
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Ícones Minimalistas
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const App = function() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(function() {
    setChatHistory([
      { role: 'ai', text: 'Sistemas Escola Express ativos. Sou seu Mentor AI especializado. Como posso acelerar seu projeto hoje?' }
    ]);
  }, []);

  useEffect(function() {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isTyping]);

  const handleSendMessage = async function() {
    if (!chatInput.trim() || isTyping) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // Criação da instância no momento do envio para garantir captura da env var
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: { 
            systemInstruction: "Você é o Mentor AI da Escola Express. Suas respostas devem ser profissionais, diretas, em Português do Brasil e focadas em ajudar o usuário a ter sucesso com tecnologia e negócios." 
        }
      });
      
      if (response && response.text) {
        setChatHistory(prev => [...prev, { role: 'ai', text: response.text }]);
      } else {
        throw new Error("Resposta vazia");
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: '⚠️ Ocorreu um problema na conexão. Certifique-se de que a variável API_KEY está correta no painel do Vercel e que o Redeploy foi concluído.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header Estilo Glassmorphism */}
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <IconZap />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase italic text-white tracking-tighter leading-none">Escola Express</h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Deploy Master v2.0</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Servidor Ativo</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-help">
              <IconShield />
              <span className="text-[10px] font-bold uppercase tracking-widest">Conexão Segura</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-92px)]">
        {/* Lado Esquerdo - Info */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-[0.85] tracking-tighter">
              BEM-VINDO AO <br/> <span className="text-indigo-500">PRÓXIMO NÍVEL.</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-md leading-relaxed">
              Sua infraestrutura está pronta. Agora, use o poder da Inteligência Artificial para transformar suas ideias em realidade.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
              <p className="text-indigo-400 font-black italic text-xl">100%</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Disponibilidade</p>
            </div>
            <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
              <p className="text-emerald-400 font-black italic text-xl">FLASH</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Velocidade IA</p>
            </div>
          </div>
        </div>

        {/* Lado Direito - Chat UI */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden backdrop-blur-md relative">
            
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-5 rounded-[1.8rem] text-[14px] leading-relaxed max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10' 
                      : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none font-medium'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.6s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Área */}
            <div className="p-6 bg-slate-950/50 border-t border-white/10">
              <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl focus-within:border-indigo-500/50 transition-all px-2">
                <input 
                  type="text" 
                  value={chatInput}
                  disabled={isTyping}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent px-5 py-5 text-sm text-white focus:outline-none placeholder:text-slate-600"
                  placeholder="Escreva sua mensagem aqui..."
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isTyping || !chatInput.trim()}
                  className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all disabled:opacity-20 active:scale-90"
                >
                  <IconSend />
                </button>
              </div>
              <p className="text-center text-[9px] text-slate-600 mt-4 uppercase tracking-widest font-bold">
                Powered by Google Gemini 3.0 • Escola Express © 2024
              </p>
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
