import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Shield,
  Lock,
  Globe,
  Copy,
  Check,
  Key,
  Link,
  Sparkles,
  Plane,
  Eye,
  EyeOff,
  Share2,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  isDarkMode?: boolean;
}

export const ProfileShareModal: React.FC<ProfileShareModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onLogout,
  isDarkMode = true,
}) => {
  const [username, setUsername] = useState(profile.username || 'denispiaia');
  const [name, setName] = useState(profile.name || 'Denis Piaia');
  const [bio, setBio] = useState(profile.bio || 'Entusiasta de Aviação & Spotter');
  const [isPrivate, setIsPrivate] = useState(profile.isPrivate || false);
  const [password, setPassword] = useState(profile.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState(profile.googleSheetUrl || '');
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const currentOrigin = window.location.origin + window.location.pathname;
  const shareableUrl = `${currentOrigin}#u/${username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setStatusMsg('Informe um nome de usuário válido.');
      return;
    }

    if (isPrivate && !password.trim()) {
      setStatusMsg('Defina uma senha de acesso para o dashboard privado.');
      return;
    }

    const updated: UserProfile = {
      ...profile,
      username: username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      name: name.trim(),
      bio: bio.trim(),
      isPrivate,
      password: isPrivate ? password : '',
      googleSheetUrl: googleSheetUrl.trim(),
    };

    onUpdateProfile(updated);
    setStatusMsg('Perfil e preferências de compartilhamento atualizados com sucesso!');
    setTimeout(() => {
      setStatusMsg('');
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-lg p-6 border rounded-2xl shadow-2xl relative transition-all max-h-[90vh] overflow-y-auto ${
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

          <div className="flex items-center gap-3 mb-5 border-b pb-4 border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EC6726] to-amber-500 text-white flex items-center justify-center shadow-md shadow-[#EC6726]/30 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Meu Perfil & Link do Dashboard
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Configure seu link único e visibilidade (Público ou Privado)
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Shareable URL Box */}
            <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <label className="block text-[11px] font-mono font-bold text-[#EC6726] uppercase mb-1.5 flex items-center justify-between">
                <span>Link Pessoal do Seu Dashboard</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-normal">
                  <Share2 className="w-3 h-3" /> Pronto para compartilhar
                </span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className={`w-full p-2 text-xs font-mono border rounded-lg focus:outline-none ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-amber-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-lg bg-[#EC6726] hover:bg-[#d9581d] text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Apelido / Username (URL)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="denispiaia"
                    className={`w-full pl-7 pr-3 py-2 text-xs border rounded-xl focus:border-[#EC6726] focus:outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Nome de Exibição</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Denis Piaia"
                  className={`w-full px-3 py-2 text-xs border rounded-xl focus:border-[#EC6726] focus:outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Bio / Apresentação Curta</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ex: Apaixonado por aviação comercial e spotter em GRU/CGH"
                className={`w-full px-3 py-2 text-xs border rounded-xl focus:border-[#EC6726] focus:outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Privacy Settings: Public vs Private Password Protected */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    {isPrivate ? <Lock className="w-4 h-4 text-amber-500" /> : <Globe className="w-4 h-4 text-emerald-500" />}
                    Privacidade do Dashboard
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {isPrivate ? 'Protegido por senha ao acessar pelo link' : 'Acesso livre para quem possui o link'}
                  </p>
                </div>

                {/* Privacy Toggle */}
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isPrivate
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {isPrivate ? 'Privado (Senha)' : 'Público'}
                </button>
              </div>

              {isPrivate && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <label className="block text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" /> Senha de Acesso ao Dashboard
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Defina uma senha secreta"
                      className={`w-full pr-10 pl-3 py-2 text-xs border rounded-xl focus:border-[#EC6726] focus:outline-none ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Visitantes precisarão dessa senha para visualizar seu diário de voos.
                  </p>
                </div>
              )}
            </div>

            {/* Google Sheets Link Auto-Sync Option */}
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-[#EC6726]" /> URL de Sincronização Automática Google Sheets (Opcional)
              </label>
              <input
                type="url"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                className={`w-full px-3 py-2 text-xs border rounded-xl focus:border-[#EC6726] focus:outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {statusMsg && (
              <p className="text-xs font-mono font-medium text-[#EC6726] flex items-center gap-1.5 p-2 rounded-xl bg-[#EC6726]/10 border border-[#EC6726]/30">
                <Sparkles className="w-4 h-4 text-[#EC6726]" /> {statusMsg}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-md shadow-[#EC6726]/30 transition-all cursor-pointer"
                >
                  Salvar Perfil
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
