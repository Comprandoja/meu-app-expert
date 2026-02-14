export interface Gate {
  id: string;
  name: string;
}

export interface School {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  region: string;
  responsibleName: string;
  responsiblePhone: string;
  latitude: number;
  longitude: number;
  gates?: Gate[];
  gradeGateMapping?: Record<string, string>;
}

export interface StudentInfo {
  id: string;
  name: string;
  grade: string;
  shift: 'Manhã' | 'Tarde' | 'Integral';
}

export interface ParentProfile {
  id: string;
  schoolId: string;
  name: string;
  cpf: string;
  relationship: string;
  phone: string;
  password: string;
  students: StudentInfo[];
}

export interface ArrivalNotification {
  id: string;
  schoolId: string;
  parentId: string;
  parentName: string;
  relationship: string;
  studentNames: string[];
  grades: string[];
  gateName: string;
  timestamp: number;
  status: 'approaching' | 'arrived' | 'released';
}

export interface Ad {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  shortDescription: string;
  region: string;
  emoji: string;
  link: string;
  featured: boolean;
}

export interface ReleaseHistory {
  id: string;
  studentNames: string[];
  gateName: string;
  parentName: string;
  releasedAt: number;
}

export interface SchoolStaff {
  id: string;
  name: string;
}

export interface SecurityTip {
  id: string;
  text: string;
  category: string;
}

export interface Partner {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  contactName: string;
  region: string;
}

export enum AppView {
  SchoolSelection = 'SCHOOL_SELECTION',
  ParentLogin = 'PARENT_LOGIN',
  ParentDashboard = 'PARENT_DASHBOARD',
  SchoolAdmin = 'SCHOOL_ADMIN',
  TestShowcase = 'TEST_SHOWCASE'
}

export {}; // Garante que o TS trate como módulo