import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  UserCheck,
  UserPlus,
  Search,
  Download,
  Filter,
  Shield,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  Calendar,
  Plane,
  Globe,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Database
} from 'lucide-react';
import { RegisteredUser } from '../types';
import { db, collection, getDocs, setDoc, doc, onSnapshot, deleteDoc } from '../lib/firebase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  currentUser: { name: string; email: string; avatar?: string } | null;
}

// Initial Seed Data for Demo & First Run
const SEED_USERS: RegisteredUser[] = [
  {
    id: 'usr_001',
    name: 'Denis Piaia',
    email: 'dpiaia@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    provider: 'google',
    createdAt: '2026-08-01 10:15',
    lastActive: '2026-08-11 08:14',
    flightCount: 42,
    role: 'admin',
    status: 'active',
    country: 'Brasil (GRU)'
  },
  {
    id: 'usr_002',
    name: 'Ana Carolina Silva',
    email: 'ana.silva@avgeek.com.br',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaSilva',
    provider: 'google',
    createdAt: '2026-08-03 14:22',
    lastActive: '2026-08-10 19:30',
    flightCount: 28,
    role: 'user',
    status: 'active',
    country: 'Brasil (CGH)'
  },
  {
    id: 'usr_003',
    name: 'Marcos Antonio Lima',
    email: 'marcos.lima@latam.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcosLima',
    provider: 'email',
    createdAt: '2026-08-05 09:10',
    lastActive: '2026-08-11 07:45',
    flightCount: 64,
    role: 'user',
    status: 'active',
    country: 'Brasil (BSB)'
  },
  {
    id: 'usr_004',
    name: 'Roberto Santos',
    email: 'roberto.spotter@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RobertoSantos',
    provider: 'google',
    createdAt: '2026-08-07 16:40',
    lastActive: '2026-08-09 22:15',
    flightCount: 19,
    role: 'user',
    status: 'active',
    country: 'Brasil (VCP)'
  },
  {
    id: 'usr_005',
    name: 'Camila Torres',
    email: 'camila.torres@flydiary.app',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CamilaTorres',
    provider: 'email',
    createdAt: '2026-08-09 11:05',
    lastActive: '2026-08-11 08:00',
    flightCount: 35,
    role: 'admin',
    status: 'active',
    country: 'Portugal (LIS)'
  },
  {
    id: 'usr_006',
    name: 'Lucas Oliveira',
    email: 'lucas.piloto@aero.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LucasOliveira',
    provider: 'google',
    createdAt: '2026-08-10 18:50',
    lastActive: '2026-08-11 08:10',
    flightCount: 12,
    role: 'user',
    status: 'active',
    country: 'EUA (MIA)'
  }
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isDarkMode = true,
  currentUser,
}) => {
  const [users, setUsers] = useState<RegisteredUser[]>(() => {
    const localSaved = localStorage.getItem('flydiary_admin_users');
    return localSaved ? JSON.parse(localSaved) : SEED_USERS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState<'all' | 'google' | 'email' | 'admin'>('all');
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isLoadingFirestore, setIsLoadingFirestore] = useState(false);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [newProvider, setNewProvider] = useState<'google' | 'email'>('email');

  // Real-time Firestore sync listener
  useEffect(() => {
    if (!isOpen) return;

    let unsubscribe: () => void = () => {};

    try {
      setIsLoadingFirestore(true);
      const usersRef = collection(db, 'users');

      unsubscribe = onSnapshot(
        usersRef,
        (snapshot) => {
          setIsLoadingFirestore(false);
          if (!snapshot.empty) {
            const firestoreList: RegisteredUser[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                name: data.name || 'Usuário Sem Nome',
                email: data.email || docSnap.id,
                avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${docSnap.id}`,
                provider: data.provider || 'email',
                createdAt: data.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
                lastActive: data.lastActive || new Date().toISOString().replace('T', ' ').substring(0, 16),
                flightCount: typeof data.flightCount === 'number' ? data.flightCount : 0,
                role: data.role === 'admin' ? 'admin' : 'user',
                status: data.status || 'active',
                country: data.country || 'Brasil',
              };
            });

            // Merge with local users (ensuring no duplicates)
            setUsers((prev) => {
              const mergedMap = new Map<string, RegisteredUser>();
              // Add existing local/seed users first
              prev.forEach((u) => mergedMap.set(u.email.toLowerCase(), u));
              // Override/add Firestore users
              firestoreList.forEach((u) => mergedMap.set(u.email.toLowerCase(), u));
              const finalArray = Array.from(mergedMap.values());
              localStorage.setItem('flydiary_admin_users', JSON.stringify(finalArray));
              return finalArray;
            });
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot listener error (using local storage fallback):', error);
          setIsLoadingFirestore(false);
        }
      );
    } catch (err) {
      console.warn('Unable to subscribe to Firestore users collection:', err);
      setIsLoadingFirestore(false);
    }

    return () => unsubscribe();
  }, [isOpen]);

  // Persist local users
  useEffect(() => {
    localStorage.setItem('flydiary_admin_users', JSON.stringify(users));
  }, [users]);

  // Make sure currentUser is registered in local/Firestore if logged in
  useEffect(() => {
    if (currentUser) {
      setUsers((prev) => {
        const exists = prev.some((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (!exists) {
          const newUserObj: RegisteredUser = {
            id: `usr_${Date.now()}`,
            name: currentUser.name,
            email: currentUser.email,
            avatar: currentUser.avatar,
            provider: 'google',
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
            flightCount: 10,
            role: currentUser.email.includes('admin') || currentUser.email === 'dpiaia@gmail.com' ? 'admin' : 'user',
            status: 'active',
            country: 'Brasil',
          };
          
          // Also attempt Firestore write
          try {
            setDoc(doc(db, 'users', currentUser.email.replace(/[^a-zA-Z0-9]/g, '_')), newUserObj);
          } catch (e) {
            console.warn('Firestore write fallback:', e);
          }

          return [newUserObj, ...prev];
        }
        return prev;
      });
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Sync all local users to Firestore DB button handler
  const handleSyncToFirestore = async () => {
    setSyncStatus('Sincronizando com Firestore Cloud DB...');
    try {
      for (const u of users) {
        const safeDocId = u.email.replace(/[^a-zA-Z0-9]/g, '_');
        await setDoc(doc(db, 'users', safeDocId), u, { merge: true });
      }
      setSyncStatus('✅ Todos os cadastros foram sincronizados com sucesso no Firestore!');
      setTimeout(() => setSyncStatus(''), 4000);
    } catch (err: any) {
      console.error('Error syncing to Firestore:', err);
      setSyncStatus('⚠️ Erro ao conectar ao Firestore (salvo no armazenamento local).');
      setTimeout(() => setSyncStatus(''), 4000);
    }
  };

  // Add new user handler
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    const created: RegisteredUser = {
      id: `usr_${Date.now()}`,
      name: newName,
      email: newEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newEmail)}`,
      provider: newProvider,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastActive: 'Agora mesmo',
      flightCount: 0,
      role: newRole,
      status: 'active',
      country: 'Brasil'
    };

    setUsers((prev) => [created, ...prev]);

    try {
      const safeDocId = created.email.replace(/[^a-zA-Z0-9]/g, '_');
      await setDoc(doc(db, 'users', safeDocId), created);
    } catch (e) {
      console.warn('Firestore write fallback on add user:', e);
    }

    setNewName('');
    setNewEmail('');
    setIsAddingUser(false);
    setSyncStatus(`🎉 Usuário ${created.name} cadastrado com sucesso!`);
    setTimeout(() => setSyncStatus(''), 3000);
  };

  // Delete user handler
  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (confirm(`Tem certeza que deseja remover o usuário "${userEmail}"?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      try {
        const safeDocId = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
        await deleteDoc(doc(db, 'users', safeDocId));
      } catch (e) {
        console.warn('Firestore delete fallback:', e);
      }
      if (selectedUser?.id === userId) setSelectedUser(null);
    }
  };

  // Toggle user role handler
  const handleToggleRole = async (user: RegisteredUser) => {
    const updatedRole = user.role === 'admin' ? 'user' : 'admin';
    const updatedUser = { ...user, role: updatedRole as 'admin' | 'user' };

    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    if (selectedUser?.id === user.id) setSelectedUser(updatedUser);

    try {
      const safeDocId = user.email.replace(/[^a-zA-Z0-9]/g, '_');
      await setDoc(doc(db, 'users', safeDocId), { role: updatedRole }, { merge: true });
    } catch (e) {
      console.warn('Firestore role update fallback:', e);
    }
  };

  // Export Users CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'Email', 'Provedor', 'Perfil', 'Data Cadastro', 'Ultima Atividade', 'Qtd Voos', 'Status'];
    const rows = users.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.provider,
      u.role,
      u.createdAt,
      u.lastActive,
      u.flightCount,
      u.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_usuarios_flydiary_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (providerFilter === 'google') return u.provider === 'google';
    if (providerFilter === 'email') return u.provider === 'email';
    if (providerFilter === 'admin') return u.role === 'admin';
    return true;
  });

  // KPI Computations
  const totalUsersCount = users.length;
  const googleCount = users.filter((u) => u.provider === 'google').length;
  const emailCount = users.filter((u) => u.provider === 'email').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const totalFlightsLogged = users.reduce((acc, u) => acc + (u.flightCount || 0), 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] transition-all ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {/* Header Banner with Clinicorp Brand Colors */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#EC6726] via-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="flex items-center gap-3.5 z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Painel de Administração
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-mono font-bold tracking-widest border border-white/20 uppercase">
                    SYS.ADMIN
                  </span>
                </div>
                <p className="text-xs text-amber-100 font-medium">
                  Módulo de Controle e Gestão de Pessoas Cadastradas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 z-10">
              <button
                onClick={handleSyncToFirestore}
                className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Sincronizar com Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFirestore ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sincronizar Nuvem</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sync Status Banner if any */}
          {syncStatus && (
            <div className="bg-[#EC6726]/10 border-b border-[#EC6726]/30 px-6 py-2.5 text-xs font-mono text-[#EC6726] flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 animate-pulse" />
                {syncStatus}
              </span>
              <button onClick={() => setSyncStatus('')} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Top Key Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Metric 1: Total Registered */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Total Cadastrados</span>
                  <div className="w-8 h-8 rounded-xl bg-[#EC6726]/10 text-[#EC6726] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#EC6726]">{totalUsersCount}</span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +100% Ativos
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Pessoas com acesso ao FlyDiary</p>
              </div>

              {/* Metric 2: Google Signups */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Login via Google</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-400">{googleCount}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({totalUsersCount > 0 ? Math.round((googleCount / totalUsersCount) * 100) : 0}%)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Autenticação OAuth rápida</p>
              </div>

              {/* Metric 3: Email Signups */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Login via E-mail</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-400">{emailCount}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({totalUsersCount > 0 ? Math.round((emailCount / totalUsersCount) * 100) : 0}%)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Cadastro tradicional por e-mail</p>
              </div>

              {/* Metric 4: Total Logged Flights Across Users */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Voos Registrados</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Plane className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400">{totalFlightsLogged}</span>
                  <span className="text-[10px] text-slate-400 font-mono">voos</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Média de ~{totalUsersCount > 0 ? Math.round(totalFlightsLogged / totalUsersCount) : 0} voos / pessoa</p>
              </div>
            </div>

            {/* Action Bar: Search, Filters, Add User & Export */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
              {/* Search & Provider Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou e-mail..."
                    className={`w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-[#EC6726] ${
                      isDarkMode
                        ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setProviderFilter('all')}
                    className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      providerFilter === 'all'
                        ? 'bg-[#EC6726] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Todos ({totalUsersCount})
                  </button>
                  <button
                    onClick={() => setProviderFilter('google')}
                    className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      providerFilter === 'google'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Google ({googleCount})
                  </button>
                  <button
                    onClick={() => setProviderFilter('email')}
                    className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      providerFilter === 'email'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    E-mail ({emailCount})
                  </button>
                  <button
                    onClick={() => setProviderFilter('admin')}
                    className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      providerFilter === 'admin'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Admins ({adminCount})
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingUser(!isAddingUser)}
                  className="px-3.5 py-2 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-md shadow-[#EC6726]/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar Novo</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isDarkMode
                      ? 'border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                  title="Exportar Lista em CSV"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Inline Add User Form */}
            <AnimatePresence>
              {isAddingUser && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCreateUserSubmit}
                  className={`p-4 rounded-2xl border space-y-4 overflow-hidden ${
                    isDarkMode ? 'bg-slate-950/90 border-[#EC6726]/40' : 'bg-orange-50/50 border-[#EC6726]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold uppercase text-[#EC6726] flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4" /> Cadastrar Nova Pessoa no Sistema
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingUser(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ex: Carlos Andrade"
                        className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#EC6726] ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">E-mail</label>
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="carlos@exemplo.com"
                        className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#EC6726] ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Método de Login</label>
                      <select
                        value={newProvider}
                        onChange={(e) => setNewProvider(e.target.value as 'google' | 'email')}
                        className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#EC6726] ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                        }`}
                      >
                        <option value="email">E-mail e Senha</option>
                        <option value="google">Conta Google</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Nível de Acesso</label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
                        className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#EC6726] ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                        }`}
                      >
                        <option value="user">Piloto (Usuário Comum)</option>
                        <option value="admin">Administrador do Sistema</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingUser(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-md shadow-[#EC6726]/30 cursor-pointer"
                    >
                      Salvar Cadastro
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Users Table */}
            <div className={`rounded-2xl border overflow-hidden shadow-lg ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b font-mono text-[10px] uppercase tracking-wider ${
                      isDarkMode ? 'border-slate-800 bg-slate-900/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}>
                      <th className="p-3.5 pl-5">Pessoa / Usuário</th>
                      <th className="p-3.5">E-mail</th>
                      <th className="p-3.5">Método Login</th>
                      <th className="p-3.5">Data Cadastro</th>
                      <th className="p-3.5 text-center">Qtd. Voos</th>
                      <th className="p-3.5">Papel</th>
                      <th className="p-3.5 text-right pr-5">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 font-mono">
                          Nenhum usuário cadastrado encontrado para os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className={`transition-colors ${
                            isDarkMode
                              ? 'hover:bg-slate-900/80 text-slate-200'
                              : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          {/* User Name & Avatar */}
                          <td className="p-3.5 pl-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#EC6726]/50 bg-slate-800 shrink-0">
                                <img
                                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <span className="font-bold text-sm block leading-tight">
                                  {user.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono block">
                                  {user.country || 'Brasil'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="p-3.5 font-mono text-slate-300">
                            {user.email}
                          </td>

                          {/* Provider */}
                          <td className="p-3.5 font-mono">
                            {user.provider === 'google' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                                <svg className="w-3 h-3" viewBox="0 0 24 24">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                Google OAuth
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                                <Mail className="w-3 h-3" />
                                E-mail
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                            {user.createdAt}
                          </td>

                          {/* Flight Count */}
                          <td className="p-3.5 text-center">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-xs">
                              {user.flightCount || 0}
                            </span>
                          </td>

                          {/* Role */}
                          <td className="p-3.5">
                            {user.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold font-mono">
                                <Shield className="w-3 h-3" /> ADMIN
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold font-mono">
                                PILOTO
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right pr-5">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleToggleRole(user)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  user.role === 'admin'
                                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                                }`}
                                title={user.role === 'admin' ? 'Remover privilégio de Admin' : 'Tornar Administrador'}
                              >
                                <Shield className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setSelectedUser(user)}
                                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                                title="Ver Detalhes do Usuário"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                                title="Excluir Usuário"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected User Details Drawer / Sub-card */}
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border space-y-4 ${
                  isDarkMode ? 'bg-slate-950 border-[#EC6726]/50' : 'bg-slate-50 border-[#EC6726]/40'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.id}`}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full border-2 border-[#EC6726]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {selectedUser.name}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {selectedUser.status.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">ID Único</span>
                    <span className="font-bold text-slate-200">{selectedUser.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Método Autenticação</span>
                    <span className="font-bold text-blue-400 uppercase">{selectedUser.provider}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Total de Voos</span>
                    <span className="font-bold text-emerald-400">{selectedUser.flightCount} voos no diário</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Último Acesso</span>
                    <span className="font-bold text-amber-400">{selectedUser.lastActive}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div className={`p-4 sm:px-6 border-t font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDarkMode ? 'border-slate-800 bg-slate-950/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}>
            <div className="flex items-center gap-2 text-[11px]">
              <Database className="w-4 h-4 text-[#EC6726]" />
              <span>Sincronização Ativa Firestore // Banco: <strong>ai-studio-aviationdiary</strong></span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-md shadow-[#EC6726]/30 cursor-pointer"
            >
              Fechar Painel Admin
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
