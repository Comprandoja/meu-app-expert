
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Terminal,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Settings2,
  Globe,
  Zap,
  Cpu,
  Activity
} from 'lucide-react';

const App = function() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Inicialização do histórico
  useEffect(function() {
    setChatHistory([{ role: 'ai', text: 'Sistemas da Escola Express online. Pronto para iniciar.' }]);
  }, []);

  // Verificação da chave de API sem usar o caractere de "maior que"
  const apiKey = process.env.API_KEY || "";
  const keyLength = apiKey.length;
  const hasKey = keyLength >= 10; 

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
    
    setChatHistory(function(prev) {
      return [...prev, { role: 'user', text: userMessage }];
    });
    
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: "Você é o Mentor AI da Escola Express. Seja técnico e direto."
        }
      });
      
      const aiText = response.text || 'Processado com sucesso.';
      setChatHistory(function(prev) {
        return [...prev, { role: 'ai', text: aiText }];
      });
    } catch (error) {
      setChatHistory(function(prev) {
        return [...prev, { role: 'ai', text: 'Erro de conexão. Verifique sua API_KEY no Vercel.' }];
      });
    } finally {
      setIsTyping(false);
    }
  };

  // TELA DE AJUDA (Aparece se faltar a chave no Vercel)
  if (!hasKey) {
    return (
      <div className="min-h-screen bg-black text-slate-300 font-mono p-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-zinc-950 border border-red-900/30 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Terminal className="w-8 h-8 text-red-500" />
            <h1 className="text-xl font-bold text-white uppercase italic">Ação Necessária</h1>
          </div>

          <div className="space-y-6">
            <div className="bg-red-500/5 p-5 border border-red-500/20 rounded-2xl">
              <p className="text-xs text-red-400 font-bold uppercase mb-2">Chave de Inteligência Ausente</p>
              <p className="text-[11px] leading-relaxed italic">
                Seu site já está na internet, mas o "cérebro" (API_KEY) ainda não foi configurado nas Variáveis de Ambiente do Vercel.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Siga os passos no Painel Vercel:</p>
              <div className="space-y-2">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px]">
                  1. Entre na aba <span className="text-white font-bold">Settings</span> do seu projeto.
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px]">
                  2. Clique em <span className="text-white font-bold">Environment Variables</span>.
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px]">
                  3. Nome: <span className="text-indigo-400 font-bold">API_KEY</span> | Valor: <span className="text-slate-400 italic">Sua_Chave_Google</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px]">
                  4. Vá em <span className="text-white font-bold">Deployments</span> e faça um <span className="text-emerald-400 font-bold">Redeploy</span>.
                </div>
              </div>
            </div>

            <button onClick={function() { window.location.reload(); }} className="w-full bg-red-600 hover:bg-red-500 transition-colors py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 text-white">
              <RefreshCw className="w-4 h-4" /> Revalidar Conexão
            </button>
          </div>
        </div>
      </div>
    );
  }

  // INTERFACE PRINCIPAL
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <header className="border-b border-white/5 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase italic text-white leading-none">Escola Express</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Sistemas Ativos</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
              <Cpu className="w-5 h-5 text-indigo-400 mb-3" />
              <h3 className="text-[10px] font-bold uppercase text-slate-500">Tecnologia</h3>
              <p className="text-white font-bold text-sm italic">Gemini 3 Flash</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
              <Globe className="w-5 h-5 text-blue-400 mb-3" />
              <h3 className="text-[10px] font-bold uppercase text-slate-500">Distribuição</h3>
              <p className="text-white font-bold text-sm italic">Vercel Global</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
              <Activity className="w-5 h-5 text-emerald-400 mb-3" />
              <h3 className="text-[10px] font-bold uppercase text-slate-500">Status</h3>
              <p className="text-white font-bold text-sm italic">Estável</p>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Zap className="w-32 h-32 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic leading-none mb-4">Bem-vindo à Nuvem.</h2>
            <p className="text-indigo-100 text-sm mb-8 max-w-md opacity-90 leading-relaxed font-medium">
              Sua aplicação da Escola Expert está agora hospedada de forma profissional e gratuita. Este é o primeiro passo para sua escala digital.
            </p>
            <div className="flex gap-4">
              <div className="bg-black/20 px-4 py-2 rounded-lg text-[9px] font-black uppercase text-white border border-white/10">Servidor Edge</div>
              <div className="bg-black/20 px-4 py-2 rounded-lg text-[9px] font-black uppercase text-white border border-white/10">SSL Ativo</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 h-[650px] flex flex-col">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-slate-800/30 border-b border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white italic shadow-inner">EX</div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-tight">Mentor AI</h3>
                <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Conexão Segura</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/10">
              {chatHistory.map(function(msg, i) {
                return (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl text-[12px] leading-relaxed max-w-[85%] shadow-sm ${
                      msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              {isTyping && <div className="text-[9px] font-bold text-indigo-400 uppercase animate-pulse italic">Processando resposta...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-5 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={function(e) { setChatInput(e.target.value); }}
                  onKeyPress={function(e) { if (e.key === 'Enter') handleSendMessage(); }}
                  placeholder="Envie um comando..."
                  className="w-full bg-slate-800 border border-white/10 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-indigo-600 text-white transition-all"
                />
                <button onClick={handleSendMessage} className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all shadow-lg active:scale-95">
                  <ArrowRight className="w-4 h-4" />
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
