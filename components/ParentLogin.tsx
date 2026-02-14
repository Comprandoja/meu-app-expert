import React, { useState, useEffect } from 'react';
import { SecurityTip } from '../types';

interface ParentLoginProps {
  onLogin: (cpf: string, password?: string) => void;
  onBack: () => void;
  securityTips: SecurityTip[];
}

const ParentLogin: React.FC<ParentLoginProps> = ({ onLogin, onBack, securityTips }) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleAttemptLogin = () => {
    setError('');
    if (cpf.length !== 11) {
      setError('O CPF deve conter exatamente 11 dígitos.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 dígitos.');
      return;
    }
    onLogin(cpf, password);
  };

  return (
    <div className="animate-fade-in space-y-8 py-6 flex flex-col min-h-[500px]">
      <div className="text-center">
        <span className="text-5xl block mb-4">🔐</span>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Acesso Seguro</h2>
        <p className="text-slate-400 text-xs mt-2 font-medium">Use seu CPF e a senha cadastrada.</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto w-full flex-1">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">CPF</label>
            <input 
              type="tel" 
              maxLength={11}
              placeholder="000.000.000-00" 
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold text-lg"
              value={cpf}
              onChange={e => setCpf(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Senha</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••" 
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold text-lg tracking-widest"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-[10px] font-black uppercase border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <button 
          onClick={handleAttemptLogin}
          className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl"
        >
          Entrar no Painel
        </button>

        <button onClick={onBack} className="w-full text-slate-300 font-bold uppercase text-[10px] tracking-widest pt-4">Trocar de Escola</button>
      </div>
    </div>
  );
};

export default ParentLogin;