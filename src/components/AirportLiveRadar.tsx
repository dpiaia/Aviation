import React, { useState, useEffect, useCallback } from 'react';
import {
  Radio,
  RefreshCw,
  Plane,
  Navigation,
  Compass,
  Gauge,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { AdsbAircraft, fetchAirportLiveTraffic } from '../utils/adsb';

interface AirportLiveRadarProps {
  airportIata: string;
  airportIcao: string;
  airportName: string;
  lat: number;
  lng: number;
}

export const AirportLiveRadar: React.FC<AirportLiveRadarProps> = ({
  airportIata,
  airportIcao,
  airportName,
  lat,
  lng,
}) => {
  const [traffic, setTraffic] = useState<AdsbAircraft[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [selectedAircraft, setSelectedAircraft] = useState<AdsbAircraft | null>(null);
  const [radiusNm, setRadiusNm] = useState<number>(35);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(true);

  const loadTraffic = useCallback(async () => {
    if (!lat || !lng) return;
    setLoading(true);
    try {
      const data = await fetchAirportLiveTraffic(lat, lng, radiusNm);
      setTraffic(data.aircraft);
      setIsConfigured(data.configured);
      setStatusMessage(data.message || '');
      setLastUpdated(new Date(data.timestamp));
    } catch {
      // Handled in adsb utility
    } finally {
      setLoading(false);
    }
  }, [lat, lng, radiusNm]);

  useEffect(() => {
    loadTraffic();
  }, [loadTraffic]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadTraffic();
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadTraffic]);

  // Helper to convert lat/lng to x,y on circular radar
  const getRadarPosition = (acLat: number, acLon: number) => {
    // 1 degree lat ≈ 60 NM
    const dLat = (acLat - lat) * 60;
    // 1 degree lon ≈ 60 * cos(lat) NM
    const dLon = (acLon - lng) * 60 * Math.cos((lat * Math.PI) / 180);

    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    const angle = Math.atan2(dLon, dLat); // Angle from North clockwise

    const normalizedDist = Math.min(dist / radiusNm, 1);
    const radiusPercent = normalizedDist * 44; // 44% max from center (so stays inside 50% circle)

    const x = 50 + radiusPercent * Math.sin(angle);
    const y = 50 - radiusPercent * Math.cos(angle);

    return { x, y, dist: Math.round(dist * 10) / 10 };
  };

  return (
    <div id="airport-live-radar-container" className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-100">
                Radar ADS-B em Tempo Real
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                ADS-B Exchange Feed
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Tráfego aéreo ativo no raio de {radiusNm} NM em torno de {airportIata || airportIcao}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Radius selector */}
          <select
            value={radiusNm}
            onChange={(e) => setRadiusNm(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
          >
            <option value={20}>20 NM (Aproximação)</option>
            <option value={35}>35 NM (Terminal TMA)</option>
            <option value={60}>60 NM (Região Extensa)</option>
          </select>

          {/* Auto Refresh Toggle */}
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors cursor-pointer ${
              autoRefresh
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title={autoRefresh ? 'Atualização automática ativa (15s)' : 'Atualização automática pausada'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{autoRefresh ? 'Auto 15s' : 'Pausado'}</span>
          </button>

          {/* Manual Refresh */}
          <button
            type="button"
            onClick={loadTraffic}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Atualizar agora"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Radar Display & Aircraft Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Circular Radar Scope */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-2">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-slate-950 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-hidden flex items-center justify-center select-none">
            {/* Concentric Range Rings */}
            <div className="absolute inset-4 rounded-full border border-emerald-500/20 pointer-events-none" />
            <div className="absolute inset-12 rounded-full border border-emerald-500/20 pointer-events-none" />
            <div className="absolute inset-20 rounded-full border border-dashed border-emerald-500/15 pointer-events-none" />

            {/* Radar Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/25 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-emerald-500/25 pointer-events-none" />

            {/* Radial Sweep Animation */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(16,185,129,0.25)_360deg)] animate-[spin_4s_linear_infinite] pointer-events-none" />

            {/* Center Airport Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-md flex items-center justify-center text-[7px] font-mono font-black text-slate-950">
                ★
              </div>
              <span className="mt-0.5 text-[9px] font-mono font-bold text-emerald-300 bg-slate-950/80 px-1 rounded border border-emerald-500/30">
                {airportIata || airportIcao}
              </span>
            </div>

            {/* Aircraft Blips */}
            {traffic.map((ac, idx) => {
              if (!ac.lat || !ac.lon) return null;
              const { x, y, dist } = getRadarPosition(ac.lat, ac.lon);
              const isSelected = selectedAircraft?.hex === ac.hex;

              return (
                <div
                  key={`blip-${ac.hex || idx}`}
                  style={{ top: `${y}%`, left: `${x}%` }}
                  onClick={() => setSelectedAircraft(ac)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group transition-all duration-300 ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                  }`}
                  title={`${ac.flight || ac.registration || 'Aeronave'} (${dist} NM)`}
                >
                  <div
                    style={{ transform: `rotate(${(ac.trackDeg || 0) - 90}deg)` }}
                    className={`w-4 h-4 flex items-center justify-center transition-transform ${
                      isSelected
                        ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                        : 'text-emerald-300 drop-shadow-[0_0_4px_rgba(16,185,129,0.8)]'
                    }`}
                  >
                    <Plane className="w-3.5 h-3.5 fill-current" />
                  </div>

                  {/* Tiny Label on Hover or Selection */}
                  <div
                    className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/90 border text-[9px] font-mono transition-opacity pointer-events-none ${
                      isSelected
                        ? 'border-amber-400 text-amber-300 opacity-100'
                        : 'border-emerald-500/40 text-emerald-200 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {ac.flight || ac.registration || ac.hex} • {typeof ac.altitudeFt === 'number' ? `${ac.altitudeFt}ft` : ac.altitudeFt}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between w-full max-w-[280px] mt-2 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              {traffic.length} aeronaves no radar
            </span>
            {lastUpdated && (
              <span>Atualizado: {lastUpdated.toLocaleTimeString('pt-BR')}</span>
            )}
          </div>
        </div>

        {/* Live Aircraft List / Inspector */}
        <div className="lg:col-span-6 space-y-3">
          {selectedAircraft ? (
            /* Selected Aircraft Detail Card */
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-400/40 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <Plane className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-mono font-bold text-white">
                      {selectedAircraft.flight || 'Voo sem Callsign'}
                    </h5>
                    <p className="text-[10px] font-mono text-amber-400">
                      Matrícula: {selectedAircraft.registration || 'Não informada'} • ICAO: {selectedAircraft.hex}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAircraft(null)}
                  className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Altitude</span>
                  <strong className="text-emerald-400 text-xs">
                    {typeof selectedAircraft.altitudeFt === 'number'
                      ? `${selectedAircraft.altitudeFt.toLocaleString('pt-BR')} ft`
                      : selectedAircraft.altitudeFt || '—'}
                  </strong>
                </div>

                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Velocidade Solo</span>
                  <strong className="text-cyan-400 text-xs">
                    {selectedAircraft.groundSpeedKnots ? `${selectedAircraft.groundSpeedKnots} kts` : '—'}
                  </strong>
                </div>

                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Modelo ICAO</span>
                  <strong className="text-amber-300 text-xs">
                    {selectedAircraft.type || 'Aeronave'}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span>Proa: {selectedAircraft.trackDeg ? `${selectedAircraft.trackDeg}°` : '—'}</span>
                <span>Squawk: {selectedAircraft.squawk || '—'}</span>
                <span>Distância: {selectedAircraft.distanceNm ? `${selectedAircraft.distanceNm} NM` : '—'}</span>
              </div>
            </div>
          ) : null}

          {/* Scrollable Aircraft Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60 max-h-56 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 sticky top-0 text-[10px] uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-2.5 py-2">Voo / Callsign</th>
                  <th className="px-2 py-2">Matrícula</th>
                  <th className="px-2 py-2">Altitude</th>
                  <th className="px-2 py-2">Veloc.</th>
                  <th className="px-2 py-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {traffic.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-slate-500 text-xs">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                          <span>Varrendo frequências do ADS-B Exchange...</span>
                        </div>
                      ) : (
                        'Nenhuma aeronave com transponder ativo no raio selecionado no momento.'
                      )}
                    </td>
                  </tr>
                ) : (
                  traffic.map((ac) => (
                    <tr
                      key={ac.hex}
                      onClick={() => setSelectedAircraft(ac)}
                      className={`hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        selectedAircraft?.hex === ac.hex ? 'bg-amber-400/10 text-amber-200' : ''
                      }`}
                    >
                      <td className="px-2.5 py-1.5 font-bold text-white flex items-center gap-1.5">
                        <Plane className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{ac.flight || ac.hex}</span>
                      </td>
                      <td className="px-2 py-1.5 text-slate-300">{ac.registration || '—'}</td>
                      <td className="px-2 py-1.5 text-emerald-400 font-bold">
                        {typeof ac.altitudeFt === 'number' ? `${ac.altitudeFt} ft` : ac.altitudeFt || '—'}
                      </td>
                      <td className="px-2 py-1.5 text-cyan-300">
                        {ac.groundSpeedKnots ? `${ac.groundSpeedKnots} kts` : '—'}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <button
                          type="button"
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 cursor-pointer"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
