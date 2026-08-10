import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plane,
  FileSpreadsheet,
  MapPin,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe2,
  Users,
  ChevronRight,
  Sparkles,
  Trophy,
  Layers,
  ArrowRight,
  Database,
  Key,
  Radio,
  CheckCircle2,
  Cloud,
  Moon,
  Sun,
  UserCheck,
  Plus
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

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDemo,
  onOpenLogin,
  onOpenImport,
  onOpenAddFlight,
  isDarkMode,
  onToggleTheme,
  currentUser
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
        isDarkMode ? 'bg-[#020617]/80 border-slate-800/80' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EC6726] to-amber-500 text-white flex items-center justify-center shadow-lg shadow-[#EC6726]/20">
              <Plane className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight flex items-center gap-1.5">
                FlyDiary <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#EC6726]/10 text-[#EC6726] border border-[#EC6726]/30">v2.0</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Seu Diário de Bordo Digital</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Alternar Tema"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {currentUser ? (
              <button
                onClick={onExploreDemo}
                className="px-4 py-2 rounded-xl bg-[#EC6726] text-white font-semibold text-xs shadow-md shadow-[#EC6726]/30 hover:bg-[#d9581d] transition-all flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Meu Dashboard
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    isDarkMode
                      ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 rounded-xl bg-[#EC6726] text-white font-semibold text-xs shadow-md shadow-[#EC6726]/30 hover:bg-[#d9581d] transition-all flex items-center gap-1.5"
                >
                  Criar Conta
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#EC6726]/15 via-blue-500/10 to-purple-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EC6726]/10 border border-[#EC6726]/30 text-[#EC6726] text-xs font-semibold font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma Multi-Usuário de Aviação Pessoal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Transforme seu Histórico de Voos em um <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC6726] via-amber-500 to-orange-400">Dashboard Interativo</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-base sm:text-lg leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Importe facilmente seus dados do <strong>my.Flightradar24</strong>, planilhas <strong>Excel/CSV</strong> ou registre manualmente. Descubra mapas geoespaciais 3D, estatísticas de aeronaves, fotos reais dos aviões e recordes de viagem.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={onExploreDemo}
                className="px-6 py-3.5 rounded-2xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-sm shadow-lg shadow-[#EC6726]/30 transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <Globe2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Explorar Dashboard Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenImport}
                className={`px-6 py-3.5 rounded-2xl border font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  isDarkMode
                    ? 'border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-[#EC6726]" />
                Importar Meus Voos (.CSV / Excel)
              </button>

              <button
                onClick={onOpenAddFlight}
                className={`px-5 py-3.5 rounded-2xl border font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  isDarkMode
                    ? 'border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Plus className="w-4 h-4 text-emerald-500" />
                Registrar Voo Manual
              </button>
            </motion.div>
          </div>

          {/* Key Metrics Counter Strip */}
          <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border backdrop-blur-md ${
            isDarkMode ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white/80 border-slate-200 shadow-sm'
          }`}>
            <div className="text-center space-y-1">
              <span className="text-2xl lg:text-3xl font-black text-[#EC6726] font-mono">100%</span>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Compatível my.Flightradar24</p>
            </div>
            <div className="text-center space-y-1">
              <span className="text-2xl lg:text-3xl font-black text-amber-500 font-mono">3D & 2D</span>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Rotas Geoespaciais</p>
            </div>
            <div className="text-center space-y-1">
              <span className="text-2xl lg:text-3xl font-black text-blue-500 font-mono">Planespotters</span>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Fotos por Prefixo Exato</p>
            </div>
            <div className="text-center space-y-1">
              <span className="text-2xl lg:text-3xl font-black text-emerald-500 font-mono">Multi-User</span>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Dashboards Individuais</p>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Section 1: How Data Gets Uploaded (#2 Requirement) */}
      <section className={`py-16 border-t ${isDarkMode ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC6726] font-mono">
              #2 - Formas de Subir Seus Dados
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Três Formas Práticas e Flexíveis de Alimentar Seu FlyDiary
            </h2>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Não perca nenhum voo do passado. Escolha a maneira mais rápida para você.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Option 1: CSV my.flightradar24 */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800 hover:border-[#EC6726]/50'
                : 'bg-white border-slate-200 hover:border-[#EC6726]/50 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 mb-2 inline-block">
                Nativo & Automático
              </span>
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                1. Exportação my.Flightradar24
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Se você já usa o my.flightradar24, basta baixar o arquivo <code>.csv</code> e colar ou fazer upload. Nosso leitor reconhece todas as colunas de data, companhia, prefixo, assento e horários.
              </p>
              <button
                onClick={onOpenImport}
                className="text-xs font-semibold text-[#EC6726] hover:text-[#d9581d] flex items-center gap-1 cursor-pointer"
              >
                Importar CSV Agora <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Option 2: Custom XLSX / CSV */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800 hover:border-[#EC6726]/50'
                : 'bg-white border-slate-200 hover:border-[#EC6726]/50 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 mb-2 inline-block">
                Planilhas Personalizadas
              </span>
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                2. Arquivos Excel & CSVs Próprios
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Possui uma planilha pessoal em Excel com seus voos? Nosso importador flexível permite converter planilhas Excel (.xlsx) e oferece um modelo pré-formatado para download.
              </p>
              <button
                onClick={onOpenImport}
                className="text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
              >
                Baixar Modelo Excel / CSV <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Option 3: Manual Entry */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800 hover:border-[#EC6726]/50'
                : 'bg-white border-slate-200 hover:border-[#EC6726]/50 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mb-2 inline-block">
                Inclusão Individual
              </span>
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                3. Registro Manual Rápido
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Acabou de pousar? Adicione o novo voo em segundos. Preencha o código do aeroporto (ex: GRU, SDU, BSB), horário, número do voo e modelo de aeronave com autocompletar inteligente.
              </p>
              <button
                onClick={onOpenAddFlight}
                className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
              >
                Adicionar Voo Manual <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: What FlyDiary Offers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC6726] font-mono">
              Recursos Avançados
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Análise Completa da Sua Vida nas Nuvens
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <MapPin className="w-8 h-8 text-[#EC6726] mb-3" />
              <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mapa Interativo Geoespacial</h4>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Veja todas as rotas conectadas no globo ou plano, com contagem de frequências e indicador de trechos voados.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Layers className="w-8 h-8 text-amber-500 mb-3" />
              <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Análise de Frota & Fabricantes</h4>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Agrupamento inteligente por famílias de aeronaves (Airbus A320, Boeing 737, Embraer E-Jets) e marcas.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Trophy className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Cartões de Recordes & Bilhetes</h4>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Estilo Boarding Pass retrô com idade exata da aeronave na data do voo, fotos reais e logos de companhias.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
              <BarChart3 className="w-8 h-8 text-emerald-500 mb-3" />
              <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Estatísticas Mensais & Anuais</h4>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Gráficos de evolução temporal mostrando picos de viagem por mês e comparativo entre anos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan & API Architecture Proposal Section (#4 Requirement) */}
      <section className={`py-16 border-t ${isDarkMode ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC6726] font-mono">
              #4 - Plano de Arquitetura & APIs Gratuitas
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Como Faremos Isso Acontecer Sem Custos de Infraestrutura
            </h2>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Mapeamento de serviços de API sem custo (Free Tier) para autenticação social, banco de dados relacional/NoSQL e dados de voo em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tech 1: Firebase Auth & Firestore */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Firebase (Auth & Firestore)</h4>
                  <span className="text-[10px] font-mono text-emerald-500 font-semibold">Custo Zero (Plan Spark Free)</span>
                </div>
              </div>
              <ul className={`text-xs space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Login Social Google:</strong> Autenticação segura em 1 clique.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Firestore Database:</strong> 50.000 leituras e 20.000 escritas grátis por dia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Sincronização Nuvem:</strong> Dados acessíveis de qualquer dispositivo.</span>
                </li>
              </ul>
            </div>

            {/* Tech 2: OpenSky / AviationStack */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>OpenSky & OurAirports API</h4>
                  <span className="text-[10px] font-mono text-emerald-500 font-semibold">100% Gratuito & Open-Data</span>
                </div>
              </div>
              <ul className={`text-xs space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Lookup de Aeroportos:</strong> Coordenadas GPS de todos os aeroportos IATA/ICAO.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>OpenSky Network:</strong> Rastreamento de prefixos e modelos de aeronave.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Planespotters API:</strong> Fotos em HD do avião exato informado.</span>
                </li>
              </ul>
            </div>

            {/* Tech 3: Multi-Tenant Architecture */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Gestão Multi-Usuário</h4>
                  <span className="text-[10px] font-mono text-emerald-500 font-semibold">Isolamento de Dados</span>
                </div>
              </div>
              <ul className={`text-xs space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Coleções <code>users/userID/flights</code>:</strong> Isolamento total de segurança.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Modo Convidado / Demo:</strong> Test-drive sem necessidade de cadastro inicial.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Exportação Geral:</strong> Exporte seu dashboard de volta para CSV a qualquer momento.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Dúvidas Frequentes (FAQ)
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Tudo o que você precisa saber sobre o FlyDiary
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "O FlyDiary é gratuito?",
                a: "Sim! O FlyDiary é 100% gratuito. Você pode usá-lo em modo convidado com dados de demonstração ou criar sua conta pessoal para salvar seus próprios voos."
              },
              {
                q: "Como importo meus voos do my.flightradar24?",
                a: "Acesse o my.flightradar24, vá em 'Settings/Export' e baixe o arquivo CSV. Depois clique em 'Importar Voos' no FlyDiary e cole ou envie o arquivo."
              },
              {
                q: "Posso utilizar planilhas do Excel?",
                a: "Sim. Oferecemos suporte para arquivos CSV gerados pelo Excel ou pela nossa própria planilha modelo para preenchimento rápido."
              },
              {
                q: "Meus dados de voo ficam seguros?",
                a: "Sim. Cada usuário possui sua própria área reservada no banco de dados e seus voos só são acessíveis pela sua conta."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
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

      {/* CTA Footer Banner */}
      <section className="py-12 border-t border-slate-800 bg-gradient-to-r from-[#EC6726]/10 via-amber-500/10 to-orange-500/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h2 className={`text-2xl sm:text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Pronto para Decolar com o FlyDiary?
          </h2>
          <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Crie seu perfil ou experimente a versão de demonstração com visualizações geoespaciais em tempo real.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onExploreDemo}
              className="px-6 py-3 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-lg shadow-[#EC6726]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe2 className="w-4 h-4" />
              Acessar Dashboard
            </button>
            <button
              onClick={onOpenLogin}
              className={`px-6 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              Entrar / Cadastrar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
