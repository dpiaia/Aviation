import React from 'react';
import { motion } from 'motion/react';
import { Plane, Plus, FileSpreadsheet, Sun, Moon, Home, User, UserCheck, Share2, Shield, Lock, Globe } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  totalFlights: number;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onShowLanding: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  currentUser: { name: string; email: string; avatar?: string } | null;
  userProfile?: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  totalFlights,
  onOpenAddModal,
  onOpenImportModal,
  isDarkMode,
  onToggleDarkMode,
  onShowLanding,
  onOpenAuthModal,
  onOpenProfileModal,
  currentUser,
  userProfile,
}) => {
  return (
    <header className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-300 ${
      isDarkMode
        ? 'border-slate-800/80 bg-[#020617]/80 text-white'
        : 'border-slate-200 bg-white/80 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onShowLanding}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EC6726] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#EC6726]/30 shrink-0"
            >
              <Plane className="w-5 h-5 -rotate-12" />
            </motion.div>

            <div>
              <h1 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                FlyDiary <span className="text-[#EC6726] text-xs uppercase font-mono px-2 py-0.5 rounded bg-[#EC6726]/10 border border-[#EC6726]/20 font-bold">Pro</span>
              </h1>
              <p className={`text-[11px] hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Diário de Bordo Digital & Análise Estratégica
              </p>
            </div>
          </div>

          {/* Mobile Total Badge */}
          <div className="md:hidden px-3 py-1 bg-[#EC6726]/10 border border-[#EC6726]/30 rounded-full text-xs font-mono font-bold text-[#EC6726]">
            {totalFlights} voos
          </div>
        </div>

        {/* Sync Status & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Navigation Home Button */}
          <button
            onClick={onShowLanding}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              isDarkMode
                ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
            }`}
            title="Ir para a Landing Page"
          >
            <Home className="w-4 h-4 text-[#EC6726]" />
            <span className="hidden sm:inline">Apresentação</span>
          </button>

          {/* Share Profile Button */}
          <button
            onClick={onOpenProfileModal}
            className="px-3 py-2 rounded-xl bg-[#EC6726]/10 text-[#EC6726] border border-[#EC6726]/30 hover:bg-[#EC6726]/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Compartilhar Dashboard & Configurar Link Pessoal"
          >
            <Share2 className="w-4 h-4 text-[#EC6726]" />
            <span className="hidden sm:inline font-mono">
              @{userProfile?.username || 'meu-link'}
            </span>
            {userProfile?.isPrivate ? (
              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
            ) : (
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
            )}
          </button>

          {/* User Auth Button */}
          <button
            onClick={currentUser ? onOpenProfileModal : onOpenAuthModal}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentUser
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : isDarkMode
                ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            {currentUser ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-[#EC6726]" />
                <span>Entrar / Perfil</span>
              </>
            )}
          </button>

          {/* Total Flights Pill */}
          <div className="hidden sm:flex items-center px-3.5 py-2 bg-[#EC6726]/10 border border-[#EC6726]/30 rounded-xl text-xs font-mono font-bold text-[#EC6726]">
            Voos: {totalFlights}
          </div>

          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-amber-400'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
            }`}
            title="Alternar Tema"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenImportModal}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Importar</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white text-xs font-bold shadow-md shadow-[#EC6726]/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Voo</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
