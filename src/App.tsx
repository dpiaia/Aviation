import React, { useState, useEffect } from 'react';
import { Plus, Upload, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { ProfileShareModal } from './components/ProfileShareModal';
import { PublicPasswordBarrier } from './components/PublicPasswordBarrier';
import { StatsOverview } from './components/StatsOverview';
import { MonthlyFlightsChart } from './components/MonthlyFlightsChart';
import { InteractiveFlightMap } from './components/InteractiveFlightMap';
import { AircraftColumns } from './components/AircraftColumns';
import { CuriosityCards } from './components/CuriosityCards';
import { FlightLogTable } from './components/FlightLogTable';
import { AddFlightModal } from './components/AddFlightModal';
import { ImportCsvModal } from './components/ImportCsvModal';
import { AirportDetailsModal } from './components/AirportDetailsModal';
import { AdminModal } from './components/AdminModal';
import { VirtualAlbumPage } from './components/VirtualAlbumPage';
import { DottedWorldMapBackground } from './components/DottedWorldMapBackground';
import { LiveDeparturesBoard } from './components/LiveDeparturesBoard';
import { INITIAL_FLIGHTS } from './data/initialFlights';
import { Flight, UserProfile } from './types';

const isDenisUser = (email?: string) => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return lower === 'denis@piaianet.com' || lower === 'dpiaia@gmail.com' || lower.includes('denis');
};

const getUserFlightsKey = (email?: string) => {
  if (!email) return 'flydiary_flights_guest';
  return `flydiary_flights_${email.toLowerCase().trim()}`;
};

const getUserProfileKey = (email?: string) => {
  if (!email) return 'flydiary_profile_guest';
  return `flydiary_profile_${email.toLowerCase().trim()}`;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar?: string } | null>(() => {
    try {
      const savedUser = localStorage.getItem('flydiary_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn('Error reading user from localStorage:', e);
    }
    return null;
  });

  const [view, setView] = useState<'landing' | 'dashboard' | 'album'>(() => {
    try {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const isShared = (hash && hash.includes('u/')) || (search && search.includes('u='));
      const savedUser = localStorage.getItem('flydiary_user');
      if (isShared || savedUser) return 'dashboard';
    } catch (e) {
      console.warn('Error reading initial view:', e);
    }
    return 'landing';
  });

  const [flights, setFlights] = useState<Flight[]>(() => {
    try {
      const savedUserStr = localStorage.getItem('flydiary_user');
      if (savedUserStr) {
        const user = JSON.parse(savedUserStr);
        if (user && user.email) {
          const key = getUserFlightsKey(user.email);
          const savedFlights = localStorage.getItem(key);
          if (savedFlights) {
            const parsed = JSON.parse(savedFlights);
            if (Array.isArray(parsed)) return parsed;
          }
          if (isDenisUser(user.email)) return INITIAL_FLIGHTS;
          return [];
        }
      }
    } catch (e) {
      console.warn('Error reading flights from localStorage:', e);
    }
    return [];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [selectedAirportModal, setSelectedAirportModal] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedUserStr = localStorage.getItem('flydiary_user');
      if (savedUserStr) {
        const user = JSON.parse(savedUserStr);
        if (user && user.email) {
          const key = getUserProfileKey(user.email);
          const savedProf = localStorage.getItem(key);
          if (savedProf) {
            const parsed = JSON.parse(savedProf);
            if (parsed && typeof parsed === 'object') return parsed;
          }
          if (isDenisUser(user.email)) {
            return {
              username: 'denispiaia',
              name: 'Denis Piaia',
              email: user.email,
              isPrivate: false,
              password: '',
              bio: 'Entusiasta de Aviação Comercial & Spotter',
            };
          }
          return {
            username: user.email.split('@')[0],
            name: user.name || user.email.split('@')[0],
            email: user.email,
            isPrivate: false,
            password: '',
            bio: 'Entusiasta de Aviação Comercial & Spotter',
          };
        }
      }
    } catch (e) {
      console.warn('Error reading profile from localStorage:', e);
    }
    return {
      username: 'visitante',
      name: 'Visitante',
      email: '',
      isPrivate: false,
      password: '',
      bio: 'Entusiasta de Aviação Comercial & Spotter',
    };
  });

  // Share URL Routing State
  const [sharedUsername, setSharedUsername] = useState<string | null>(null);
  const [isPrivateUnlocked, setIsPrivateUnlocked] = useState<boolean>(false);

  // Check URL parameters for shared profile links like #u/denispiaia or ?u=denispiaia
  useEffect(() => {
    const checkSharedUrl = () => {
      const hash = window.location.hash;
      const search = window.location.search;

      let extractedUsername: string | null = null;

      if (hash && hash.includes('u/')) {
        extractedUsername = hash.split('u/')[1]?.split('?')[0]?.trim() || null;
      } else if (search && search.includes('u=')) {
        const params = new URLSearchParams(search);
        extractedUsername = params.get('u');
      }

      if (extractedUsername) {
        setSharedUsername(extractedUsername.toLowerCase());
        setView('dashboard');
      }
    };

    checkSharedUrl();
    window.addEventListener('hashchange', checkSharedUrl);
    return () => window.removeEventListener('hashchange', checkSharedUrl);
  }, []);

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle user change & load account-isolated flights and profile
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('flydiary_user', JSON.stringify(currentUser));
      const email = currentUser.email;

      // Load isolated flights
      const flightsKey = getUserFlightsKey(email);
      const savedFlightsStr = localStorage.getItem(flightsKey);
      if (savedFlightsStr) {
        try {
          const parsed = JSON.parse(savedFlightsStr);
          if (Array.isArray(parsed)) setFlights(parsed);
          else setFlights(isDenisUser(email) ? INITIAL_FLIGHTS : []);
        } catch (e) {
          setFlights(isDenisUser(email) ? INITIAL_FLIGHTS : []);
        }
      } else {
        setFlights(isDenisUser(email) ? INITIAL_FLIGHTS : []);
      }

      // Load isolated profile
      const profileKey = getUserProfileKey(email);
      const savedProfStr = localStorage.getItem(profileKey);
      if (savedProfStr) {
        try {
          const parsed = JSON.parse(savedProfStr);
          if (parsed && typeof parsed === 'object') setUserProfile(parsed);
          else {
            setUserProfile({
              username: email.split('@')[0],
              name: currentUser.name,
              email: currentUser.email,
              isPrivate: false,
              password: '',
              bio: 'Entusiasta de Aviação Comercial & Spotter',
            });
          }
        } catch (e) {
          setUserProfile({
            username: email.split('@')[0],
            name: currentUser.name,
            email: currentUser.email,
            isPrivate: false,
            password: '',
            bio: 'Entusiasta de Aviação Comercial & Spotter',
          });
        }
      } else {
        const newProf: UserProfile = {
          username: email.split('@')[0],
          name: currentUser.name,
          email: currentUser.email,
          isPrivate: false,
          password: '',
          bio: 'Entusiasta de Aviação Comercial & Spotter',
        };
        setUserProfile(newProf);
        localStorage.setItem(profileKey, JSON.stringify(newProf));
      }
    } else {
      localStorage.removeItem('flydiary_user');
      setFlights([]);
    }
  }, [currentUser?.email]);

  // Persist flights & profile per user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(getUserFlightsKey(currentUser.email), JSON.stringify(flights));
    }
    localStorage.setItem('flydiary_flights', JSON.stringify(flights));
  }, [flights, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(getUserProfileKey(currentUser.email), JSON.stringify(userProfile));
    }
    localStorage.setItem('flydiary_profile', JSON.stringify(userProfile));
  }, [userProfile, currentUser]);

  // Protect Dashboard: redirect to landing if not logged in and no shared link
  useEffect(() => {
    if (!currentUser && !sharedUsername && view !== 'landing') {
      setView('landing');
    }
  }, [currentUser, sharedUsername, view]);

  const handleAddFlight = (newFlight: Flight) => {
    setFlights((prev) => [newFlight, ...prev]);
    setView('dashboard');
  };

  const handleImportFlights = (importedFlights: Flight[]) => {
    setFlights((prev) => [...importedFlights, ...prev]);
    setView('dashboard');
  };

  const handleSelectAirport = (airportCode: string) => {
    setSelectedAirportModal(airportCode);
  };

  const handleAuthenticatePrivate = (pass: string) => {
    if (pass === userProfile.password) {
      setIsPrivateUnlocked(true);
      return true;
    }
    return false;
  };

  // If a shared link is opened and profile is PRIVATE and not unlocked yet
  if (sharedUsername && userProfile.isPrivate && !isPrivateUnlocked) {
    return (
      <PublicPasswordBarrier
        username={sharedUsername}
        onAuthenticate={handleAuthenticatePrivate}
        onGoHome={() => {
          setSharedUsername(null);
          window.location.hash = '';
          setView('landing');
        }}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-[#EC6726]/30 selection:text-amber-200 transition-colors duration-300 relative overflow-x-hidden ${
      isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {view === 'landing' ? (
        <LandingPage
          onExploreDemo={() => {
            if (currentUser || sharedUsername) {
              setView('dashboard');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onOpenImport={() => {
            if (currentUser) {
              setIsImportModalOpen(true);
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          onOpenAddFlight={() => {
            if (currentUser) {
              setIsAddModalOpen(true);
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          currentUser={currentUser}
        />
      ) : (
        <>
          {/* Subtle Dotted World Map Background with Light Flying Beams */}
          <DottedWorldMapBackground isDarkMode={isDarkMode} />

          {/* App Navigation Header */}
          <Header
            onSelectDashboard={() => setView('dashboard')}
            onOpenAlbumModal={() => setView('album')}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
            currentUser={currentUser}
            userProfile={userProfile}
            onLogout={() => setCurrentUser(null)}
            activeTab={view === 'album' ? 'album' : 'dashboard'}
          />

          {/* Live Departures Ticker Bar */}
          <LiveDeparturesBoard isDarkMode={isDarkMode} />

          {/* Shared User Banner if viewing a friend's profile */}
          {sharedUsername && (
            <div className="bg-[#EC6726]/10 border-b border-[#EC6726]/30 py-2.5 px-4 text-center text-xs font-mono text-[#EC6726] flex items-center justify-center gap-2">
              <span>✈️ Você está visualizando o FlyDiary de <strong>@{sharedUsername}</strong></span>
              <button
                onClick={() => {
                  setSharedUsername(null);
                  window.location.hash = '';
                }}
                className="underline font-bold hover:text-white cursor-pointer ml-2"
              >
                Voltar ao Meu Dashboard
              </button>
            </div>
          )}

          {/* Main Content Area */}
          {view === 'album' ? (
            <VirtualAlbumPage
              isDarkMode={isDarkMode}
              flightsCount={flights.length}
              onBackToDashboard={() => setView('dashboard')}
            />
          ) : (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
              {/* Onboarding Callout Card for New Accounts with 0 Flights */}
              {flights.length === 0 && (
                <div className={`p-6 rounded-2xl border ${
                  isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                } shadow-xl relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#EC6726]/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#EC6726]/10 text-[#EC6726] border border-[#EC6726]/30 font-mono text-xs font-bold">
                          PAINEL PESSOAL PRONTO
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Boas-vindas ao seu FlyDiary</span>
                      </div>
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Olá, {currentUser?.name || userProfile.name}! Vamos registrar seu primeiro voo?
                      </h2>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Seu diário de bordo está limpo para você cadastrar suas próprias viagens. Adicione um voo manualmente, importe um CSV do Flightradar24/MyFlightradar, ou carregue dados de teste para ver o painel em ação.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Voo
                      </button>
                      <button
                        onClick={() => setIsImportModalOpen(true)}
                        className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isDarkMode
                            ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                        }`}
                      >
                        <Upload className="w-4 h-4 text-blue-400" />
                        Importar CSV
                      </button>
                      <button
                        onClick={() => {
                          setFlights(INITIAL_FLIGHTS);
                        }}
                        className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isDarkMode
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                            : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Carregar Voos de Exemplo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* KPI Overview Cards */}
              <StatsOverview flights={flights} isDarkMode={isDarkMode} />

              {/* Interactive Flight Route Map */}
              <InteractiveFlightMap flights={flights} onSelectAirport={handleSelectAirport} isDarkMode={isDarkMode} />

              {/* Chart Section: Line Chart per Year + Total Monthly Bars */}
              <MonthlyFlightsChart flights={flights} isDarkMode={isDarkMode} />

              {/* Aircraft 3-Column Section: Specific Models, Grouped Families, Manufacturers */}
              <AircraftColumns flights={flights} isDarkMode={isDarkMode} />

              {/* Curiosity & Records Cards */}
              <CuriosityCards flights={flights} onSelectAirport={handleSelectAirport} isDarkMode={isDarkMode} />

              {/* Flight Log History Table */}
              <FlightLogTable flights={flights} onSelectAirport={handleSelectAirport} isDarkMode={isDarkMode} />
            </main>
          )}

          {/* Tactical Immersive Footer */}
          <footer className={`border-t backdrop-blur-md py-6 font-mono text-[10px] relative z-10 transition-colors ${
            isDarkMode ? 'border-slate-900 bg-[#020617]/80 text-slate-500' : 'border-slate-200 bg-white/80 text-slate-500'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[#EC6726] font-bold">LOC: SBGR (23°26′08″S 046°28′23″W)</span>
                <span className={isDarkMode ? 'text-slate-700' : 'text-slate-300'}>|</span>
                <span>© 2026 FlyDiary — Aviation Diary</span>
              </div>
              <div className="flex items-center gap-6">
                <span>LATENCY: 14MS</span>
                <span>UPTIME: 99.98%</span>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Clinicorp Design System</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modals */}
      <AddFlightModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFlight={handleAddFlight}
      />

      <ImportCsvModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportFlights={handleImportFlights}
        isDarkMode={isDarkMode}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setUserProfile((prev) => ({ ...prev, name: user.name, email: user.email }));
          setView('dashboard');
        }}
        onLogout={() => setCurrentUser(null)}
        isDarkMode={isDarkMode}
      />

      <ProfileShareModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onUpdateProfile={(updated) => {
          setUserProfile(updated);
          if (currentUser) {
            setCurrentUser({ ...currentUser, name: updated.name });
          }
        }}
        onLogout={() => {
          setCurrentUser(null);
          setIsProfileModalOpen(false);
        }}
        isDarkMode={isDarkMode}
      />

      <AirportDetailsModal
        airportQuery={selectedAirportModal}
        onClose={() => setSelectedAirportModal(null)}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isDarkMode={isDarkMode}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setUserProfile((prev) => ({ ...prev, name: user.name, email: user.email }));
        }}
        flightsCount={flights.length}
      />
    </div>
  );
}
