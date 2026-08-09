import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { MonthlyFlightsChart } from './components/MonthlyFlightsChart';
import { InteractiveFlightMap } from './components/InteractiveFlightMap';
import { AircraftColumns } from './components/AircraftColumns';
import { CuriosityCards } from './components/CuriosityCards';
import { FlightLogTable } from './components/FlightLogTable';
import { AddFlightModal } from './components/AddFlightModal';
import { ImportCsvModal } from './components/ImportCsvModal';
import { INITIAL_FLIGHTS } from './data/initialFlights';
import { Flight } from './types';

export default function App() {
  const [flights, setFlights] = useState<Flight[]>(INITIAL_FLIGHTS);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

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
  };

  const handleImportFlights = (importedFlights: Flight[]) => {
    setFlights((prev) => [...importedFlights, ...prev]);
  };

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200 transition-colors duration-300 relative overflow-x-hidden`}>
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950/80 to-[#020617]" />

      {/* App Navigation Header */}
      <Header
        totalFlights={flights.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* KPI Overview Cards */}
        <StatsOverview flights={flights} />

        {/* Interactive Flight Route Map */}
        <InteractiveFlightMap flights={flights} />

        {/* Chart Section: Line Chart per Year + Total Monthly Bars */}
        <MonthlyFlightsChart flights={flights} isDarkMode={isDarkMode} />

        {/* Aircraft 3-Column Section: Specific Models, Grouped Families, Manufacturers */}
        <AircraftColumns flights={flights} />

        {/* Curiosity & Records Cards */}
        <CuriosityCards flights={flights} />

        {/* Flight Log History Table */}
        <FlightLogTable flights={flights} />
      </main>

      {/* Tactical Immersive Footer */}
      <footer className="border-t border-slate-900 bg-[#020617]/80 backdrop-blur-md py-6 text-slate-500 font-mono text-[10px] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-blue-500 font-bold">LOC: SBGR (23°26′08″S 046°28′23″W)</span>
            <span className="text-slate-700">|</span>
            <span>© 2026 Aviation Diary</span>
          </div>
          <div className="flex items-center gap-6">
            <span>LATENCY: 14MS</span>
            <span>UPTIME: 99.98%</span>
            <span className="text-slate-400">Clinicorp Design System</span>
          </div>
        </div>
      </footer>

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
      />
    </div>
  );
}

