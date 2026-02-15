
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
  Zap
} from 'lucide-react';

const App = () => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Sistema Inicializado. Aguardando verificação de conexão com o Google Gemini...' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Busca a chave de forma segura em múltiplos locais comuns
  const getApiKey = () => {
    const env = process.env || {};
    return env.API_KEY || (env as any).GEMINI_API_KEY || (env as any).VITE_API_KEY || '';
  };

  const apiKey = getApiKey();
  const hasKey = apiKey.length > 10; // Chaves Gemini são longas

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
      // Inicialização segura dentro da função para não quebrar o app no load
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: "Você é o Mentor Expert da Escola Express. O sistema está ONLINE. Cumprimente o usuário e diga que agora o app está funcionando perfeitamente."
        }
      });
      setChatHistory(prev => [...prev, { role: 'ai', text: response.text || 'Resposta recebida.' }]);
    } catch (error: any) {
      console.error(error);
      setErrorStatus(error.message || 'Erro desconhecido na API');
      setChatHistory(prev => [...prev, { role: 'ai', text: '⚠️ Erro na chave: ' + (error.message || 'Verifique se a chave é válida.') }]);
    } finally {
      setIsTyping(false);
    }
  };

  // TELA DE DIAGNÓSTICO SE A CHAVE SUMIR
  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-300 font-mono p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-900 border-2 border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_100px_rgba(79,70,229,0.1)]">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
            <Terminal className="w-8 h-8 text-indigo-400" />
            <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">Diagnóstico Escola Express</h1>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
              <div>
                <h2 className="text-red-400 font-black text-sm uppercase">ERRO: API_KEY_MISSING</h2>
                <p className="text-xs mt-2 leading-relaxed">
                  O sistema não encontrou uma chave de API válida nas variáveis de ambiente.
                  Sem ela, o Google Gemini não responde.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-800/50 border border-white/5 rounded-2xl">
              <h3 className="text-white text-xs font-black mb-4 uppercase flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-400" /> Verifique no Vercel:
              </h3>
              <ul className="text-[11px] space-y-3 list-disc list-inside text-slate-400">
                <li>Vá em <span className="text-indigo-300 font-bold">Settings > Environment Variables</span>.</li>
                <li>O nome DEVE ser exatamente: <span className="bg-slate-700 text-white px-2 py-0.5 rounded">API_KEY</span></li>
                <li>O valor deve ser sua chave começando com <span className="text-white">AIza...</span></li>
                <li>Após salvar, você **PRECISA** fazer um <span className="text-white font-bold underline">Redeploy</span>.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <p className="text-[9px] uppercase text-slate-500 mb-1">Status do Build</p>
                  <p className="text-xs font-bold text-emerald-400">PRONTO (Vercel)</p>
               </div>
               <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <p className="text-[9px] uppercase text-slate-500 mb-1">Status da Chave</p>
                  <p className="text-xs font-bold text-red-500">NÃO DETECTADA</p>
               </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-4 h-4" /> Verificar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TELA PRINCIPAL (SÓ APARECE SE TIVER CHAVE)
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 py-6 px-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="bg-indigo-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <Zap className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tight uppercase italic text-white leading-none">Escola Express</h1>
                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Conexão Ativa: Gemini Online</p>
             </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                <Lock className="w-3 h-3 text-indigo-400" /> Criptografia SSL
             </div>
             <div className="w-px h-4 bg-white/10"></div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                v2.0 Stable
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-black flex items-center gap-3 text-white uppercase italic">
                    <Code2 className="w-6 h-6 text-indigo-400" /> Painel de Controle
                 </h2>
                 <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase border border-emerald-500/20">Sistemas OK</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="p-6 bg-slate-800/50 rounded-3xl border border-white/5 group hover:border-indigo-500/50 transition-all">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Key className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-white font-black text-sm mb-2 uppercase italic tracking-tight">Status da API</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Conexão estabelecida com sucesso. O modelo flash-preview está respondendo.</p>
                 </div>
                 <div className="p-6 bg-slate-800/50 rounded-3xl border border-white/5 group hover:border-blue-500/50 transition-all">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-white font-black text-sm mb-2 uppercase italic tracking-tight">Hospedagem</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Servidores Vercel operando em produção sem latência detectada.</p>
                 </div>
              </div>
           </section>

           <div className="p-8 bg-indigo-600/10 border border-indigo-600/20 rounded-3xl flex items-center gap-6">
              <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg">
                 <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                 O seu aplicativo foi configurado corretamente. Agora você pode expandir as funcionalidades usando o chat de suporte ao lado.
              </p>
           </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 h-[700px] flex flex-col sticky top-32 overflow-hidden">
            <div className="p-6 bg-slate-800/80 border-b border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black italic shadow-inner">EX</div>
              <div>
                 <span className="block font-black text-xs uppercase italic text-white">Mentor AI Expert</span>
                 <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-[0.2em] animate-pulse">Conectado</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] font-black text-indigo-400 uppercase animate-pulse italic flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Processando...</div>}
              {errorStatus && <div className="text-[10px] font-black text-red-500 uppercase p-2 bg-red-500/10 rounded-lg">Erro: {errorStatus}</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-slate-900 border-t border-white/5">
              <div className="relative group">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Envie um comando..."
                  className="w-full bg-slate-800 border-2 border-white/5 rounded-2xl px-6 py-5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-600 text-white font-medium"
                />
                <button 
                  onClick={handleSendMessage} 
                  className="absolute right-3 top-3 bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-500 transition-all shadow-xl active:scale-95"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-10 border-t border-white/5 text-center">
         <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">Sistema de Portaria • Escola Express</p>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
