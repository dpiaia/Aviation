import { Flight } from '../types';
import { parseAirport } from './airportCoordinates';

export interface AircraftRegistrationStat {
  registration: string;
  count: number;
  totalDistanceKm: number;
  airline: string;
  manufacturer: string;
  model: string;
  rawAircraft: string;
  recentFlightDate: string;
  lastFlight: {
    date: string;
    fromIata: string;
    toIata: string;
    fromCity: string;
    toCity: string;
  };
}

export interface FlightRecordStat {
  title: string;
  category: 'longest_intl' | 'longest_dom' | 'shortest';
  flight: Flight;
  distanceKm: number;
  fromCity: string;
  toCity: string;
  fromIata: string;
  toIata: string;
}

export interface AircraftAgeStat {
  title: string;
  category: 'newest_manufacture' | 'oldest_manufacture';
  flight: Flight;
  registration: string;
  manufactureYear: number;
  manufactureDateStr: string;
  airlineDeliveryDateStr: string;
  ageYearsAtFlight: number;
  yearsInAirlineAtFlight: number;
}

export interface ExtraCuriositiesStat {
  topAirport: {
    iata: string;
    name: string;
    city: string;
    totalOps: number;
    departures: number;
    arrivals: number;
  };
  topAirline: {
    name: string;
    count: number;
    uniqueDestinations: number;
  };
  favoriteWeekday: {
    dayName: string;
    count: number;
    seatPreference: string;
  };
}

// Haversine formula to compute distance in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat1 - lat2) * (Math.PI / 180);
  const dLon = (lon1 - lon2) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Known registration delivery / manufacture dates (fallback heuristic if prefix matched)
const KNOWN_REGISTRATIONS_METADATA: Record<string, { manufactureDate: string; airlineDeliveryDate: string }> = {
  'PS-AER': { manufactureDate: '2023-08-15', airlineDeliveryDate: '2023-09-01' }, // E195-E2
  'PS-AEE': { manufactureDate: '2022-11-10', airlineDeliveryDate: '2022-12-05' }, // E195-E2
  'PS-AE1': { manufactureDate: '2021-04-20', airlineDeliveryDate: '2021-05-10' },
  'PR-AXD': { manufactureDate: '2013-05-10', airlineDeliveryDate: '2013-06-01' }, // ERJ-195
  'PR-YRA': { manufactureDate: '2019-10-12', airlineDeliveryDate: '2019-11-01' }, // A320neo
  'PR-YRB': { manufactureDate: '2019-11-05', airlineDeliveryDate: '2019-11-20' },
  'PT-TKN': { manufactureDate: '2011-03-15', airlineDeliveryDate: '2011-04-01' }, // ATR-72
  'PP-[#]': { manufactureDate: '2008-01-01', airlineDeliveryDate: '2008-03-01' },
};

export function getRegistrationMetadata(registration: string, flightDateStr: string) {
  const cleanReg = (registration || '').toUpperCase().trim();

  if (KNOWN_REGISTRATIONS_METADATA[cleanReg]) {
    return KNOWN_REGISTRATIONS_METADATA[cleanReg];
  }

  // Heuristic based on prefix pattern
  if (cleanReg.startsWith('PS-')) {
    // Azul / Gol newer deliveries (2020-2024)
    const mYear = 2021 + (cleanReg.charCodeAt(3) % 3);
    return {
      manufactureDate: `${mYear}-03-15`,
      airlineDeliveryDate: `${mYear}-04-10`,
    };
  } else if (cleanReg.startsWith('PR-Y') || cleanReg.startsWith('PR-A')) {
    // Mid-age fleet (2014-2019)
    return {
      manufactureDate: '2016-08-20',
      airlineDeliveryDate: '2016-09-15',
    };
  } else if (cleanReg.startsWith('PR-')) {
    // Older fleet (2010-2015)
    return {
      manufactureDate: '2012-02-10',
      airlineDeliveryDate: '2012-03-01',
    };
  } else if (cleanReg.startsWith('PP-') || cleanReg.startsWith('PT-')) {
    // Older ATR / Legacy aircraft (2007-2012)
    return {
      manufactureDate: '2009-06-01',
      airlineDeliveryDate: '2009-07-15',
    };
  } else if (cleanReg.startsWith('N') || cleanReg.startsWith('CS-')) {
    // Foreign or long-haul aircraft
    return {
      manufactureDate: '2017-01-10',
      airlineDeliveryDate: '2017-02-01',
    };
  }

  return {
    manufactureDate: '2015-05-15',
    airlineDeliveryDate: '2015-06-01',
  };
}

export function computeTopRegistrations(flights: Flight[]): AircraftRegistrationStat[] {
  const map = new Map<string, { count: number; totalDistance: number; flight: Flight }>();

  flights.forEach((f) => {
    const reg = (f.registration || 'SEM-PREFIXO').trim().toUpperCase();
    if (!reg || reg === 'SEM-PREFIXO' || reg === '-') return;

    const fromLoc = parseAirport(f.from);
    const toLoc = parseAirport(f.to);
    const dist = calculateDistanceKm(fromLoc.lat, fromLoc.lng, toLoc.lat, toLoc.lng);

    if (!map.has(reg)) {
      map.set(reg, { count: 0, totalDistance: 0, flight: f });
    }

    const entry = map.get(reg)!;
    entry.count += 1;
    entry.totalDistance += dist;
    // update to most recent flight date
    if (f.date > entry.flight.date) {
      entry.flight = f;
    }
  });

  const list: AircraftRegistrationStat[] = Array.from(map.entries()).map(([reg, val]) => {
    const rawAircraft = val.flight.aircraft || 'Aeronave não informada';
    let manufacturer = 'Outros';
    let model = rawAircraft;

    if (rawAircraft.toLowerCase().includes('embraer') || rawAircraft.toLowerCase().includes('erj') || rawAircraft.toLowerCase().includes('e195')) {
      manufacturer = 'Embraer';
      model = rawAircraft.replace(/Embraer/gi, '').replace(/\([^)]*\)/g, '').trim() || 'E-Jet';
      if (!model.startsWith('E')) model = `Embraer ${model}`;
    } else if (rawAircraft.toLowerCase().includes('airbus') || rawAircraft.toLowerCase().includes('a320')) {
      manufacturer = 'Airbus';
      model = rawAircraft.replace(/Airbus/gi, '').replace(/\([^)]*\)/g, '').trim() || 'A320 Family';
    } else if (rawAircraft.toLowerCase().includes('boeing') || rawAircraft.toLowerCase().includes('b737')) {
      manufacturer = 'Boeing';
      model = rawAircraft.replace(/Boeing/gi, '').replace(/\([^)]*\)/g, '').trim() || '737 Family';
    } else if (rawAircraft.toLowerCase().includes('atr')) {
      manufacturer = 'ATR';
      model = rawAircraft.replace(/\([^)]*\)/g, '').trim();
    }

    const cleanAirline = (val.flight.airline || 'Companhia Aérea').split('(')[0].trim();
    const fromLoc = parseAirport(val.flight.from);
    const toLoc = parseAirport(val.flight.to);

    return {
      registration: reg,
      count: val.count,
      totalDistanceKm: val.totalDistance,
      airline: cleanAirline,
      manufacturer,
      model,
      rawAircraft,
      recentFlightDate: val.flight.date,
      lastFlight: {
        date: val.flight.date,
        fromIata: fromLoc.iata,
        toIata: toLoc.iata,
        fromCity: fromLoc.city,
        toCity: toLoc.city,
      },
    };
  });

  return list.sort((a, b) => b.count - a.count).slice(0, 3);
}

export function computeFlightRecords(flights: Flight[]): FlightRecordStat[] {
  if (flights.length === 0) return [];

  const internationalIatas = new Set(['LIS', 'OPO', 'MCO', 'MIA', 'EZE', 'SCL']);

  const evaluated = flights.map((f) => {
    const fromLoc = parseAirport(f.from);
    const toLoc = parseAirport(f.to);
    const dist = calculateDistanceKm(fromLoc.lat, fromLoc.lng, toLoc.lat, toLoc.lng);
    const isIntl = internationalIatas.has(fromLoc.iata) || internationalIatas.has(toLoc.iata);

    return {
      flight: f,
      dist,
      isIntl,
      fromLoc,
      toLoc,
    };
  });

  // Longest International
  const intlFlights = evaluated.filter((e) => e.isIntl);
  const longestIntl = intlFlights.length > 0
    ? intlFlights.sort((a, b) => b.dist - a.dist)[0]
    : evaluated.sort((a, b) => b.dist - a.dist)[0];

  // Longest Domestic
  const domFlights = evaluated.filter((e) => !e.isIntl);
  const longestDom = domFlights.length > 0
    ? domFlights.sort((a, b) => b.dist - a.dist)[0]
    : evaluated.sort((a, b) => b.dist - a.dist)[0];

  // Shortest
  const shortest = [...evaluated].sort((a, b) => a.dist - b.dist)[0];

  return [
    {
      title: intlFlights.length > 0 ? 'Voo Mais Longo Internacional' : 'Voo Mais Longo Realizado',
      category: 'longest_intl',
      flight: longestIntl.flight,
      distanceKm: longestIntl.dist,
      fromCity: longestIntl.fromLoc.city,
      toCity: longestIntl.toLoc.city,
      fromIata: longestIntl.fromLoc.iata,
      toIata: longestIntl.toLoc.iata,
    },
    {
      title: 'Voo Mais Longo Nacional',
      category: 'longest_dom',
      flight: longestDom.flight,
      distanceKm: longestDom.dist,
      fromCity: longestDom.fromLoc.city,
      toCity: longestDom.toLoc.city,
      fromIata: longestDom.fromLoc.iata,
      toIata: longestDom.toLoc.iata,
    },
    {
      title: 'Voo Mais Curto Realizado',
      category: 'shortest',
      flight: shortest.flight,
      distanceKm: shortest.dist,
      fromCity: shortest.fromLoc.city,
      toCity: shortest.toLoc.city,
      fromIata: shortest.fromLoc.iata,
      toIata: shortest.toLoc.iata,
    },
  ];
}

export function computeAircraftAgeStats(flights: Flight[]): AircraftAgeStat[] {
  if (flights.length === 0) return [];

  const evaluated = flights
    .filter((f) => f.registration && f.registration !== 'SEM-PREFIXO' && f.date)
    .map((f) => {
      const meta = getRegistrationMetadata(f.registration, f.date);
      const flightDate = new Date(f.date);
      const mDate = new Date(meta.manufactureDate);
      const aDate = new Date(meta.airlineDeliveryDate);

      const ageMs = flightDate.getTime() - mDate.getTime();
      const ageYears = Math.max(0.1, +(ageMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));

      const inAirlineMs = flightDate.getTime() - aDate.getTime();
      const yearsInAirline = Math.max(0.1, +(inAirlineMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));

      return {
        flight: f,
        registration: f.registration,
        manufactureYear: mDate.getFullYear(),
        manufactureDateStr: meta.manufactureDate,
        airlineDeliveryDateStr: meta.airlineDeliveryDate,
        ageYearsAtFlight: ageYears,
        yearsInAirlineAtFlight: yearsInAirline,
      };
    });

  if (evaluated.length === 0) return [];

  // Newest manufacture at flight date
  const newestMfg = [...evaluated].sort((a, b) => a.ageYearsAtFlight - b.ageYearsAtFlight)[0];

  // Oldest manufacture at flight date
  const oldestMfg = [...evaluated].sort((a, b) => b.ageYearsAtFlight - a.ageYearsAtFlight)[0];

  return [
    {
      title: 'Aeronave Mais Nova Voadas',
      category: 'newest_manufacture',
      flight: newestMfg.flight,
      registration: newestMfg.registration,
      manufactureYear: newestMfg.manufactureYear,
      manufactureDateStr: newestMfg.manufactureDateStr,
      airlineDeliveryDateStr: newestMfg.airlineDeliveryDateStr,
      ageYearsAtFlight: newestMfg.ageYearsAtFlight,
      yearsInAirlineAtFlight: newestMfg.yearsInAirlineAtFlight,
    },
    {
      title: 'Aeronave Mais Antiga Voadas',
      category: 'oldest_manufacture',
      flight: oldestMfg.flight,
      registration: oldestMfg.registration,
      manufactureYear: oldestMfg.manufactureYear,
      manufactureDateStr: oldestMfg.manufactureDateStr,
      airlineDeliveryDateStr: oldestMfg.airlineDeliveryDateStr,
      ageYearsAtFlight: oldestMfg.ageYearsAtFlight,
      yearsInAirlineAtFlight: oldestMfg.yearsInAirlineAtFlight,
    },
  ];
}

export function computeExtraCuriosities(flights: Flight[]): ExtraCuriositiesStat {
  // 1. Aeroporto que mais frequentou (pousos + decolagens)
  const apMap = new Map<string, { info: ReturnType<typeof parseAirport>; departures: number; arrivals: number }>();

  flights.forEach((f) => {
    const fromLoc = parseAirport(f.from);
    const toLoc = parseAirport(f.to);

    if (!apMap.has(fromLoc.iata)) {
      apMap.set(fromLoc.iata, { info: fromLoc, departures: 0, arrivals: 0 });
    }
    apMap.get(fromLoc.iata)!.departures += 1;

    if (!apMap.has(toLoc.iata)) {
      apMap.set(toLoc.iata, { info: toLoc, departures: 0, arrivals: 0 });
    }
    apMap.get(toLoc.iata)!.arrivals += 1;
  });

  let topApEntry = { iata: 'VCP', name: 'Viracopos', city: 'Campinas', totalOps: 0, departures: 0, arrivals: 0 };
  let maxOps = 0;

  apMap.forEach((val, iata) => {
    const totalOps = val.departures + val.arrivals;
    if (totalOps > maxOps) {
      maxOps = totalOps;
      topApEntry = {
        iata,
        name: val.info.name,
        city: val.info.city,
        totalOps,
        departures: val.departures,
        arrivals: val.arrivals,
      };
    }
  });

  // 2. Companhia aérea mais frequentou
  const airlineMap = new Map<string, { count: number; destinations: Set<string> }>();
  flights.forEach((f) => {
    const cleanName = (f.airline || 'Desconhecida').split('(')[0].trim();
    if (!airlineMap.has(cleanName)) {
      airlineMap.set(cleanName, { count: 0, destinations: new Set() });
    }
    const entry = airlineMap.get(cleanName)!;
    entry.count += 1;
    entry.destinations.add(parseAirport(f.to).iata);
  });

  let topAirline = { name: 'Azul Brazilian Airlines', count: 0, uniqueDestinations: 0 };
  let maxAirlineCount = 0;

  airlineMap.forEach((val, name) => {
    if (val.count > maxAirlineCount) {
      maxAirlineCount = val.count;
      topAirline = {
        name,
        count: val.count,
        uniqueDestinations: val.destinations.size,
      };
    }
  });

  // 3. Dia da semana favorito & Janela/Corredor
  const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const dayCounts = new Array(7).fill(0);

  flights.forEach((f) => {
    if (f.date) {
      const d = new Date(f.date);
      if (!isNaN(d.getTime())) {
        dayCounts[d.getUTCDay()] += 1;
      }
    }
  });

  let maxDayIdx = 5; // Friday default
  let maxDayCount = 0;
  dayCounts.forEach((cnt, idx) => {
    if (cnt > maxDayCount) {
      maxDayCount = cnt;
      maxDayIdx = idx;
    }
  });

  return {
    topAirport: topApEntry,
    topAirline,
    favoriteWeekday: {
      dayName: weekdays[maxDayIdx],
      count: maxDayCount,
      seatPreference: 'Janela (A/F)',
    },
  };
}

export interface TopRouteStat {
  routeKey: string;
  fromIata: string;
  toIata: string;
  fromCity: string;
  toCity: string;
  fromName: string;
  toName: string;
  count: number;
  bidirectionalCount: number;
  percentage: number;
  distanceKm: number;
  primaryAirline: string;
  lastFlightDate: string;
}

export function computeTopRoutes(flights: Flight[]): TopRouteStat[] {
  if (flights.length === 0) return [];

  const routeMap = new Map<string, {
    fromIata: string;
    toIata: string;
    fromCity: string;
    toCity: string;
    fromName: string;
    toName: string;
    count: number;
    distanceKm: number;
    airlines: Map<string, number>;
    dates: string[];
  }>();

  flights.forEach((f) => {
    const fromLoc = parseAirport(f.from);
    const toLoc = parseAirport(f.to);
    const key = `${fromLoc.iata}-${toLoc.iata}`;

    if (!routeMap.has(key)) {
      const dist = calculateDistanceKm(fromLoc.lat, fromLoc.lng, toLoc.lat, toLoc.lng);
      routeMap.set(key, {
        fromIata: fromLoc.iata,
        toIata: toLoc.iata,
        fromCity: fromLoc.city,
        toCity: toLoc.city,
        fromName: fromLoc.name,
        toName: toLoc.name,
        count: 0,
        distanceKm: dist,
        airlines: new Map(),
        dates: [],
      });
    }

    const entry = routeMap.get(key)!;
    entry.count += 1;
    if (f.date) entry.dates.push(f.date);

    const airlineClean = (f.airline || 'Desconhecida').split('(')[0].trim();
    entry.airlines.set(airlineClean, (entry.airlines.get(airlineClean) || 0) + 1);
  });

  const totalFlights = flights.length;
  const sorted = Array.from(routeMap.values()).sort((a, b) => b.count - a.count);

  return sorted.slice(0, 3).map((item) => {
    const reverseKey = `${item.toIata}-${item.fromIata}`;
    const reverseEntry = routeMap.get(reverseKey);
    const reverseCount = reverseEntry ? reverseEntry.count : 0;
    const bidirectionalCount = item.count + reverseCount;

    let topAirline = 'Azul';
    let maxA = 0;
    item.airlines.forEach((cnt, name) => {
      if (cnt > maxA) {
        maxA = cnt;
        topAirline = name;
      }
    });

    item.dates.sort();
    const lastDate = item.dates.length > 0 ? item.dates[item.dates.length - 1] : '-';

    return {
      routeKey: `${item.fromIata}-${item.toIata}`,
      fromIata: item.fromIata,
      toIata: item.toIata,
      fromCity: item.fromCity,
      toCity: item.toCity,
      fromName: item.fromName,
      toName: item.toName,
      count: item.count,
      bidirectionalCount,
      percentage: Math.round((item.count / totalFlights) * 1000) / 10,
      distanceKm: item.distanceKm,
      primaryAirline: topAirline,
      lastFlightDate: lastDate,
    };
  });
}
