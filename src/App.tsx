import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { StatsOverview } from './components/StatsOverview';
import { MonthlyFlightsChart } from './components/MonthlyFlightsChart';
import { InteractiveFlightMap } from './components/InteractiveFlightMap';
import { AircraftColumns } from './components/AircraftColumns';
import { CuriosityCards } from './components/CuriosityCards';
import { FlightLogTable } from './components/FlightLogTable';
import { AddFlightModal } from './components/AddFlightModal';
import { ImportCsvModal } from './components/ImportCsvModal';
import { AirportDetailsModal } from './components/AirportDetailsModal';
import { DottedWorldMapBackground } from './components/DottedWorldMapBackground';
import { INITIAL_FLIGHTS } from './data/initialFlights';
import { Flight } from './types';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [flights, setFlights] = useState<Flight[]>(INITIAL_FLIGHTS);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [selectedAirportModal, setSelectedAirportModal] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  return (
    <div className={`min-h-screen font-sans selection:bg-[#EC6726]/30 selection:text-amber-200 transition-colors duration-300 relative overflow-x-hidden ${
      isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {view === 'landing' ? (
        <LandingPage
          onExploreDemo={() => setView('dashboard')}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onOpenImport={() => setIsImportModalOpen(true)}
          onOpenAddFlight={() => setIsAddModalOpen(true)}
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
            totalFlights={flights.length}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onShowLanding={() => setView('landing')}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
          />

          {/* Main Content Area */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
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
          setView('dashboard');
        }}
        onLogout={() => setCurrentUser(null)}
        isDarkMode={isDarkMode}
      />

      <AirportDetailsModal
        airportQuery={selectedAirportModal}
        onClose={() => setSelectedAirportModal(null)}
      />
    </div>
  );
}
