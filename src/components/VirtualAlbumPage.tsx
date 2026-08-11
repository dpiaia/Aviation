import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Award,
  Package,
  CheckCircle2,
  Lock,
  Zap,
  Plane,
  Building2,
  Palette,
  Globe2,
  Eye,
  Share2,
  Check,
  Flame,
  ArrowLeft,
  X,
  Copy,
  Layers,
  ChevronRight
} from 'lucide-react';

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

interface VirtualAlbumPageProps {
  isDarkMode: boolean;
  flightsCount: number;
  onBackToDashboard: () => void;
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
    description: 'Fuselagem em compostos de fibra de carbono e janelas eletrocrômicas autorreguláveis.',
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

export const VirtualAlbumPage: React.FC<VirtualAlbumPageProps> = ({
  isDarkMode,
  flightsCount,
  onBackToDashboard,
}) => {
  const [cards, setCards] = useState<ExtendedCard[]>(INITIAL_CARDS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [unopenedPacks, setUnopenedPacks] = useState<number>(Math.max(2, Math.floor(flightsCount / 2)));

  // Pack Opening Animation States
  const [openingStage, setOpeningStage] = useState<'idle' | 'holding_pack' | 'ripping' | 'revealing_cards'>('idle');
  const [currentPackCards, setCurrentPackCards] = useState<ExtendedCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});

  // Card Inspection Dialog State
  const [inspectedCard, setInspectedCard] = useState<ExtendedCard | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

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

  const startPackOpening = () => {
    if (unopenedPacks <= 0) return;

    const card1 = cards.find((c) => c.cardType === 'MODEL_AIRCRAFT') || cards[0];
    const card2 = cards.find((c) => c.cardType === 'SPECIFIC_AIRCRAFT') || cards[2];
    const card3 = cards.find((c) => c.cardType === 'AIRPORT') || cards[4];
    const card4 = cards.find((c) => c.cardType === 'SPECIAL_MANUFACTURER') || cards[6];

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

  const handleRipPack = () => {
    setOpeningStage('ripping');
    setTimeout(() => {
      setOpeningStage('revealing_cards');
    }, 1200);
  };

  const toggleFlipCard = (cardId: string) => {
    setFlippedCardIds((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const revealAllCards = () => {
    const allFlipped: Record<string, boolean> = {};
    currentPackCards.forEach((c) => {
      allFlipped[c.id] = true;
    });
    setFlippedCardIds(allFlipped);
  };

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
        }
      });
      return updated;
    });

    setUnopenedPacks((prev) => Math.max(0, prev - 1));
    setOpeningStage('idle');
    setCurrentPackCards([]);
  };

  const handleShareCard = (card: ExtendedCard) => {
    const shareText = `✈️ TCG FlyDiary — Carta Colecionável!\n\n🃏 ${card.title} (${card.subtitle})\n⭐ Raridade: ${card.rarity.toUpperCase()}\n\n` +
      card.stats.map((s) => `• ${s.label}: ${s.value}`).join('\n') +
      `\n\nConfira meu álbum completo no FlyDiary Pro! 🌍`;

    if (navigator.share) {
      navigator.share({
        title: `Carta TCG FlyDiary — ${card.title}`,
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }
  };

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

  const getRarityBadge = (rarity: ExtendedCard['rarity'], prestige?: ExtendedCard['prestigeLevel']) => {
    if (prestige === 'black_platinum') {
      return { label: 'TITANIUM BLACK', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-extrabold' };
    }
    if (prestige === 'diamond') {
      return { label: 'DIAMANTE PRISMA', color: 'bg-purple-500/20 text-purple-300 border-purple-400 font-extrabold' };
    }
    if (prestige === 'gold') {
      return { label: 'DOURADA GOLD', color: 'bg-amber-500/20 text-amber-300 border-amber-400 font-extrabold' };
    }

    switch (rarity) {
      case 'legendary': return { label: 'LENDÁRIA', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50' };
      case 'epic': return { label: 'ÉPICA', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' };
      case 'rare': return { label: 'RARA', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' };
      default: return { label: 'COMUM', color: 'bg-slate-500/20 text-slate-400 border-slate-500/50' };
    }
  };

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-300 ${
      isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Album Page Header Bar */}
      <div className={`border-b sticky top-14 z-20 backdrop-blur-xl ${
        isDarkMode ? 'border-slate-800 bg-[#020617]/90' : 'border-slate-200 bg-white/90'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EC6726] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-[#EC6726]/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                Álbum Virtual TCG FlyDiary <Sparkles className="w-4 h-4 text-amber-400" />
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Página Oficial da Sua Coleção — Clique nas figurinhas para expandir
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs hidden sm:block">
            <span className="text-slate-400">Total Conquistado:</span>
            <span className="font-bold text-[#EC6726] ml-2">{totalCollected}/{totalCatalog}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Banner Overview + Pack Opener */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Progress Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Progresso do Álbum</span>
              <span className="font-extrabold text-[#EC6726] text-sm">{completionPercentage}%</span>
            </div>

            <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700 my-2">
              <div
                className="bg-gradient-to-r from-[#EC6726] via-amber-400 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400">Coleção Registrada:</span>
              <span className="font-mono font-bold text-white">
                {totalCollected} de {totalCatalog} Cartas
              </span>
            </div>
          </div>

          {/* Pack Opener Action Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-[#EC6726]/20 via-amber-500/10 to-purple-500/10 border border-[#EC6726]/40 flex flex-col sm:flex-row items-center justify-between gap-4 md:col-span-2 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#EC6726] to-amber-500 flex items-center justify-center text-white shadow-xl shadow-[#EC6726]/40 shrink-0 relative">
                <Package className="w-7 h-7 animate-bounce" />
                {unopenedPacks > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white font-mono text-xs font-black flex items-center justify-center border-2 border-slate-950">
                    {unopenedPacks}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  Pacotes de Viagem Prontos <span className="text-amber-400 font-mono text-sm">({unopenedPacks} disponíveis)</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Cada novo voo cadastrado gera 1 pacote com 4 cartas oficiais (Modelo, Matrícula Exata, Aeroporto e Especial).
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={unopenedPacks <= 0}
              onClick={startPackOpening}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xl shrink-0 ${
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

        {/* Categories Bar */}
        <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#EC6726] text-white shadow-lg shadow-[#EC6726]/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCards.map((card) => {
            const borderClasses = getCardBorderClasses(card.borderStyle, card.prestigeLevel);
            const rarityBadge = getRarityBadge(card.rarity, card.prestigeLevel);

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -4 }}
                onClick={() => card.isUnlocked && setInspectedCard(card)}
                className={`relative rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer ${borderClasses} ${
                  !card.isUnlocked ? 'opacity-40 grayscale' : 'hover:shadow-2xl'
                }`}
              >
                {/* Rarity & Quantity */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${rarityBadge.color}`}>
                    {rarityBadge.label}
                  </span>

                  {card.quantity > 1 && (
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/40">
                      x{card.quantity}
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-3 border border-slate-700/60 shadow-inner">
                  <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                  {!card.isUnlocked && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-slate-400">
                      <Lock className="w-6 h-6 mb-1 text-slate-500" />
                      <span className="text-[10px] font-mono uppercase">Não Conquistada</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="mb-2">
                  <h4 className="font-black text-sm text-white line-clamp-1">{card.title}</h4>
                  <span className="text-[11px] text-amber-400/90 font-mono font-semibold block">
                    {card.subtitle}
                  </span>
                </div>

                {/* Stats */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 my-2">
                  {card.stats.slice(0, 3).map((st, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400 truncate max-w-[100px]">{st.label}:</span>
                      <span className="font-bold text-white truncate max-w-[110px]">{st.value}</span>
                    </div>
                  ))}
                </div>

                {/* Card Action Footer */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="truncate flex items-center gap-1 text-amber-300 font-semibold">
                    <Eye className="w-3.5 h-3.5 text-amber-400" /> Clique para Expandir
                  </span>
                  {card.isPasted ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> No Álbum
                    </span>
                  ) : (
                    <span>Pendente</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* ================= CARD INSPECTION DIALOG OVERLAY ================= */}
      <AnimatePresence>
        {inspectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl overflow-hidden flex flex-col items-center"
            >
              <button
                onClick={() => setInspectedCard(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4 z-10">
                <span className="text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  TCG FLYDIARY PRO
                </span>
                <h3 className="text-xl font-black text-white mt-1">{inspectedCard.title}</h3>
                <span className="text-xs font-mono text-amber-400">{inspectedCard.subtitle}</span>
              </div>

              <div className={`w-full rounded-2xl p-4 mb-5 ${getCardBorderClasses(inspectedCard.borderStyle, inspectedCard.prestigeLevel)}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono uppercase px-3 py-1 rounded-full border ${getRarityBadge(inspectedCard.rarity, inspectedCard.prestigeLevel).color}`}>
                    {getRarityBadge(inspectedCard.rarity, inspectedCard.prestigeLevel).label}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Acumuladas: <strong className="text-white">x{inspectedCard.quantity}</strong>
                  </span>
                </div>

                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-700 shadow-xl">
                  <img src={inspectedCard.imageUrl} alt={inspectedCard.title} className="w-full h-full object-cover" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {inspectedCard.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-1 border-b border-slate-800 pb-1">
                    Ficha Técnica Super Trunfo
                  </div>
                  {inspectedCard.stats.map((st, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{st.label}:</span>
                      <span className="font-bold text-white">{st.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full z-10">
                <button
                  onClick={() => handleShareCard(inspectedCard)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#EC6726] to-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#EC6726]/30 hover:brightness-110 transition-all"
                >
                  {copiedShareLink ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Compartilhar Carta</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setInspectedCard(null)}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer transition-colors"
                >
                  Fechar Dialog
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= GAMIFIED PACK OPENING OVERLAY STAGE ================= */}
      {openingStage !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-hidden">
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

              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                className="relative w-64 h-88 rounded-3xl bg-gradient-to-tr from-[#EC6726] via-amber-500 to-purple-600 p-1 shadow-[0_0_50px_rgba(236,103,38,0.5)] border-2 border-amber-300/80 cursor-pointer mb-8"
                onClick={handleRipPack}
              >
                <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col items-center justify-between border border-amber-400/40 relative overflow-hidden">
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

                <button
                  onClick={revealAllCards}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#EC6726] text-white text-xs font-extrabold cursor-pointer hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-amber-500/30"
                >
                  <Eye className="w-4 h-4" />
                  <span>REVELAR TODAS</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
                {currentPackCards.map((card, idx) => {
                  const isFlipped = flippedCardIds[card.id];
                  const borderClasses = getCardBorderClasses(card.borderStyle, card.prestigeLevel);
                  const rarityBadge = getRarityBadge(card.rarity, card.prestigeLevel);

                  return (
                    <div
                      key={card.id}
                      className="perspective-1000 h-108 cursor-pointer"
                      onClick={() => toggleFlipCard(card.id)}
                    >
                      <motion.div
                        animate={{ rotateY: isFlipped ? 0 : 180 }}
                        transition={{ duration: 0.6 }}
                        className="relative w-full h-full rounded-2xl shadow-2xl transition-all preserve-3d"
                      >
                        <div className={`absolute inset-0 rounded-2xl p-4 flex flex-col justify-between backface-hidden ${borderClasses}`}>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${rarityBadge.color}`}>
                                {rarityBadge.label}
                              </span>
                              <span className="text-[9px] font-mono text-slate-300 uppercase">
                                #{idx + 1} / 4
                              </span>
                            </div>

                            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 mb-3 shadow-lg">
                              <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                            </div>

                            <h4 className="font-black text-sm text-white line-clamp-1">{card.title}</h4>
                            <span className="text-[10px] text-amber-400 font-mono block mb-2 font-bold">
                              {card.subtitle}
                            </span>

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
                            <span>NOVA CARTA!</span>
                          </div>
                        </div>

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
                    </div>
                  );
                })}
              </div>

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
  );
};
