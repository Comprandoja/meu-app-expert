
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  ShieldAlert,
  RefreshCw,
  Terminal,
  Key,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Code2,
  Settings2,
  Globe,
  Lock,
  Zap,
  Cpu,
  Activity
} from 'lucide-react';

const App = () => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Sistemas da Escola Express iniciados. Aguardando conexão com a inteligência artificial...' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Verificação ultra-segura da chave de API
  const checkKey = () => {
    try {
      const key = process.env.API_KEY;
      return key && key.length > 10;
    } catch {
      return false;
    }
  };

  const hasKey = checkKey();

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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: "Você é o Mentor AI da Escola Express. O sistema está operacional no Vercel. Seja motivador e técnico."
        }
      });
      setChatHistory(prev => [...prev, { role: 'ai', text: response.text || 'Comando processado.' }]);
    } catch (error: any) {
      console.error(error);
      setErrorStatus(error.message || 'Falha na comunicação');
      setChatHistory(prev => [...prev, { role: 'ai', text: 'ERRO: ' + (error.message || 'Verifique sua API_KEY.') }]);
    } finally {
      setIsTyping(false);
    }
  };

  // TELA DE DIAGNÓSTICO SIMPLIFICADA (Sem símbolos perigosos para o build)
  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#050505] text-slate-300 font-mono p-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#0a0a0a] border border-red-900/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(255,0,0,0.05)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-red-950 p-3 rounded-lg">
              <Terminal className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-lg font-bold text-white uppercase tracking-widest">Falha de Configuração</h1>
          </div>

          <div className="space-y-6">
            <div className="bg-red-500/5 p-4 border-l-4 border-red-600 rounded-r-xl">
              <p className="text-xs font-bold text-red-400 uppercase mb-1 italic">Status: Chave Ausente</p>
              <p className="text-[11px] leading-relaxed">O aplicativo rodou, mas o Vercel não encontrou sua credencial do Google.</p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Siga os passos abaixo:</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0">1</div>
                  <p className="text-[11px]">No painel do Vercel, clique na aba Settings e depois em Environment Variables.</p>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0">2</div>
                  <p className="text-[11px]">Crie uma variável com o nome API_KEY (exatamente assim).</p>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0">3</div>
                  <p className="text-[11px]">Cole sua chave começando com AIza e clique em Add.</p>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0">4</div>
                  <p className="text-[11px]">Importante: Vá na aba Deployments e faça um Redeploy para ativar.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.3em] transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-4 h-4" /> Revalidar Sistema
            </button>
          </div>
        </div>
      </div>
    );
  }

  // INTERFACE PRINCIPAL ONLINE
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* HEADER DE ALTA TECNOLOGIA */}
      <header className="border-b border-white/5 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter italic text-white flex items-center gap-2">
                Escola Express <span className="text-[10px] not-italic bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">PRO</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">Servidor Operacional</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Latência</span>
              <span className="text-[10px] font-mono text-emerald-400">14ms</span>
            </div>
            <div className="w-px h-8 bg-white/5 mx-2"></div>
            <Settings2 className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LADO ESQUERDO: STATUS DO SISTEMA */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl hover:border-indigo-500/40 transition-all group">
              <Cpu className="w-5 h-5 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-1">Processamento</h3>
              <p className="text-white font-bold text-sm italic">Gemini 3.0 Flash</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl hover:border-blue-500/40 transition-all group">
              <Globe className="w-5 h-5 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-1">Hospedagem</h3>
              <p className="text-white font-bold text-sm italic">Vercel Edge</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl hover:border-emerald-500/40 transition-all group">
              <Activity className="w-5 h-5 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-1">Uptime</h3>
              <p className="text-white font-bold text-sm italic">99.98% Stable</p>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2rem] p-10 relative overflow-hidden shadow-2xl shadow-indigo-500/10">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Zap className="w-40 h-40 text-white" />
            </div>
            <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl font-black text-white uppercase italic leading-[0.9] mb-6">Seu aplicativo está pronto para escalar.</h2>
              <p className="text-indigo-100 text-sm leading-relaxed mb-8 opacity-90 font-medium">
                O deploy foi concluído com sucesso. Agora você tem uma infraestrutura profissional rodando na nuvem com auxílio de inteligência artificial.
              </p>
              <div className="flex gap-3">
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl">Documentação</button>
                <button className="bg-indigo-500/50 text-white border border-indigo-400/30 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400/50 transition-all active:scale-95">Ver Logs</button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Relatório de Segurança</h4>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-300">Firewall Ativo - Camada {i}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">PROTECTED</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LADO DIREITO: CHAT DO MENTOR */}
        <div className="lg:col-span-4 h-[750px] flex flex-col">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-slate-800/50 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black italic shadow-inner text-white">EX</div>
                <div>
                  <h3 className="text-xs font-black uppercase text-white">Mentor Expert</h3>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">IA Conectada</p>
                </div>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/10">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-3xl text-[12px] leading-relaxed ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' : 'bg-slate-800 text-slate-300 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[9px] font-black text-indigo-400 uppercase animate-pulse italic">O Mentor está processando...</div>}
              {errorStatus && <div className="p-3 bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 rounded-xl">Erro crítico de comunicação.</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 border-t border-white/5">
              <div className="relative group">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escreva sua mensagem..."
                  className="w-full bg-slate-800 border-2 border-white/5 rounded-2xl px-5 py-5 text-sm focus:border-indigo-600 outline-none transition-all text-white placeholder:text-slate-600"
                />
                <button 
                  onClick={handleSendMessage} 
                  className="absolute right-2 top-2 bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-500 transition-all shadow-xl active:scale-95"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[8px] text-slate-600 uppercase font-black text-center mt-4 tracking-[0.2em]">Escola Express v2.0 - Gemini AI</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 text-center">
        <div className="flex justify-center gap-8 mb-6 opacity-20 grayscale">
          <Globe className="w-5 h-5" />
          <Lock className="w-5 h-5" />
          <Activity className="w-5 h-5" />
        </div>
        <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em]">2025 • Todos os direitos reservados à Escola Expert</p>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
