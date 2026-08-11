import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane,
  Plus,
  FileSpreadsheet,
  Sun,
  Moon,
  LayoutDashboard,
  BookOpen,
  User,
  UserCheck,
  Share2,
  Shield,
  Lock,
  Globe,
  Settings,
  ChevronDown,
  LogOut,
  Sliders,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onSelectDashboard: () => void;
  onOpenAlbumModal: () => void;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAdminModal: () => void;
  currentUser: { name: string; email: string; avatar?: string } | null;
  userProfile?: UserProfile;
  onLogout?: () => void;
  activeTab?: 'dashboard' | 'album';
}

export const Header: React.FC<HeaderProps> = ({
  onSelectDashboard,
  onOpenAlbumModal,
  onOpenAddModal,
  onOpenImportModal,
  isDarkMode,
  onToggleDarkMode,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenAdminModal,
  currentUser,
  userProfile,
  onLogout,
  activeTab = 'dashboard'
}) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const configRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isAdmin =
    currentUser?.email.toLowerCase() === 'denis@piaianet.com' ||
    currentUser?.email.toLowerCase() === 'dpiaia@gmail.com';

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (configRef.current && !configRef.current.contains(event.target as Node)) {
        setIsConfigOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-300 ${
        isDarkMode
          ? 'border-slate-800/80 bg-[#020617]/85 text-white shadow-lg'
          : 'border-slate-200 bg-white/90 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={onSelectDashboard}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EC6726] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#EC6726]/30 shrink-0"
          >
            <Plane className="w-4 h-4 -rotate-12" />
          </motion.div>

          <h1
            className={`text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-1.5 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            FlyDiary{' '}
            <span className="text-[#EC6726] text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#EC6726]/10 border border-[#EC6726]/20 font-bold">
              Pro
            </span>
          </h1>
        </div>

        {/* Core Navigation Options: DASHBOARD | ÁLBUM VIRTUAL | CONFIG | PERFIL */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* 1. DASHBOARD */}
          <button
            onClick={onSelectDashboard}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-[#EC6726] text-white shadow-md shadow-[#EC6726]/30'
                : isDarkMode
                ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="uppercase font-mono tracking-wider">Dashboard</span>
          </button>

          {/* 2. ÁLBUM VIRTUAL */}
          <button
            onClick={onOpenAlbumModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'album'
                ? 'bg-[#EC6726] text-white shadow-md shadow-[#EC6726]/30'
                : isDarkMode
                ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase font-mono tracking-wider">Álbum Virtual</span>
            <Sparkles className="w-3 h-3 text-amber-300 hidden sm:inline" />
          </button>

          {/* 3. CONFIG */}
          <div className="relative" ref={configRef}>
            <button
              onClick={() => {
                setIsConfigOpen(!isConfigOpen);
                setIsProfileOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isConfigOpen
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : isDarkMode
                  ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Configurações e Ferramentas"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="uppercase font-mono tracking-wider">Config</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Config Popover */}
            <AnimatePresence>
              {isConfigOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-60 p-2 rounded-2xl border shadow-2xl backdrop-blur-xl z-50 text-xs ${
                    isDarkMode
                      ? 'bg-slate-950/95 border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    Configurações & Dados
                  </div>

                  <div className="p-1 space-y-1 mt-1">
                    {/* Toggle Dark Mode */}
                    <button
                      onClick={() => {
                        onToggleDarkMode();
                        setIsConfigOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-900 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isDarkMode ? (
                          <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-blue-600" />
                        )}
                        <span>Tema de Cores</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                        {isDarkMode ? 'Escuro' : 'Claro'}
                      </span>
                    </button>

                    {/* Import CSV/Excel */}
                    <button
                      onClick={() => {
                        onOpenImportModal();
                        setIsConfigOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-900 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="font-semibold">Importar Planilha</div>
                        <div className="text-[10px] text-slate-400">Excel / FlightRadar24 / CSV</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. PERFIL */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsConfigOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isProfileOpen
                  ? 'border-[#EC6726] bg-[#EC6726]/10 text-[#EC6726]'
                  : currentUser
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : isDarkMode
                  ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Perfil e Conta"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-4 h-4 rounded-full object-cover border border-emerald-500/50"
                />
              ) : (
                <User className="w-3.5 h-3.5 text-[#EC6726]" />
              )}
              <span className="uppercase font-mono tracking-wider">Perfil</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Profile Popover */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-64 p-2 rounded-2xl border shadow-2xl backdrop-blur-xl z-50 text-xs ${
                    isDarkMode
                      ? 'bg-slate-950/95 border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  {/* Header / User Info */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-2">
                    {currentUser ? (
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-slate-100 text-xs truncate max-w-[140px]">
                            {currentUser.name}
                          </span>
                          {isAdmin && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1">
                              <Shield className="w-2.5 h-2.5 text-purple-400" />
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                      </div>
                    ) : (
                      <div className="text-center py-1">
                        <p className="font-bold text-slate-200">Visitante FlyDiary</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Faça login para salvar suas viagens</p>
                      </div>
                    )}
                  </div>

                  <div className="p-1 space-y-1">
                    {/* Share / Public Profile */}
                    <button
                      onClick={() => {
                        onOpenProfileModal();
                        setIsProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-900 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-[#EC6726]" />
                        <div>
                          <div className="font-semibold">Link de Perfil</div>
                          <div className="text-[10px] text-slate-400">@{userProfile?.username || 'meu-link'}</div>
                        </div>
                      </div>
                      {userProfile?.isPrivate ? (
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>

                    {/* Admin Panel Option */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          onOpenAdminModal();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 font-bold transition-colors text-left cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-purple-400" />
                        <div>
                          <div>Painel Administrativo</div>
                          <div className="text-[10px] text-purple-400 font-normal">
                            Gestão de Usuários
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Auth Action */}
                    {currentUser ? (
                      <button
                        onClick={() => {
                          if (onLogout) onLogout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer font-semibold"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Sair da Conta</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onOpenAuthModal();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#EC6726]/10 text-[#EC6726] hover:bg-[#EC6726]/20 font-bold transition-colors text-left cursor-pointer border border-[#EC6726]/30"
                      >
                        <UserCheck className="w-4 h-4 text-[#EC6726]" />
                        <span>Entrar com Google / Email</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Primary Action Button: + Novo Voo */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white text-xs font-bold shadow-md shadow-[#EC6726]/30 transition-all cursor-pointer shrink-0 ml-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Voo</span>
          </motion.button>
        </nav>
      </div>
    </header>
  );
};
