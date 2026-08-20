import React from 'react';
import { Plane, Upload, Plus, Sparkles, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  userName: string;
  isDarkMode: boolean;
  onClose: () => void;
  onAddFlight: () => void;
  onImportCsv: () => void;
  onLoadSampleData: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  userName,
  isDarkMode,
  onClose,
  onAddFlight,
  onImportCsv,
  onLoadSampleData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl rounded-3xl border ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl shadow-slate-950/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl shadow-slate-200/80'
        } overflow-hidden relative`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-colors cursor-pointer ${
            isDarkMode ? 'bg-black/30 hover:bg-black/50 text-white/80' : 'bg-white/30 hover:bg-white/50 text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="relative bg-gradient-to-br from-[#EC6726] via-[#d9581d] to-[#9a3809] p-8 text-white overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-4 top-4 opacity-20 pointer-events-none">
            <Plane className="w-32 h-32 transform -rotate-12" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase text-white/90">
              <Sparkles className="w-3.5 h-3.5" />
              Conta Criada Com Sucesso
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Seja bem-vindo, {userName}! ✈️
            </h2>
            <p className="text-white/90 text-sm max-w-md leading-relaxed">
              Seu diário de aviação pessoal está totalmente zerado e pronto para registrar seus voos, mapas e coleções.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3.5 rounded-2xl border ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            } flex items-start gap-3`}>
              <CheckCircle2 className="w-5 h-5 text-[#EC6726] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold">Mapa 3D & 2D</h4>
                <p className="text-[11px] text-slate-400 leading-tight">Visualize suas rotas no mapa global.</p>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            } flex items-start gap-3`}>
              <CheckCircle2 className="w-5 h-5 text-[#EC6726] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold">Estatísticas</h4>
                <p className="text-[11px] text-slate-400 leading-tight">Aeronaves, companhias e horas de voo.</p>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            } flex items-start gap-3`}>
              <CheckCircle2 className="w-5 h-5 text-[#EC6726] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold">Álbum Virtual</h4>
                <p className="text-[11px] text-slate-400 leading-tight">Coleção de bilhetes e bilhetagem.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Como você deseja começar?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  onAddFlight();
                }}
                className="p-4 rounded-2xl border border-[#EC6726]/40 bg-[#EC6726]/10 hover:bg-[#EC6726]/20 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#EC6726] text-white flex items-center justify-center shadow-md">
                    <Plus className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#EC6726] group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Cadastrar 1º Voo
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Insira origem, destino e data do seu primeiro voo.
                </p>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onImportCsv();
                }}
                className={`p-4 rounded-2xl border transition-all text-left group cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Upload className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Importar Lista / CSV
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Importe dados do Flightradar24, MyFlightradar24 ou CSV.
                </p>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between gap-4">
            <button
              onClick={() => {
                onClose();
                onLoadSampleData();
              }}
              className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Carregar voos de demonstração
            </button>

            <button
              onClick={onClose}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              Ir para o Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
