import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Key, ArrowRight, ShieldCheck, Plane, AlertCircle, Home } from 'lucide-react';

interface PublicPasswordBarrierProps {
  username: string;
  onAuthenticate: (password: string) => boolean;
  onGoHome: () => void;
  isDarkMode?: boolean;
}

export const PublicPasswordBarrier: React.FC<PublicPasswordBarrierProps> = ({
  username,
  onAuthenticate,
  onGoHome,
  isDarkMode = true,
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword) return;

    const success = onAuthenticate(inputPassword);
    if (!success) {
      setErrorMsg('Senha incorreta. Solicite a senha ao proprietário do diário.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans ${
      isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-md p-8 border rounded-3xl shadow-2xl relative transition-all text-center space-y-6 ${
          isDarkMode
            ? 'bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-xl'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#EC6726] to-amber-500 text-white flex items-center justify-center shadow-lg shadow-[#EC6726]/30">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold text-[#EC6726] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#EC6726]/10 border border-[#EC6726]/20 inline-block mb-2">
            Dashboard Protegido por Senha
          </span>
          <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            FlyDiary de @{username}
          </h2>
          <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Este diário de voos é privado. Digite a senha de acesso configurada por @{username} para visualizar o histórico de voos e estatísticas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              autoFocus
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Digite a senha de acesso..."
              className={`w-full pl-10 pr-4 py-3 text-xs border rounded-2xl focus:border-[#EC6726] focus:outline-none ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-mono text-red-400 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-lg shadow-[#EC6726]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Acessar Dashboard Privado
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/60">
          <button
            onClick={onGoHome}
            className={`text-xs font-semibold hover:underline inline-flex items-center gap-1.5 cursor-pointer ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#EC6726]" /> Ir para a página inicial do FlyDiary
          </button>
        </div>
      </motion.div>
    </div>
  );
};
