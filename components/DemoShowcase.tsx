
import React from 'react';

interface DemoShowcaseProps {
  onStartDemo: () => void;
}

const DemoShowcase: React.FC<DemoShowcaseProps> = ({ onStartDemo }) => {
  return (
    <div className="animate-fade-in space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          A Evolução da Portaria Escolar
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Segurança e agilidade para <span className="text-indigo-600">toda a escola.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          O aplicativo que conecta o <strong>Responsável</strong> à <strong>Portaria</strong> em tempo real, eliminando filas e barulho.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
          <div className="text-3xl">📱</div>
          <h3 className="font-bold text-slate-800">App Instalável</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Sem downloads pesados. O responsável instala direto do navegador em segundos.</p>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-indigo-200">
          <div className="text-3xl">🛰️</div>
          <h3 className="font-bold">Aviso por GPS</h3>
          <p className="text-sm text-indigo-100 leading-relaxed">Notificação automática ao entrar no raio de busca. O aluno já desce pronto.</p>
        </div>
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
          <div className="text-3xl">🔐</div>
          <h3 className="font-bold text-slate-800">Controle Total</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Identificação visual do responsável, placa do veículo e histórico de retiradas.</p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">🏫</div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Por que escolher o Escola Express?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="h-6 w-6 rounded-full bg-indigo-500 flex-shrink-0"></span>
                <p className="text-sm text-slate-300"><strong>Redução de 70%</strong> no tempo de espera dos pais na fila do carro.</p>
              </div>
              <div className="flex gap-4">
                <span className="h-6 w-6 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <p className="text-sm text-slate-300"><strong>Silêncio absoluto</strong> na portaria, sem necessidade de microfones ou alto-falantes.</p>
              </div>
              <div className="flex gap-4">
                <span className="h-6 w-6 rounded-full bg-amber-500 flex-shrink-0"></span>
                <p className="text-sm text-slate-300"><strong>Privacidade</strong> de dados garantida, sem compartilhamento com terceiros.</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
             <div className="aspect-video bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300 text-xs italic">
               [ Vídeo de Demonstração ]
             </div>
             <p className="mt-4 text-[10px] text-center text-slate-500 uppercase font-black tracking-widest">Interface da Portaria em Tempo Real</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center space-y-8 pb-12">
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-slate-800">Experimente agora.</h3>
          <p className="text-slate-500">Clique abaixo para testar a interface do Responsável e da Escola.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={onStartDemo}
            className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
          >
            Abrir Demonstração do App
          </button>
          <a 
            href="https://wa.me/seu-numero" 
            target="_blank" 
            className="bg-white border-2 border-slate-200 text-slate-800 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:border-indigo-600 transition-all"
          >
            Falar com Especialista
          </a>
        </div>
      </div>
    </div>
  );
};

export default DemoShowcase;
