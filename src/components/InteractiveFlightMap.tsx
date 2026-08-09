import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Plane, Navigation, Filter, RotateCcw, Info, Calendar, Building2, Check, ArrowRight } from 'lucide-react';
import { Flight } from '../types';
import { parseAirport, AirportLocation } from '../utils/airportCoordinates';

interface InteractiveFlightMapProps {
  flights: Flight[];
}

interface RouteStat {
  key: string; // "VCP-JOI"
  fromAirport: AirportLocation;
  toAirport: AirportLocation;
  totalFlights: number;
  airlines: string[];
  aircrafts: string[];
  recentDate: string;
}

export function InteractiveFlightMap({ flights }: InteractiveFlightMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Filters
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedAirline, setSelectedAirline] = useState<string>('ALL');
  const [selectedAirportIata, setSelectedAirportIata] = useState<string>('ALL');
  const [activeRoute, setActiveRoute] = useState<RouteStat | null>(null);
  const [mapMode, setMapMode] = useState<'routes' | 'nodes'>('routes');

  // Extract unique years & airlines
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    flights.forEach((f) => {
      if (f.date && f.date.length >= 4) {
        yearsSet.add(f.date.substring(0, 4));
      }
    });
    return Array.from(yearsSet).sort().reverse();
  }, [flights]);

  const availableAirlines = useMemo(() => {
    const airlinesSet = new Set<string>();
    flights.forEach((f) => {
      if (f.airline) {
        const cleanAirline = f.airline.split('(')[0].trim();
        if (cleanAirline) airlinesSet.add(cleanAirline);
      }
    });
    return Array.from(airlinesSet).sort();
  }, [flights]);

  // Filtered Flights
  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      if (selectedYear !== 'ALL' && !f.date.startsWith(selectedYear)) return false;
      if (selectedAirline !== 'ALL' && !f.airline.toLowerCase().includes(selectedAirline.toLowerCase())) return false;
      if (selectedAirportIata !== 'ALL') {
        const fromA = parseAirport(f.from);
        const toA = parseAirport(f.to);
        if (fromA.iata !== selectedAirportIata && toA.iata !== selectedAirportIata) return false;
      }
      return true;
    });
  }, [flights, selectedYear, selectedAirline, selectedAirportIata]);

  // Process Airports & Route Stats
  const { airportsMap, routeStatsList, totalRoutesCount } = useMemo(() => {
    type AirportEntry = { info: AirportLocation; totalCount: number; inbound: number; outbound: number };
    type RouteEntry = { from: AirportLocation; to: AirportLocation; count: number; airlines: Set<string>; aircrafts: Set<string>; dates: string[] };

    const airports = new Map<string, AirportEntry>();
    const routesMap = new Map<string, RouteEntry>();

    filteredFlights.forEach((f) => {
      const fromLoc = parseAirport(f.from);
      const toLoc = parseAirport(f.to);

      // Register origin
      if (!airports.has(fromLoc.iata)) {
        airports.set(fromLoc.iata, { info: fromLoc, totalCount: 0, inbound: 0, outbound: 0 });
      }
      const fromEntry = airports.get(fromLoc.iata)!;
      fromEntry.totalCount += 1;
      fromEntry.outbound += 1;

      // Register destination
      if (!airports.has(toLoc.iata)) {
        airports.set(toLoc.iata, { info: toLoc, totalCount: 0, inbound: 0, outbound: 0 });
      }
      const toEntry = airports.get(toLoc.iata)!;
      toEntry.totalCount += 1;
      toEntry.inbound += 1;

      // Register route pair (bidirectional order key for grouping)
      const routeKey = [fromLoc.iata, toLoc.iata].sort().join(' ➔ ');
      if (!routesMap.has(routeKey)) {
        routesMap.set(routeKey, {
          from: fromLoc,
          to: toLoc,
          count: 0,
          airlines: new Set<string>(),
          aircrafts: new Set<string>(),
          dates: [],
        });
      }
      const rEntry = routesMap.get(routeKey)!;
      rEntry.count += 1;
      if (f.airline) rEntry.airlines.add(f.airline.split('(')[0].trim());
      if (f.aircraft) rEntry.aircrafts.add(f.aircraft);
      if (f.date) rEntry.dates.push(f.date);
    });

    const routeStats: RouteStat[] = Array.from(routesMap.entries()).map(([key, value]): RouteStat => ({
      key,
      fromAirport: value.from,
      toAirport: value.to,
      totalFlights: value.count,
      airlines: Array.from(value.airlines),
      aircrafts: Array.from(value.aircrafts),
      recentDate: [...value.dates].sort().reverse()[0] || '',
    })).sort((a, b) => b.totalFlights - a.totalFlights);

    return {
      airportsMap: airports,
      routeStatsList: routeStats,
      totalRoutesCount: routeStats.length,
    };
  }, [filteredFlights]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-22.5, -46.5],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
      });

      // Add CartoDB Dark Matter Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 18,
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render Markers & Route Lines on Filter or Mode Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (airportsMap.size === 0) return;

    const bounds = L.latLngBounds([]);

    // 1. Draw Airport Markers
    airportsMap.forEach((ap, iata) => {
      const loc = ap.info;
      bounds.extend([loc.lat, loc.lng]);

      const isSelected = selectedAirportIata === iata;
      const size = Math.min(36, Math.max(22, 18 + ap.totalCount));

      const markerHtml = `
        <div class="relative flex items-center justify-center group cursor-pointer">
          <div class="absolute -inset-1 rounded-full bg-blue-500/30 blur-sm ${isSelected ? 'animate-ping opacity-75' : 'opacity-40'}"></div>
          <div class="relative flex items-center justify-center rounded-full bg-slate-950 border-2 ${isSelected ? 'border-amber-400 text-amber-300' : 'border-blue-400 text-blue-200'} shadow-[0_0_15px_rgba(59,130,246,0.6)] font-mono font-bold text-[10px] px-2 py-0.5 whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-blue-400'} mr-1 animate-pulse"></span>
            ${loc.iata}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-airport-icon',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; color: #f8fafc;">
          <div style="font-weight: 800; font-size: 13px; color: #38bdf8;">${loc.name} (${loc.iata})</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${loc.city}</div>
          <div style="margin-top: 8px; border-top: 1px solid #334155; padding-top: 6px; font-size: 11px; display: flex; gap: 8px;">
            <span>Total: <strong>${ap.totalCount} voos</strong></span>
            <span>(Partidas: ${ap.outbound} | Chegadas: ${ap.inbound})</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup',
      });

      marker.on('click', () => {
        setSelectedAirportIata(iata);
      });

      marker.addTo(layerGroup);
    });

    // 2. Draw Route Arc Polylines
    if (mapMode === 'routes') {
      const maxRouteCount = Math.max(...routeStatsList.map((r) => r.totalFlights), 1);

      routeStatsList.forEach((r) => {
        const p1 = L.latLng(r.fromAirport.lat, r.fromAirport.lng);
        const p2 = L.latLng(r.toAirport.lat, r.toAirport.lng);

        // Generate curved quadratic bezier path points
        const midLat = (p1.lat + p2.lat) / 2 + (p2.lng - p1.lng) * 0.15;
        const midLng = (p1.lng + p2.lng) / 2 - (p2.lat - p1.lat) * 0.15;
        const controlPoint = L.latLng(midLat, midLng);

        const curvePoints: L.LatLng[] = [];
        for (let t = 0; t <= 1; t += 0.05) {
          const lat = (1 - t) * (1 - t) * p1.lat + 2 * (1 - t) * t * controlPoint.lat + t * t * p2.lat;
          const lng = (1 - t) * (1 - t) * p1.lng + 2 * (1 - t) * t * controlPoint.lng + t * t * p2.lng;
          curvePoints.push(L.latLng(lat, lng));
        }

        const isHighlighted = activeRoute?.key === r.key;
        const weight = isHighlighted ? 5 : Math.max(2, Math.min(6, (r.totalFlights / maxRouteCount) * 5));
        const color = isHighlighted ? '#fbbf24' : r.totalFlights > 5 ? '#38bdf8' : '#818cf8';
        const opacity = isHighlighted ? 0.95 : Math.max(0.4, (r.totalFlights / maxRouteCount) * 0.85);

        const polyline = L.polyline(curvePoints, {
          color,
          weight,
          opacity,
          dashArray: isHighlighted ? '8, 8' : undefined,
        });

        polyline.on('mouseover', function () {
          this.setStyle({ color: '#f59e0b', weight: weight + 2, opacity: 1 });
        });

        polyline.on('mouseout', function () {
          if (activeRoute?.key !== r.key) {
            this.setStyle({ color, weight, opacity });
          }
        });

        polyline.on('click', () => {
          setActiveRoute(r);
        });

        polyline.addTo(layerGroup);
      });
    }

    // Fit Map Bounds
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [airportsMap, routeStatsList, activeRoute, selectedAirportIata, mapMode]);

  const handleResetMap = () => {
    setSelectedYear('ALL');
    setSelectedAirline('ALL');
    setSelectedAirportIata('ALL');
    setActiveRoute(null);
    if (mapInstanceRef.current && airportsMap.size > 0) {
      const bounds = L.latLngBounds([]);
      airportsMap.forEach((ap) => bounds.extend([ap.info.lat, ap.info.lng]));
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden mb-8"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Map Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Map className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Mapa Interativo de Rotas e Trajetos
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-10">
            Visualização geoespacial das conexões aéreas, rotas voadas e malha de aeroportos
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode switch */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setMapMode('routes')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mapMode === 'routes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rotas Aéreas
            </button>
            <button
              onClick={() => setMapMode('nodes')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mapMode === 'nodes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Aeroportos
            </button>
          </div>

          <button
            onClick={handleResetMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar Visão</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" /> Filtros:
          </span>

          {/* Year Select */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">Todos os Anos</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                Ano {y}
              </option>
            ))}
          </select>

          {/* Airline Select */}
          <select
            value={selectedAirline}
            onChange={(e) => setSelectedAirline(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">Todas as Companhias</option>
            {availableAirlines.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Airport Select */}
          <select
            value={selectedAirportIata}
            onChange={(e) => setSelectedAirportIata(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">Todos os Aeroportos</option>
            {Array.from(airportsMap.values()).map((ap: { info: AirportLocation; totalCount: number }) => (
              <option key={ap.info.iata} value={ap.info.iata}>
                {ap.info.iata} - {ap.info.name} ({ap.totalCount} voos)
              </option>
            ))}
          </select>
        </div>

        {/* Quick KPI stats pill */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Building2 className="w-3 h-3 text-blue-400" />
            <strong className="text-white">{airportsMap.size}</strong> Aeroportos
          </span>
          <span className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Navigation className="w-3 h-3 text-amber-400" />
            <strong className="text-white">{totalRoutesCount}</strong> Rotas Únicas
          </span>
        </div>
      </div>

      {/* Map Canvas + Overlay Details Drawer */}
      <div className="relative z-10 mt-4 h-[440px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full bg-slate-950" />

        {/* Floating Active Route Detail Card */}
        <AnimatePresence>
          {activeRoute && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 z-[1000] w-80 p-4 bg-slate-950/90 border border-blue-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-xs"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5" /> Rota Selecionada
                </span>
                <button
                  onClick={() => setActiveRoute(null)}
                  className="text-slate-500 hover:text-white text-xs font-bold px-1"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between mb-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-center">
                  <span className="text-lg font-black text-white font-mono">{activeRoute.fromAirport.iata}</span>
                  <span className="block text-[10px] text-slate-400 truncate max-w-[80px]">
                    {activeRoute.fromAirport.city}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <div className="text-center">
                  <span className="text-lg font-black text-white font-mono">{activeRoute.toAirport.iata}</span>
                  <span className="block text-[10px] text-slate-400 truncate max-w-[80px]">
                    {activeRoute.toAirport.city}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Total de Voos:</span>
                  <span className="font-mono font-bold text-blue-400 text-sm">{activeRoute.totalFlights} voos</span>
                </div>

                <div className="py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 block mb-1">Companhias:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeRoute.airlines.map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 font-semibold text-[10px]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="py-1">
                  <span className="text-slate-400 block mb-1">Aeronaves Utilizadas:</span>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
                    {activeRoute.aircrafts.map((ac) => (
                      <span key={ac} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {ac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Routes Ranking Bar below Map */}
      <div className="relative z-10 mt-4 pt-3 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
            Rotas Mais Frequentes:
          </span>
          <div className="flex flex-wrap gap-2">
            {routeStatsList.slice(0, 4).map((r, idx) => (
              <button
                key={r.key}
                onClick={() => setActiveRoute(r)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all cursor-pointer ${
                  activeRoute?.key === r.key
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-blue-500/50'
                }`}
              >
                #{idx + 1} {r.fromAirport.iata} ➔ {r.toAirport.iata} ({r.totalFlights})
              </button>
            ))}
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          DICA: Clique nos aeroportos ou linhas de rota para filtrar conexões
        </span>
      </div>
    </motion.section>
  );
}
