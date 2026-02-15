
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
    { role: 'ai', text: 'Sistema Escola Express inicializado. Pronto para configurar.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Verificação de segurança da chave
  const apiKey = process.env.API_KEY || "";
  const hasKey = apiKey.length > 5;

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
      // Inicialização conforme documentação oficial @google/genai
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: "Você é o Mentor AI da Escola Express. O sistema está 100% ONLINE. Parabéns ao usuário por concluir o deploy!"
        }
      });
      setChatHistory(prev => [...prev, { role: 'ai', text: response.text || 'Processado com sucesso.' }]);
    } catch (error: any) {
      console.error(error);
      setErrorStatus(error.message || 'Erro de API');
      setChatHistory(prev => [...prev, { role: 'ai', text: '⚠️ Erro na conexão: ' + (error.message || 'Verifique sua API_KEY no Vercel.') }]);
    } finally {
      setIsTyping(false);
    }
  };

  // TELA DE DIAGNÓSTICO (Caso a chave não chegue ao código)
  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-300 font-mono p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-900 border-2 border-red-500/30 rounded-3xl p-8 shadow-[0_0_100px_rgba(239,68,68,0.1)]">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
            <Terminal className="w-8 h-8 text-red-400" />
            <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">Erro de Ambiente</h1>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
              <div>
                <h2 className="text-red-400 font-black text-sm uppercase">API_KEY Não Detectada</h2>
                <p className="text-xs mt-2 leading-relaxed">
                  O Vercel concluiu o build, mas a variável <code className="text-white">API_KEY</code> não foi injetada no navegador.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-800/50 border border-white/5 rounded-2xl">
              <h3 className="text-white text-[10px] font-black mb-4 uppercase flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-400" /> Siga exatamente estes passos:
              </h3>
              <ul className="text-[11px] space-y-4 text-slate-400">
                <li className="flex gap-2">
                   <span className="text-indigo-400 font-bold">1.</span>
                   <span>No Vercel, vá em <strong className="text-white italic">Settings &gt; Environment Variables</strong></span>
                </li>
                <li className="flex gap-2">
                   <span className="text-indigo-400 font-bold">2.</span>
                   <span>Nome: <strong className="bg-slate-700 text-white px-1.5 rounded">API_KEY</strong> (Exatamente assim)</span>
                </li>
                <li className="flex gap-2">
                   <span className="text-indigo-400 font-bold">3.</span>
                   <span>Valor: Cole sua chave do Gemini (começa com AIza...)</span>
                </li>
                <li className="flex gap-2">
                   <span className="text-indigo-400 font-bold">4.</span>
                   <span>Salve e clique no botão <strong className="text-emerald-400 underline">Redeploy</strong> na aba Deployments.</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-4 h-4" /> Validar Alterações
            </button>
          </div>
        </div>
      </div>
    );
  }

  // APP ONLINE
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
                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Conexão: Produção Online</p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Globe className="w-32 h-32" />
              </div>
              <h2 className="text-xl font-black flex items-center gap-3 text-white uppercase italic mb-8">
                 <Code2 className="w-6 h-6 text-indigo-400" /> Central de Comando
              </h2>
              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                 <div className="p-6 bg-slate-800/50 rounded-3xl border border-white/5 group hover:border-indigo-500/50 transition-all">
                    <Key className="w-6 h-6 text-indigo-400 mb-4" />
                    <h3 className="text-white font-black text-sm mb-2 uppercase italic">Status da API</h3>
                    <p className="text-slate-500 text-xs">Chave validada. O cérebro AI está pronto para receber comandos.</p>
                 </div>
                 <div className="p-6 bg-slate-800/50 rounded-3xl border border-white/5 group hover:border-emerald-500/50 transition-all">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-4" />
                    <h3 className="text-white font-black text-sm mb-2 uppercase italic">Hospedagem</h3>
                    <p className="text-slate-500 text-xs">Hospedado na Vercel com Edge Functions ativas.</p>
                 </div>
              </div>
           </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 h-[650px] flex flex-col shadow-2xl overflow-hidden sticky top-32">
            <div className="p-6 bg-slate-800/80 border-b border-white/5 flex items-center gap-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="font-black text-[10px] uppercase italic text-white tracking-widest">Suporte AI Escola Express</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/10">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 border border-white/5 shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] font-black text-indigo-400 uppercase animate-pulse italic flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Mentor está digitando...</div>}
              {errorStatus && <div className="text-[10px] font-black text-red-500 uppercase p-3 bg-red-500/10 rounded-xl border border-red-500/20">Erro: {errorStatus}</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-slate-900 border-t border-white/5">
              <div className="relative group">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Envie sua dúvida para o mentor..."
                  className="w-full bg-slate-800 border-2 border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-600 outline-none transition-all text-white placeholder:text-slate-600"
                />
                <button 
                  onClick={handleSendMessage} 
                  className="absolute right-2 top-2 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-500 transition-all shadow-xl active:scale-95"
                >
                  <ArrowRight className="w-5 h-5" />
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
