
import React, { useState } from 'react';
import { ParentProfile, StudentInfo } from '../types';
import { RELATIONSHIP_OPTIONS, DEFAULT_GRADES } from '../constants';

interface RegistrationFormProps {
  schoolId: string;
  onRegister: (profile: ParentProfile) => void;
  availableGrades: string[];
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ schoolId, onRegister, availableGrades }) => {
  const [parentData, setParentData] = useState({
    name: '',
    cpf: '',
    relationship: RELATIONSHIP_OPTIONS[0],
    phone: '',
    password: ''
  });
  
  const [students, setStudents] = useState<Omit<StudentInfo, 'id'>[]>([
    { name: '', grade: availableGrades[0] || DEFAULT_GRADES[0], shift: 'Manhã' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentData.cpf.length !== 11) return alert("CPF deve ter 11 números");
    if (parentData.password.length < 6) return alert("A senha deve ter 6 dígitos");

    const profile: ParentProfile = {
      id: Math.random().toString(36).substr(2, 9),
      schoolId,
      ...parentData,
      students: students.map(s => ({ ...s, id: Math.random().toString(36).substr(2, 5) })) as StudentInfo[]
    };
    
    onRegister(profile);
    // Limpar campos
    setParentData({ name: '', cpf: '', relationship: RELATIONSHIP_OPTIONS[0], phone: '', password: '' });
    setStudents([{ name: '', grade: availableGrades[0] || DEFAULT_GRADES[0], shift: 'Manhã' }]);
  };

  const inputClasses = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold transition-all";
  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-2 tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-lg mx-auto pb-10">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
           <span className="w-2 h-2 bg-indigo-600 rounded-full"></span> Dados do Responsável
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Nome Completo do Responsável</label>
            <input required type="text" className={inputClasses} value={parentData.name} onChange={e => setParentData({...parentData, name: e.target.value})} placeholder="Ex: João Silva" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>CPF (Login)</label>
              <input required type="tel" maxLength={11} className={inputClasses} value={parentData.cpf} onChange={e => setParentData({...parentData, cpf: e.target.value.replace(/\D/g, '')})} placeholder="00000000000" />
            </div>
            <div>
              <label className={labelClasses}>Senha (6 dígitos)</label>
              <input required type="password" maxLength={6} className={inputClasses} value={parentData.password} onChange={e => setParentData({...parentData, password: e.target.value.replace(/\D/g, '')})} placeholder="••••••" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Dados do Aluno (Filho)
          </h3>
          <button type="button" onClick={() => setStudents([...students, { name: '', grade: availableGrades[0], shift: 'Manhã' }])} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">+ Adicionar Filho</button>
        </div>

        {students.map((student, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 relative">
            <div>
              <label className={labelClasses}>Nome do Aluno</label>
              <input required type="text" className={inputClasses} value={student.name} onChange={e => {
                const ns = [...students]; ns[idx].name = e.target.value; setStudents(ns);
              }} placeholder="Nome Completo do Aluno" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Turma / Série</label>
                <select className={inputClasses} value={student.grade} onChange={e => {
                  const ns = [...students]; ns[idx].grade = e.target.value; setStudents(ns);
                }}>
                  {(availableGrades.length > 0 ? availableGrades : DEFAULT_GRADES).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Turno</label>
                <select className={inputClasses} value={student.shift} onChange={e => {
                  const ns = [...students]; ns[idx].shift = e.target.value as any; setStudents(ns);
                }}>
                  <option value="Manhã">☀️ Manhã</option>
                  <option value="Tarde">🌤️ Tarde</option>
                  <option value="Integral">🔄 Integral</option>
                </select>
              </div>
            </div>
            {students.length > 1 && (
              <button type="button" onClick={() => setStudents(students.filter((_, i) => i !== idx))} className="absolute top-4 right-6 text-red-400 text-[10px] font-black uppercase">Remover</button>
            )}
          </div>
        ))}
      </div>

      <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-sm shadow-xl hover:bg-indigo-700 transition-all">
        Concluir Cadastro Escolar
      </button>
    </form>
  );
};

export default RegistrationForm;
