import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  BookOpen,
  Award,
  Package,
  CheckCircle2,
  Lock,
  RotateCcw,
  Star,
  Zap,
  Plane,
  Building2,
  Palette,
  Globe2,
  Eye,
  Layers,
  ChevronRight,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { Sticker } from '../types';

interface ExtendedCard {
  id: string;
  cardType: 'MODEL_AIRCRAFT' | 'SPECIFIC_AIRCRAFT' | 'AIRPORT' | 'SPECIAL_MANUFACTURER';
  borderStyle: 'BRUSHED_ALUMINUM' | 'RIVETED_PLATE' | 'TAXIWAY_ASPHALT' | 'VINTAGE_BLUEPRINT';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  prestigeLevel?: 'base' | 'gold' | 'diamond' | 'black_platinum';
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  quantity: number;
  isUnlocked: boolean;
  isPasted: boolean;
  stats: { label: string; value: string; unit?: string }[];
}

interface VirtualAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  flightsCount: number;
}

// Full TCG Card Database
const INITIAL_CARDS: ExtendedCard[] = [
  // 1. MODEL_AIRCRAFT (BRUSHED_ALUMINUM)
  {
    id: 'card_mdl_e195e2',
    cardType: 'MODEL_AIRCRAFT',
    borderStyle: 'BRUSHED_ALUMINUM',
    rarity: 'rare',
    prestigeLevel: 'gold',
    title: 'Embraer E195-E2',
    subtitle: 'Modelo Comercial Genérico',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600',
    description: 'Aeronave comercial de passageiros de alcance médio e alta eficiência energética com motores GTF.',
    quantity: 5,
    isUnlocked: true,
    isPasted: true,
    stats: [
      { label: 'Lançamento', value: '2017' },
      { label: 'Capacidade', value: '146 pax' },
      { label: 'Empuxo', value: '23.000 lbf' },
      { label: 'Fabricante', value: 'Embraer (Brasil)' },
      { label: 'Alcance', value: '4.815 km' }
    ]
  },
  {
    id: 'card_mdl_b7879',
    cardType: 'MODEL_AIRCRAFT',
    borderStyle: 'BRUSHED_ALUMINUM',
    rarity: 'epic',
    prestigeLevel: 'base',
    title: 'Boeing 787-9 Dreamliner',
    subtitle: 'Widebody de Longo Alcance',
    imageUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4edd16be1?auto=format&fit=crop&q=80&w=600',
    description: 'Fusolagem em compostos de fibra de carbono e janelas eletrocrômicas autorreguláveis.',
    quantity: 2,
    isUnlocked: true,
    isPasted: true,
    stats: [
      { label: 'Lançamento', value: '2013' },
      { label: 'Capacidade', value: '290 pax' },
      { label: 'Empuxo', value: '71.000 lbf' },
      { label: 'Fabricante', value: 'Boeing (EUA)' },
      { label: 'Alcance', value: '14.140 km' }
    ]
  },

  // 2. SPECIFIC_AIRCRAFT (RIVETED_PLATE)
  {
    id: 'card_unit_psaed',
    cardType: 'SPECIFIC_AIRCRAFT',
    borderStyle: 'RIVETED_PLATE',
    rarity: 'rare',
    prestigeLevel: 'base',
    title: 'Embraer E2 PS-AED',
    subtitle: 'Matrícula Específica das Ilhas',
    imageUrl: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=600',
    description: 'Unidade física entregue com a clássica pintura temática Arara Azul.',
    quantity: 1,
    isUnlocked: true,
    isPasted: true,
    stats: [
      { label: 'Prefixo', value: 'PS-AED' },
      { label: 'Entrega', value: 'Out/2020' },
      { label: 'Operadora', value: 'Azul Linhas Aéreas' },
      { label: 'Motores', value: '2x PW1900G' },
      { label: 'Configuração', value: '136 As. Econômica' }
    ]
  },
  {
    id: 'card_unit_prgxa',
    cardType: 'SPECIFIC_AIRCRAFT',
    borderStyle: 'RIVETED_PLATE',
    rarity: 'common',
    prestigeLevel: 'base',
    title: 'Boeing 737-800 PR-GXA',
    subtitle: 'Unidade Frota Gol',
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=600',
    description: 'Aeronave veterana de rotas domésticas brasileiras com winglets Split Scimitar.',
    quantity: 1,
    isUnlocked: true,
    isPasted: true,
    stats: [
      { label: 'Prefixo', value: 'PR-GXA' },
      { label: 'Entrega', value: 'Mai/2012' },
      { label: 'Operadora', value: 'Gol Linhas Aéreas' },
      { label: 'Motores', value: '2x CFM56-7B' },
      { label: 'Configuração', value: '186 Assentos' }
    ]
  },

  // 3. AIRPORT (TAXIWAY_ASPHALT)
  {
    id: 'card_apt_vcp',
    cardType: 'AIRPORT',
    borderStyle: 'TAXIWAY_ASPHALT',
    rarity: 'common',
    prestigeLevel: 'base',
    title: 'Viracopos Campinas (VCP)',
    subtitle: 'Aeroporto de Origem / Destino',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600',
    description: 'Principal hub logístico e de conexões aéreas do interior de São Paulo.',
    quantity: 3,
    isUnlocked: true,
    isPasted: true,
    stats: [
      { label: 'IATA / ICAO', value: 'VCP / SBKP' },
      { label: 'Inauguração', value: '1960' },
      { label: 'Pista Principal', value: '3.240m Asfalto' },
      { label: 'Passageiros/Ano', value: '12.5 Milhões' },
      { label: 'Elevação', value: '661 metros' }
    ]
  },
  {
    id: 'card_apt_sdu',
    cardType: 'AIRPORT',
    borderStyle: 'TAXIWAY_ASPHALT',
    rarity: 'epic',
    prestigeLevel: 'base',
    title: 'Santos Dumont (SDU)',
    subtitle: 'Aeroporto Central Rio',
    imageUrl: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&q=80&w=600',
    description: 'Famoso pela aproximação visual espetacular contornando o Pão de Açúcar.',
    quantity: 1,
    isUnlocked: true,
    isPasted: true,
    stats: [
      { label: 'IATA / ICAO', value: 'SDU / SBRJ' },
      { label: 'Inauguração', value: '1936' },
      { label: 'Pista Principal', value: '1.323m Asfalto' },
      { label: 'Passageiros/Ano', value: '9.8 Milhões' },
      { label: 'Elevação', value: '3 metros' }
    ]
  },

  // 4. SPECIAL_MANUFACTURER (VINTAGE_BLUEPRINT)
  {
    id: 'card_her_concorde',
    cardType: 'SPECIAL_MANUFACTURER',
    borderStyle: 'VINTAGE_BLUEPRINT',
    rarity: 'legendary',
    prestigeLevel: 'diamond',
    title: 'Concorde Supersônico G-BOAC',
    subtitle: 'Especial Fabricante Histórica',
    imageUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=600',
    description: 'Aeronave comercial supersônica lendária da Aérospatiale / BAC capaz de cruzar o Atlântico a Mach 2.04.',
    quantity: 11,
    isUnlocked: true,
    isPasted: true,
    stats: [
      { label: '1º Voo Teste', value: '1969' },
      { label: 'Velocidade Máx.', value: 'Mach 2.04 (2.179 km/h)' },
      { label: 'Altitude Teto', value: '60.000 pés' },
      { label: 'Motores', value: '4x Rolls-Royce Olympus' },
      { label: 'Capacidade', value: '100 pax' }
    ]
  },
  {
    id: 'card_her_b707',
    cardType: 'SPECIAL_MANUFACTURER',
    borderStyle: 'VINTAGE_BLUEPRINT',
    rarity: 'legendary',
    prestigeLevel: 'black_platinum',
    title: 'Boeing 707-320B',
    subtitle: 'Especial Fabricante Histórica',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600',
    description: 'O quadrijato pioneiro que revolucionou a Era do Jato na aviação comercial global.',
    quantity: 24,
    isUnlocked: true,
    isPasted: true,
    stats: [
      { label: '1º Voo Teste', value: '1957' },
      { label: 'Motores', value: '4x Pratt & Whitney JT3D' },
      { label: 'Capacidade', value: '181 pax' },
      { label: 'Fabricante', value: 'Boeing Commercial' },
      { label: 'Status', value: 'Aposentado' }
    ]
  }
];

// Pool of extra cards for generating new 4-card packs
const EXTRA_PACK_POOL: Omit<ExtendedCard, 'isUnlocked' | 'isPasted' | 'quantity'>[] = [
  {
    id: 'card_mdl_a320neo',
    cardType: 'MODEL_AIRCRAFT',
    borderStyle: 'BRUSHED_ALUMINUM',
    rarity: 'common',
    title: 'Airbus A320neo',
    subtitle: 'Modelo Comercial Genérico',
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=600',
    description: 'Aeronave de corredor único mais vendida do mundo com motores LEAP-1A.',
    stats: [
      { label: 'Lançamento', value: '2014' },
      { label: 'Capacidade', value: '180 pax' },
      { label: 'Empuxo', value: '27.120 lbf' },
      { label: 'Fabricante', value: 'Airbus (Europa)' }
    ]
  },
  {
    id: 'card_unit_pryrb',
    cardType: 'SPECIFIC_AIRCRAFT',
    borderStyle: 'RIVETED_PLATE',
    rarity: 'rare',
    title: 'Airbus A320 PR-YRB',
    subtitle: 'Unidade Específica Rosa',
    imageUrl: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=600',
    description: 'Aeronave com pintura rosa temática especial em apoio ao Outubro Rosa.',
    stats: [
      { label: 'Prefixo', value: 'PR-YRB' },
      { label: 'Entrega', value: 'Out/2019' },
      { label: 'Operadora', value: 'Azul Linhas Aéreas' },
      { label: 'Configuração', value: '174 Assentos' }
    ]
  },
  {
    id: 'card_apt_jfk',
    cardType: 'AIRPORT',
    borderStyle: 'TAXIWAY_ASPHALT',
    rarity: 'epic',
    title: 'John F. Kennedy (JFK)',
    subtitle: 'Aeroporto Internacional Nova York',
    imageUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4edd16be1?auto=format&fit=crop&q=80&w=600',
    description: 'Portal de entrada internacional de Nova York com mais de 60 milhões de passageiros/ano.',
    stats: [
      { label: 'IATA / ICAO', value: 'JFK / KJFK' },
      { label: 'Inauguração', value: '1948' },
      { label: 'Pista Principal', value: '4.423m Asfalto' },
      { label: 'Passageiros/Ano', value: '62 Milhões' }
    ]
  },
  {
    id: 'card_her_a300',
    cardType: 'SPECIAL_MANUFACTURER',
    borderStyle: 'VINTAGE_BLUEPRINT',
    rarity: 'legendary',
    title: 'Airbus A300B4',
    subtitle: 'Especial Fabricante Histórica',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600',
    description: 'O primeiro widebody bimotor da história da aviação, fundando o consórcio Airbus.',
    stats: [
      { label: '1º Voo Teste', value: '1972' },
      { label: 'Motores', value: '2x GE CF6-50' },
      { label: 'Capacidade', value: '269 pax' },
      { label: 'Status', value: 'Aposentado' }
    ]
  }
];

export const VirtualAlbumModal: React.FC<VirtualAlbumModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  flightsCount,
}) => {
  const [cards, setCards] = useState<ExtendedCard[]>(INITIAL_CARDS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [unopenedPacks, setUnopenedPacks] = useState<number>(Math.max(2, Math.floor(flightsCount / 2)));
  
  // Pack Opening Animation States
  const [openingStage, setOpeningStage] = useState<'idle' | 'holding_pack' | 'ripping' | 'revealing_cards' | 'claimed'>('idle');
  const [currentPackCards, setCurrentPackCards] = useState<ExtendedCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const totalCollected = cards.filter((s) => s.isUnlocked).length;
  const totalCatalog = cards.length;
  const completionPercentage = Math.round((totalCollected / totalCatalog) * 100);

  const categories = [
    { id: 'all', label: 'Todas as Cartas', icon: BookOpen },
    { id: 'MODEL_AIRCRAFT', label: '1. Modelo de Avião', icon: Plane },
    { id: 'SPECIFIC_AIRCRAFT', label: '2. Aeronave Específica', icon: Zap },
    { id: 'AIRPORT', label: '3. Aeroporto', icon: Building2 },
    { id: 'SPECIAL_MANUFACTURER', label: '4. Especial Fabricante', icon: Palette },
  ];

  const filteredCards = activeCategory === 'all'
    ? cards
    : cards.filter((c) => c.cardType === activeCategory);

  // Trigger Pack Opening Flow
  const startPackOpening = () => {
    if (unopenedPacks <= 0) return;

    // Pick 4 cards for the pack (1 of each card type!)
    const card1 = cards.find((c) => c.cardType === 'MODEL_AIRCRAFT') || EXTRA_PACK_POOL[0];
    const card2 = cards.find((c) => c.cardType === 'SPECIFIC_AIRCRAFT') || EXTRA_PACK_POOL[1];
    const card3 = cards.find((c) => c.cardType === 'AIRPORT') || EXTRA_PACK_POOL[2];
    const card4 = cards.find((c) => c.cardType === 'SPECIAL_MANUFACTURER') || EXTRA_PACK_POOL[3];

    // Ensure unique pack instances
    const generatedPack: ExtendedCard[] = [
      { ...card1, id: `pack_card_${Date.now()}_1` },
      { ...card2, id: `pack_card_${Date.now()}_2` },
      { ...card3, id: `pack_card_${Date.now()}_3` },
      { ...card4, id: `pack_card_${Date.now()}_4` },
    ];

    setCurrentPackCards(generatedPack);
    setFlippedCardIds({});
    setOpeningStage('holding_pack');
  };

  // Rip Pack Animation Handler
  const handleRipPack = () => {
    setOpeningStage('ripping');
    setTimeout(() => {
      setOpeningStage('revealing_cards');
    }, 1200);
  };

  // Flip Individual Card
  const toggleFlipCard = (cardId: string) => {
    setFlippedCardIds((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  // Flip All Cards At Once
  const revealAllCards = () => {
    const allFlipped: Record<string, boolean> = {};
    currentPackCards.forEach((c) => {
      allFlipped[c.id] = true;
    });
    setFlippedCardIds(allFlipped);
  };

  // Claim Pack Cards into Main Collection
  const claimPackCards = () => {
    setCards((prev) => {
      const updated = [...prev];
      currentPackCards.forEach((packCard) => {
        const existingIdx = updated.findIndex((c) => c.title === packCard.title);
        if (existingIdx >= 0) {
          const newQty = updated[existingIdx].quantity + 1;
          let newPrestige = updated[existingIdx].prestigeLevel || 'base';
          if (newQty >= 21) newPrestige = 'black_platinum';
          else if (newQty >= 10) newPrestige = 'diamond';
          else if (newQty >= 5) newPrestige = 'gold';

          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
            isUnlocked: true,
            isPasted: true,
            prestigeLevel: newPrestige,
          };
        } else {
          updated.push({
            ...packCard,
            quantity: 1,
            isUnlocked: true,
            isPasted: true,
            prestigeLevel: 'base',
          });
        }
      });
      return updated;
    });

    setUnopenedPacks((prev) => Math.max(0, prev - 1));
    setOpeningStage('idle');
    setCurrentPackCards([]);
  };

  // Helper for Card Border Texture Styling
  const getCardBorderClasses = (borderStyle: ExtendedCard['borderStyle'], prestige?: ExtendedCard['prestigeLevel']) => {
    if (prestige === 'black_platinum') {
      return 'border-2 border-cyan-400/90 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/80 shadow-cyan-500/30 shadow-xl';
    }
    if (prestige === 'diamond') {
      return 'border-2 border-purple-400/90 bg-gradient-to-br from-purple-950/90 via-slate-900 to-indigo-950 shadow-purple-500/30 shadow-xl';
    }
    if (prestige === 'gold') {
      return 'border-2 border-amber-400/90 bg-gradient-to-br from-amber-950/90 via-amber-900/40 to-slate-950 shadow-amber-500/30 shadow-xl';
    }

    switch (borderStyle) {
      case 'BRUSHED_ALUMINUM':
        return 'border-2 border-slate-400/80 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-slate-500/20';
      case 'RIVETED_PLATE':
        return 'border-2 border-amber-500/70 bg-gradient-to-br from-[#1e1b18] via-slate-900 to-slate-950 shadow-amber-500/20';
      case 'TAXIWAY_ASPHALT':
        return 'border-2 border-yellow-500/80 bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-950 shadow-yellow-500/20';
      case 'VINTAGE_BLUEPRINT':
        return 'border-2 border-blue-400/80 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 shadow-blue-500/20';
      default:
        return 'border border-slate-700 bg-slate-900';
    }
  };

  const getBorderNameLabel = (style: ExtendedCard['borderStyle']) => {
    switch (style) {
      case 'BRUSHED_ALUMINUM': return 'Alumínio Escovado';
      case 'RIVETED_PLATE': return 'Plaqueta com Rebites';
      case 'TAXIWAY_ASPHALT': return 'Asfalto de Pista';
      case 'VINTAGE_BLUEPRINT': return 'Papel Blueprint';
    }
  };

  const getRarityBadge = (rarity: ExtendedCard['rarity'], prestige?: ExtendedCard['prestigeLevel']) => {
    if (prestige === 'black_platinum') {
      return { label: 'TITANIUM BLACK', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-cyan-500/40 font-extrabold' };
    }
    if (prestige === 'diamond') {
      return { label: 'DIAMANTE PRISMA', color: 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-purple-500/40 font-extrabold' };
    }
    if (prestige === 'gold') {
      return { label: 'DOURADA GOLD', color: 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-amber-500/40 font-extrabold' };
    }

    switch (rarity) {
      case 'legendary':
        return { label: 'LENDÁRIA', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/20' };
      case 'epic':
        return { label: 'ÉPICA', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-purple-500/20' };
      case 'rare':
        return { label: 'RARA', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-blue-500/20' };
      default:
        return { label: 'COMUM', color: 'bg-slate-500/20 text-slate-400 border-slate-500/50' };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden my-auto ${
            isDarkMode ? 'bg-[#020617] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Main Album Header */}
          <div className="px-6 py-4 border-b border-slate-800/80 bg-gradient-to-r from-[#EC6726]/10 via-amber-500/5 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EC6726] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-[#EC6726]/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                  Álbum TCG de Aviação <Sparkles className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Coleção de Cartas & Fichas Técnicas — Conquiste pacotes a cada viagem
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Album Stats & Blister Banner */}
          <div className="p-6 border-b border-slate-800/80 bg-slate-900/40 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Completion Progress */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Progresso do Colecionador</span>
                <span className="font-bold text-[#EC6726]">{completionPercentage}%</span>
              </div>

              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-[#EC6726] via-amber-400 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-slate-400">Cartas Desbloqueadas:</span>
                <span className="font-mono font-bold text-white">
                  {totalCollected} / {totalCatalog}
                </span>
              </div>
            </div>

            {/* Pack Opener Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#EC6726]/20 via-amber-500/10 to-purple-500/10 border border-[#EC6726]/40 flex items-center justify-between gap-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EC6726] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#EC6726]/30 shrink-0 relative">
                  <Package className="w-6 h-6 animate-bounce" />
                  {unopenedPacks > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold flex items-center justify-center border-2 border-slate-950">
                      {unopenedPacks}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    Pacote de Viagem (4 Cartas TCG){' '}
                    <span className="text-amber-400 font-mono text-xs">({unopenedPacks} prontos)</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Contém: 1x Modelo, 1x Aeronave Exata, 1x Aeroporto e 1x Especial Fabricante
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                disabled={unopenedPacks <= 0}
                onClick={startPackOpening}
                className={`px-5 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xl shrink-0 ${
                  unopenedPacks > 0
                    ? 'bg-gradient-to-r from-[#EC6726] via-amber-500 to-amber-400 text-white shadow-[#EC6726]/40 hover:brightness-110 animate-pulse'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-200 fill-amber-300" />
                <span>ABRIR PACOTE (4 CARTAS)</span>
              </motion.button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#EC6726] text-white shadow-md shadow-[#EC6726]/30'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Album Cards Display Grid */}
          <div className="p-6 max-h-[55vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCards.map((card) => {
              const borderClasses = getCardBorderClasses(card.borderStyle, card.prestigeLevel);
              const rarityBadge = getRarityBadge(card.rarity, card.prestigeLevel);

              return (
                <div
                  key={card.id}
                  className={`relative rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-300 ${borderClasses} ${
                    !card.isUnlocked ? 'opacity-40 grayscale' : 'hover:scale-[1.02] hover:shadow-2xl'
                  }`}
                >
                  {/* Card Header & Prestige */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${rarityBadge.color}`}
                    >
                      {rarityBadge.label}
                    </span>

                    {card.quantity > 1 && (
                      <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/40">
                        x{card.quantity}
                      </span>
                    )}
                  </div>

                  {/* Card Image Stage */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-2 border border-slate-700/60 shadow-inner">
                    <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                    {!card.isUnlocked && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-slate-400">
                        <Lock className="w-6 h-6 mb-1 text-slate-500" />
                        <span className="text-[10px] font-mono uppercase">Não Conquistada</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-2">
                    <h4 className="font-extrabold text-xs text-white line-clamp-1">{card.title}</h4>
                    <span className="text-[10px] text-amber-400/90 font-mono font-semibold block">
                      {card.subtitle}
                    </span>
                  </div>

                  {/* Super Trunfo Stats Box */}
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 my-2">
                    {card.stats.slice(0, 3).map((st, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400 truncate max-w-[100px]">{st.label}:</span>
                        <span className="font-bold text-white truncate max-w-[110px]">{st.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Texture/Border Type Identifier */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span className="truncate">Borda: {getBorderNameLabel(card.borderStyle)}</span>
                    {card.isPasted ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> No Álbum
                      </span>
                    ) : (
                      <span>Pendente</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>💡 Dica: 5 cartas iguais viram Gold 🏆 | 10 viram Diamante 💎 | 21+ Titanium ⚡</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
            >
              Fechar Álbum
            </button>
          </div>
        </motion.div>

        {/* ================= GAMIFIED PACK OPENING OVERLAY STAGE ================= */}
        {openingStage !== 'idle' && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background Particles & Rays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,103,38,0.25)_0%,transparent_70%)] pointer-events-none animate-pulse" />

            {/* STAGE 1: PACK READY TO RIP */}
            {openingStage === 'holding_pack' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center max-w-md text-center z-10"
              >
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-widest">
                  <Flame className="w-4 h-4 text-amber-400" /> Pacote de Viagem Conquistado
                </div>

                <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                  Pronto para Rasgar o Blister?
                </h2>
                <p className="text-xs text-slate-300 font-mono mb-8">
                  Contém 4 Cartas Oficiais do TCG FlyDiary
                </p>

                {/* 3D Foil Pack Visual */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                  className="relative w-64 h-88 rounded-3xl bg-gradient-to-tr from-[#EC6726] via-amber-500 to-purple-600 p-1 shadow-[0_0_50px_rgba(236,103,38,0.5)] border-2 border-amber-300/80 cursor-pointer mb-8"
                  onClick={handleRipPack}
                >
                  <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col items-center justify-between border border-amber-400/40 relative overflow-hidden">
                    {/* Metallic Shine Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

                    <div className="text-center z-10">
                      <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                        LIMITED AVIATION TCG
                      </span>
                      <h3 className="font-extrabold text-xl text-white mt-2">FlyDiary Pack</h3>
                    </div>

                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#EC6726] to-amber-400 p-0.5 shadow-xl flex items-center justify-center my-auto">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
                        <Plane className="w-12 h-12 -rotate-12" />
                      </div>
                    </div>

                    <div className="w-full text-center z-10">
                      <div className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/10 py-1.5 rounded-xl border border-amber-500/30">
                        4 CARTAS EXCLUSIVAS
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRipPack}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#EC6726] via-amber-500 to-amber-400 text-white font-black text-sm tracking-wide shadow-2xl shadow-[#EC6726]/50 cursor-pointer flex items-center gap-2"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>CLIQUE PARA RASGAR E ABRIR</span>
                </motion.button>
              </motion.div>
            )}

            {/* STAGE 2: RIPPING PACK ANIMATION */}
            {openingStage === 'ripping' && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 0.9, 1.3], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center z-10"
              >
                <div className="w-64 h-88 rounded-3xl bg-gradient-to-tr from-[#EC6726] to-amber-400 p-1 shadow-[0_0_80px_rgba(251,191,36,0.8)] border-4 border-white animate-ping">
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-20 h-20 animate-spin" />
                  </div>
                </div>
                <p className="text-amber-300 font-mono font-black text-lg mt-6 animate-pulse">
                  RASGANDO PACOTE DE VIAGEM...
                </p>
              </motion.div>
            )}

            {/* STAGE 3: REVEAL 4 CARDS STAGE */}
            {openingStage === 'revealing_cards' && (
              <div className="flex flex-col items-center w-full max-w-6xl z-10">
                <div className="flex items-center justify-between w-full mb-6">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      Sua Viagem Rendeu 4 Novas Cartas! <Sparkles className="w-5 h-5 text-amber-400" />
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Clique em cada carta para virar ou clique no botão de revelar todas
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={revealAllCards}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#EC6726] text-white text-xs font-extrabold cursor-pointer hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-amber-500/30"
                    >
                      <Eye className="w-4 h-4" />
                      <span>REVELAR TODAS</span>
                    </button>
                  </div>
                </div>

                {/* 4 Cards Hand / Stage Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
                  {currentPackCards.map((card, idx) => {
                    const isFlipped = flippedCardIds[card.id];
                    const borderClasses = getCardBorderClasses(card.borderStyle, card.prestigeLevel);
                    const rarityBadge = getRarityBadge(card.rarity, card.prestigeLevel);

                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 50, rotateY: 180 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15, duration: 0.5 }}
                        className="perspective-1000 h-108 cursor-pointer"
                        onClick={() => toggleFlipCard(card.id)}
                      >
                        <motion.div
                          animate={{ rotateY: isFlipped ? 0 : 180 }}
                          transition={{ duration: 0.6 }}
                          className="relative w-full h-full rounded-2xl shadow-2xl transition-all preserve-3d"
                        >
                          {/* FRONT OF CARD (When Flipped) */}
                          <div
                            className={`absolute inset-0 rounded-2xl p-4 flex flex-col justify-between backface-hidden ${borderClasses}`}
                          >
                            <div>
                              {/* Rarity & Type */}
                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${rarityBadge.color}`}
                                >
                                  {rarityBadge.label}
                                </span>
                                <span className="text-[9px] font-mono text-slate-300 uppercase">
                                  #{idx + 1} / 4
                                </span>
                              </div>

                              {/* Image */}
                              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 mb-3 shadow-lg">
                                <img
                                  src={card.imageUrl}
                                  alt={card.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <h4 className="font-black text-sm text-white line-clamp-1">{card.title}</h4>
                              <span className="text-[10px] text-amber-400 font-mono block mb-2 font-bold">
                                {card.subtitle}
                              </span>

                              {/* Super Trunfo Stats Box */}
                              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 my-2">
                                {card.stats.map((st, i) => (
                                  <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="text-slate-400 truncate">{st.label}:</span>
                                    <span className="font-bold text-amber-200">{st.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-400">
                              <span>Borda: {getBorderNameLabel(card.borderStyle)}</span>
                              <span className="text-emerald-400 font-bold">NOVA CARTA!</span>
                            </div>
                          </div>

                          {/* BACK OF CARD (Face-Down) */}
                          <div className="absolute inset-0 rounded-2xl p-4 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border-2 border-amber-500/60 shadow-2xl flex flex-col items-center justify-between backface-hidden rotate-y-180">
                            <div className="w-full text-center">
                              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                                FLYDIARY TCG
                              </span>
                            </div>

                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#EC6726] to-amber-400 p-0.5 shadow-xl flex items-center justify-center my-auto border border-amber-300">
                              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
                                <Plane className="w-10 h-10 -rotate-45" />
                              </div>
                            </div>

                            <div className="text-center">
                              <span className="text-[10px] font-mono text-slate-400">
                                Clique para Virar
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Claim Button */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={claimPackCards}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-white font-black text-sm tracking-wide shadow-2xl shadow-emerald-500/40 cursor-pointer flex items-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  <span>GUARDAR TODAS AS CARTAS NO ÁLBUM</span>
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
