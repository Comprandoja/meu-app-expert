
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

const App = () => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Sistemas da Escola Express online. Pronto para iniciar.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Verificação da chave de API
  const apiKey = process.env.API_KEY || "";
  const hasKey = apiKey.length > 10;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !hasKey) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: "Você é o Mentor AI da Escola Express. O sistema está 100% operacional no Vercel."
        }
      });
      setChatHistory(prev => [...prev, { role: 'ai', text: response.text || 'Processado.' }]);
    } catch (error: any) {
      setErrorStatus(error.message || 'Erro de conexão');
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Aviso: Erro na API. Verifique sua chave no Vercel.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // TELA DE DIAGNÓSTICO (Aparecerá se a API_KEY não estiver configurada no Vercel)
  if (!hasKey) {
    return (
      <div className="min-h-screen bg-black text-slate-300 font-mono p-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#0d0d0d] border border-red-900/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Terminal className="w-8 h-8 text-red-500" />
            <h1 className="text-xl font-bold text-white uppercase italic">Configuração Necessária</h1>
          </div>

          <div className="space-y-6">
            <div className="bg-red-500/10 p-4 border border-red-500/20 rounded-2xl">
              <p className="text-xs text-red-400 font-bold uppercase mb-2">Chave API_KEY não encontrada</p>
              <p className="text-[11px] leading-relaxed">O build deu certo, mas falta conectar o cérebro do Google Gemini.</p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Siga estas etapas no Vercel:</p>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px]">
                  1. No painel do seu projeto, entre na aba <strong className="text-white italic">Settings</strong>.
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px]">
                  2. Clique em <strong className="text-white italic">Environment Variables</strong> no menu lateral.
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px]">
                  3. Adicione o nome <strong className="text-indigo-400">API_KEY</strong> e cole sua chave no valor.
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px]">
                  4. Volte em <strong className="text-white italic">Deployments</strong> e clique nos três pontinhos para fazer um <strong className="text-emerald-400 italic">Redeploy</strong>.
                </div>
              </div>
            </div>

            <button onClick={() => window.location.reload()} className="w-full bg-red-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
              <RefreshCw className="w-4 h-4" /> Validar Agora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase italic text-white">Escola Express</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Produção Online</span>
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
              <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-1">Processador AI</h3>
              <p className="text-white font-bold text-sm italic">Gemini 3 Flash</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
              <Globe className="w-5 h-5 text-blue-400 mb-3" />
              <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-1">Rede</h3>
              <p className="text-white font-bold text-sm italic">Edge Vercel</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
              <Activity className="w-5 h-5 text-emerald-400 mb-3" />
              <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-1">Uptime</h3>
              <p className="text-white font-bold text-sm italic">100.0% Stable</p>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Zap className="w-32 h-32 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic leading-none mb-4">Sua infraestrutura profissional está ativa.</h2>
            <p className="text-indigo-100 text-sm mb-6 max-w-md opacity-80">O deploy foi finalizado. Seu aplicativo agora pode ser acessado de qualquer lugar do mundo.</p>
            <div className="flex gap-4">
              <div className="bg-white/20 px-4 py-2 rounded-lg text-[9px] font-black uppercase text-white border border-white/30">Hospedagem Gratuita</div>
              <div className="bg-white/20 px-4 py-2 rounded-lg text-[9px] font-black uppercase text-white border border-white/30">SSL Seguro</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 h-[600px] flex flex-col">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-slate-800/50 border-b border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white italic">EX</div>
              <div>
                <h3 className="text-xs font-black text-white uppercase">Mentor Expert</h3>
                <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Sessão Ativa</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-[12px] leading-relaxed max-w-[90%] ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[9px] font-bold text-indigo-400 uppercase animate-pulse">Pensando...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Dúvidas sobre o deploy?"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-indigo-600 text-white"
                />
                <button onClick={handleSendMessage} className="absolute right-2 top-2 bg-indigo-600 p-2 rounded-xl">
                  <ArrowRight className="w-4 h-4 text-white" />
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
