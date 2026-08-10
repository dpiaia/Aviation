import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  Calendar,
  Plane,
  Clock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { Flight } from '../types';
import { getAirlineLogo } from '../utils/airlineLogos';
import { AirlineLogo } from './AirlineLogo';
import { parseAirportCodes } from '../utils/airportDb';

interface FlightLogTableProps {
  flights: Flight[];
  onSelectAirport?: (airport: string) => void;
  isDarkMode?: boolean;
}

export const FlightLogTable: React.FC<FlightLogTableProps> = ({ flights, onSelectAirport, isDarkMode = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAirline, setSelectedAirline] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Distinct airlines
  const airlines = useMemo(() => {
    const set = new Set<string>();
    flights.forEach((f) => {
      if (f.airline) {
        const clean = f.airline.split('(')[0].trim();
        set.add(clean);
      }
    });
    return Array.from(set).sort();
  }, [flights]);

  // Distinct years
  const years = useMemo(() => {
    const set = new Set<string>();
    flights.forEach((f) => {
      if (f.date) {
        const y = f.date.substring(0, 4);
        if (y) set.add(y);
      }
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [flights]);

  // Filtered flights
  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      const matchSearch =
        searchTerm === '' ||
        f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.aircraft.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.note && f.note.toLowerCase().includes(searchTerm.toLowerCase()));

      const cleanAirline = f.airline ? f.airline.split('(')[0].trim() : '';
      const matchAirline =
        selectedAirline === 'ALL' || cleanAirline === selectedAirline;

      const flightYear = f.date ? f.date.substring(0, 4) : '';
      const matchYear = selectedYear === 'ALL' || flightYear === selectedYear;

      return matchSearch && matchAirline && matchYear;
    });
  }, [flights, searchTerm, selectedAirline, selectedYear]);

  // Pagination
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage) || 1;
  const paginatedFlights = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFlights.slice(start, start + itemsPerPage);
  }, [filteredFlights, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`p-6 rounded-2xl border shadow-lg backdrop-blur-md relative overflow-hidden mb-12 transition-all ${
        isDarkMode
          ? 'bg-slate-900/40 border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.3)] text-slate-100'
          : 'bg-white/90 border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-slate-800'
      }`}
    >
      {/* Table Header & Controls */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Calendar className="w-5 h-5 text-blue-500" /> Histórico de Voos ({filteredFlights.length})
          </h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Registro detalhado de cada rota, horário, assento e observações de voo.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar voo, rota, aeronave..."
              className={`w-full pl-9 pr-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:border-blue-500 ${
                isDarkMode
                  ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Airline Filter */}
          <select
            value={selectedAirline}
            onChange={(e) => {
              setSelectedAirline(e.target.value);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:border-blue-500 ${
              isDarkMode
                ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="ALL">Todas as Cias</option>
            {airlines.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:border-blue-500 ${
              isDarkMode
                ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="ALL">Todos os Anos</option>
            {years.map((y) => (
              <option key={y} value={y}>
                Ano {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Render */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className={`border-b uppercase tracking-wider font-mono text-[11px] ${
              isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <th className="py-3 px-3">Data</th>
              <th className="py-3 px-3">Voo</th>
              <th className="py-3 px-3">Origem & Destino</th>
              <th className="py-3 px-3">Companhia</th>
              <th className="py-3 px-3">Aeronave & Matrícula</th>
              <th className="py-3 px-3">Duração</th>
              <th className="py-3 px-3">Assento</th>
              <th className="py-3 px-3">Nota</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
            {paginatedFlights.length > 0 ? (
              paginatedFlights.map((f) => (
                <tr
                  key={f.id}
                  className={`transition-colors ${
                    isDarkMode
                      ? 'hover:bg-slate-800/40 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {/* Date */}
                  <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                    {f.date || 'N/A'}
                  </td>

                  {/* Flight Number */}
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {f.flightNumber || 'S/N'}
                  </td>

                  {/* Route */}
                  <td className="py-3 px-3 font-medium text-slate-200">
                    {(() => {
                      const fromCodes = parseAirportCodes(f.from);
                      const toCodes = parseAirportCodes(f.to);
                      return (
                        <div className="flex items-center gap-1.5 flex-wrap text-xs">
                          <button
                            type="button"
                            onClick={() => onSelectAirport && onSelectAirport(f.from)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/90 hover:bg-blue-600/30 hover:border-blue-500/50 text-slate-100 font-bold transition-all border border-slate-700/80 cursor-pointer group"
                            title={`Clique para ver detalhes de ${fromCodes.city} (${fromCodes.iata} / ${fromCodes.icao})`}
                          >
                            <span>{fromCodes.city}</span>
                            <span className="text-[10px] font-mono text-blue-400 group-hover:text-blue-300 font-extrabold">
                              ({fromCodes.iata})
                            </span>
                          </button>

                          <span className="text-blue-400 font-bold">➔</span>

                          <button
                            type="button"
                            onClick={() => onSelectAirport && onSelectAirport(f.to)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/90 hover:bg-blue-600/30 hover:border-blue-500/50 text-slate-100 font-bold transition-all border border-slate-700/80 cursor-pointer group"
                            title={`Clique para ver detalhes de ${toCodes.city} (${toCodes.iata} / ${toCodes.icao})`}
                          >
                            <span>{toCodes.city}</span>
                            <span className="text-[10px] font-mono text-blue-400 group-hover:text-blue-300 font-extrabold">
                              ({toCodes.iata})
                            </span>
                          </button>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Airline */}
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                    {f.airline ? (
                      <AirlineLogo
                        airline={f.airline}
                        size="sm"
                        isLightBackground={false}
                        showName={false}
                      />
                    ) : (
                      '-'
                    )}
                  </td>

                  {/* Aircraft & Registration */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-200">
                        {f.aircraft}
                      </span>
                      {f.registration && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-400 text-[10px] font-mono border border-blue-500/20">
                          {f.registration}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-3 text-slate-400 font-mono whitespace-nowrap">
                    {f.duration}
                  </td>

                  {/* Seat */}
                  <td className="py-3 px-3 text-slate-300 font-mono">
                    {f.seatNumber || '-'}
                  </td>

                  {/* Note */}
                  <td className="py-3 px-3 max-w-xs truncate text-slate-400 italic">
                    {f.note ? (
                      <span className="flex items-center gap-1 text-amber-400">
                        <MessageSquare className="w-3 h-3 shrink-0" /> {f.note}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-slate-500"
                >
                  Nenhum voo encontrado com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800 text-xs text-slate-400 font-mono">
        <span>
          Página {currentPage} de {totalPages} ({filteredFlights.length} voos)
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-30 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-30 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
