
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Ícones Modernos
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

const SUGGESTIONS = [
  "Como escalar meu negócio digital?",
  "Ideias de automação com IA",
  "Dicas de marketing para iniciantes",
  "Como melhorar meu código React?"
];

const App = function() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Carregar histórico salvo ao iniciar
  useEffect(function() {
    const saved = localStorage.getItem('expert_chat_history');
    if (saved) {
      setChatHistory(JSON.parse(saved));
    } else {
      setChatHistory([
        { role: 'ai', text: 'Sistemas Escola Express ativos. Sou seu Mentor AI especializado. Como posso acelerar seu projeto hoje?' }
      ]);
    }
  }, []);

  // Salvar sempre que o histórico mudar
  useEffect(function() {
    if (chatHistory.length > 0) {
      localStorage.setItem('expert_chat_history', JSON.stringify(chatHistory));
    }
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isTyping]);

  const clearHistory = () => {
    if (window.confirm("Deseja limpar toda a conversa?")) {
      const initialMsg = [{ role: 'ai', text: 'Sistemas Escola Express ativos. Histórico limpo. Como posso ajudar agora?' }];
      setChatHistory(initialMsg);
      localStorage.setItem('expert_chat_history', JSON.stringify(initialMsg));
    }
  };

  const handleSendMessage = async function(customMsg?: string) {
    const messageToSend = customMsg || chatInput;
    if (!messageToSend.trim() || isTyping) return;
    
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: messageToSend,
        config: { 
            systemInstruction: "Você é o Mentor AI da Escola Express. Respostas curtas, impactantes, em Português do Brasil. Use emojis e formatação clara." 
        }
      });
      
      let fullText = "";
      // Adiciona um balão vazio para a IA que será preenchido pelo stream
      setChatHistory(prev => [...prev, { role: 'ai', text: '' }]);

      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullText += chunkText;
        
        // Atualiza o último balão de mensagem (da IA) com o texto acumulado
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: 'ai', text: fullText };
          return newHistory;
        });
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: '⚠️ Erro de conexão. Verifique sua chave API no Vercel.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <IconZap />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase italic text-white tracking-tighter leading-none">Escola Express</h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Nível Especialista v3.0</p>
            </div>
          </div>
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-[10px] font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5"
          >
            <IconTrash />
            Limpar Chat
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-92px)]">
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-[0.85] tracking-tighter">
              A IA QUE <br/> <span className="text-indigo-500">CONSTRÓI.</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-md leading-relaxed">
              Você superou os desafios técnicos. Agora, deixe o Mentor AI guiar sua estratégia de crescimento.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i}
                onClick={() => handleSendMessage(s)}
                className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-indigo-600 hover:border-indigo-600 transition-all text-slate-400 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col min-h-0">
          <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden backdrop-blur-md relative">
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-5 rounded-[1.8rem] text-[14px] leading-relaxed max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10' 
                      : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none font-medium whitespace-pre-wrap'
                  }`}>
                    {msg.text || (isTyping && i === chatHistory.length - 1 ? "..." : "")}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-white/10">
              <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl focus-within:border-indigo-500/50 transition-all px-2 shadow-inner">
                <input 
                  type="text" 
                  value={chatInput}
                  disabled={isTyping}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent px-5 py-5 text-sm text-white focus:outline-none placeholder:text-slate-600"
                  placeholder="Envie um comando para o Mentor..."
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={isTyping || !chatInput.trim()}
                  className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all disabled:opacity-20 active:scale-90"
                >
                  <IconSend />
                </button>
              </div>
              <p className="text-center text-[9px] text-slate-600 mt-4 uppercase tracking-[0.3em] font-black">
                Escola Express • Tecnologia de Elite
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
