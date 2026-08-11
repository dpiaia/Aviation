import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Plane, Navigation, Filter, RotateCcw, Info, Calendar, Building2, Check, ArrowRight, Globe2 } from 'lucide-react';
import { Flight } from '../types';
import { parseAirport, AirportLocation, extractCountry, extractCountryCode } from '../utils/airportCoordinates';

interface InteractiveFlightMapProps {
  flights: Flight[];
  onSelectAirport?: (airport: string) => void;
  isDarkMode?: boolean;
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

interface AirportEntry {
  info: AirportLocation;
  totalCount: number;
  inbound: number;
  outbound: number;
}

// Country Flags & Centroid Coordinates Map for Country Overlay Markers
const COUNTRY_METADATA: Record<string, { flag: string; lat: number; lng: number; code: string }> = {
  'Brasil': { flag: '🇧🇷', lat: -14.235, lng: -51.925, code: 'BRA' },
  'EUA': { flag: '🇺🇸', lat: 37.0902, lng: -95.7129, code: 'USA' },
  'Portugal': { flag: '🇵🇹', lat: 39.3999, lng: -8.2245, code: 'PRT' },
  'França': { flag: '🇫🇷', lat: 46.2276, lng: 2.2137, code: 'FRA' },
  'Espanha': { flag: '🇪🇸', lat: 40.4637, lng: -3.7492, code: 'ESP' },
  'Alemanha': { flag: '🇩🇪', lat: 51.1657, lng: 10.4515, code: 'DEU' },
  'Reino Unido': { flag: '🇬🇧', lat: 55.3781, lng: -3.436, code: 'GBR' },
  'Argentina': { flag: '🇦🇷', lat: -38.4161, lng: -63.6167, code: 'ARG' },
  'Chile': { flag: '🇨🇱', lat: -35.6751, lng: -71.543, code: 'CHL' },
  'Colômbia': { flag: '🇨🇴', lat: 4.5709, lng: -74.2973, code: 'COL' },
  'México': { flag: '🇲🇽', lat: 23.6345, lng: -102.5528, code: 'MEX' },
  'Panamá': { flag: '🇵🇦', lat: 8.538, lng: -80.7821, code: 'PAN' },
  'Peru': { flag: '🇵🇪', lat: -9.19, lng: -75.0152, code: 'PER' },
  'Uruguai': { flag: '🇺🇾', lat: -32.5228, lng: -55.7658, code: 'URY' },
};

// Built-in lightweight fallback GeoJSON polygons so map is NEVER empty
const FALLBACK_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', id: 'BRA', properties: { name: 'Brazil', NAME: 'Brazil' }, geometry: { type: 'Polygon', coordinates: [[[-73.98, -9.28], [-60, 5], [-34.8, -7], [-53, -33.7], [-73.98, -9.28]]] } },
    { type: 'Feature', id: 'USA', properties: { name: 'United States', NAME: 'United States' }, geometry: { type: 'Polygon', coordinates: [[[-124, 49], [-67, 49], [-80, 25], [-117, 32], [-124, 49]]] } },
    { type: 'Feature', id: 'PRT', properties: { name: 'Portugal', NAME: 'Portugal' }, geometry: { type: 'Polygon', coordinates: [[[-9.5, 37], [-6.2, 37], [-6.2, 42.1], [-9.5, 42.1], [-9.5, 37]]] } },
    { type: 'Feature', id: 'FRA', properties: { name: 'France', NAME: 'France' }, geometry: { type: 'Polygon', coordinates: [[[-4.8, 43.5], [8.2, 43.5], [8.2, 51.1], [-4.8, 51.1], [-4.8, 43.5]]] } },
    { type: 'Feature', id: 'ESP', properties: { name: 'Spain', NAME: 'Spain' }, geometry: { type: 'Polygon', coordinates: [[[-9.3, 36], [3.3, 36], [3.3, 43.8], [-9.3, 43.8], [-9.3, 36]]] } },
    { type: 'Feature', id: 'DEU', properties: { name: 'Germany', NAME: 'Germany' }, geometry: { type: 'Polygon', coordinates: [[[5.8, 47.3], [15, 47.3], [15, 55], [5.8, 55], [5.8, 47.3]]] } },
    { type: 'Feature', id: 'GBR', properties: { name: 'United Kingdom', NAME: 'United Kingdom' }, geometry: { type: 'Polygon', coordinates: [[[-8, 50], [1.7, 50], [1.7, 58.6], [-8, 58.6], [-8, 50]]] } },
    { type: 'Feature', id: 'ARG', properties: { name: 'Argentina', NAME: 'Argentina' }, geometry: { type: 'Polygon', coordinates: [[[-73.5, -21.8], [-53.6, -26.2], [-65, -55], [-73.5, -21.8]]] } },
    { type: 'Feature', id: 'CHL', properties: { name: 'Chile', NAME: 'Chile' }, geometry: { type: 'Polygon', coordinates: [[[-75.6, -17.5], [-68.5, -17.5], [-68.5, -55], [-75.6, -55], [-75.6, -17.5]]] } },
    { type: 'Feature', id: 'COL', properties: { name: 'Colombia', NAME: 'Colombia' }, geometry: { type: 'Polygon', coordinates: [[[-79, -4.2], [-66.8, -4.2], [-66.8, 12.5], [-79, 12.5], [-79, -4.2]]] } },
    { type: 'Feature', id: 'MEX', properties: { name: 'Mexico', NAME: 'Mexico' }, geometry: { type: 'Polygon', coordinates: [[[-117, 32.5], [-86.7, 21], [-92, 14.5], [-117, 32.5]]] } },
    { type: 'Feature', id: 'PAN', properties: { name: 'Panama', NAME: 'Panama' }, geometry: { type: 'Polygon', coordinates: [[[-83, 7.2], [-77.2, 7.2], [-77.2, 9.6], [-83, 9.6], [-83, 7.2]]] } },
    { type: 'Feature', id: 'PER', properties: { name: 'Peru', NAME: 'Peru' }, geometry: { type: 'Polygon', coordinates: [[[-81.3, -0.03], [-68.6, -0.03], [-68.6, -18.3], [-81.3, -18.3], [-81.3, -0.03]]] } },
    { type: 'Feature', id: 'URY', properties: { name: 'Uruguay', NAME: 'Uruguay' }, geometry: { type: 'Polygon', coordinates: [[[-58.4, -30.1], [-53.1, -30.1], [-53.1, -35], [-58.4, -35], [-58.4, -30.1]]] } },
  ]
};

function matchCountryCount(
  featureName: string,
  featureIso: string,
  countryCounts: Record<string, number>,
  countryCodeCounts?: Record<string, number>
): number {
  const nameLower = (featureName || '').toLowerCase().trim();
  const isoUpper = (featureIso || '').toUpperCase().trim();

  // 1. Direct ISO 3166-1 alpha-3 code match first
  if (isoUpper && countryCodeCounts && countryCodeCounts[isoUpper] !== undefined) {
    return countryCodeCounts[isoUpper];
  }

  // 2. Name-based match fallback
  let count = 0;
  Object.entries(countryCounts).forEach(([cName, cCount]) => {
    const cLower = cName.toLowerCase().trim();

    const isMatch =
      (cLower === 'brasil' && (nameLower.includes('brazil') || nameLower.includes('brasil') || isoUpper === 'BRA')) ||
      (cLower === 'eua' && (nameLower.includes('united states') || nameLower.includes('america') || isoUpper === 'USA')) ||
      (cLower === 'portugal' && (nameLower.includes('portugal') || isoUpper === 'PRT')) ||
      (cLower === 'frança' && (nameLower.includes('france') || nameLower.includes('frança') || isoUpper === 'FRA')) ||
      (cLower === 'espanha' && (nameLower.includes('spain') || nameLower.includes('espanha') || isoUpper === 'ESP')) ||
      (cLower === 'alemanha' && (nameLower.includes('germany') || nameLower.includes('alemanha') || isoUpper === 'DEU')) ||
      (cLower === 'reino unido' && (nameLower.includes('united kingdom') || nameLower.includes('britain') || nameLower.includes('uk') || isoUpper === 'GBR')) ||
      (cLower === 'argentina' && (nameLower.includes('argentina') || isoUpper === 'ARG')) ||
      (cLower === 'chile' && (nameLower.includes('chile') || isoUpper === 'CHL')) ||
      (cLower === 'colômbia' && (nameLower.includes('colombia') || nameLower.includes('colômbia') || isoUpper === 'COL')) ||
      (cLower === 'méxico' && (nameLower.includes('mexico') || nameLower.includes('méxico') || isoUpper === 'MEX')) ||
      (cLower === 'panamá' && (nameLower.includes('panama') || nameLower.includes('panamá') || isoUpper === 'PAN')) ||
      (cLower === 'peru' && (nameLower.includes('peru') || isoUpper === 'PER')) ||
      (cLower === 'uruguai' && (nameLower.includes('uruguay') || nameLower.includes('uruguai') || isoUpper === 'URY')) ||
      nameLower === cLower ||
      (nameLower.length >= 4 && cLower.length >= 4 && (nameLower.includes(cLower) || cLower.includes(nameLower)));

    if (isMatch) {
      count += cCount;
    }
  });

  return count;
}

export function InteractiveFlightMap({ flights, onSelectAirport, isDarkMode = true }: InteractiveFlightMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Filters
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedAirline, setSelectedAirline] = useState<string>('ALL');
  const [selectedAirportIata, setSelectedAirportIata] = useState<string>('ALL');
  const [activeRoute, setActiveRoute] = useState<RouteStat | null>(null);
  const [mapMode, setMapMode] = useState<'routes' | 'nodes' | 'countries'>('routes');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [geoJsonData, setGeoJsonData] = useState<any>(FALLBACK_GEOJSON);

  // Auto-rotate map views periodically (every 6 seconds) between routes, aeroportos, and países visitados
  useEffect(() => {
    if (!isAutoRotating) return;

    const timer = setInterval(() => {
      setMapMode((prev) => {
        if (prev === 'routes') return 'nodes';
        if (prev === 'nodes') return 'countries';
        return 'routes';
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoRotating]);

  // Load GeoJSON for world countries choropleth with multi-source fallback
  useEffect(() => {
    let isMounted = true;
    fetch('https://cdn.jsdelivr.net/gh/johan/world-geojson@master/countries.geo.json')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && data.features) setGeoJsonData(data);
      })
      .catch(() => {
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
          .then((res) => res.json())
          .then((data) => {
            if (isMounted && data && data.features) setGeoJsonData(data);
          })
          .catch((e) => console.warn('GeoJSON load fallback error:', e));
      });
    return () => {
      isMounted = false;
    };
  }, []);

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
  const { airportsMap, routeStatsList, totalRoutesCount, countryStats, countryCodeStats, uniqueCountryCodes } = useMemo<{
    airportsMap: Map<string, AirportEntry>;
    routeStatsList: RouteStat[];
    totalRoutesCount: number;
    countryStats: Record<string, number>;
    countryCodeStats: Record<string, number>;
    uniqueCountryCodes: string[];
  }>(() => {
    type RouteEntry = { from: AirportLocation; to: AirportLocation; count: number; airlines: Set<string>; aircrafts: Set<string>; dates: string[] };

    const airports = new Map<string, AirportEntry>();
    const routesMap = new Map<string, RouteEntry>();
    const countriesCount: Record<string, number> = {};
    const countryCodesCount: Record<string, number> = {};
    const uniqueCodesSet = new Set<string>();

    filteredFlights.forEach((f) => {
      const fromLoc = parseAirport(f.from);
      const toLoc = parseAirport(f.to);

      // Track country visits
      const cFrom = extractCountry(fromLoc.city, fromLoc.iata);
      const codeFrom = extractCountryCode(fromLoc.city, fromLoc.iata);
      const cTo = extractCountry(toLoc.city, toLoc.iata);
      const codeTo = extractCountryCode(toLoc.city, toLoc.iata);

      countriesCount[cFrom] = (countriesCount[cFrom] || 0) + 1;
      countriesCount[cTo] = (countriesCount[cTo] || 0) + 1;

      countryCodesCount[codeFrom] = (countryCodesCount[codeFrom] || 0) + 1;
      countryCodesCount[codeTo] = (countryCodesCount[codeTo] || 0) + 1;

      uniqueCodesSet.add(codeFrom);
      uniqueCodesSet.add(codeTo);

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

      // Register route pair
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
      countryStats: countriesCount,
      countryCodeStats: countryCodesCount,
      uniqueCountryCodes: Array.from(uniqueCodesSet),
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

  // Sync tile layer on isDarkMode change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const newTileLayer = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [isDarkMode]);

  // Render Markers & Route Lines on Filter or Mode Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (airportsMap.size === 0) return;

    const bounds = L.latLngBounds([]);

    // Always calculate bounds from airports
    airportsMap.forEach((ap) => {
      bounds.extend([ap.info.lat, ap.info.lng]);
    });

    // 0. Render GeoJSON Countries Choropleth Layer
    if (geoJsonData) {
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: (feature) => {
          const name = feature?.properties?.name || feature?.properties?.NAME || '';
          const iso = feature?.id || feature?.properties?.ISO_A3 || '';
          const flightCount = matchCountryCount(name, iso, countryStats, countryCodeStats);

          if (flightCount === 0) {
            return {
              fillColor: isDarkMode ? '#0f172a' : '#e2e8f0',
              fillOpacity: mapMode === 'countries' ? 0.35 : 0.08,
              color: isDarkMode ? '#334155' : '#cbd5e1',
              weight: mapMode === 'countries' ? 1.2 : 0.6,
            };
          }

          // Dynamic gradient intensity based on number of visits
          let fillColor = '#fdba74'; // 1-2 flights (light orange)
          if (flightCount > 20) fillColor = '#7c2d12';     // 21+ flights (dark maroon/orange)
          else if (flightCount > 10) fillColor = '#c2410c'; // 11-20 flights (dark orange)
          else if (flightCount > 5) fillColor = '#ea580c';  // 6-10 flights (brand orange)
          else if (flightCount > 2) fillColor = '#f97316';  // 3-5 flights (medium orange)

          return {
            fillColor,
            fillOpacity: mapMode === 'countries' ? 0.85 : 0.45,
            color: '#ea580c',
            weight: mapMode === 'countries' ? 2 : 1.2,
          };
        },
        onEachFeature: (feature, layer) => {
          const name = feature?.properties?.name || feature?.properties?.NAME || 'País';
          const iso = feature?.id || feature?.properties?.ISO_A3 || '';
          const flightCount = matchCountryCount(name, iso, countryStats, countryCodeStats);

          if (flightCount > 0) {
            layer.bindTooltip(
              `<div style="font-family: sans-serif; padding: 6px; font-size: 12px; font-weight: bold; color: #ffffff;">
                <div style="display: flex; align-items: center; gap: 4px;">📍 <span>${name}</span></div>
                <div style="color: #fdba74; font-size: 11px; margin-top: 3px; font-family: monospace;">✈️ <strong>${flightCount}</strong> voos/trajetos</div>
              </div>`,
              { sticky: true, className: 'custom-country-tooltip' }
            );
          }
        },
      });

      geoJsonLayer.addTo(layerGroup);
    }

    // 1. Draw Country Markers when in 'countries' mode
    if (mapMode === 'countries') {
      Object.entries(countryStats).forEach(([cName, cCount]) => {
        const meta = COUNTRY_METADATA[cName] || { flag: '🌐', lat: 0, lng: 0 };

        // Fallback lat/lng from airports in that country if meta is empty
        let lat = meta.lat;
        let lng = meta.lng;
        if (!lat && !lng) {
          const matchingAirports = (Array.from(airportsMap.values()) as AirportEntry[]).filter(
            (ap) => extractCountry(ap.info.city, ap.info.iata) === cName
          );
          if (matchingAirports.length > 0) {
            lat = matchingAirports.reduce((acc: number, a: AirportEntry) => acc + a.info.lat, 0) / matchingAirports.length;
            lng = matchingAirports.reduce((acc: number, a: AirportEntry) => acc + a.info.lng, 0) / matchingAirports.length;
          }
        }

        if (lat && lng) {
          bounds.extend([lat, lng]);

          const countryMarkerHtml = `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="absolute -inset-2 rounded-2xl bg-[#EC6726]/30 blur-md animate-pulse"></div>
              <div class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border-2 border-[#EC6726] text-white shadow-2xl font-mono text-xs font-bold whitespace-nowrap">
                <span class="text-sm">${meta.flag}</span>
                <span class="text-amber-200">${cName}</span>
                <span class="px-1.5 py-0.5 rounded-md bg-[#EC6726] text-slate-950 font-black text-[10px]">
                  ${cCount} voos
                </span>
              </div>
            </div>
          `;

          const customIcon = L.divIcon({
            html: countryMarkerHtml,
            className: 'custom-country-badge-icon',
            iconSize: [120, 36],
            iconAnchor: [60, 18],
          });

          const marker = L.marker([lat, lng], { icon: customIcon });
          marker.bindPopup(`
            <div style="font-family: sans-serif; padding: 6px; color: #f8fafc;">
              <div style="font-weight: 800; font-size: 14px; color: #fdba74;">${meta.flag} ${cName}</div>
              <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
                Total de Trajetos Registrados: <strong style="color: #ea580c;">${cCount} voos</strong>
              </div>
            </div>
          `, { className: 'custom-leaflet-popup' });

          marker.addTo(layerGroup);
        }
      });
    }

    // 2. Draw Airport Markers
    if (mapMode === 'routes' || mapMode === 'nodes') {
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
    }

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
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
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
        mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden mb-8 ${
        isDarkMode
          ? 'bg-slate-900/40 border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.3)] text-white'
          : 'bg-white/90 border-slate-200/90 shadow-md text-slate-900'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Map Header */}
      <div className={`relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 border border-blue-500/30 flex items-center justify-center">
              <MapIcon className="w-4 h-4" />
            </div>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Mapa Interativo de Rotas e Trajetos
            </h2>
          </div>
          <p className={`text-xs mt-1 pl-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Visualização geoespacial das conexões aéreas, rotas voadas e malha de aeroportos
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode switch */}
          <div className={`flex items-center border rounded-xl p-1 gap-1 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => {
                setMapMode('routes');
                setIsAutoRotating(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mapMode === 'routes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rotas Aéreas
            </button>
            <button
              onClick={() => {
                setMapMode('nodes');
                setIsAutoRotating(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mapMode === 'nodes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aeroportos
            </button>
            <button
              onClick={() => {
                setMapMode('countries');
                setIsAutoRotating(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                mapMode === 'countries'
                  ? 'bg-[#EC6726] text-white shadow-xs font-bold'
                  : isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-[#EC6726] hover:text-[#d9581d]'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              Países Visitados
            </button>
          </div>

          {/* Auto-rotation Toggle Pill */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title={isAutoRotating ? 'Clique para pausar a troca automática de visões' : 'Clique para ativar a troca automática de visões'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-semibold transition-all cursor-pointer ${
              isAutoRotating
                ? 'bg-[#EC6726]/10 border-[#EC6726]/40 text-[#EC6726]'
                : isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAutoRotating ? 'bg-[#EC6726] animate-ping' : 'bg-slate-500'}`} />
            <span>{isAutoRotating ? 'Auto (Alternando)' : 'Auto (Pausado)'}</span>
          </button>

          <button
            onClick={handleResetMap}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar Visão</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`relative z-10 flex flex-wrap items-center justify-between gap-3 py-3 border-b text-xs ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`font-semibold flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <Filter className="w-3.5 h-3.5 text-blue-500" /> Filtros:
          </span>

          {/* Year Select */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={`border rounded-xl px-3 py-1 focus:outline-none focus:border-blue-500 font-mono ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
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
            className={`border rounded-xl px-3 py-1 focus:outline-none focus:border-blue-500 font-mono ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
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
            className={`border rounded-xl px-3 py-1 focus:outline-none focus:border-blue-500 font-mono ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
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
        <div className={`flex items-center gap-2 flex-wrap font-mono text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <span className={`flex items-center gap-1 border px-2.5 py-1 rounded-lg ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Globe2 className="w-3 h-3 text-[#EC6726]" />
            <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{Object.keys(countryStats).length}</strong> Países Visitados
          </span>
          <span className={`flex items-center gap-1 border px-2.5 py-1 rounded-lg ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Building2 className="w-3 h-3 text-blue-500" />
            <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{airportsMap.size}</strong> Aeroportos
          </span>
          <span className={`flex items-center gap-1 border px-2.5 py-1 rounded-lg ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Navigation className="w-3 h-3 text-amber-500" />
            <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{totalRoutesCount}</strong> Rotas Únicas
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
                <button
                  type="button"
                  onClick={() => onSelectAirport && onSelectAirport(activeRoute.fromAirport.iata)}
                  className="text-center group hover:bg-slate-800/80 p-1 rounded transition-colors cursor-pointer"
                  title="Clique para ver ficha do aeroporto"
                >
                  <span className="text-lg font-black text-white font-mono group-hover:text-blue-400">{activeRoute.fromAirport.iata}</span>
                  <span className="block text-[10px] text-slate-400 truncate max-w-[80px]">
                    {activeRoute.fromAirport.city}
                  </span>
                </button>

                <ArrowRight className="w-4 h-4 text-amber-400" />

                <button
                  type="button"
                  onClick={() => onSelectAirport && onSelectAirport(activeRoute.toAirport.iata)}
                  className="text-center group hover:bg-slate-800/80 p-1 rounded transition-colors cursor-pointer"
                  title="Clique para ver ficha do aeroporto"
                >
                  <span className="text-lg font-black text-white font-mono group-hover:text-blue-400">{activeRoute.toAirport.iata}</span>
                  <span className="block text-[10px] text-slate-400 truncate max-w-[80px]">
                    {activeRoute.toAirport.city}
                  </span>
                </button>
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

      {/* Top Routes & Visited Countries Ranking Bar below Map */}
      <div className="relative z-10 mt-4 pt-3 border-t border-slate-800 flex flex-col gap-3 text-xs">
        {mapMode === 'countries' ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#EC6726] uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                Países Mais Visitados:
              </span>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(countryStats) as [string, number][])
                  .sort((a, b) => b[1] - a[1])
                  .map(([country, count]: [string, number], idx) => {
                    const meta = COUNTRY_METADATA[country] || { flag: '🌐', lat: 0, lng: 0 };
                    let colorBg = 'bg-orange-500/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/40';
                    if (count > 20) colorBg = 'bg-red-900/40 text-red-200 border-red-500/60 font-black hover:bg-red-800/60';
                    else if (count > 10) colorBg = 'bg-orange-600/30 text-orange-200 border-orange-500/50 font-bold hover:bg-orange-600/50';
                    else if (count > 5) colorBg = 'bg-amber-600/20 text-amber-300 border-amber-500/40 hover:bg-amber-600/40';

                    const handleCountryClick = () => {
                      const map = mapInstanceRef.current;
                      if (!map) return;
                      let lat = meta.lat;
                      let lng = meta.lng;
                      if (!lat && !lng) {
                        const matchingAirports = (Array.from(airportsMap.values()) as AirportEntry[]).filter(
                          (ap) => extractCountry(ap.info.city, ap.info.iata) === country
                        );
                        if (matchingAirports.length > 0) {
                          lat = matchingAirports.reduce((acc: number, a: AirportEntry) => acc + a.info.lat, 0) / matchingAirports.length;
                          lng = matchingAirports.reduce((acc: number, a: AirportEntry) => acc + a.info.lng, 0) / matchingAirports.length;
                        }
                      }
                      if (lat && lng) {
                        map.flyTo([lat, lng], 5, { duration: 1.2 });
                      }
                    };

                    return (
                      <button
                        key={country}
                        onClick={handleCountryClick}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all cursor-pointer flex items-center gap-1 ${colorBg}`}
                      >
                        <span>{meta.flag}</span>
                        <span>#{idx + 1} {country}: <strong>{count} voos</strong></span>
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>Intensidade:</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-300/30 text-orange-200">1-2</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-500/40 text-orange-100">3-5</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-700/60 text-white">6-10</span>
              <span className="px-1.5 py-0.5 rounded bg-red-900/80 text-white font-bold">11+</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
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
        )}
      </div>
    </motion.section>
  );
}
