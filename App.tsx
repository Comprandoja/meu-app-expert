import React, { useState, useEffect } from 'react';
import { AppView, ParentProfile, School, ArrivalNotification, ReleaseHistory, Ad, SecurityTip, Partner } from './types';
import Layout from './components/Layout';
import SchoolSelector from './components/SchoolSelector';
import ParentLogin from './components/ParentLogin';
import ParentDashboard from './components/ParentDashboard';
import SchoolAdmin from './components/SchoolAdmin';
import TestShowcase from './components/TestShowcase';
import SuperAdminPortal from './components/SuperAdminPortal';
import { generateWelcomeMessage } from './services/geminiService';
import { STORAGE_KEYS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.TestShowcase);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [notifications, setNotifications] = useState<ArrivalNotification[]>([]);
  const [history, setHistory] = useState<ReleaseHistory[]>([]);
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);
  
  const [ads, setAds] = useState<Ad[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [securityTips, setSecurityTips] = useState<SecurityTip[]>([]);

  useEffect(() => {
    try {
      const savedSchools = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
      if (savedSchools) setSchools(JSON.parse(savedSchools));

      const savedAds = localStorage.getItem(STORAGE_KEYS.GLOBAL_ADS);
      if (savedAds) setAds(JSON.parse(savedAds));

      const savedPartners = localStorage.getItem(STORAGE_KEYS.PARTNERS);
      if (savedPartners) setPartners(JSON.parse(savedPartners));
      
      setSecurityTips([{ id: '1', text: 'Respeite a velocidade máxima permitida na zona escolar.', category: 'safety' }]);
    } catch (e) {
      console.error("Erro no armazenamento local:", e);
    }
  }, []);

  const handleRegisterProfile = async (p: ParentProfile) => {
    try {
      const savedString = localStorage.getItem(STORAGE_KEYS.PARENT_PROFILE);
      const saved: ParentProfile[] = savedString ? JSON.parse(savedString) : [];
      const updated = [...saved, p];
      localStorage.setItem(STORAGE_KEYS.PARENT_PROFILE, JSON.stringify(updated));
      const msg = await generateWelcomeMessage(p.name, p.students.map(s => s.name));
      alert(msg);
    } catch (e) {
      alert(`Cadastro realizado com sucesso!`);
    }
  };

  const handleNotifyArrival = (status: 'approaching' | 'arrived', _distance?: number, _extraMessage?: string, names?: string[], grades?: string[]) => {
    if (!profile || !selectedSchool) return;
    const newNotif: ArrivalNotification = {
      id: Date.now().toString(),
      schoolId: selectedSchool.id,
      parentId: profile.id,
      parentName: profile.name,
      relationship: profile.relationship,
      studentNames: names || profile.students.map(s => s.name),
      grades: grades || profile.students.map(s => s.grade),
      gateName: "Portaria Principal",
      timestamp: Date.now(),
      status: status
    };
    setNotifications(prev => [...prev, newNotif]);
    alert("Portaria notificada!");
  };

  const handleConfirmDelivery = (notifId: string) => {
    const notif = notifications.find(n => n.id === notifId);
    if (!notif) return;
    const newHistory: ReleaseHistory = {
      id: Date.now().toString(),
      studentNames: notif.studentNames,
      gateName: notif.gateName,
      parentName: notif.parentName,
      releasedAt: Date.now()
    };
    setHistory(prev => [newHistory, ...prev]);
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  if (showSuperAdmin) {
    return (
      <Layout 
        title="Painel Central" 
        onSwitchView={() => {}} 
        currentViewName="" 
        hideSwitch 
        onReset={() => { if(confirm("Apagar todos os dados?")) { localStorage.clear(); window.location.reload(); } }}
      >
        <SuperAdminPortal 
          ads={ads} 
          onSaveAds={(newAds: Ad[]) => { setAds(newAds); localStorage.setItem(STORAGE_KEYS.GLOBAL_ADS, JSON.stringify(newAds)); }}
          partners={partners}
          onSavePartners={(newPs: Partner[]) => { setPartners(newPs); localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(newPs)); }}
          securityTips={securityTips}
          onSaveTips={(tips: SecurityTip[]) => { setSecurityTips(tips); }}
          onBack={() => setShowSuperAdmin(false)}
        />
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {view === AppView.TestShowcase && (
        <TestShowcase onStartDemo={() => setView(AppView.SchoolSelection)} />
      )}

      {view === AppView.SchoolSelection && (
        <div className="max-w-xl mx-auto p-6 py-12">
          <SchoolSelector 
            schools={schools} 
            onSelect={(s: School) => { setSelectedSchool(s); setView(AppView.ParentLogin); }}
            onCreate={(data: Omit<School, 'id' | 'latitude' | 'longitude'>) => {
              const newS: School = { ...data, id: Date.now().toString(), latitude: 0, longitude: 0 };
              const updated = [...schools, newS];
              setSchools(updated);
              localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(updated));
              setSelectedSchool(newS);
              setView(AppView.ParentLogin);
            }}
          />
          <button onClick={() => setShowSuperAdmin(true)} className="w-full mt-8 text-[9px] font-black uppercase text-slate-300 tracking-[0.3em] hover:text-indigo-500 transition-colors">Acesso Administrativo Central</button>
        </div>
      )}

      {selectedSchool && (view === AppView.ParentLogin || view === AppView.ParentDashboard || view === AppView.SchoolAdmin) && (
        <Layout 
          title={view === AppView.SchoolAdmin ? "Gestão da Portaria" : "Minha Família"}
          subtitle={selectedSchool.name}
          onSwitchView={() => setView(view === AppView.SchoolAdmin ? AppView.ParentLogin : AppView.SchoolAdmin)}
          currentViewName={view === AppView.SchoolAdmin ? "Modo Pais" : "Modo Escola"}
        >
          {view === AppView.ParentLogin && (
            <ParentLogin 
              securityTips={securityTips} 
              onLogin={(cpf: string, pass?: string) => {
                const savedString = localStorage.getItem(STORAGE_KEYS.PARENT_PROFILE);
                const saved: ParentProfile[] = savedString ? JSON.parse(savedString) : [];
                const found = saved.find((p: ParentProfile) => p.cpf === cpf && p.password === pass && p.schoolId === selectedSchool.id);
                if (found) { setProfile(found); setView(AppView.ParentDashboard); }
                else { alert("Acesso negado. CPF/Senha incorretos ou escola diferente."); }
              }}
              onBack={() => setView(AppView.SchoolSelection)}
            />
          )}

          {view === AppView.ParentDashboard && profile && (
            <ParentDashboard 
              profile={profile} 
              school={selectedSchool}
              ads={ads.filter(a => a.region === selectedSchool.region || a.region === "Toda a Cidade")} 
              history={history} 
              allNotifications={notifications}
              onNotify={handleNotifyArrival}
              onLogout={() => { setProfile(null); setView(AppView.SchoolSelection); }}
            />
          )}

          {view === AppView.SchoolAdmin && (
            <SchoolAdmin 
              school={selectedSchool}
              notifications={notifications} 
              history={history}
              availableGrades={["Berçário", "Maternal", "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"]}
              schoolStaff={[{id: '1', name: 'Operador Principal'}]}
              onUpdateStaff={() => {}} 
              onUpdateGrades={() => {}}
              onRegisterProfile={handleRegisterProfile}
              onDeleteProfile={() => {}} 
              onUpdateConfig={() => {}}
              onConfirmDelivery={(id: string) => handleConfirmDelivery(id)} 
              onClear={() => {}}
            />
          )}
        </Layout>
      )}
    </div>
  );
};

export default App;