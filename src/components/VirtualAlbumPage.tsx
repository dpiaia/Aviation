import React, { useState, useEffect } from 'react';
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
  Crown,
  Share2,
  Check,
  Flame,
  ArrowLeft,
  X,
  RotateCw,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { Flight } from '../types';
import {
  AlbumCard,
  CardCategory,
  CardRarityTier,
  BASE_CATALOG_CARDS,
  CARD_BACK_IMAGES,
  buildUserCardRoster,
  getDynamicRarity,
} from '../data/albumCards';
import { AviationCard } from './AviationCard';

interface VirtualAlbumPageProps {
  isDarkMode: boolean;
  flightsCount: number;
  flights?: Flight[];
  userEmail?: string;
  onBackToDashboard: () => void;
}

export const VirtualAlbumPage: React.FC<VirtualAlbumPageProps> = ({
  isDarkMode,
  flightsCount,
  flights = [],
  userEmail = 'default',
  onBackToDashboard,
}) => {
  const storageKey = `flydiary_album_cards_${userEmail || 'guest'}`;

  // Initialize cards combining user flights + base catalog + saved local quantities
  const [cards, setCards] = useState<AlbumCard[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading saved album cards:', e);
    }
    return buildUserCardRoster(flights, BASE_CATALOG_CARDS);
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeRarityFilter, setActiveRarityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unopenedPacks, setUnopenedPacks] = useState<number>(() => {
    try {
      const savedPacks = localStorage.getItem(`flydiary_packs_${userEmail || 'guest'}`);
      if (savedPacks !== null) return parseInt(savedPacks, 10);
    } catch (e) {}
    return Math.max(3, Math.floor(flightsCount / 2) + 2);
  });

  // Pack Opening Animation States
  const [openingStage, setOpeningStage] = useState<'idle' | 'holding_pack' | 'ripping' | 'revealing_cards'>('idle');
  const [currentPackCards, setCurrentPackCards] = useState<AlbumCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});

  // Card Inspection Dialog State
  const [inspectedCard, setInspectedCard] = useState<AlbumCard | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Sync cards when user flights change
  useEffect(() => {
    if (flights && flights.length > 0) {
      setCards((prevCards) => {
        const roster = buildUserCardRoster(flights, prevCards);
        return roster;
      });
    }
  }, [flights]);

  // Persist cards state
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cards));
      localStorage.setItem(`flydiary_packs_${userEmail || 'guest'}`, unopenedPacks.toString());
    } catch (e) {
      console.warn('Failed to persist album state:', e);
    }
  }, [cards, unopenedPacks, storageKey, userEmail]);

  const totalCollected = cards.filter((s) => s.isUnlocked).length;
  const totalCatalog = cards.length;
  const completionPercentage = totalCatalog > 0 ? Math.round((totalCollected / totalCatalog) * 100) : 0;

  // Filter Categories
  const categories = [
    { id: 'all', label: 'Todas as Cartas', icon: BookOpen, count: cards.length },
    {
      id: 'AIRCRAFT_MODEL',
      label: 'Modelos de Avião',
      icon: Plane,
      count: cards.filter((c) => c.category === 'AIRCRAFT_MODEL').length,
    },
    {
      id: 'SPECIFIC_AIRCRAFT',
      label: 'Aviões Específicos (Prefixo)',
      icon: Zap,
      count: cards.filter((c) => c.category === 'SPECIFIC_AIRCRAFT').length,
    },
    {
      id: 'AIRPORT',
      label: 'Aeroportos',
      icon: Building2,
      count: cards.filter((c) => c.category === 'AIRPORT').length,
    },
    {
      id: 'LEGENDARY_AIRCRAFT',
      label: 'Aviões Lendários',
      icon: Crown,
      count: cards.filter((c) => c.category === 'LEGENDARY_AIRCRAFT').length,
    },
  ];

  // Apply filters
  const filteredCards = cards.filter((card) => {
    if (activeCategory !== 'all' && card.category !== activeCategory) return false;

    if (activeRarityFilter !== 'all') {
      const dynamicRarity = getDynamicRarity(card.quantity, card.baseRarity).tier;
      if (dynamicRarity !== activeRarityFilter) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = card.title.toLowerCase().includes(q);
      const matchSub = card.subtitle.toLowerCase().includes(q);
      const matchReg = (card.registration || '').toLowerCase().includes(q);
      const matchApt = (card.airportCode || '').toLowerCase().includes(q);
      const matchModel = (card.aircraftModel || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSub && !matchReg && !matchApt && !matchModel) return false;
    }

    return true;
  });

  // Pack Opening Logic
  const startPackOpening = () => {
    if (unopenedPacks <= 0) return;

    // Pick 1 Model, 1 Specific Aircraft, 1 Airport, 1 Legendary/Bonus
    const modelPool = cards.filter((c) => c.category === 'AIRCRAFT_MODEL');
    const specificPool = cards.filter((c) => c.category === 'SPECIFIC_AIRCRAFT');
    const airportPool = cards.filter((c) => c.category === 'AIRPORT');
    const legendPool = cards.filter((c) => c.category === 'LEGENDARY_AIRCRAFT');

    const pickRandom = (pool: AlbumCard[], fallback: AlbumCard) => {
      if (!pool || pool.length === 0) return fallback;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const card1 = pickRandom(modelPool, cards[0]);
    const card2 = pickRandom(specificPool, cards[1] || cards[0]);
    const card3 = pickRandom(airportPool, cards[2] || cards[0]);
    const card4 = pickRandom(legendPool, cards[3] || cards[0]);

    // Randomize photo index for each card in the pack so we don't repeat the same photo
    const randomizeCardPhoto = (baseCard: AlbumCard, idx: number): AlbumCard => {
      let photoUrl = baseCard.imageUrl;
      let pIdx = 0;
      if (baseCard.allPhotoUrls && baseCard.allPhotoUrls.length > 0) {
        pIdx = Math.floor(Math.random() * baseCard.allPhotoUrls.length);
        photoUrl = baseCard.allPhotoUrls[pIdx];
      }
      return {
        ...baseCard,
        id: `pack_draw_${Date.now()}_${idx}`,
        imageUrl: photoUrl,
        currentPhotoIndex: pIdx,
      };
    };

    const generatedPack: AlbumCard[] = [
      randomizeCardPhoto(card1, 1),
      randomizeCardPhoto(card2, 2),
      randomizeCardPhoto(card3, 3),
      randomizeCardPhoto(card4, 4),
    ];

    setCurrentPackCards(generatedPack);
    setFlippedCardIds({});
    setOpeningStage('holding_pack');
  };

  const handleRipPack = () => {
    setOpeningStage('ripping');
    setTimeout(() => {
      setOpeningStage('revealing_cards');
    }, 1100);
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
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
            isUnlocked: true,
            isPasted: true,
            imageUrl: packCard.imageUrl,
            currentPhotoIndex: packCard.currentPhotoIndex,
          };
        } else {
          updated.push({
            ...packCard,
            id: `card_unlocked_${Date.now()}`,
            quantity: 1,
            isUnlocked: true,
            isPasted: true,
          });
        }
      });
      return updated;
    });

    setUnopenedPacks((prev) => Math.max(0, prev - 1));
    setOpeningStage('idle');
    setCurrentPackCards([]);
  };

  const handleShareCard = (card: AlbumCard) => {
    const rarity = getDynamicRarity(card.quantity, card.baseRarity);
    const shareText =
      `✈️ TCG FlyDiary — Carta Colecionável Oficial!\n\n` +
      `🃏 ${card.title} (${card.subtitle})\n` +
      `⭐ Raridade Atual: ${rarity.label} (Possuo x${card.quantity})\n` +
      `📁 Categoria: ${card.category}\n\n` +
      card.stats.map((s) => `• ${s.label}: ${s.value}`).join('\n') +
      `\n\nConfira meu álbum completo no FlyDiary Pro! 🌍`;

    if (navigator.share) {
      navigator
        .share({
          title: `Carta TCG FlyDiary — ${card.title}`,
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }
  };

  return (
    <div
      className={`min-h-screen pb-16 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header Bar */}
      <div
        className={`border-b sticky top-14 z-20 backdrop-blur-xl ${
          isDarkMode ? 'border-slate-800 bg-[#020617]/90' : 'border-slate-200 bg-white/90'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EC6726] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-[#EC6726]/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                Álbum de Figurinhas TCG FlyDiary <Sparkles className="w-4 h-4 text-amber-400" />
              </h1>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Coleção de Cartas Oficiais • Fotos Reais • Raridade Dinâmica • Verso Artístico
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-xs">
              <span className="text-slate-400">Total Conquistado:</span>
              <span className="font-extrabold text-[#EC6726] ml-2 text-sm">
                {totalCollected}/{totalCatalog}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Banner Overview + Pack Opener Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Progress Card */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Progresso do Álbum
              </span>
              <span className="font-extrabold text-[#EC6726] text-sm">{completionPercentage}%</span>
            </div>

            <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700 my-2">
              <div
                className="bg-gradient-to-r from-[#EC6726] via-amber-400 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 text-slate-400 font-mono">
              <span>Coleção Registrada:</span>
              <span className="font-bold text-white">
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
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white font-mono text-xs font-black flex items-center justify-center border-2 border-slate-950 shadow-md">
                    {unopenedPacks}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  Pacotes de Viagem Disponíveis{' '}
                  <span className="text-amber-400 font-mono text-sm">({unopenedPacks})</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  Cada pacote contém 4 cartas reais: 1 Modelo de Avião, 1 Matrícula Específica, 1 Aeroporto e 1 Avião Lendário.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                disabled={unopenedPacks <= 0}
                onClick={startPackOpening}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shrink-0 ${
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
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#EC6726] text-white shadow-lg shadow-[#EC6726]/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Rarity Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por prefixo, modelo ou aeroporto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EC6726]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Rarity Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            <span className="text-[11px] font-mono text-slate-400 mr-1 hidden lg:inline">Raridade:</span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'common', label: 'Comum' },
              { id: 'rare', label: 'Rara (Prata)' },
              { id: 'epic', label: 'Épica (Ouro)' },
              { id: 'legendary', label: 'Lendária (Diamante)' },
              { id: 'mythic', label: 'Mítica (Titanium)' },
            ].map((rf) => (
              <button
                key={rf.id}
                onClick={() => setActiveRarityFilter(rf.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeRarityFilter === rf.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        {filteredCards.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
            <Plane className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
            <h3 className="text-base font-bold text-white">Nenhuma carta encontrada</h3>
            <p className="text-xs text-slate-400 mt-1">
              Tente ajustar os filtros de categoria, raridade ou busca acima.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <AviationCard
                key={card.id}
                card={card}
                onInspect={(c) => setInspectedCard(c)}
                showFlipButton={true}
                className="h-[420px]"
              />
            ))}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* CARD INSPECTION MODAL (FULL SCREEN 3D VIEW)                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {inspectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              className="relative w-full max-w-xl rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl overflow-hidden flex flex-col items-center"
            >
              <button
                onClick={() => setInspectedCard(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-3 z-10">
                <span className="text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  TCG FLYDIARY PRO • EXPANSÃO OFICIAL
                </span>
                <h3 className="text-xl font-black text-white mt-1">{inspectedCard.title}</h3>
                <span className="text-xs font-mono text-amber-400">{inspectedCard.subtitle}</span>
              </div>

              {/* Large Interactive 3D Card Inspector */}
              <div className="w-full max-w-sm h-[480px] my-2">
                <AviationCard
                  card={inspectedCard}
                  isInspected={true}
                  showFlipButton={true}
                  className="w-full h-full"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-3 w-full mt-4 z-10">
                <button
                  onClick={() => handleShareCard(inspectedCard)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#EC6726] to-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#EC6726]/30 hover:brightness-110 transition-all"
                >
                  {copiedShareLink ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copiado para Área de Transferência!</span>
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
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* GAMIFIED PACK OPENING OVERLAY STAGE                                       */}
      {/* ========================================================================= */}
      {openingStage !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-hidden">
          {/* Stage 1: Holding Sealed Blister Pack */}
          {openingStage === 'holding_pack' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center max-w-md text-center z-10"
            >
              <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-widest">
                <Flame className="w-4 h-4 text-amber-400" /> Pacote de Viagem Conquistado
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-1">
                Pronto para Rasgar o Blister?
              </h2>
              <p className="text-xs text-slate-300 font-mono mb-6">
                Contém 4 Cartas Oficiais do TCG FlyDiary com Fotos Reais
              </p>

              {/* 3D Sealed Blister Pack Graphic */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                className="relative w-64 h-92 rounded-3xl bg-gradient-to-tr from-[#EC6726] via-amber-500 to-purple-600 p-1.5 shadow-[0_0_60px_rgba(236,103,38,0.6)] border-2 border-amber-300/90 cursor-pointer mb-8"
                onClick={handleRipPack}
              >
                <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col items-center justify-between border border-amber-400/50 relative overflow-hidden">
                  <div className="text-center z-10">
                    <span className="text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-md">
                      LIMITED AVIATION TCG
                    </span>
                    <h3 className="font-extrabold text-xl text-white mt-2">FlyDiary Pack</h3>
                  </div>

                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#EC6726] to-amber-400 p-0.5 shadow-2xl flex items-center justify-center my-auto">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
                      <Plane className="w-12 h-12 -rotate-12" />
                    </div>
                  </div>

                  <div className="w-full text-center z-10">
                    <div className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/10 py-1.5 rounded-xl border border-amber-500/30">
                      4 CARTAS COM FOTOS REAIS
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRipPack}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#EC6726] via-amber-500 to-amber-400 text-white font-black text-sm tracking-wide shadow-2xl shadow-[#EC6726]/50 cursor-pointer flex items-center gap-2 hover:brightness-110"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>CLIQUE PARA RASGAR E ABRIR</span>
              </motion.button>
            </motion.div>
          )}

          {/* Stage 2: Ripping Animation */}
          {openingStage === 'ripping' && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 0.9, 1.3], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center z-10"
            >
              <div className="w-64 h-92 rounded-3xl bg-gradient-to-tr from-[#EC6726] to-amber-400 p-1.5 shadow-[0_0_90px_rgba(251,191,36,0.9)] border-4 border-white animate-ping">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-20 h-20 animate-spin" />
                </div>
              </div>
              <p className="text-amber-300 font-mono font-black text-lg mt-6 animate-pulse">
                RASGANDO PACOTE DE VIAGEM...
              </p>
            </motion.div>
          )}

          {/* Stage 3: Revealing Cards Face Down with Category Backs */}
          {openingStage === 'revealing_cards' && (
            <div className="flex flex-col items-center w-full max-w-6xl z-10">
              <div className="flex flex-wrap items-center justify-between w-full mb-6 gap-3">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    Sua Viagem Rendeu 4 Novas Cartas! <Sparkles className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Clique em cada carta para virar e ver a foto real, ou use o botão para revelar todas
                  </p>
                </div>

                <button
                  onClick={revealAllCards}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#EC6726] text-white text-xs font-extrabold cursor-pointer hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-amber-500/30"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>REVELAR TODAS</span>
                </button>
              </div>

              {/* 4 Cards Grid in Pack Reveal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
                {currentPackCards.map((card) => {
                  const isFlipped = flippedCardIds[card.id];
                  return (
                    <div
                      key={card.id}
                      className="cursor-pointer h-[420px]"
                      onClick={() => toggleFlipCard(card.id)}
                    >
                      <AviationCard
                        card={card}
                        initialFlipped={!isFlipped}
                        forceFront={isFlipped}
                        showFlipButton={false}
                        className="w-full h-full pointer-events-none"
                      />
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
