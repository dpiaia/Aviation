import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Compass,
  Building,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Plane,
  Layers,
  Search,
  CloudSun,
  Loader2,
  Navigation,
} from 'lucide-react';
import { AirportDetail, fetchAirportDetails } from '../utils/airportDb';

interface AirportDetailsModalProps {
  airportQuery: string | null; // e.g. "VCP", "SBKP", "Campinas / Viracopos (VCP/SBKP)"
  onClose: () => void;
}

export const AirportDetailsModal: React.FC<AirportDetailsModalProps> = ({
  airportQuery,
  onClose,
}) => {
  const [airport, setAirport] = useState<AirportDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState<string>('');

  useEffect(() => {
    if (!airportQuery) return;
    let isMounted = true;
    setLoading(true);

    fetchAirportDetails(airportQuery).then((data) => {
      if (isMounted) {
        setAirport(data);
        setSearchVal(`${data.iata} / ${data.icao}`);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [airportQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setLoading(true);
    fetchAirportDetails(searchVal).then((data) => {
      setAirport(data);
      setLoading(false);
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!airportQuery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Informações do Aeroporto
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  AirportDB.io
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Identificação por código IATA e ICAO
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Code Search Bar inside modal */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800/60">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Buscar aeroporto por IATA, ICAO ou Nome (ex: SBKP, VCP, GRU)..."
              className="w-full pl-9 pr-24 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1 px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
            >
              Consultar
            </button>
          </form>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-xs text-slate-400 font-mono animate-pulse">
                Consultando banco de dados AirportDB.io & ICAO...
              </p>
            </div>
          ) : airport ? (
            <>
              {/* Main Banner Card */}
              <div className="relative p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-950 border border-slate-800 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{airport.flag}</span>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {airport.city}, {airport.country}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white leading-snug">
                      {airport.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      {airport.state} • {airport.type}
                    </p>
                  </div>

                  {/* Badges for IATA & ICAO */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* IATA Badge */}
                    <div className="flex flex-col items-center p-2.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-center min-w-[70px]">
                      <span className="text-[10px] uppercase text-blue-400 font-mono font-bold tracking-wider">
                        IATA
                      </span>
                      <span className="text-lg font-black text-white font-mono">
                        {airport.iata}
                      </span>
                      <button
                        onClick={() => copyToClipboard(airport.iata, 'IATA')}
                        className="mt-1 flex items-center gap-1 text-[10px] text-blue-300 hover:text-white transition-colors"
                      >
                        {copiedCode === 'IATA' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedCode === 'IATA' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>

                    {/* ICAO Badge */}
                    <div className="flex flex-col items-center p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-center min-w-[70px]">
                      <span className="text-[10px] uppercase text-amber-400 font-mono font-bold tracking-wider">
                        ICAO
                      </span>
                      <span className="text-lg font-black text-amber-300 font-mono">
                        {airport.icao}
                      </span>
                      <button
                        onClick={() => copyToClipboard(airport.icao, 'ICAO')}
                        className="mt-1 flex items-center gap-1 text-[10px] text-amber-300 hover:text-white transition-colors"
                      >
                        {copiedCode === 'ICAO' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedCode === 'ICAO' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Elevation */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    Elevação
                  </span>
                  <div className="mt-1">
                    <span className="text-base font-bold text-slate-100 font-mono">
                      {airport.elevation_m} m
                    </span>
                    <span className="text-xs text-slate-500 ml-1 font-mono">
                      ({airport.elevation_ft.toLocaleString()} ft)
                    </span>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    Coordenadas
                  </span>
                  <div className="mt-1">
                    <span className="text-xs font-bold text-slate-200 font-mono block truncate">
                      {airport.lat.toFixed(4)}°, {airport.lng.toFixed(4)}°
                    </span>
                  </div>
                </div>

                {/* Timezone */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    Fuso Horário
                  </span>
                  <div className="mt-1">
                    <span className="text-xs font-bold text-slate-200 font-mono truncate block">
                      {airport.timezone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Runways Card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Pistas de Pouso e Decolagem
                </h4>

                <div className="space-y-2">
                  {airport.runways.map((runway, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                          {runway.name}
                        </span>
                        <span className="text-slate-300">
                          {runway.surface}
                        </span>
                      </div>
                      <div className="text-slate-400 font-semibold">
                        {runway.length_m} m ({runway.length_ft.toLocaleString()} ft)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Description */}
              {airport.summary && (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300 leading-relaxed">
                  <p>{airport.summary}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${airport.lat},${airport.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  Ver no Google Maps
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                {airport.wikipedia && (
                  <a
                    href={airport.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    Wikipédia
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}

                {airport.website && (
                  <a
                    href={airport.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-colors"
                  >
                    Site Oficial
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Nenhum aeroporto encontrado para &quot;{airportQuery}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
