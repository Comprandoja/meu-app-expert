
import React, { useState, useEffect } from 'react';
import { ParentProfile, Ad, ReleaseHistory, School, ArrivalNotification } from '../types';
import { STORAGE_KEYS, MASTER_GUARDIANS, RELATIONSHIP_OPTIONS } from '../constants';

interface ParentDashboardProps {
  profile: ParentProfile;
  school: School;
  ads: Ad[];
  history: ReleaseHistory[];
  allNotifications: ArrivalNotification[];
  onNotify: (status: 'approaching' | 'arrived', distance?: number, extraMessage?: string, names?: string[], grades?: string[]) => void;
  onLogout: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ profile, school, ads, history, allNotifications, onNotify, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'authorized' | 'history'>('home');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(profile.students.map(s => s.id));
  const [extraMessage, setExtraMessage] = useState('');
  const [existingAuthorized, setExistingAuthorized] = useState<ParentProfile[]>([]);
  const [isAddingAuthorized, setIsAddingAuthorized] = useState(false);
  const [newAuth, setNewAuth] = useState({ name: '', relationship: 'Vô/Vó', customRel: '', cpf: '', password: '' });

  const myChildrenNames = profile.students.map(s => s.name);
  const activePickups = allNotifications.filter(n => 
    n.studentNames.some(name => myChildrenNames.includes(name))
  );
  const myOwnNotification = activePickups.find(n => n.parentId === profile.id);

  const loadAuthorized = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARENT_PROFILE) || '[]');
    const myChildrenIds = profile.students.map(s => s.id);
    const auth = saved.filter((p: ParentProfile) => 
      p.schoolId === school.id &&
      p.students.some(s => myChildrenIds.includes(s.id)) &&
      !MASTER_GUARDIANS.includes(p.relationship)
    );
    setExistingAuthorized(auth);
  };

  useEffect(() => { loadAuthorized(); }, [profile]);

  const handleSaveAuthorized = () => {
    if (!newAuth.name || newAuth.cpf.length !== 11 || newAuth.password.length !== 6) {
      alert("Preencha todos os campos corretamente."); return;
    }
    const finalRel = newAuth.relationship === 'Outro' ? newAuth.customRel : newAuth.relationship;
    const newProfile: ParentProfile = {
      id: Date.now().toString(),
      schoolId: school.id,
      name: newAuth.name,
      cpf: newAuth.cpf,
      relationship: finalRel,
      password: newAuth.password,
      phone: '',
      students: profile.students,
    };
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARENT_PROFILE) || '[]');
    localStorage.setItem(STORAGE_KEYS.PARENT_PROFILE, JSON.stringify([...saved, newProfile]));
    alert("Autorização salva!");
    setIsAddingAuthorized(false);
    loadAuthorized();
  };

  const getGateNameForGrade = (grade: string) => {
    const gateId = school.gradeGateMapping?.[grade];
    return school.gates?.find(g => g.id === gateId)?.name || 'Portaria Geral';
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
        <button onClick={() => setActiveTab('home')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl ${activeTab === 'home' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Avisar Chegada</button>
        {MASTER_GUARDIANS.includes(profile.relationship) && (
          <button onClick={() => setActiveTab('authorized')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl ${activeTab === 'authorized' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Autorizados</button>
        )}
        <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl ${activeTab === 'history' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Histórico</button>
      </div>

      {activeTab === 'home' ? (
        <div className="space-y-6">
          {activePickups.map(pickup => (
            <div key={pickup.id} className="p-6 rounded-[2rem] border-2 border-amber-300 bg-amber-50 shadow-xl animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🚨</span>
                <div>
                  <h5 className="font-black uppercase text-sm text-amber-700">Monitorando Retirada</h5>
                  <p className="text-xs font-black text-indigo-600 uppercase">📍 Local de Saída: {pickup.gateName}</p>
                </div>
              </div>
              <div className="bg-white/70 p-4 rounded-2xl border border-white">
                <p className="text-[10px] font-black uppercase text-slate-400">Em processo de retirada por:</p>
                <p className="text-sm font-black text-slate-800">{pickup.parentName} ({pickup.relationship})</p>
              </div>
            </div>
          ))}

          {!myOwnNotification && (
            <div className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] shadow-sm space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quem você vai buscar hoje?</h4>
              {profile.students.map(student => (
                <button key={student.id} onClick={() => setSelectedStudentIds(prev => prev.includes(student.id) ? prev.filter(sid => sid !== student.id) : [...prev, student.id])} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedStudentIds.includes(student.id) ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                  <div className="text-left">
                    <p className="font-bold text-sm">{student.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[9px] font-black uppercase text-indigo-400">Portaria: {getGateNameForGrade(student.grade)}</p>
                      <span className="text-[8px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase">{student.shift}</span>
                    </div>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedStudentIds.includes(student.id) ? 'bg-indigo-500 text-white' : 'bg-white'}`}>{selectedStudentIds.includes(student.id) && '✓'}</div>
                </button>
              ))}
              <input type="text" placeholder="Algum recado para a portaria?" className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm" value={extraMessage} onChange={e => setExtraMessage(e.target.value)} />
              <button onClick={() => onNotify('arrived', 0, extraMessage, profile.students.filter(s => selectedStudentIds.includes(s.id)).map(s => s.name), profile.students.filter(s => selectedStudentIds.includes(s.id)).map(s => s.grade))} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] shadow-xl font-black uppercase text-sm">Estou na Portaria!</button>
            </div>
          )}
        </div>
      ) : activeTab === 'authorized' ? (
        <div className="space-y-6">
          <button onClick={() => setIsAddingAuthorized(true)} className="w-full p-8 border-2 border-dashed border-indigo-200 rounded-[2rem] text-indigo-600 font-black uppercase text-xs">+ Nova Autorização</button>
          <div className="space-y-3">
            {existingAuthorized.map(auth => (
              <div key={auth.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-sm">
                <div><h5 className="font-black text-slate-800 text-xs uppercase">{auth.name}</h5><p className="text-[9px] text-indigo-500 font-black uppercase">{auth.relationship}</p></div>
                <button onClick={() => {
                   const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARENT_PROFILE) || '[]');
                   localStorage.setItem(STORAGE_KEYS.PARENT_PROFILE, JSON.stringify(saved.filter((p: any) => p.id !== auth.id)));
                   loadAuthorized();
                }} className="text-red-400 text-xs font-black uppercase">Remover</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {history.filter(h => h.studentNames.some(sn => myChildrenNames.includes(sn))).map(item => (
            <div key={item.id} className="bg-white border-l-4 border-emerald-500 p-5 rounded-2xl shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase">Retirada em {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(item.releasedAt)}</p>
              <p className="text-sm font-bold text-slate-700">{item.studentNames.join(', ')}</p>
              <p className="text-[10px] font-black text-indigo-500 uppercase">📍 Saída: {item.gateName} | Buscado por: {item.parentName}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center pt-8 border-t border-slate-100">
        <button onClick={onLogout} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500">Sair da Conta</button>
      </div>
    </div>
  );
};

export default ParentDashboard;
