
import React, { useState } from 'react';
import { ArrivalNotification, School, ParentProfile, ReleaseHistory, SchoolStaff } from '../types';
import RegistrationForm from './RegistrationForm';

interface SchoolAdminProps {
  school: School;
  notifications: ArrivalNotification[];
  history: ReleaseHistory[];
  availableGrades: string[];
  schoolStaff: SchoolStaff[];
  onUpdateStaff: (staff: SchoolStaff[]) => void;
  onUpdateGrades: (grades: string[]) => void;
  onRegisterProfile: (profile: ParentProfile) => void;
  onDeleteProfile: (id: string) => void;
  onUpdateConfig: (school: School) => void;
  onConfirmDelivery: (notifId: string, staffName: string, observation: string, verified: boolean) => void;
  onClear: (id: string) => void;
}

const SchoolAdmin: React.FC<SchoolAdminProps> = ({ 
  school, notifications, availableGrades, schoolStaff, onRegisterProfile, onConfirmDelivery 
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'registration'>('queue');
  const [currentStaffId, setCurrentStaffId] = useState('');

  const handleConfirm = (id: string) => {
    const staff = schoolStaff.find(s => s.id === currentStaffId);
    if (!staff) return alert("Selecione o Operador primeiro!");
    onConfirmDelivery(id, staff.name, '', true);
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
        <button onClick={() => setActiveTab('queue')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl ${activeTab === 'queue' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Fila de Chamados</button>
        <button onClick={() => setActiveTab('registration')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl ${activeTab === 'registration' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Cadastrar Pais</button>
      </div>

      {activeTab === 'queue' ? (
        <div className="space-y-4">
          <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-lg">
             <label className="text-[9px] font-black uppercase opacity-60 block mb-2">Operador em Serviço:</label>
             <select className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-xs outline-none" value={currentStaffId} onChange={e => setCurrentStaffId(e.target.value)}>
               <option value="" className="text-slate-800">Selecione seu nome...</option>
               {schoolStaff.map(s => <option key={s.id} value={s.id} className="text-slate-800">{s.name}</option>)}
             </select>
          </div>

          {notifications.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold uppercase text-xs">Aguardando chegadas...</div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm space-y-4 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-sm">{notif.parentName}</h4>
                    <p className="text-[10px] font-black text-indigo-500 uppercase">📍 {notif.gateName}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="space-y-2">
                  {notif.studentNames.map((n, i) => (
                    <div key={i} className="flex justify-between p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                      <span className="font-bold text-slate-700">{n}</span>
                      <span className="text-indigo-600 font-black uppercase">{notif.grades[i]}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleConfirm(notif.id)} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-emerald-50 hover:bg-emerald-600 transition-all">Liberar Alunos</button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white p-2 rounded-[2rem]">
          <div className="p-4 mb-6 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-[10px] text-amber-700 font-black uppercase leading-tight">Dica: Cadastre o pai/mãe com os dados do filho para que eles possam fazer o login no modo pais.</p>
          </div>
          <RegistrationForm 
            schoolId={school.id} 
            availableGrades={availableGrades} 
            onRegister={(p) => { onRegisterProfile(p); setActiveTab('queue'); }} 
          />
        </div>
      )}
    </div>
  );
};

export default SchoolAdmin;
