import React from 'react';
import { Ad, SecurityTip, Partner } from '../types';

interface SuperAdminPortalProps {
  ads: Ad[];
  onSaveAds: (ads: Ad[]) => void;
  partners: Partner[];
  onSavePartners: (partners: Partner[]) => void;
  securityTips: SecurityTip[];
  onSaveTips: (tips: SecurityTip[]) => void;
  onBack: () => void;
}

const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({ onBack }) => {
  return (
    <div className="space-y-8 p-4">
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
        <h3 className="text-xl font-black uppercase tracking-tight">Painel Central</h3>
        <p className="text-white/40 text-[10px] font-black uppercase mt-2">Administração Geral</p>
      </div>
      <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-black uppercase text-xs">Aguardando implementação de módulos...</p>
      </div>
      <button onClick={onBack} className="w-full py-4 text-slate-400 font-black uppercase text-[10px]">Voltar para o App</button>
    </div>
  );
};

export default SuperAdminPortal;