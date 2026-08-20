// Aviation Card Album Database & Helpers
import { Flight } from '../types';

export type CardCategory = 'AIRPORT' | 'AIRCRAFT_MODEL' | 'SPECIFIC_AIRCRAFT' | 'LEGENDARY_AIRCRAFT';

export type CardRarityTier = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface AlbumCard {
  id: string;
  category: CardCategory;
  title: string;
  subtitle: string;
  registration?: string;
  airportCode?: string;
  aircraftModel?: string;
  airline?: string;
  imageUrl: string;
  allPhotoUrls?: string[]; // Multiple photos pool for random rotation
  currentPhotoIndex?: number;
  description: string;
  quantity: number;
  isUnlocked: boolean;
  isPasted: boolean;
  stats: { label: string; value: string; unit?: string }[];
  obtainedDates?: string[];
  baseRarity: CardRarityTier;
}

// Card Back Images mapping according to user instructions
export const CARD_BACK_IMAGES: Record<CardCategory, { url: string; fallbackClass: string; title: string }> = {
  AIRPORT: {
    url: 'Gemini_Generated_Image_uyea6uuyea6uuyea.jpeg',
    fallbackClass: 'bg-gradient-to-tr from-sky-950 via-blue-900 to-indigo-950 border-amber-400',
    title: 'Aviation 2024 Air Club — Aeroportos',
  },
  AIRCRAFT_MODEL: {
    url: 'Gemini_Generated_Image_6va5n66va5n66va5.jpeg',
    fallbackClass: 'bg-gradient-to-tr from-amber-950 via-slate-900 to-stone-900 border-amber-300',
    title: 'Aviation Playing Cards — Modelos',
  },
  SPECIFIC_AIRCRAFT: {
    url: 'Gemini_Generated_Image_6va5n66va5n66va5.jpeg',
    fallbackClass: 'bg-gradient-to-tr from-orange-950 via-slate-900 to-zinc-900 border-orange-400',
    title: 'Aviation Playing Cards — Matrícula Real',
  },
  LEGENDARY_AIRCRAFT: {
    url: 'Gemini_Generated_Image_a72wjva72wjva72w.jpeg',
    fallbackClass: 'bg-gradient-to-tr from-black via-zinc-950 to-amber-950 border-amber-500',
    title: 'Aviation Royal Edition — Aviões Lendários',
  },
};

// Calculate dynamic rarity based on collected quantity
export function getDynamicRarity(quantity: number, baseRarity: CardRarityTier = 'common'): {
  tier: CardRarityTier;
  label: string;
  colorClass: string;
  badgeBg: string;
  borderClass: string;
  glowClass: string;
  holoEffect: string;
  nextTier?: { name: string; requiredQty: number; progress: number };
} {
  if (quantity >= 25) {
    return {
      tier: 'mythic',
      label: 'MÍTICA • TITANIUM BLACK',
      colorClass: 'text-cyan-300',
      badgeBg: 'bg-gradient-to-r from-cyan-950 to-slate-950 text-cyan-300 border-cyan-400 font-black shadow-cyan-500/50 shadow-md',
      borderClass: 'border-2 border-cyan-400 bg-gradient-to-br from-slate-950 via-cyan-950/60 to-slate-900',
      glowClass: 'shadow-[0_0_25px_rgba(34,211,238,0.4)]',
      holoEffect: 'animate-pulse ring-2 ring-cyan-400/60',
    };
  }
  if (quantity >= 10) {
    return {
      tier: 'legendary',
      label: 'LENDÁRIA • DIAMANTE PRISMA',
      colorClass: 'text-purple-300',
      badgeBg: 'bg-gradient-to-r from-purple-950 to-indigo-950 text-purple-200 border-purple-400 font-extrabold shadow-purple-500/40 shadow-md',
      borderClass: 'border-2 border-purple-400 bg-gradient-to-br from-slate-950 via-purple-950/60 to-indigo-950',
      glowClass: 'shadow-[0_0_20px_rgba(192,132,252,0.35)]',
      holoEffect: 'ring-1 ring-purple-400/50',
      nextTier: { name: 'Mítica (Titanium Black)', requiredQty: 25, progress: Math.min(100, Math.round(((quantity - 10) / 15) * 100)) },
    };
  }
  if (quantity >= 5) {
    return {
      tier: 'epic',
      label: 'ÉPICA • OURO 24K',
      colorClass: 'text-amber-300',
      badgeBg: 'bg-gradient-to-r from-amber-950 to-yellow-950 text-amber-300 border-amber-400 font-extrabold shadow-amber-500/30 shadow-md',
      borderClass: 'border-2 border-amber-400 bg-gradient-to-br from-slate-950 via-amber-950/50 to-slate-900',
      glowClass: 'shadow-[0_0_18px_rgba(251,191,36,0.3)]',
      holoEffect: 'ring-1 ring-amber-400/40',
      nextTier: { name: 'Lendária (Diamante)', requiredQty: 10, progress: Math.min(100, Math.round(((quantity - 5) / 5) * 100)) },
    };
  }
  if (quantity >= 2) {
    return {
      tier: 'rare',
      label: 'RARA • PRATA HOLOGRÁFICA',
      colorClass: 'text-blue-300',
      badgeBg: 'bg-slate-900 text-blue-300 border-blue-400 font-bold',
      borderClass: 'border-2 border-blue-400/80 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40',
      glowClass: 'shadow-blue-500/20 shadow-lg',
      holoEffect: '',
      nextTier: { name: 'Épica (Ouro 24k)', requiredQty: 5, progress: Math.min(100, Math.round(((quantity - 2) / 3) * 100)) },
    };
  }

  // Base / 1 copy
  const baseConfigs: Record<CardRarityTier, any> = {
    legendary: {
      tier: 'legendary',
      label: 'LENDÁRIA (BASE)',
      colorClass: 'text-amber-400',
      badgeBg: 'bg-amber-950/70 text-amber-300 border-amber-500/70 font-bold',
      borderClass: 'border-2 border-amber-500/80 bg-gradient-to-br from-slate-950 via-amber-950/30 to-slate-900',
      glowClass: 'shadow-amber-500/20 shadow-md',
      holoEffect: '',
      nextTier: { name: 'Rara (Prata)', requiredQty: 2, progress: 50 },
    },
    epic: {
      tier: 'epic',
      label: 'ÉPICA (BASE)',
      colorClass: 'text-purple-400',
      badgeBg: 'bg-purple-950/70 text-purple-300 border-purple-500/60 font-bold',
      borderClass: 'border border-purple-400/70 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900',
      glowClass: 'shadow-purple-500/15 shadow-md',
      holoEffect: '',
      nextTier: { name: 'Rara (Prata)', requiredQty: 2, progress: 50 },
    },
    rare: {
      tier: 'rare',
      label: 'RARA (BASE)',
      colorClass: 'text-blue-400',
      badgeBg: 'bg-blue-950/70 text-blue-300 border-blue-500/60 font-bold',
      borderClass: 'border border-blue-400/70 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900',
      glowClass: 'shadow-blue-500/15 shadow-md',
      nextTier: { name: 'Rara (Prata)', requiredQty: 2, progress: 50 },
    },
    mythic: {
      tier: 'mythic',
      label: 'MÍTICA',
      colorClass: 'text-cyan-300',
      badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold',
      borderClass: 'border-2 border-cyan-400 bg-slate-950',
      glowClass: 'shadow-cyan-500/30 shadow-lg',
      nextTier: undefined,
    },
    common: {
      tier: 'common',
      label: 'COMUM',
      colorClass: 'text-slate-300',
      badgeBg: 'bg-slate-900 text-slate-300 border-slate-700 font-bold',
      borderClass: 'border border-slate-700 bg-slate-900',
      glowClass: 'shadow-slate-950 shadow-md',
      nextTier: { name: 'Rara (Prata)', requiredQty: 2, progress: 50 },
    },
  };

  return baseConfigs[baseRarity] || baseConfigs.common;
}

// Multi-photo pools for random selection per model, airport, and legendary planes
export const REAL_AVIATION_PHOTO_POOLS: Record<string, string[]> = {
  // Aircraft Models Pools
  'embraer_e195_e2': [
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544016768-982d1554c0b7?auto=format&fit=crop&q=80&w=800',
  ],
  'boeing_787_9': [
    'https://images.unsplash.com/photo-1519074069444-1ba4edd16be1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?auto=format&fit=crop&q=80&w=800',
  ],
  'airbus_a320neo': [
    'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=800',
  ],
  'atr_72_600': [
    'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=800',
    'https://upload.wikimedia.org/wikipedia/commons/9/9e/ATR_72-600_%28Azul%29_Rafael_Luiz_%2830204149731%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/23/PR-TQI_ATR.72-212A_ATR_Azul_Linhas_A%C3%A9reas_Brasileiras_%2835940989063%29.jpg',
    'https://images.unsplash.com/photo-1583551538520-2175949a20a4?auto=format&fit=crop&q=80&w=800',
  ],
  'boeing_737_800': [
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
  ],
  'airbus_a350_900': [
    'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&q=80&w=800',
  ],

  // Legendary Aircraft Pools
  'legend_concorde': [
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    'https://upload.wikimedia.org/wikipedia/commons/7/73/Concorde_216_%28G-BBDG%29_Brooklands_Museum_%2849551179782%29.jpg',
  ],
  'legend_an225': [
    'https://upload.wikimedia.org/wikipedia/commons/1/18/Antonov_An-225_Mriya_in_2008.jpg',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
  ],
  'legend_sr71': [
    'https://upload.wikimedia.org/wikipedia/commons/1/1e/Lockheed_SR-71_Blackbird.jpg',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=800',
  ],
  'legend_b747_100': [
    'https://upload.wikimedia.org/wikipedia/commons/a/a2/Boeing_747_first_flight_1969.jpg',
    'https://images.unsplash.com/photo-1519074069444-1ba4edd16be1?auto=format&fit=crop&q=80&w=800',
  ],
  'legend_constellation': [
    'https://upload.wikimedia.org/wikipedia/commons/0/07/Lockheed_L-1049_Super_Constellation_%28Breitling%29.jpg',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
  ],
  'legend_dc3': [
    'https://upload.wikimedia.org/wikipedia/commons/6/6f/Douglas_DC-3_%28C-47A-25-DK%29%2C_Private_JP6841261.jpg',
    'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=800',
  ],
  'legend_14bis': [
    'https://upload.wikimedia.org/wikipedia/commons/9/90/14-bis_en_vol_1906.jpg',
    'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&q=80&w=800',
  ],

  // Airports Pools
  'airport_sdu': [
    'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=800',
  ],
  'airport_vcp': [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
  ],
  'airport_gru': [
    'https://images.unsplash.com/photo-1473862170180-84427c485aca?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
  ],
  'airport_lhr': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=800',
  ],
  'airport_jfk': [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=800',
  ],
};

// Pick a random photo from pool ensuring variety
export function getRandomPhotoFromPool(poolKey: string, previousIndex?: number): { url: string; index: number } {
  const pool = REAL_AVIATION_PHOTO_POOLS[poolKey] || REAL_AVIATION_PHOTO_POOLS['embraer_e195_e2'];
  if (pool.length === 1) return { url: pool[0], index: 0 };

  let nextIndex = Math.floor(Math.random() * pool.length);
  if (previousIndex !== undefined && nextIndex === previousIndex && pool.length > 1) {
    nextIndex = (nextIndex + 1) % pool.length;
  }
  return { url: pool[nextIndex], index: nextIndex };
}

// Initial Standard Cards Roster
export const BASE_CATALOG_CARDS: AlbumCard[] = [
  // 1. MODELO DE AVIÃO (AIRCRAFT_MODEL)
  {
    id: 'card_mdl_e195e2',
    category: 'AIRCRAFT_MODEL',
    title: 'Embraer E195-E2',
    subtitle: 'O "Profit Hunter" Brasileiro',
    aircraftModel: 'Embraer E195-E2',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['embraer_e195_e2'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['embraer_e195_e2'],
    currentPhotoIndex: 0,
    description: 'Aeronave comercial de médio alcance com motores Pratt & Whitney GTF ultra silenciosos e asas de alta razão de aspecto.',
    quantity: 3,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'rare',
    stats: [
      { label: 'Primeiro Voo', value: '2017' },
      { label: 'Capacidade', value: '146 passageiros' },
      { label: 'Alcance', value: '4.815 km' },
      { label: 'Velocidade', value: '870 km/h (Mach 0.82)' },
      { label: 'Fabricante', value: 'Embraer (Brasil)' },
    ],
  },
  {
    id: 'card_mdl_b7879',
    category: 'AIRCRAFT_MODEL',
    title: 'Boeing 787-9 Dreamliner',
    subtitle: 'Widebody de Fuselagem Composta',
    aircraftModel: 'Boeing 787-9',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['boeing_787_9'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['boeing_787_9'],
    currentPhotoIndex: 0,
    description: 'Aeronave de longo curso construída em 50% de materiais compostos de fibra de carbono e janelas reguláveis.',
    quantity: 1,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'epic',
    stats: [
      { label: 'Primeiro Voo', value: '2013' },
      { label: 'Capacidade', value: '290 passageiros' },
      { label: 'Alcance', value: '14.140 km' },
      { label: 'Velocidade', value: 'Mach 0.85 (903 km/h)' },
      { label: 'Fabricante', value: 'Boeing (EUA)' },
    ],
  },
  {
    id: 'card_mdl_a320neo',
    category: 'AIRCRAFT_MODEL',
    title: 'Airbus A320neo',
    subtitle: 'O Best-Seller Europeu',
    aircraftModel: 'Airbus A320neo',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['airbus_a320neo'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['airbus_a320neo'],
    currentPhotoIndex: 0,
    description: 'Jato de corredor único com sharklets e motores de nova geração, o mais vendido da história da aviação moderna.',
    quantity: 6,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'rare',
    stats: [
      { label: 'Primeiro Voo', value: '2014' },
      { label: 'Capacidade', value: '180 passageiros' },
      { label: 'Alcance', value: '6.500 km' },
      { label: 'Velocidade', value: 'Mach 0.78 (828 km/h)' },
      { label: 'Fabricante', value: 'Airbus (Europa)' },
    ],
  },
  {
    id: 'card_mdl_atr72',
    category: 'AIRCRAFT_MODEL',
    title: 'ATR 72-600',
    subtitle: 'Rei das Rotas Regionais',
    aircraftModel: 'ATR 72-600',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['atr_72_600'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['atr_72_600'],
    currentPhotoIndex: 0,
    description: 'Turboélice bimotor perfeito para pistas curtas no interior, com baixíssimo consumo de combustível.',
    quantity: 2,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'common',
    stats: [
      { label: 'Primeiro Voo', value: '2009' },
      { label: 'Capacidade', value: '70 passageiros' },
      { label: 'Alcance', value: '1.528 km' },
      { label: 'Pista Mínima', value: '1.333 metros' },
      { label: 'Fabricante', value: 'ATR (França / Itália)' },
    ],
  },

  // 2. AVIÃO ESPECÍFICO (SPECIFIC_AIRCRAFT - Por Prefixo Real)
  {
    id: 'card_reg_psaed',
    category: 'SPECIFIC_AIRCRAFT',
    title: 'Embraer E195-E2 • PS-AED',
    subtitle: 'Azul "Arara Azul" Pintura Especial',
    registration: 'PS-AED',
    aircraftModel: 'Embraer E195-E2',
    airline: 'Azul Linhas Aéreas',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    description: 'Unidade física entregue com pintura temática especial comemorativa da fauna brasileira.',
    quantity: 2,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'rare',
    stats: [
      { label: 'Prefixo', value: 'PS-AED' },
      { label: 'Operadora', value: 'Azul Linhas Aéreas' },
      { label: 'Data Entrega', value: 'Outubro de 2020' },
      { label: 'Motores', value: '2x PW1900G' },
      { label: 'Configuração', value: '136 assentos' },
    ],
  },
  {
    id: 'card_reg_prgxa',
    category: 'SPECIFIC_AIRCRAFT',
    title: 'Boeing 737-800 • PR-GXA',
    subtitle: 'Gol Linhas Aéreas Veterano',
    registration: 'PR-GXA',
    aircraftModel: 'Boeing 737-800',
    airline: 'Gol Linhas Aéreas',
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
    description: 'Aeronave experiente da malha doméstica brasileira com winglets Split Scimitar instalados.',
    quantity: 1,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'common',
    stats: [
      { label: 'Prefixo', value: 'PR-GXA' },
      { label: 'Operadora', value: 'Gol Linhas Aéreas' },
      { label: 'Data Entrega', value: 'Maio de 2012' },
      { label: 'Motores', value: '2x CFM56-7B26' },
      { label: 'Configuração', value: '186 assentos' },
    ],
  },
  {
    id: 'card_reg_ptmub',
    category: 'SPECIFIC_AIRCRAFT',
    title: 'Airbus A320-200 • PT-MUB',
    subtitle: 'LATAM Brasil Linha de Frente',
    registration: 'PT-MUB',
    aircraftModel: 'Airbus A320-200',
    airline: 'LATAM Airlines',
    imageUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=800',
    description: 'Espinha dorsal da conexão aérea entre os principais aeroportos capitais da América do Sul.',
    quantity: 1,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'common',
    stats: [
      { label: 'Prefixo', value: 'PT-MUB' },
      { label: 'Operadora', value: 'LATAM Airlines Brasil' },
      { label: 'Data Entrega', value: 'Março de 2011' },
      { label: 'Motores', value: '2x IAE V2500' },
      { label: 'Configuração', value: '174 assentos' },
    ],
  },

  // 3. AEROPORTO (AIRPORT)
  {
    id: 'card_apt_sdu',
    category: 'AIRPORT',
    title: 'Santos Dumont (SDU)',
    subtitle: 'Rio de Janeiro • Brasil',
    airportCode: 'SDU',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['airport_sdu'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['airport_sdu'],
    currentPhotoIndex: 0,
    description: 'Um dos cenários mais famosos do mundo, com aproximação na Baía de Guanabara e vista privilegiada do Pão de Açúcar.',
    quantity: 5,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'epic',
    stats: [
      { label: 'IATA / ICAO', value: 'SDU / SBRJ' },
      { label: 'Inauguração', value: '1936' },
      { label: 'Pista Principal', value: '1.323m Asfalto' },
      { label: 'Elevação', value: '3 metros' },
      { label: 'Passageiros/Ano', value: '10.2 Milhões' },
    ],
  },
  {
    id: 'card_apt_vcp',
    category: 'AIRPORT',
    title: 'Viracopos Campinas (VCP)',
    subtitle: 'São Paulo • Brasil',
    airportCode: 'VCP',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['airport_vcp'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['airport_vcp'],
    currentPhotoIndex: 0,
    description: 'Maior hub de conexões domésticas do interior paulista e principal polo de cargas aéreas do país.',
    quantity: 4,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'rare',
    stats: [
      { label: 'IATA / ICAO', value: 'VCP / SBKP' },
      { label: 'Inauguração', value: '1960' },
      { label: 'Pista Principal', value: '3.240m Asfalto' },
      { label: 'Elevação', value: '661 metros' },
      { label: 'Passageiros/Ano', value: '12.5 Milhões' },
    ],
  },
  {
    id: 'card_apt_gru',
    category: 'AIRPORT',
    title: 'Guarulhos Internacional (GRU)',
    subtitle: 'São Paulo • Brasil',
    airportCode: 'GRU',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['airport_gru'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['airport_gru'],
    currentPhotoIndex: 0,
    description: 'O aeroporto mais movimentado da América do Sul e o principal portão de entrada para voos intercontinentais.',
    quantity: 2,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'rare',
    stats: [
      { label: 'IATA / ICAO', value: 'GRU / SBGR' },
      { label: 'Inauguração', value: '1985' },
      { label: 'Pista Principal', value: '3.700m Asfalto' },
      { label: 'Elevação', value: '750 metros' },
      { label: 'Passageiros/Ano', value: '41.3 Milhões' },
    ],
  },
  {
    id: 'card_apt_lhr',
    category: 'AIRPORT',
    title: 'London Heathrow (LHR)',
    subtitle: 'Londres • Reino Unido',
    airportCode: 'LHR',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['airport_lhr'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['airport_lhr'],
    currentPhotoIndex: 0,
    description: 'O coração da aviação europeia e um dos aeroportos mais conectados do planeta com 5 terminais de passageiros.',
    quantity: 1,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'epic',
    stats: [
      { label: 'IATA / ICAO', value: 'LHR / EGLL' },
      { label: 'Inauguração', value: '1946' },
      { label: 'Pistas', value: '2x Paralelas (3.902m)' },
      { label: 'Passageiros/Ano', value: '79.2 Milhões' },
      { label: 'Elevação', value: '25 metros' },
    ],
  },

  // 4. AVIÃO LENDÁRIO (LEGENDARY_AIRCRAFT - Ícones Históricos)
  {
    id: 'card_leg_concorde',
    category: 'LEGENDARY_AIRCRAFT',
    title: 'Concorde Supersônico G-BOAC',
    subtitle: 'A Lenda dos Céus a Mach 2.04',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['legend_concorde'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['legend_concorde'],
    currentPhotoIndex: 0,
    description: 'O ícone comercial supersônico anglo-francês capaz de voar de Londres a Nova York em menos de 3h30min no limite da estratosfera.',
    quantity: 12,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'legendary',
    stats: [
      { label: 'Primeiro Voo', value: '1969' },
      { label: 'Velocidade Máxima', value: 'Mach 2.04 (2.179 km/h)' },
      { label: 'Teto de Serviço', value: '60.000 pés (18.300m)' },
      { label: 'Motores', value: '4x Rolls-Royce Olympus' },
      { label: 'Status', value: 'Lenda Aposentada' },
    ],
  },
  {
    id: 'card_leg_an225',
    category: 'LEGENDARY_AIRCRAFT',
    title: 'Antonov An-225 "Mriya"',
    subtitle: 'O Maior Avião Já Construído',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['legend_an225'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['legend_an225'],
    currentPhotoIndex: 0,
    description: 'Gigante ucraniano com 6 turbofans, 32 rodas de trem de pouso e capacidade colossal de carga de até 250 toneladas.',
    quantity: 1,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'legendary',
    stats: [
      { label: 'Envergadura', value: '88,4 metros' },
      { label: 'Peso Máx. Decolagem', value: '640.000 kg' },
      { label: 'Motores', value: '6x Progress D-18T' },
      { label: 'Carga Útil Recorde', value: '253.820 kg' },
      { label: 'Fabricante', value: 'Antonov ASTC' },
    ],
  },
  {
    id: 'card_leg_14bis',
    category: 'LEGENDARY_AIRCRAFT',
    title: 'Santos-Dumont 14-Bis',
    subtitle: 'O Primeiro Voo Homologado da Humanidade',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['legend_14bis'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['legend_14bis'],
    currentPhotoIndex: 0,
    description: 'Em 23 de outubro de 1906, em Paris, decolou por meios próprios sem auxílio externo de catapultas, consagrando a aviação moderna.',
    quantity: 26,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'legendary',
    stats: [
      { label: 'Data Histórica', value: '23 de Outubro de 1906' },
      { label: 'Local', value: 'Campo de Bagatelle (Paris)' },
      { label: 'Motor', value: 'Antoinette 50 HP V8' },
      { label: 'Distância do Voo', value: '60 metros a 3m de altura' },
      { label: 'Inventor', value: 'Alberto Santos-Dumont' },
    ],
  },
  {
    id: 'card_leg_b747_100',
    category: 'LEGENDARY_AIRCRAFT',
    title: 'Boeing 747 "Queen of the Skies"',
    subtitle: 'O Primeiro Jumbo Jet do Mundo',
    imageUrl: REAL_AVIATION_PHOTO_POOLS['legend_b747_100'][0],
    allPhotoUrls: REAL_AVIATION_PHOTO_POOLS['legend_b747_100'],
    currentPhotoIndex: 0,
    description: 'Democratizou as viagens internacionais de massa nos anos 70 com seu formato corcunda característico e cabine dupla.',
    quantity: 3,
    isUnlocked: true,
    isPasted: true,
    baseRarity: 'legendary',
    stats: [
      { label: 'Primeiro Voo', value: '1969' },
      { label: 'Capacidade', value: 'Até 480 passageiros' },
      { label: 'Alcance', value: '9.800 km' },
      { label: 'Motores', value: '4x Pratt & Whitney JT9D' },
      { label: 'Título', value: 'Rainha dos Céus' },
    ],
  },
];

// Helper to generate dynamic cards based on user's actual flights
export function buildUserCardRoster(flights: Flight[], baseCatalog: AlbumCard[] = BASE_CATALOG_CARDS): AlbumCard[] {
  const cardsMap = new Map<string, AlbumCard>();

  // Load base cards
  baseCatalog.forEach((c) => cardsMap.set(c.id, { ...c }));

  if (!flights || flights.length === 0) {
    return Array.from(cardsMap.values());
  }

  // Count registration occurrences
  const regCounts: Record<string, { count: number; flight: Flight }> = {};
  const airportCounts: Record<string, { count: number; name: string }> = {};
  const modelCounts: Record<string, { count: number; model: string }> = {};

  flights.forEach((f) => {
    // Specific Aircraft by Registration
    if (f.registration && f.registration.trim() && f.registration !== 'SEM-PREFIXO') {
      const regKey = f.registration.toUpperCase().trim();
      if (!regCounts[regKey]) regCounts[regKey] = { count: 0, flight: f };
      regCounts[regKey].count += 1;
    }

    // Airports
    if (f.fromIata || f.from) {
      const aptKey = (f.fromIata || f.from).toUpperCase().trim();
      if (!airportCounts[aptKey]) airportCounts[aptKey] = { count: 0, name: f.from };
      airportCounts[aptKey].count += 1;
    }
    if (f.toIata || f.to) {
      const aptKey = (f.toIata || f.to).toUpperCase().trim();
      if (!airportCounts[aptKey]) airportCounts[aptKey] = { count: 0, name: f.to };
      airportCounts[aptKey].count += 1;
    }

    // Models
    if (f.aircraft && f.aircraft.trim()) {
      const mdlKey = f.aircraft.trim();
      if (!modelCounts[mdlKey]) modelCounts[mdlKey] = { count: 0, model: mdlKey };
      modelCounts[mdlKey].count += 1;
    }
  });

  // Inject user specific registrations
  Object.entries(regCounts).forEach(([reg, data]) => {
    const cardId = `card_user_reg_${reg.replace(/[^A-Z0-9]/g, '')}`;
    const existing = cardsMap.get(cardId);
    if (existing) {
      existing.quantity += data.count;
      existing.isUnlocked = true;
      existing.isPasted = true;
    } else {
      cardsMap.set(cardId, {
        id: cardId,
        category: 'SPECIFIC_AIRCRAFT',
        title: `${data.flight.aircraft || 'Aeronave'} • ${reg}`,
        subtitle: `${data.flight.airline || 'Linha Aérea'} (Seu Voo)`,
        registration: reg,
        aircraftModel: data.flight.aircraft,
        airline: data.flight.airline,
        imageUrl: `https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800`,
        description: `Aeronave registrada em voo real no seu diário de bordo (${data.flight.from} ➔ ${data.flight.to}).`,
        quantity: data.count,
        isUnlocked: true,
        isPasted: true,
        baseRarity: data.count >= 3 ? 'rare' : 'common',
        stats: [
          { label: 'Prefixo', value: reg },
          { label: 'Modelo', value: data.flight.aircraft || 'Comercial' },
          { label: 'Companhia', value: data.flight.airline || 'Comercial' },
          { label: 'Seus Voos', value: `${data.count}x Registrado` },
          { label: 'Assento Recente', value: data.flight.seatNumber || 'Não especificado' },
        ],
      });
    }
  });

  return Array.from(cardsMap.values());
}
