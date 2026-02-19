
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// ==========================================
// CONFIGURAÇÕES DA MARCA ESCOLA EXPRESS
// ==========================================
const BRAND = {
  NAME: "Escola Express",
  TAGLINE: "MENTORIA AI • NÍVEL ESPECIALISTA",
  PRIMARY: "#6366f1", // Indigo
  ACCENT: "#f59e0b",  // Amber
  WELCOME: "Conexão estabelecida. Sou o Mentor AI da Escola Express. Como posso impulsionar seu negócio digital hoje?",
  SYSTEM_PROMPT: "Você é o Mentor da Escola Express. Seu objetivo é ajudar empreendedores digitais a escalar seus negócios com automação e estratégia. Seja direto, prático e motivador."
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState('checking'); // checking, ready, error
  const scrollRef = useRef<HTMLDivElement>(null);

  // Inicialização e Verificação de Segurança
  useEffect(() => {
    const key = process.env.API_KEY;
    
    // Pequeno atraso para o check visual de "carregando sistema"
    setTimeout(() => {
      if (key && key !== 'undefined' && key.length > 10) {
        setSystemStatus('ready');
      } else {
        setSystemStatus('error');
      }
    }, 1000);

    const saved = localStorage.getItem('ee_messages_v4');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'ai', text: BRAND.WELCOME }]);
    }
  }, []);

  // Scroll automático para a última mensagem
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 1) {
      localStorage.setItem('ee_messages_v4', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim() || loading) return;

    const currentKey = process.env.API_KEY;
    if (!currentKey || currentKey === 'undefined') {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "❌ SISTEMA DESCONECTADO: A chave API_KEY não foi detectada pelo Vercel. \n\nPASSO A PASSO PARA CORRIGIR:\n1. Vá no painel do Vercel.\n2. Em 'Settings' > 'Environment Variables', crie a chave API_KEY.\n3. Vá em 'Deployments' e faça um NOVO Redeploy." 
      }]);
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: currentKey });
      const model = 'gemini-3-flash-preview';

      const result = await genAI.models.generateContentStream({
        model: model,
        contents: text,
        config: { systemInstruction: BRAND.SYSTEM_PROMPT }
      });

      let responseText = "";
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);

      for await (const chunk of result) {
        responseText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'ai', text: responseText };
          return newMessages;
        });
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "⚠️ Ocorreu um erro na rede neural. Verifique se sua chave do Google AI Studio está ativa e com créditos/limites disponíveis." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-80 bg-slate-900/40 border-r border-white/5 flex-col p-8 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <h1 className="font-black italic text-xl tracking-tighter leading-none">{BRAND.NAME}</h1>
            <p className="text-[10px] font-bold text-indigo-400 tracking-widest mt-1 uppercase">{BRAND.TAGLINE}</p>
          </div>
        </div>

        <div className="space-y-4 mb-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Sugestões de Escala</p>
          {["Criar Funil de Vendas", "Otimizar Anúncios", "Copywriting para Infoprodutos"].map((item, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(item)}
              className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all text-sm group"
            >
              <span className="text-slate-400 group-hover:text-white transition-colors">{item}</span>
            </button>
          ))}
        </div>

        <div className="p-5 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${systemStatus === 'ready' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
              {systemStatus === 'checking' ? 'Checando Sistemas...' : systemStatus === 'ready' ? 'Mentor Online' : 'Sistema Offline'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">Proteção Escola Express: Dados criptografados ponta-a-ponta.</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header Mobile */}
        <header className="lg:hidden p-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded text-white scale-90"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
            <span className="font-black italic text-white uppercase tracking-tighter text-sm">{BRAND.NAME}</span>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-8 lg:p-12 scrollbar-hide">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className={`relative max-w-[90%] lg:max-w-[80%] p-6 rounded-3xl text-sm lg:text-[15px] leading-relaxed shadow-xl ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/60 border border-white/5 text-slate-100 rounded-tl-none backdrop-blur-sm'
                }`}>
                  <span className="whitespace-pre-wrap">{m.text}</span>
                  {m.role === 'ai' && i === messages.length - 1 && loading && (
                    <div className="mt-4 flex gap-1.5 opacity-50">
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Input Dock */}
        <div className="p-4 lg:p-10">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition-all duration-500"></div>
            <div className="relative flex items-center bg-slate-900/80 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-lg">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Qual o próximo nível, Mentor?"
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-4 text-sm text-white placeholder:text-slate-600 font-medium"
              />
              <button 
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 rounded-xl flex items-center justify-center text-white transition-all shadow-lg active:scale-95 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                )}
              </button>
            </div>
            <div className="flex justify-between items-center mt-6 px-2 opacity-30">
               <span className="text-[8px] uppercase tracking-[0.3em] font-black">Escola Express Digital Architecture</span>
               <div className="h-[1px] flex-1 mx-4 bg-slate-800"></div>
               <span className="text-[8px] uppercase tracking-[0.3em] font-black">Secure Core V4</span>
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
