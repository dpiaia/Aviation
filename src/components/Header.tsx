import React from 'react';
import { motion } from 'motion/react';
import { Plane, Plus, FileSpreadsheet, Sparkles, Compass } from 'lucide-react';

interface HeaderProps {
  totalFlights: number;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalFlights,
  onOpenAddModal,
  onOpenImportModal,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#020617]/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] cursor-pointer shrink-0"
            >
              <Plane className="w-5 h-5 -rotate-12" />
            </motion.div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Denis Piaia Aviation Diary <span className="text-blue-500 opacity-50 font-normal text-sm">v2.4</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Diário de Bordo & Análise Estatística Integrada
              </p>
            </div>
          </div>

          {/* Mobile Total Badge */}
          <div className="md:hidden px-3 py-1 bg-blue-600/10 border border-blue-500/30 rounded-full text-xs font-medium text-blue-400">
            {totalFlights} voos
          </div>
        </div>

        {/* Sync Status & Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Sync Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-xs font-medium text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Sync: Ativo</span>
          </div>

          {/* Total Flights Pill */}
          <div className="hidden sm:flex items-center px-4 py-2 bg-blue-600/10 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-400">
            Total Voos: {totalFlights}
          </div>

          <button
            onClick={onToggleDarkMode}
            className="px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors text-xs font-medium cursor-pointer"
            title="Alternar Tema"
          >
            {isDarkMode ? '☀️ Claro' : '🌙 Escuro'}
          </button>

          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Importar CSV</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Voo</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
