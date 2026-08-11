import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Plane, RefreshCw, Filter, Globe2, Sparkles, Clock, Navigation, CheckCircle2, AlertTriangle, ChevronRight, X, Barcode, MapPin, Gauge, Compass, Share2 } from 'lucide-react';

export interface LiveFlight {
  id: string;
  code: string;
  airline: string;
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  aircraft: string;
  registration: string;
  depTime: string;
  gate: string;
  terminal: string;
  status: 'EMBARQUE' | 'NO HORÁRIO' | 'TAXIAMENTO' | 'DECOLADO' | 'SUBINDO' | 'EM CRUZEIRO' | 'ÚLTIMA CHAMADA' | 'FINALIZADO';
  statusColor: string;
  region: 'Brasil' | 'América do Norte' | 'Europa' | 'Ásia & Oriente Médio' | 'América do Sul';
  altitude?: string;
  speed?: string;
}

// Global Airports Real Flight Data
const INITIAL_LIVE_FLIGHTS: LiveFlight[] = [
  {
    id: 'fl-101',
    code: 'LA 3021',
    airline: 'LATAM Airlines',
    originCode: 'GRU',
    originCity: 'São Paulo',
    destCode: 'SDU',
    destCity: 'Rio de Janeiro',
    aircraft: 'Airbus A320neo',
    registration: 'PR-XBB',
    depTime: '10:15',
    gate: 'B14',
    terminal: 'T2',
    status: 'EMBARQUE',
    statusColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    region: 'Brasil',
    altitude: 'FL280',
    speed: '440 kts'
  },
  {
    id: 'fl-102',
    code: 'G3 1420',
    airline: 'Gol Linhas Aéreas',
    originCode: 'CGH',
    originCity: 'São Paulo',
    destCode: 'BSB',
    destCity: 'Brasília',
    aircraft: 'Boeing 737 MAX 8',
    registration: 'PR-XMR',
    depTime: '10:30',
    gate: 'A04',
    terminal: 'T1',
    status: 'NO HORÁRIO',
    statusColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    region: 'Brasil',
    altitude: 'FL350',
    speed: '460 kts'
  },
  {
    id: 'fl-103',
    code: 'AD 4050',
    airline: 'Azul Linhas Aéreas',
    originCode: 'VCP',
    originCity: 'Campinas',
    destCode: 'CNF',
    destCity: 'Belo Horizonte',
    aircraft: 'Embraer E195-E2',
    registration: 'PS-AE1',
    depTime: '10:45',
    gate: 'C08',
    terminal: 'T1',
    status: 'SUBINDO',
    statusColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    region: 'Brasil',
    altitude: 'FL180',
    speed: '320 kts'
  },
  {
    id: 'fl-104',
    code: 'EK 0262',
    airline: 'Emirates',
    originCode: 'GRU',
    originCity: 'São Paulo',
    destCode: 'DXB',
    destCity: 'Dubai',
    aircraft: 'Airbus A380-800',
    registration: 'A6-EEO',
    depTime: '01:25',
    gate: 'G32',
    terminal: 'T3',
    status: 'EM CRUZEIRO',
    statusColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    region: 'Ásia & Oriente Médio',
    altitude: 'FL390',
    speed: '510 kts'
  },
  {
    id: 'fl-105',
    code: 'AA 0950',
    airline: 'American Airlines',
    originCode: 'GIG',
    originCity: 'Rio de Janeiro',
    destCode: 'JFK',
    destCity: 'Nova York',
    aircraft: 'Boeing 777-200ER',
    registration: 'N780AN',
    depTime: '22:45',
    gate: 'D22',
    terminal: 'T2',
    status: 'NO HORÁRIO',
    statusColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    region: 'América do Norte',
    altitude: 'FL370',
    speed: '485 kts'
  },
  {
    id: 'fl-106',
    code: 'AF 0454',
    airline: 'Air France',
    originCode: 'CDG',
    originCity: 'Paris',
    destCode: 'GRU',
    destCity: 'São Paulo',
    aircraft: 'Airbus A350-900',
    registration: 'F-HTYA',
    depTime: '11:10',
    gate: 'E42',
    terminal: 'T2E',
    status: 'EM CRUZEIRO',
    statusColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    region: 'Europa',
    altitude: 'FL410',
    speed: '495 kts'
  },
  {
    id: 'fl-107',
    code: 'TP 0088',
    airline: 'TAP Air Portugal',
    originCode: 'GRU',
    originCity: 'São Paulo',
    destCode: 'LIS',
    destCity: 'Lisboa',
    aircraft: 'Airbus A330-900neo',
    registration: 'CS-TUD',
    depTime: '15:20',
    gate: 'B28',
    terminal: 'T3',
    status: 'TAXIAMENTO',
    statusColor: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
    region: 'Europa',
    altitude: 'FL000',
    speed: '18 kts'
  },
  {
    id: 'fl-108',
    code: 'BA 0247',
    airline: 'British Airways',
    originCode: 'LHR',
    originCity: 'Londres',
    destCode: 'EZE',
    destCity: 'Buenos Aires',
    aircraft: 'Boeing 787-9',
    registration: 'G-ZBJA',
    depTime: '21:30',
    gate: 'A10',
    terminal: 'T5',
    status: 'NO HORÁRIO',
    statusColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    region: 'Europa',
    altitude: 'FL380',
    speed: '475 kts'
  },
  {
    id: 'fl-109',
    code: 'DL 0105',
    airline: 'Delta Air Lines',
    originCode: 'ATL',
    originCity: 'Atlanta',
    destCode: 'GRU',
    destCity: 'São Paulo',
    aircraft: 'Airbus A330-300',
    registration: 'N814NW',
    depTime: '19:50',
    gate: 'F12',
    terminal: 'T2',
    status: 'SUBINDO',
    statusColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    region: 'América do Norte',
    altitude: 'FL240',
    speed: '390 kts'
  },
  {
    id: 'fl-110',
    code: 'LH 0506',
    airline: 'Lufthansa',
    originCode: 'FRA',
    originCity: 'Frankfurt',
    destCode: 'EZE',
    destCity: 'Buenos Aires',
    aircraft: 'Boeing 747-8i',
    registration: 'D-ABYA',
    depTime: '22:15',
    gate: 'Z15',
    terminal: 'T1',
    status: 'EM CRUZEIRO',
    statusColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    region: 'Europa',
    altitude: 'FL360',
    speed: '505 kts'
  },
  {
    id: 'fl-111',
    code: 'SQ 0021',
    airline: 'Singapore Airlines',
    originCode: 'EWR',
    originCity: 'Nova York',
    destCode: 'SIN',
    destCity: 'Cingapura',
    aircraft: 'Airbus A350-900ULR',
    registration: '9V-SGA',
    depTime: '10:25',
    gate: 'B58',
    terminal: 'T1',
    status: 'EM CRUZEIRO',
    statusColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    region: 'Ásia & Oriente Médio',
    altitude: 'FL400',
    speed: '490 kts'
  },
  {
    id: 'fl-112',
    code: 'NH 0011',
    airline: 'ANA (All Nippon)',
    originCode: 'ORD',
    originCity: 'Chicago',
    destCode: 'HND',
    destCity: 'Tóquio',
    aircraft: 'Boeing 777-300ER',
    registration: 'JA795A',
    depTime: '11:00',
    gate: 'M14',
    terminal: 'T5',
    status: 'EMBARQUE',
    statusColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    region: 'Ásia & Oriente Médio',
    altitude: 'FL000',
    speed: '0 kts'
  },
  {
    id: 'fl-113',
    code: 'AR 1240',
    airline: 'Aerolíneas Argentinas',
    originCode: 'EZE',
    originCity: 'Buenos Aires',
    destCode: 'GIG',
    destCity: 'Rio de Janeiro',
    aircraft: 'Boeing 737-800',
    registration: 'LV-FQZ',
    depTime: '09:40',
    gate: '12',
    terminal: 'TC',
    status: 'DECOLADO',
    statusColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    region: 'América do Sul',
    altitude: 'FL330',
    speed: '445 kts'
  },
  {
    id: 'fl-114',
    code: 'AM 0014',
    airline: 'Aeroméxico',
    originCode: 'MEX',
    originCity: 'Cidade do México',
    destCode: 'GRU',
    destCity: 'São Paulo',
    aircraft: 'Boeing 787-9',
    registration: 'N183AM',
    depTime: '23:10',
    gate: '68',
    terminal: 'T2',
    status: 'NO HORÁRIO',
    statusColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    region: 'América do Norte',
    altitude: 'FL380',
    speed: '480 kts'
  },
  {
    id: 'fl-115',
    code: 'IB 6824',
    airline: 'Iberia',
    originCode: 'MAD',
    originCity: 'Madri',
    destCode: 'SCL',
    destCity: 'Santiago',
    aircraft: 'Airbus A350-900',
    registration: 'EC-NXY',
    depTime: '23:55',
    gate: 'R21',
    terminal: 'T4S',
    status: 'EM CRUZEIRO',
    statusColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    region: 'Europa',
    altitude: 'FL390',
    speed: '500 kts'
  }
];

const POSSIBLE_STATUSES: Array<LiveFlight['status']> = [
  'EMBARQUE', 'NO HORÁRIO', 'TAXIAMENTO', 'DECOLADO', 'SUBINDO', 'EM CRUZEIRO', 'ÚLTIMA CHAMADA'
];

const STATUS_COLOR_MAP: Record<LiveFlight['status'], string> = {
  'EMBARQUE': 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  'NO HORÁRIO': 'text-sky-400 border-sky-500/40 bg-sky-500/10',
  'TAXIAMENTO': 'text-orange-400 border-orange-500/40 bg-orange-500/10',
  'DECOLADO': 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  'SUBINDO': 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
  'EM CRUZEIRO': 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  'ÚLTIMA CHAMADA': 'text-red-400 border-red-500/40 bg-red-500/10',
  'FINALIZADO': 'text-slate-400 border-slate-500/40 bg-slate-500/10'
};

interface LiveDeparturesBoardProps {
  isDarkMode?: boolean;
}

export const LiveDeparturesBoard: React.FC<LiveDeparturesBoardProps> = ({ isDarkMode = true }) => {
  const [flights, setFlights] = useState<LiveFlight[]>(INITIAL_LIVE_FLIGHTS);
  const [selectedFlight, setSelectedFlight] = useState<LiveFlight | null>(null);
  const [isFullBoardOpen, setIsFullBoardOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('TODOS');
  const [lastFlippedId, setLastFlippedId] = useState<string | null>(null);

  // Periodically randomize/flip flight status to simulate real-time live airport radar telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setFlights((prev) => {
        const next = [...prev];
        const randomIdx = Math.floor(Math.random() * next.length);
        const target = { ...next[randomIdx] };

        const currentStatusIdx = POSSIBLE_STATUSES.indexOf(target.status);
        const nextStatus = POSSIBLE_STATUSES[(currentStatusIdx + 1) % POSSIBLE_STATUSES.length];

        target.status = nextStatus;
        target.statusColor = STATUS_COLOR_MAP[nextStatus];

        if (nextStatus === 'SUBINDO' || nextStatus === 'EM CRUZEIRO') {
          target.altitude = `FL${Math.floor(Math.random() * 12 + 28) * 10}`;
          target.speed = `${Math.floor(Math.random() * 80 + 430)} kts`;
        }

        next[randomIdx] = target;
        setLastFlippedId(target.id);
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const filteredFlights = selectedRegion === 'TODOS'
    ? flights
    : flights.filter((f) => f.region === selectedRegion);

  return (
    <>
      {/* Ticker Banner (Zero Scrollbar, Infinite Horizontal Marquee) */}
      <section className={`py-3.5 border-y font-mono text-xs z-10 relative overflow-hidden select-none ${
        isDarkMode
          ? 'bg-slate-950/90 border-slate-800 text-slate-100 shadow-inner'
          : 'bg-slate-900 text-white border-slate-800 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Fixed Badge Header */}
          <div className="flex items-center gap-2.5 shrink-0 z-20 pr-4 bg-slate-950/90 border-r border-slate-800/80">
            <div className="relative flex items-center justify-center">
              <Radio className="w-4 h-4 text-[#EC6726] animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC6726] animate-ping absolute -top-1 -right-1 opacity-75" />
            </div>
            <div className="text-left">
              <span className="text-[#EC6726] font-extrabold uppercase tracking-tight block text-[11px] font-mono leading-tight">
                DECOLAGENS AO VIVO
              </span>
              <span className="text-[9px] text-slate-400 font-sans block opacity-80">
                Aeroportos do Mundo
              </span>
            </div>

            <button
              onClick={() => setIsFullBoardOpen(true)}
              className="ml-2 px-2.5 py-1 rounded-lg bg-[#EC6726]/20 border border-[#EC6726]/40 text-[#EC6726] hover:bg-[#EC6726] hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              title="Abrir Painel Completo de Decolagens"
            >
              <Globe2 className="w-3 h-3" />
              <span>Painel</span>
            </button>
          </div>

          {/* Marquee Continuous Infinite Slider (NO SCROLLBAR) */}
          <div className="flex-1 overflow-hidden relative no-scrollbar">
            {/* Fade Gradients at Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            {/* Seamless Infinite Double Loop Container */}
            <div className="animate-marquee flex items-center gap-8 whitespace-nowrap py-1 font-mono cursor-pointer">
              {[...flights, ...flights].map((f, i) => {
                const isFlipped = f.id === lastFlippedId;

                return (
                  <div
                    key={`${f.id}-${i}`}
                    onClick={() => setSelectedFlight(f)}
                    className={`inline-flex items-center gap-3 px-3 py-1.5 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      isFlipped
                        ? 'border-[#EC6726] bg-[#EC6726]/15 shadow-sm shadow-[#EC6726]/30'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="text-amber-400 font-extrabold text-xs tracking-tight">
                      {f.code}
                    </span>

                    <span className="text-slate-300 text-[11px] font-sans font-semibold flex items-center gap-1">
                      <span>{f.originCode}</span>
                      <Plane className="w-3 h-3 text-[#EC6726] -rotate-45 inline" />
                      <span>{f.destCode}</span>
                    </span>

                    <span className="text-slate-400 text-[10px] hidden lg:inline font-sans">
                      ({f.aircraft})
                    </span>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${f.statusColor} ${
                      isFlipped ? 'animate-bounce' : ''
                    }`}>
                      {f.status}
                    </span>

                    <span className="text-[10px] text-slate-500 font-mono">
                      {f.depTime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Flight Detail Popover Modal - Styled as Real Boarding Pass Card */}
      <AnimatePresence>
        {selectedFlight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden font-sans select-none"
            >
              {/* Ticket Semicircle Cutouts */}
              <div className="absolute -left-3.5 bottom-[72px] w-7 h-7 rounded-full border border-slate-800 bg-[#020617] z-20" />
              <div className="absolute -right-3.5 bottom-[72px] w-7 h-7 rounded-full border border-slate-800 bg-[#020617] z-20" />

              {/* Boarding Pass Header Stub */}
              <div className="bg-gradient-to-r from-[#EC6726] via-orange-500 to-amber-500 p-5 text-white relative">
                <button
                  onClick={() => setSelectedFlight(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-black/20 w-fit px-2.5 py-1 rounded-md mb-2">
                  <Radio className="w-3 h-3 text-amber-200 animate-pulse" />
                  <span>CARTÃO DE EMBARQUE • DECOLAGEM AO VIVO</span>
                </div>

                <div className="flex items-end justify-between mt-2">
                  <div>
                    <span className="text-2xl font-black font-mono tracking-tight block leading-none text-white">
                      {selectedFlight.code}
                    </span>
                    <span className="text-xs text-orange-100 font-semibold block mt-1">
                      {selectedFlight.airline}
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-amber-100 uppercase block font-bold">REGIÃO</span>
                    <span className="text-xs font-extrabold text-white bg-black/20 px-2 py-0.5 rounded">
                      {selectedFlight.region}
                    </span>
                  </div>
                </div>
              </div>

              {/* Boarding Pass Main Body */}
              <div className="p-6 space-y-5">
                {/* Route Path Display */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 font-mono">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-3xl font-black text-[#EC6726] block tracking-tight">
                        {selectedFlight.originCode}
                      </span>
                      <span className="text-xs text-slate-400 font-sans block font-medium">
                        {selectedFlight.originCity}
                      </span>
                    </div>

                    <div className="flex-1 px-4 text-center">
                      <div className="relative flex items-center justify-center my-1">
                        <div className="border-t-2 border-dashed border-slate-700 w-full absolute" />
                        <div className="w-8 h-8 rounded-full bg-[#EC6726]/20 border border-[#EC6726]/50 text-[#EC6726] flex items-center justify-center relative z-10 shadow-sm">
                          <Plane className="w-4 h-4 -rotate-45" />
                        </div>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mt-1 uppercase ${selectedFlight.statusColor}`}>
                        {selectedFlight.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-3xl font-black text-[#EC6726] block tracking-tight">
                        {selectedFlight.destCode}
                      </span>
                      <span className="text-xs text-slate-400 font-sans block font-medium">
                        {selectedFlight.destCity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Extra Flight Information Grid */}
                <div className="grid grid-cols-2 gap-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">PARTIDA / TIME</span>
                    <span className="font-bold text-sky-400 text-sm flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-400" /> {selectedFlight.depTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">PORTÃO / TERMINAL</span>
                    <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" /> {selectedFlight.terminal} / {selectedFlight.gate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">AERONAVE / MODELO</span>
                    <span className="font-bold text-slate-200 truncate block">
                      {selectedFlight.aircraft}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">MATRÍCULA / REG</span>
                    <span className="font-extrabold text-amber-400">
                      {selectedFlight.registration}
                    </span>
                  </div>

                  {selectedFlight.altitude && (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">ALTITUDE DE VOO</span>
                      <span className="font-bold text-cyan-400 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" /> {selectedFlight.altitude}
                      </span>
                    </div>
                  )}

                  {selectedFlight.speed && (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">VELOCIDADE</span>
                      <span className="font-bold text-amber-300 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-amber-300" /> {selectedFlight.speed}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Tear Line & Barcode Section */}
              <div className="p-4 border-t border-dashed border-slate-800 bg-slate-950/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Barcode className="w-8 h-6 text-[#EC6726]" />
                  <div className="font-mono text-[9px] text-slate-400 leading-tight">
                    <span className="block font-bold text-slate-300">LIVE-RADAR-{selectedFlight.id.toUpperCase()}</span>
                    <span>PASSENGER TICKET • OK</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFlight(null)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EC6726] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#EC6726]/20"
                >
                  Fechar Cartão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Expanded Split-Flap Airport Board Modal View */}
      <AnimatePresence>
        {isFullBoardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono relative"
            >
              {/* Board Header */}
              <div className="p-5 sm:p-6 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EC6726] to-amber-500 text-white flex items-center justify-center shadow-lg shadow-[#EC6726]/30">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                      PAINEL MUNDIAL DE DECOLAGENS
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">LIVE RADAR</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-sans">
                      Monitoramento em tempo real de voos e partidas nos maiores hubs do mundo
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFullBoardOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Tabs (Zero Scrollbar) */}
              <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
                  <Filter className="w-3.5 h-3.5 text-[#EC6726]" /> Região:
                </span>
                {['TODOS', 'Brasil', 'América do Sul', 'América do Norte', 'Europa', 'Ásia & Oriente Médio'].map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedRegion === region
                        ? 'bg-[#EC6726] text-white shadow-md'
                        : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              {/* Solari Split-Flap Table Board (Zero Scrollbars on container) */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 no-scrollbar space-y-2">
                <div className="hidden sm:grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase px-4 py-2 border-b border-slate-800">
                  <span className="col-span-2">VOO / CIA</span>
                  <span className="col-span-3">ORIGEM ➔ DESTINO</span>
                  <span className="col-span-3">AERONAVE / REG</span>
                  <span className="col-span-1 text-center">PORTÃO</span>
                  <span className="col-span-1 text-center">HORA</span>
                  <span className="col-span-2 text-right">STATUS</span>
                </div>

                {filteredFlights.map((f) => {
                  const isFlipped = f.id === lastFlippedId;

                  return (
                    <motion.div
                      key={f.id}
                      onClick={() => setSelectedFlight(f)}
                      whileHover={{ scale: 1.01 }}
                      className={`grid grid-cols-1 sm:grid-cols-12 gap-2 p-3.5 rounded-2xl border transition-all cursor-pointer items-center ${
                        isFlipped
                          ? 'border-[#EC6726] bg-[#EC6726]/10 shadow-lg shadow-[#EC6726]/20'
                          : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <span className="text-amber-400 font-extrabold text-sm">{f.code}</span>
                        <span className="text-[10px] text-slate-400 font-sans truncate">{f.airline}</span>
                      </div>

                      <div className="sm:col-span-3 font-sans flex items-center gap-2 text-xs">
                        <span className="font-bold text-white">{f.originCode} ({f.originCity})</span>
                        <Plane className="w-3.5 h-3.5 text-[#EC6726] -rotate-45 shrink-0" />
                        <span className="font-bold text-white">{f.destCode} ({f.destCity})</span>
                      </div>

                      <div className="sm:col-span-3 text-xs text-slate-300 font-sans">
                        <span className="font-semibold block">{f.aircraft}</span>
                        <span className="text-[10px] font-mono text-amber-500 font-bold">{f.registration}</span>
                      </div>

                      <div className="sm:col-span-1 text-center font-bold text-emerald-400 text-xs">
                        {f.gate}
                      </div>

                      <div className="sm:col-span-1 text-center font-bold text-sky-400 text-xs">
                        {f.depTime}
                      </div>

                      <div className="sm:col-span-2 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border ${f.statusColor}`}>
                          {f.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0 font-sans">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Sincronizado via Radar de Aviação
                </span>
                <button
                  onClick={() => setIsFullBoardOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
                >
                  Fechar Painel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
