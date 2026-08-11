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
  Globe2
} from 'lucide-react';
import { Sticker, BlisterPack } from '../types';

interface VirtualAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  flightsCount: number;
}

// Initial Mock Sticker Catalog
const INITIAL_STICKERS: (Sticker & { isUnlocked: boolean; isPasted: boolean; quantity: number })[] = [
  {
    id: 'stk_01',
    title: 'Embraer E195-E2 "Arara Azul"',
    category: 'aircraft_models',
    rarity: 'rare',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400',
    description: 'Orgulho da aviação comercial brasileira com motores Pratt & Whitney GTF.',
    isUnlocked: true,
    isPasted: true,
    quantity: 1
  },
  {
    id: 'stk_02',
    title: 'Boeing 787-9 Dreamliner',
    category: 'aircraft_models',
    rarity: 'epic',
    imageUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4edd16be1?auto=format&fit=crop&q=80&w=400',
    description: 'Aeronave widebody em fibra de carbono com janelas eletrocrômicas.',
    isUnlocked: true,
    isPasted: true,
    quantity: 2
  },
  {
    id: 'stk_03',
    title: 'Airbus A350-1000 XWB',
    category: 'aircraft_models',
    rarity: 'legendary',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400',
    description: 'O jato de ultra longo alcance mais moderno da frota global.',
    isUnlocked: false,
    isPasted: false,
    quantity: 0
  },
  {
    id: 'stk_04',
    title: 'Aeroporto Santos Dumont (SDU)',
    category: 'iconic_airports',
    rarity: 'rare',
    imageUrl: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&q=80&w=400',
    description: 'Aproximação espetacular com vista para o Pão de Açúcar e Baía de Guanabara.',
    isUnlocked: true,
    isPasted: true,
    quantity: 1
  },
  {
    id: 'stk_05',
    title: 'Aeroporto Int. de Viracopos (VCP)',
    category: 'iconic_airports',
    rarity: 'common',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400',
    description: 'Hub estratégico de passageiros e maior centro logístico de carga aérea do país.',
    isUnlocked: true,
    isPasted: true,
    quantity: 1
  },
  {
    id: 'stk_06',
    title: 'Pintura Especial "Outubro Rosa" Azul',
    category: 'special_liveries',
    rarity: 'epic',
    imageUrl: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=400',
    description: 'Livery rosa temática de conscientização e apoio à saúde feminina.',
    isUnlocked: false,
    isPasted: false,
    quantity: 0
  },
  {
    id: 'stk_07',
    title: 'Concorde Supersonico G-BOAC',
    category: 'special_liveries',
    rarity: 'legendary',
    imageUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=400',
    description: 'Lenda da aviação comercial que voava a Mach 2.04 na estratosfera.',
    isUnlocked: false,
    isPasted: false,
    quantity: 0
  },
  {
    id: 'stk_08',
    title: 'Airbus A320neo LATAM',
    category: 'airlines',
    rarity: 'common',
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=400',
    description: 'Espinha dorsal dos voos domésticos e regionais na América Latina.',
    isUnlocked: true,
    isPasted: true,
    quantity: 3
  }
];

export const VirtualAlbumModal: React.FC<VirtualAlbumModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  flightsCount,
}) => {
  const [stickers, setStickers] = useState(INITIAL_STICKERS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [unopenedPacks, setUnopenedPacks] = useState<number>(Math.max(1, Math.floor(flightsCount / 2)));
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [revealedStickers, setRevealedStickers] = useState<Sticker[]>([]);

  if (!isOpen) return null;

  const totalCollected = stickers.filter((s) => s.isUnlocked).length;
  const totalCatalog = stickers.length;
  const completionPercentage = Math.round((totalCollected / totalCatalog) * 100);

  const categories = [
    { id: 'all', label: 'Todas as Figurinhas', icon: BookOpen },
    { id: 'aircraft_models', label: 'Modelos de Aeronaves', icon: Plane },
    { id: 'iconic_airports', label: 'Aeroportos Icônicos', icon: Building2 },
    { id: 'special_liveries', label: 'Pinturas Especiais', icon: Palette },
    { id: 'airlines', label: 'Companhias Aéreas', icon: Globe2 },
  ];

  const filteredStickers = activeCategory === 'all'
    ? stickers
    : stickers.filter((s) => s.category === activeCategory);

  const handleOpenPack = () => {
    if (unopenedPacks <= 0) return;
    setIsOpeningPack(true);

    // Pick 2 random stickers to reveal/unlock
    setTimeout(() => {
      const lockedStickers = stickers.filter((s) => !s.isUnlocked);
      const pool = lockedStickers.length > 0 ? lockedStickers : stickers;
      
      const idx1 = Math.floor(Math.random() * pool.length);
      const idx2 = Math.floor(Math.random() * stickers.length);
      
      const newRevealed = [pool[idx1], stickers[idx2]];

      setStickers((prev) =>
        prev.map((s) => {
          if (s.id === newRevealed[0].id || s.id === newRevealed[1].id) {
            return {
              ...s,
              isUnlocked: true,
              isPasted: true,
              quantity: s.quantity + 1,
            };
          }
          return s;
        })
      );

      setRevealedStickers(newRevealed);
      setUnopenedPacks((prev) => Math.max(0, prev - 1));
      setIsOpeningPack(false);
    }, 1500);
  };

  const getRarityBadge = (rarity: Sticker['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return { label: 'Lendária', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/20' };
      case 'epic':
        return { label: 'Épica', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-purple-500/20' };
      case 'rare':
        return { label: 'Rara', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-blue-500/20' };
      default:
        return { label: 'Comum', color: 'bg-slate-500/20 text-slate-400 border-slate-500/50' };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden my-auto ${
            isDarkMode ? 'bg-[#020617] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header Bar */}
          <div className="px-6 py-5 border-b border-slate-800/80 bg-gradient-to-r from-[#EC6726]/10 via-amber-500/5 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#EC6726] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-[#EC6726]/30">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                  Álbum Virtual de Figurinhas <Sparkles className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Coleção Oficial FlyDiary — Conquiste blisters a cada voo registrado
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

          {/* Album Overview Metrics & Blister Pack Opener Banner */}
          <div className="p-6 border-b border-slate-800/80 bg-slate-900/40 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Completion Progress Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Progresso do Álbum</span>
                <span className="font-bold text-[#EC6726]">{completionPercentage}%</span>
              </div>

              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-[#EC6726] to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-slate-400">Figurinhas Coladas:</span>
                <span className="font-mono font-bold text-white">
                  {totalCollected} / {totalCatalog}
                </span>
              </div>
            </div>

            {/* Blister Pack Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#EC6726]/20 via-amber-500/10 to-purple-500/10 border border-[#EC6726]/40 flex items-center justify-between gap-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EC6726] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#EC6726]/30 shrink-0 relative">
                  <Package className="w-6 h-6" />
                  {unopenedPacks > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold flex items-center justify-center border-2 border-slate-950">
                      {unopenedPacks}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    Pacotinhos Blister Prontos <span className="text-amber-400 font-mono text-xs">({unopenedPacks} disponíveis)</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Ganha 1 blister a cada voo registrado no diário de bordo
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={unopenedPacks <= 0 || isOpeningPack}
                onClick={handleOpenPack}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shrink-0 ${
                  unopenedPacks > 0
                    ? 'bg-gradient-to-r from-[#EC6726] to-amber-500 text-white shadow-[#EC6726]/30 hover:brightness-110'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {isOpeningPack ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-white" />
                    <span>Rasgando Blister...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Abrir Pacote</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Reveal Modal / Banner after opening pack */}
          {revealedStickers.length > 0 && (
            <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/30 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">
                  Novas Figurinhas Reveladas! Adicionadas ao seu álbum.
                </span>
              </div>
              <button
                onClick={() => setRevealedStickers([])}
                className="text-xs text-emerald-400 underline font-mono cursor-pointer"
              >
                Dispensar
              </button>
            </div>
          )}

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

          {/* Sticker Grid / Album Pages */}
          <div className="p-6 max-h-[55vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStickers.map((sticker) => {
              const rarityInfo = getRarityBadge(sticker.rarity);
              return (
                <div
                  key={sticker.id}
                  className={`relative rounded-2xl p-3 border transition-all duration-300 flex flex-col justify-between ${
                    sticker.isUnlocked
                      ? 'bg-slate-900/90 border-slate-700/80 shadow-lg hover:border-[#EC6726]/60'
                      : 'bg-slate-950/50 border-slate-800/60 opacity-60 grayscale'
                  }`}
                >
                  {/* Top Badge & Quantity */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${rarityInfo.color}`}
                    >
                      {rarityInfo.label}
                    </span>

                    {sticker.quantity > 1 && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        x{sticker.quantity}
                      </span>
                    )}
                  </div>

                  {/* Sticker Card Image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                    <img
                      src={sticker.imageUrl}
                      alt={sticker.title}
                      className="w-full h-full object-cover"
                    />
                    {!sticker.isUnlocked && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-slate-400">
                        <Lock className="w-6 h-6 mb-1 text-slate-500" />
                        <span className="text-[10px] font-mono uppercase">Bloqueada</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <h4 className="font-bold text-xs text-white line-clamp-1 mb-1">{sticker.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {sticker.description}
                    </p>
                  </div>

                  {/* Bottom Paste Status */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">COD: {sticker.id.toUpperCase()}</span>
                    {sticker.isPasted ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Colada
                      </span>
                    ) : (
                      <span className="text-slate-500">Pendente</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>💡 Registre mais voos para ganhar novos pacotinhos no seu diário.</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
            >
              Fechar Álbum
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
