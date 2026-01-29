
import React from 'react';
import { 
  LayoutDashboard, 
  Radar, 
  Users, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Calculator,
  Building,
  Trophy,
  ShieldCheck,
  Briefcase,
  BarChart3,
  Send
} from 'lucide-react';
import { Lead, ChatContact, AppLanguage, NavSection } from './types';

export const LANG_OPTIONS: { code: AppLanguage; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: 'BR' },
  { code: 'en', label: 'English', flag: 'US' },
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'zh', label: '中文', flag: 'CN' },
  { code: 'hi', label: 'हिन्दी', flag: 'IN' },
  { code: 'fr', label: 'Français', flag: 'FR' },
];

export const TRANSLATIONS: Record<AppLanguage, any> = {
  pt: {
    dashboard: 'Painel Geral',
    radar: 'Social Radar',
    leads: 'Meus Leads',
    senior_command: 'Comando Sênior',
    messenger: 'Mensagens',
    market: 'Análise de Mercado',
    appraisal: 'Calculadora Técnica',
    jobs: 'Oportunidades',
    chat: 'Atendimento IA',
    settings: 'Configurações',
    help: 'Central de Ajuda',
    launches: 'Lançamentos',
    emails: 'Email Intel',
    performance: 'Elite Squad',
    total_leads: 'Total de Capturas',
    hot_leads: 'Leads Quentes',
    active_scan: 'Iniciar Varredura IA',
    search_placeholder: 'Pesquisar...',
    welcome: 'Bem-vindo ao Protocolo LeadGen',
  },
  en: {
    dashboard: 'Dashboard',
    radar: 'Social Radar',
    leads: 'My Leads',
    senior_command: 'Senior Command',
    messenger: 'Messages',
    market: 'Market Analysis',
    appraisal: 'Appraisal Calc',
    jobs: 'Jobs',
    chat: 'AI Assistant',
    settings: 'Settings',
    help: 'Help Center',
    launches: 'Launches',
    emails: 'Email Intel',
    performance: 'Elite Squad',
    total_leads: 'Total Captures',
    hot_leads: 'Hot Leads',
    active_scan: 'Start AI Scan',
    search_placeholder: 'Search...',
    welcome: 'Welcome to LeadGen Protocol',
  },
  es: {
    dashboard: 'Tablero',
    radar: 'Radar Social',
    leads: 'Mis Leads',
    senior_command: 'Mando Senior',
    messenger: 'Mensajes',
    market: 'Análisis de Mercado',
    appraisal: 'Calculadora',
    jobs: 'Empleos',
    chat: 'Asistente IA',
    settings: 'Ajustes',
    help: 'Ayuda',
    launches: 'Lanzamientos',
    emails: 'Email Intel',
    performance: 'Elite Squad',
    total_leads: 'Total Capturas',
    hot_leads: 'Leads Calientes',
    active_scan: 'Iniciar Escaneo',
    search_placeholder: 'Buscar...',
    welcome: 'Bienvenido',
  },
  zh: { dashboard: '仪表板', radar: '社交雷达', leads: '我的潜在客户', senior_command: '高级指挥部', messenger: '消息', market: '市场分析', appraisal: '评估计算器', jobs: '工作机会', chat: '人工智能助手', settings: '设置', help: '帮助中心', launches: '新楼盘', emails: '邮件情报', performance: '精英小组', total_leads: '总捕获量', hot_leads: '热门潜在客户', active_scan: '开始人工智能扫描', search_placeholder: '搜索...', welcome: '欢迎来到 LeadGen 协议' },
  hi: { dashboard: 'डैशबोर्ड', radar: 'सोशल रडार', leads: 'मेरे लीड्स', senior_command: 'सीनियर कमांड', messenger: 'संदेश', market: 'बाज़ार विश्लेषण', appraisal: 'मूल्यांकन कैलकुलेटर', jobs: 'नौकरियां', chat: 'AI सहायक', settings: 'सेटिंग्स', help: 'सहायta केंद्र', launches: 'लॉन्च', emails: 'ईमेल इंटेलिजेंस', performance: 'एलीट स्क्वाड', total_leads: 'कुल कैप्चर', hot_leads: 'हॉट लीड्स', active_scan: 'AI स्कैन शुरू करें', search_placeholder: 'खोजें...', welcome: 'LeadGen प्रोटोकॉल में आपका स्वागत है' },
  fr: { dashboard: 'Tableau de bord', radar: 'Radar Social', leads: 'Mes Leads', senior_command: 'Commandement Senior', messenger: 'Messages', market: 'Analyse de Marché', appraisal: 'Calculateur d\'Évaluation', jobs: 'Opportunités', chat: 'Assistant IA', settings: 'Paramètres', help: 'Centre d\'Aide', launches: 'Lancements', emails: 'Email Intel', performance: 'Escouade d\'Élite', total_leads: 'Captures Totales', hot_leads: 'Leads Chauds', active_scan: 'Démarrer le Scan IA', search_placeholder: 'Rechercher...', welcome: 'Bienvenue au Protocole LeadGen' }
};

export const getNavItems = (lang: AppLanguage) => [
  { id: NavSection.Dashboard, label: TRANSLATIONS[lang].dashboard, icon: <LayoutDashboard size={20} /> },
  { id: NavSection.SeniorCommand, label: TRANSLATIONS[lang].senior_command, icon: <ShieldCheck size={20} /> },
  { id: NavSection.SocialRadar, label: TRANSLATIONS[lang].radar, icon: <Radar size={20} /> },
  { id: NavSection.Leads, label: TRANSLATIONS[lang].leads, icon: <Users size={20} /> },
  { id: NavSection.JobBoard, label: TRANSLATIONS[lang].jobs, icon: <Briefcase size={20} /> },
  { id: NavSection.AppraisalCalc, label: TRANSLATIONS[lang].appraisal, icon: <Calculator size={20} /> },
  { id: NavSection.MarketAnalysis, label: TRANSLATIONS[lang].market, icon: <BarChart3 size={20} /> },
  { id: NavSection.Messenger, label: TRANSLATIONS[lang].messenger, icon: <Send size={20} /> },
  { id: NavSection.Launches, label: TRANSLATIONS[lang].launches, icon: <Building size={20} /> },
  { id: NavSection.Performance, label: TRANSLATIONS[lang].performance, icon: <Trophy size={20} /> },
  { id: NavSection.AIChat, label: TRANSLATIONS[lang].chat, icon: <MessageSquare size={20} /> },
  { id: NavSection.Settings, label: TRANSLATIONS[lang].settings, icon: <SettingsIcon size={20} /> },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    need: 'Apartamento 3 dormitórios com varanda gourmet no Urbanova',
    location: 'SJC, SP',
    score: 85,
    triggers: ['FGTS'],
    foundAt: 'Twitter/X',
    status: 'Novo',
    type: 'buyer',
    lastInteraction: new Date().toISOString(),
  },
  {
    id: 'stale-demo',
    name: 'Roberto Estagnado',
    need: 'Busca terreno para investimento em condomínio',
    location: 'SJC, SP',
    score: 92,
    triggers: ['Investimento'],
    foundAt: 'Facebook',
    status: 'Em Contato',
    type: 'buyer',
    lastInteraction: new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)).toISOString(), // 10 dias atrás (ALPHA RED PULSE)
  }
];

export const MOCK_CONTACTS: ChatContact[] = [
  { id: 'c1', name: 'Ricardo Santos', role: 'Gerente', online: true, lastMessage: 'Como estão os leads?' },
];

export const MOCK_PERFORMANCE = [
  { id: '1', name: 'Ricardo Santos', role: 'Corretor Alpha', avatar: '', leadsCaptured: 142, dealsClosed: 12, conversionRate: 8.4, responseTime: '12min', isTeam: false },
  { id: 't1', name: 'Alpha Team', role: 'Squad', avatar: '', leadsCaptured: 500, dealsClosed: 45, conversionRate: 9.2, responseTime: '10min', isTeam: true },
];
