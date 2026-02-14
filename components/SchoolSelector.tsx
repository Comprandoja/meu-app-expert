
import React, { useState } from 'react';
import { School } from '../types';
import { REGIONS } from '../constants';

interface SchoolSelectorProps {
  schools: School[];
  onSelect: (school: School) => void;
  onCreate: (schoolData: Omit<School, 'id' | 'latitude' | 'longitude'>) => void;
}

const SchoolSelector: React.FC<SchoolSelectorProps> = ({ schools, onSelect, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    address: '',
    region: REGIONS[0],
    responsibleName: '',
    responsiblePhone: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const inputClasses = "w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm mb-3 font-medium";
  const labelClasses = "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 block";

  const handleCreate = () => {
    if (!formData.name || !formData.cnpj) {
      alert("Preencha o Nome e CNPJ da Instituição.");
      return;
    }
    onCreate(formData);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <span className="text-5xl">🏢</span>
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Seleção de Unidade</h3>
        <p className="text-slate-500 text-sm">Ponta Grossa - PR</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {schools.map(school => (
          <button
            key={school.id}
            onClick={() => onSelect(school)}
            className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left"
          >
            <div>
              <p className="font-bold text-slate-800 group-hover:text-indigo-700">{school.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                {school.region} | {school.address}
              </p>
            </div>
            <span className="text-slate-300 group-hover:text-indigo-500">→</span>
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100">
        {!isCreating ? (
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all"
          >
            + Adicionar Nova Escola
          </button>
        ) : (
          <div className="bg-slate-50 p-8 rounded-[2.5rem] shadow-inner border border-slate-200 animate-fade-in">
            <h4 className="text-[10px] font-black uppercase text-indigo-600 mb-6 tracking-widest text-center border-b border-indigo-100 pb-2">Cadastro de Nova Instituição</h4>
            
            <label className={labelClasses}>Nome da Instituição</label>
            <input type="text" placeholder="Escola Exemplo" className={inputClasses} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            
            <label className={labelClasses}>CNPJ</label>
            <input type="text" placeholder="00.000.000/0000-00" className={inputClasses} value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
            
            <label className={labelClasses}>Bairro / Região</label>
            <select className={inputClasses} value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            
            <label className={labelClasses}>Endereço Completo</label>
            <input type="text" placeholder="Rua..." className={inputClasses} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className={labelClasses}>Responsável (Diretor/Adm)</label>
                <input type="text" placeholder="Nome Completo" className={inputClasses} value={formData.responsibleName} onChange={e => setFormData({...formData, responsibleName: e.target.value})} />
              </div>
              <div>
                <label className={labelClasses}>WhatsApp de Contato</label>
                <input type="tel" placeholder="(42) 00000-0000" className={inputClasses} value={formData.responsiblePhone} onChange={e => setFormData({...formData, responsiblePhone: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={handleCreate} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Salvar Unidade</button>
              <button onClick={() => setIsCreating(false)} className="px-6 py-4 text-slate-400 font-black uppercase text-[10px]">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolSelector;
