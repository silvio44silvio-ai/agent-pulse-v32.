
export type AppLanguage = 'pt' | 'en' | 'es' | 'zh' | 'hi' | 'fr';

export interface Lead {
  id: string;
  name: string;
  need: string;
  location: string;
  score: number;
  triggers: string[];
  contact?: string;
  email?: string;
  publicProfileUrl?: string;
  sourceUrl?: string;
  foundAt: string;
  status: 'Novo' | 'Em Contato' | 'Agendado' | 'Negócio Fechado';
  type: 'buyer' | 'owner';
  value?: number;
  lastInteraction?: string;
  brokerId?: string;
  propertyImage?: string;
  
  // Banco de Dados 360º
  personalData?: {
    fullName?: string;
    cpf?: string;
    rg?: string;
    birthDate?: string;
    profession?: string;
    maritalStatus?: string;
    nationality?: string;
  };
}

export interface SearchSchedule {
  id: string;
  niche: string;
  location: string;
  type: 'buyer' | 'owner';
  days: string[];
  time: string;
  active: boolean;
}

export interface UserProfile {
  brokerName: string;
  agencyName: string;
  welcomeMessage: string;
  phone: string;
  catalogLink?: string;
  bioLink?: string;
  instagram?: string;
  profilePicture?: string;
  trialStartDate?: string;
  proToken?: string;
  language?: AppLanguage;
  customApiKey?: string;
  googleSheetsUrl?: string;
  customInstructions?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  enableTelegramAlerts?: boolean;
  schedules?: SearchSchedule[];
}

export enum NavSection {
  Dashboard = 'dashboard',
  SocialRadar = 'radar',
  Leads = 'leads',
  SeniorCommand = 'senior_command',
  MarketAnalysis = 'market',
  AppraisalCalc = 'appraisal',
  JobBoard = 'jobs',
  AIChat = 'chat',
  Messenger = 'messenger',
  Settings = 'settings',
  Help = 'help',
  Admin = 'admin',
  Launches = 'launches',
  EmailMarketing = 'emails',
  Performance = 'performance',
  Presentation = 'presentation'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  online: boolean;
  lastMessage: string;
  isGroup?: boolean;
  membersCount?: number;
}

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

export interface JobOpportunity {
  id?: string;
  type: 'broker_seeking' | 'agency_seeking';
  title: string;
  company: string;
  description: string;
  location: string;
  remuneration: string;
  postedAt: string;
  image?: string; // Campo para Base64 da imagem
}

export interface TalentProfile {
  id?: string;
  name: string;
  role: string;
  experience: string;
  contact: string;
  location: string;
  type: string;
  image?: string; // Campo para Base64 da imagem
}
