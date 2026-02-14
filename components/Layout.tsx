
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onSwitchView: () => void;
  currentViewName: string;
  hideSwitch?: boolean;
  onReset?: () => void;
  onOpenSuperAdmin?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, onSwitchView, currentViewName, hideSwitch, onReset, onOpenSuperAdmin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🏫</span> Escola Express
            </h1>
            {subtitle && (
              <div className="hidden md:block h-6 w-px bg-white/20"></div>
            )}
            {subtitle && <p className="text-indigo-100 text-[10px] font-medium uppercase tracking-wider">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            {!hideSwitch && (
              <button 
                onClick={onSwitchView}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors border border-white/10"
              >
                {currentViewName}
              </button>
            )}
            {onOpenSuperAdmin && (
              <button 
                onClick={onOpenSuperAdmin}
                className="bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
                title="Admin Geral (Marketing)"
              >
                ⚙️ Admin Geral
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
           <div className="bg-slate-50/50 border-b border-slate-100 p-6 flex justify-between items-center">
             <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase text-sm">{title}</h2>
             {onReset && (
               <button 
                 onClick={onReset}
                 className="text-[9px] bg-red-50 text-red-500 px-3 py-1.5 rounded-full font-black uppercase tracking-widest hover:bg-red-100 transition-colors border border-red-100"
               >
                 Reiniciar Sistema
               </button>
             )}
           </div>
           <div className="p-6 md:p-8">
            {children}
           </div>
        </div>
      </main>
      <footer className="p-6 text-center space-y-4">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          &copy; 2024 Escola Express - Ponta Grossa / PR
        </p>
      </footer>
    </div>
  );
};

export default Layout;
