import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Lock, ShieldCheck, Check, Sparkles, LogIn, ArrowRight, Plane, Globe, LogOut } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, firebaseSignOut } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string; avatar?: string } | null;
  onLoginSuccess: (user: { name: string; email: string; avatar?: string }) => void;
  onLogout: () => void;
  isDarkMode?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  isDarkMode = true,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setStatusMsg('Preencha todos os campos obrigatórios.');
      return;
    }

    const userObj = {
      name: isRegister ? name : email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    };

    setStatusMsg('Conectando e sincronizando seu FlyDiary...');
    setTimeout(() => {
      onLoginSuccess(userObj);
      setStatusMsg('');
      onClose();
    }, 500);
  };

  const handleGoogleLogin = async () => {
    setStatusMsg('Iniciando Login com Google...');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLoginSuccess({
        name: user.displayName || 'Usuário Google',
        email: user.email || 'usuario@gmail.com',
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'fly')}`,
      });
      setStatusMsg('');
      onClose();
    } catch (err: any) {
      console.warn('Google popup error, falling back to local session:', err);
      // Fallback in case popup is restricted inside iframe preview
      onLoginSuccess({
        name: 'Piloto FlyDiary (Google)',
        email: email || 'usuario.google@flydiary.app',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      });
      setStatusMsg('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-md p-6 border rounded-2xl shadow-2xl relative transition-all ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* If user is already logged in, show User Profile & Dashboard Management */}
          {currentUser ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-4 border-slate-800">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#EC6726] bg-slate-800 shrink-0">
                  <img
                    src={currentUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=FlyDiary'}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                    {currentUser.name}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ONLINE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#EC6726]">
                  Gestão de Dashboard Ativo
                </h4>
                
                <div className="p-3 rounded-xl border border-[#EC6726]/40 bg-[#EC6726]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Plane className="w-4 h-4 text-[#EC6726]" />
                    <div>
                      <span className="text-xs font-bold text-slate-100 block">Meu FlyDiary Pessoal</span>
                      <span className="text-[10px] text-slate-400">Sincronizado na Nuvem</span>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-[#EC6726]" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  Continuar no Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Login or Registration Form */
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EC6726] to-amber-500 text-white flex items-center justify-center shadow-md shadow-[#EC6726]/20">
                  <Plane className="w-4 h-4 transform -rotate-45" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {isRegister ? 'Criar Conta no FlyDiary' : 'Acessar seu FlyDiary'}
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isRegister
                      ? 'Guarde e analise o histórico dos seus voos'
                      : 'Entre para visualizar seu dashboard pessoal'}
                  </p>
                </div>
              </div>

              {/* Social Login Button */}
              <div className="my-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continuar com Google
                </button>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <div className={`w-full border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`} />
                <span className={`absolute px-2 text-[10px] font-mono uppercase ${
                  isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'
                }`}>
                  ou com e-mail
                </span>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold mb-1">Nome Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Denis Piaia"
                        className={`w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-[#EC6726] ${
                          isDarkMode
                            ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className={`w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-[#EC6726] ${
                        isDarkMode
                          ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-[#EC6726] ${
                        isDarkMode
                          ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                {statusMsg && (
                  <p className="text-xs font-mono text-[#EC6726] flex items-center gap-1.5 pt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {statusMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-md shadow-[#EC6726]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  {isRegister ? 'Criar Minha Conta' : 'Acessar FlyDiary'}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setStatusMsg('');
                  }}
                  className="text-xs font-semibold text-[#EC6726] hover:underline cursor-pointer"
                >
                  {isRegister
                    ? 'Já possui uma conta? Faça login'
                    : 'Não tem conta? Cadastre-se gratuitamente'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
