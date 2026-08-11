import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane,
  FileSpreadsheet,
  MapPin,
  BarChart3,
  Globe2,
  ChevronRight,
  Sparkles,
  Trophy,
  ArrowRight,
  Moon,
  Sun,
  UserCheck,
  Plus,
  Ticket,
  Luggage,
  QrCode,
  Clock,
  Navigation,
  Share2,
  Compass,
  CheckCircle2,
  Check,
  Copy,
  Radio,
  Sliders,
  PlaneTakeoff,
  PlaneLanding,
  Building2,
  Layers
} from 'lucide-react';

interface LandingPageProps {
  onExploreDemo: () => void;
  onOpenLogin: () => void;
  onOpenImport: () => void;
  onOpenAddFlight: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentUser: { name: string; email: string; avatar?: string } | null;
}

// Sample Interactive Boarding Pass Themes
const SAMPLE_TICKETS = [
  {
    airline: 'LATAM Airlines',
    flightNumber: 'LA3021',
    fromCode: 'GRU',
    fromCity: 'São Paulo',
    toCode: 'SDU',
    toCity: 'Rio de Janeiro',
    aircraft: 'Airbus A320neo',
    registration: 'PR-XBB',
    gate: '214B',
    seat: '01A (Janela / First)',
    depTime: '08:30',
    arrTime: '09:30',
    duration: '1h 00m',
    color: 'from-[#EC6726] to-[#d9581d]',
    logoBg: 'bg-red-600',
    classType: 'Executiva',
  },
  {
    airline: 'Gol Linhas Aéreas',
    flightNumber: 'G31420',
    fromCode: 'CGH',
    fromCity: 'São Paulo',
    toCode: 'BSB',
    toCity: 'Brasília',
    aircraft: 'Boeing 737 MAX 8',
    registration: 'PR-XMR',
    gate: '04A',
    seat: '03F (Premium)',
    depTime: '14:15',
    arrTime: '16:00',
    duration: '1h 45m',
    color: 'from-orange-500 to-[#EC6726]',
    logoBg: 'bg-orange-500',
    classType: 'Gol Premium',
  },
  {
    airline: 'Azul Linhas Aéreas',
    flightNumber: 'AD4050',
    fromCode: 'VCP',
    fromCity: 'Campinas',
    toCode: 'CNF',
    toCity: 'Belo Horizonte',
    aircraft: 'Embraer E195-E2',
    registration: 'PS-AE1',
    gate: 'B12',
    seat: '02A (Espaço Azul)',
    depTime: '10:00',
    arrTime: '11:15',
    duration: '1h 15m',
    color: 'from-blue-600 to-cyan-500',
    logoBg: 'bg-blue-600',
    classType: 'Espaço Azul',
  },
  {
    airline: 'Emirates',
    flightNumber: 'EK0262',
    fromCode: 'GRU',
    fromCity: 'São Paulo',
    toCode: 'DXB',
    toCity: 'Dubai',
    aircraft: 'Airbus A380-800',
    registration: 'A6-EEO',
    gate: 'G32',
    seat: '02K (Primeira Classe)',
    depTime: '01:25',
    arrTime: '22:55',
    duration: '14h 30m',
    color: 'from-amber-600 to-yellow-500',
    logoBg: 'bg-amber-600',
    classType: 'First Class Suite',
  },
];

// Airport Split Flap / Solari Board Mock Rows
const SOLARI_FLIGHTS = [
  { code: 'LA 3021', dest: 'RIO DE JANEIRO (SDU)', gate: 'B12', status: 'EMBARQUE', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { code: 'G3 1420', dest: 'BRASÍLIA (BSB)', gate: 'A04', status: 'CONFIRMADO', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { code: 'AD 4050', dest: 'BELO HORIZONTE (CNF)', gate: 'C08', status: 'NO MUNDO', color: 'text-[#EC6726] border-[#EC6726]/30 bg-[#EC6726]/10' },
  { code: 'EK 0262', dest: 'DUBAI (DXB)', gate: 'G32', status: 'NO HORÁRIO', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDemo,
  onOpenLogin,
  onOpenImport,
  onOpenAddFlight,
  isDarkMode,
  onToggleTheme,
  currentUser,
}) => {
  const [selectedTicketIdx, setSelectedTicketIdx] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [flightModeTab, setFlightModeTab] = useState<'myflightradar' | 'excel' | 'manual'>('myflightradar');

  const ticket = SAMPLE_TICKETS[selectedTicketIdx];

  const handleCopyDemoLink = () => {
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#u/denispiaia');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans relative overflow-x-hidden ${
      isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Dynamic Runway Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-[#EC6726]/15 via-amber-500/10 to-blue-600/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Airport Control Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        isDarkMode ? 'bg-[#020617]/85 border-slate-800/80' : 'bg-white/85 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EC6726] to-amber-500 text-white flex items-center justify-center shadow-lg shadow-[#EC6726]/30 shrink-0"
            >
              <Plane className="w-5 h-5 -rotate-45" />
            </motion.div>
            <div>
              <span className="text-xl font-black tracking-tight flex items-center gap-2 font-sans">
                FlyDiary <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EC6726]/10 text-[#EC6726] border border-[#EC6726]/30 font-bold">AVGEEK EDITION</span>
              </span>
              <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
                SYS.LOC: RUNWAY 27R // SEU PASSAPORTE DIGITAL DE AVIAÇÃO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Status Radar Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>RADAR ATIVO: 2.450 AIRPORTS</span>
            </div>

            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Alternar Modo Noite / Dia"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {currentUser ? (
              <button
                onClick={onExploreDemo}
                className="px-4 py-2 rounded-xl bg-[#EC6726] text-white font-bold text-xs shadow-md shadow-[#EC6726]/30 hover:bg-[#d9581d] transition-all flex items-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                Meu Diário ({currentUser.name})
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isDarkMode
                      ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 rounded-xl bg-[#EC6726] text-white font-bold text-xs shadow-md shadow-[#EC6726]/30 hover:bg-[#d9581d] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  Criar Cartão
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EC6726]/10 border border-[#EC6726]/30 text-[#EC6726] text-xs font-bold font-mono"
              >
                <PlaneTakeoff className="w-4 h-4 text-[#EC6726]" />
                <span>PARA QUEM AME O BARULHO DAS TURBINAS E A JANELA DO AVIAO</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Seu Diário de Voos com a Paixão e Detalhes de um{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC6726] via-amber-500 to-orange-400">
                  Verdadeiro AvGeek
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`text-base sm:text-lg leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Cada milha navegada, cada prefixo de aeronave (de Embraer E2 a Boeing 787), cada modelo e foto real reunidos no seu mapa interativo. Transforme bilhetes e memórias em estatísticas visuais inesquecíveis.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <button
                  onClick={onExploreDemo}
                  className="px-6 py-3.5 rounded-2xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-sm shadow-xl shadow-[#EC6726]/30 transition-all flex items-center gap-2.5 group cursor-pointer"
                >
                  <Globe2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Explorar Dashboard Interativo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenImport}
                  className={`px-5 py-3.5 rounded-2xl border font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                    isDarkMode
                      ? 'border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#EC6726]" />
                  Importar CSV / my.Flightradar
                </button>

                <button
                  onClick={onOpenAddFlight}
                  className={`px-4 py-3.5 rounded-2xl border font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                    isDarkMode
                      ? 'border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Plus className="w-4 h-4 text-emerald-500" />
                  Registrar Voo
                </button>
              </motion.div>

              {/* Quick Specs Checklist */}
              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#EC6726]" /> 100% Compatível com my.Flightradar24
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" /> Fotos Reais por Prefixo Exato
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Link Pessoal Compartilhável
                </span>
              </div>
            </div>

            {/* Right Interactive Boarding Pass Widget */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Airline Selector Tabs for Boarding Pass Preview */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-mono font-bold text-[#EC6726] uppercase flex items-center gap-1.5">
                    <Ticket className="w-4 h-4" /> Simular Cartão de Embarque
                  </span>
                  <div className="flex gap-1">
                    {SAMPLE_TICKETS.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTicketIdx(idx)}
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                          selectedTicketIdx === idx
                            ? 'bg-[#EC6726] text-white shadow-md'
                            : isDarkMode
                            ? 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {t.fromCode}✈{t.toCode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* The Boarding Pass Component */}
                <div className={`p-6 rounded-3xl border shadow-2xl relative overflow-hidden transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-orange-950/20'
                    : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
                }`}>
                  {/* Decorative Airline Header Banner */}
                  <div className={`p-4 -mx-6 -mt-6 bg-gradient-to-r ${ticket.color} text-white flex items-center justify-between mb-5`}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs">
                        <Plane className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider block leading-tight">
                          {ticket.airline}
                        </span>
                        <span className="text-[10px] font-mono opacity-90 block">
                          VOO {ticket.flightNumber} • {ticket.classType}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase">
                      BOARDING PASS
                    </span>
                  </div>

                  {/* IATA Route Large Display */}
                  <div className="flex items-center justify-between my-2 font-mono">
                    <div className="text-left">
                      <span className="text-3xl font-black text-[#EC6726] block tracking-tighter">
                        {ticket.fromCode}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-sans">
                        {ticket.fromCity}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                        SAÍDA {ticket.depTime}
                      </span>
                    </div>

                    <div className="flex-1 px-4 text-center relative flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 font-sans mb-1">{ticket.duration}</span>
                      <div className="w-full h-0.5 bg-gradient-to-r from-[#EC6726] via-amber-400 to-[#EC6726] relative">
                        <Plane className="w-4 h-4 text-[#EC6726] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-0.5 rounded-full" />
                      </div>
                      <span className="text-[9px] text-amber-500 font-mono mt-1 uppercase font-bold">Direto</span>
                    </div>

                    <div className="text-right">
                      <span className="text-3xl font-black text-[#EC6726] block tracking-tighter">
                        {ticket.toCode}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-sans">
                        {ticket.toCity}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                        POUSO {ticket.arrTime}
                      </span>
                    </div>
                  </div>

                  {/* Flight Info Specs */}
                  <div className={`mt-5 pt-4 border-t border-dashed grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs ${
                    isDarkMode ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">AERONAVE</span>
                      <span className="font-bold text-amber-400 truncate block">{ticket.aircraft}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">PREFIXO</span>
                      <span className="font-bold text-[#EC6726] block">{ticket.registration}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">ASSENTO</span>
                      <span className="font-bold text-emerald-400 block">{ticket.seat}</span>
                    </div>
                  </div>

                  {/* Barcode & Luggage Tag Visual Footer */}
                  <div className={`mt-5 pt-4 border-t flex items-center justify-between ${
                    isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <QrCode className="w-8 h-8 text-[#EC6726] shrink-0" />
                      <div className="font-mono text-[9px] leading-tight">
                        <span className="block font-bold text-slate-300">FLYDIARY DIGIPASS</span>
                        <span className="block opacity-60">ETKT: 057-2489103859</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#EC6726]">
                      <Luggage className="w-4 h-4" />
                      <span>BAG CHECKED</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </header>

      {/* Airport Departure Board (Solari Flap) Ticker */}
      <section className={`py-6 border-y font-mono text-xs ${
        isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto py-1">
            <div className="flex items-center gap-2 text-[#EC6726] font-bold shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>PAINEL DE DECOLAGENS AO VIVO:</span>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              {SOLARI_FLIGHTS.map((f, i) => (
                <div key={i} className="flex items-center gap-2 font-bold">
                  <span className="text-amber-400">{f.code}</span>
                  <span>{f.dest}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${f.color}`}>
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1: Formas de Subir Seus Voos */}
      <section className={`py-16 border-t ${isDarkMode ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC6726] font-mono px-3 py-1 rounded-full bg-[#EC6726]/10 border border-[#EC6726]/20 inline-block">
              INTEGRAÇÃO & PRATICIDADE
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Três Maneiras Rápidas de Reunir Todos os Seus Voos
            </h2>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Seja importando todo o seu histórico do passado ou cadastrando o voo que acabou de fazer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. my.Flightradar24 */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden group ${
                isDarkMode
                  ? 'bg-slate-900/60 border-slate-800 hover:border-[#EC6726]/50'
                  : 'bg-slate-50 border-slate-200 hover:border-[#EC6726]/50 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EC6726]/10 border border-[#EC6726]/30 text-[#EC6726] flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#EC6726] uppercase tracking-wider bg-[#EC6726]/10 px-2.5 py-1 rounded-md border border-[#EC6726]/20 mb-3 inline-block">
                Importador Direto
              </span>
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                1. my.Flightradar24 (.CSV)
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Baixe seu arquivo CSV do my.flightradar24 e faça o upload. Nosso leitor identifica automaticamente rotas, prefixos, horas e companhias.
              </p>
              <button
                onClick={onOpenImport}
                className="text-xs font-bold text-[#EC6726] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Importar CSV Agora <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* 2. Excel + Conciliação De/Para */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden group ${
                isDarkMode
                  ? 'bg-slate-900/60 border-slate-800 hover:border-amber-500/50'
                  : 'bg-slate-50 border-slate-200 hover:border-amber-500/50 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 mb-3 inline-block">
                Conciliação inteligente
              </span>
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                2. Planilhas Excel & Google Sheets
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Tem suas viagens registradas em Excel ou Google Sheets? Suba o arquivo ou sincronize por link com a nossa tela de conciliação de colunas "De / Para".
              </p>
              <button
                onClick={onOpenImport}
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Mapear Minha Planilha <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* 3. Registro Manual */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden group ${
                isDarkMode
                  ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50'
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-500/50 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 mb-3 inline-block">
                Inclusão Individual
              </span>
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                3. Registro Manual de Bordo
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Acabou de pousar? Adicione novos voos em segundos preenchendo códigos IATA/ICAO, assento, número do voo e modelo de aeronave.
              </p>
              <button
                onClick={onOpenAddFlight}
                className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Cadastrar Voo Manual <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AvGeek Features Showcase */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#EC6726]">
              A EXPERIÊNCIA COMPLETA
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Desenvolvido Especialmente para Entusiastas de Aviação
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Globe2 className="w-8 h-8 text-[#EC6726] mb-3" />
              <h4 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mapa de Rotas 3D & 2D</h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Visualização de rotas com feixes luminosos e busca interativa de aeroportos no globo.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Layers className="w-8 h-8 text-amber-500 mb-3" />
              <h4 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Análise de Frota & Modelos</h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Estatísticas separadas por modelos exatos (ex: A320neo, E195-E2) e famílias de fabricantes (Airbus, Boeing, Embraer, ATR).
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Trophy className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Curiosidades & Recordes</h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Descubra qual foi seu voo mais longo, aeroporto mais visitado e idade exata de cada avião na data da viagem.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Share2 className="w-8 h-8 text-emerald-500 mb-3" />
              <h4 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Seu Link Pessoal</h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Compartilhe seu mapa e estatísticas com amigos usando um link único no formato <code>flydiary.app/#u/seunome</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Perguntas Frequentes de Aviação
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "O FlyDiary é gratuito para salvar meus voos?",
                a: "Sim! O FlyDiary é completamente gratuito. Você pode usá-lo com os dados demonstrativos ou criar sua conta para salvar seu próprio diário na nuvem."
              },
              {
                q: "Como faço para exportar do my.flightradar24?",
                a: "No my.flightradar24, clique em Settings > Export e salve o arquivo CSV. Em seguida, acesse a opção Importar do FlyDiary e selecione o arquivo."
              },
              {
                q: "Minhas colunas no Excel estão com nomes diferentes, funciona?",
                a: "Sim! Ao enviar qualquer planilha Excel ou CSV, o FlyDiary abre a tela de conciliação de colunas ('De / Para') onde você vincula cada campo manualmente."
              },
              {
                q: "Posso proteger meu diário de bordo com senha?",
                a: "Com certeza. No painel de perfil você pode marcar seu dashboard como 'Privado' e definir uma senha de acesso para que apenas pessoas autorizadas visualizem."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className={`w-full p-4 text-left text-xs font-bold flex items-center justify-between cursor-pointer ${
                    isDarkMode ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-900'
                  }`}
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeFaq === idx ? 'rotate-90 text-[#EC6726]' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className={`p-4 pt-0 text-xs leading-relaxed border-t ${
                    isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 border-t border-slate-800 bg-gradient-to-r from-[#EC6726]/10 via-amber-500/10 to-orange-500/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EC6726] text-white flex items-center justify-center shadow-lg shadow-[#EC6726]/40">
            <Plane className="w-6 h-6 -rotate-45" />
          </div>
          <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Pronto para Embarcar no Seu Diário de Bordo?
          </h2>
          <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Junte-se a apaixonados por aviação e acompanhe cada voo com precisão, mapa interativo e recordes de viagem.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onExploreDemo}
              className="px-6 py-3.5 rounded-2xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-xl shadow-[#EC6726]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe2 className="w-4 h-4" />
              Acessar Dashboard
            </button>
            <button
              onClick={onOpenLogin}
              className={`px-6 py-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              Criar Conta Grátis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
