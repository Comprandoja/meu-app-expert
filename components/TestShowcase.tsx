
import React from 'react';

interface TestShowcaseProps {
  onStartDemo: () => void;
}

const TestShowcase: React.FC<TestShowcaseProps> = ({ onStartDemo }) => {
  return (
    <div className="animate-fade-in space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
          Tecnologia Escolar Inteligente
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
          Segurança e agilidade para <br/>
          <span className="text-indigo-600">toda a escola.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          O aplicativo que conecta o <strong>Responsável</strong> à <strong>Portaria</strong> em tempo real, organizando a saída dos alunos com praticidade.
        </p>
      </div>

      {/* Feature Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4 shadow-sm">
          <div className="text-3xl">📱</div>
          <h3 className="font-bold text-slate-800">Acesso Web-App</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Sem downloads pesados. O responsável acessa de qualquer celular via navegador em segundos.</p>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-indigo-200">
          <div className="text-3xl">💬</div>
          <h3 className="font-bold">Aviso Direto</h3>
          <p className="text-sm text-indigo-100 leading-relaxed">Notifique sua chegada com um clique. A portaria recebe o alerta visual e sonoro imediato.</p>
        </div>
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4 shadow-sm">
          <div className="text-3xl">🔐</div>
          <h3 className="font-bold text-slate-800">Múltiplos Perfis</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Cadastre pais, avós ou transportadores com segurança e mensagens individuais da escola.</p>
        </div>
      </div>

      {/* Seção Parceiro ComprandoJá - Estilo Fiel ao Logo Enviado */}
      <div className="bg-gradient-to-r from-slate-50 to-white border-2 border-blue-100 p-8 md:p-10 rounded-[3rem] shadow-lg overflow-hidden relative group">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          
          {/* Logo Comprando Já - Lado Esquerdo - Estilo Circular conforme anexo */}
          <div className="relative flex-shrink-0">
            {/* Glow de fundo inspirado no degradê do anexo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500 via-blue-500 to-purple-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-2xl flex items-center justify-center bg-white overflow-hidden p-4">
               <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] md:text-[12px] font-black text-indigo-900 tracking-tighter mb-2">COMPRANDO JÁ</span>
                  
                  {/* Ícone: Carrinho de Compras em cima da Mão (Representação SVG) */}
                  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-24 md:h-24">
                    <path d="M25 35h10l8 30h35l6-20H40" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="48" cy="72" r="4" fill="#2563eb"/>
                    <circle cx="72" cy="72" r="4" fill="#2563eb"/>
                    <path d="M20 80c10-5 30-10 60 0-5-10-15-15-30-15s-25 5-30 15z" fill="#2563eb" opacity="0.1"/>
                    <path d="M20 80q30-12 60 0M35 70h30" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
               </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-5">
            <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              Plataforma Integrada
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter leading-none">
              Uma ferramenta do <br/><span className="text-blue-600">Portal ComprandoJá.</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              O Escola Express faz parte do ecossistema de conveniência regional que conecta você às melhores oportunidades da região.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              <a 
                href="https://www.comprandoja.com.br" 
                target="_blank" 
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-700 transition-all hover:-translate-y-1"
              >
                Visitar Portal
              </a>
              
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-blue-50 shadow-sm">
                <div className="w-14 h-14 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-center">
                   <div className="w-full h-full grid grid-cols-4 gap-0.5">
                      {Array.from({length: 16}).map((_, i) => (
                        <div key={i} className={`rounded-xs ${Math.random() > 0.4 ? 'bg-slate-800' : 'bg-transparent'}`}></div>
                      ))}
                   </div>
                </div>
                <div className="text-left">
                   <p className="text-[9px] font-black text-slate-400 uppercase leading-tight">Acesso Rápido</p>
                   <p className="text-[10px] font-bold text-blue-600">comprandoja.com.br</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-6 pt-6">
        <button 
          onClick={onStartDemo}
          className="bg-indigo-600 text-white px-14 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
        >
          Iniciar Demonstração
        </button>
      </div>

      <div className="text-center pt-8 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
            Escola Express &bull; Solução Powered by Portal ComprandoJá &copy; 2024
          </p>
      </div>
    </div>
  );
};

export default TestShowcase;
