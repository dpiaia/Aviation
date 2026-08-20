import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  RotateCw,
  Camera,
  Eye,
  CheckCircle2,
  Sparkles,
  Lock,
  RefreshCw,
  Plane,
  Building2,
  Zap,
  Crown,
} from 'lucide-react';
import {
  AlbumCard,
  CardCategory,
  CARD_BACK_IMAGES,
  getDynamicRarity,
  REAL_AVIATION_PHOTO_POOLS,
} from '../data/albumCards';
import { AviationCardBackSvg } from './AviationCardBackSvg';
import {
  AviationPhoto,
  fetchDualSourcePhotos,
  fetchAirportPhotos,
  getCuratedFallbackPhoto,
} from '../utils/aviationPhotos';

interface AviationCardProps {
  card: AlbumCard;
  isInspected?: boolean;
  onInspect?: (card: AlbumCard) => void;
  onPhotoChanged?: (newUrl: string, newIdx: number) => void;
  showFlipButton?: boolean;
  initialFlipped?: boolean;
  className?: string;
  forceFront?: boolean;
}

export const AviationCard: React.FC<AviationCardProps> = ({
  card,
  isInspected = false,
  onInspect,
  onPhotoChanged,
  showFlipButton = true,
  initialFlipped = false,
  className = '',
  forceFront = false,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(initialFlipped);
  const [currentPhoto, setCurrentPhoto] = useState<string>(card.imageUrl);
  const [photoIndex, setPhotoIndex] = useState<number>(card.currentPhotoIndex || 0);
  const [availablePhotos, setAvailablePhotos] = useState<AviationPhoto[]>([]);
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
  const [photoCredit, setPhotoCredit] = useState<string | null>(null);

  // Dynamic rarity calculation based on quantity
  const rarityInfo = getDynamicRarity(card.quantity, card.baseRarity);
  const cardBackMeta = CARD_BACK_IMAGES[card.category];

  // Dual-source real photo fetch (JetPhotos + Planespotters) for Aircraft & Airports
  useEffect(() => {
    let isMounted = true;
    const cleanReg = (card.registration || '').toUpperCase().trim();
    const cleanAptCode = (card.airportCode || '').toUpperCase().trim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    if (card.category === 'AIRPORT' && (cleanAptCode || card.title)) {
      setLoadingPhoto(true);
      fetchAirportPhotos(cleanAptCode || card.title, card.subtitle, controller.signal)
        .then((photos) => {
          clearTimeout(timeoutId);
          if (isMounted && photos && photos.length > 0) {
            setAvailablePhotos(photos);
            const safeIdx = Math.min(photoIndex, photos.length - 1);
            setCurrentPhoto(photos[safeIdx].url);
            setPhotoIndex(safeIdx);
            setPhotoCredit(photos[safeIdx].photographer);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingPhoto(false);
        });

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
        controller.abort();
      };
    }

    if (card.category === 'SPECIFIC_AIRCRAFT' && cleanReg && cleanReg !== 'SEM-PREFIXO') {
      setLoadingPhoto(true);

      fetchDualSourcePhotos(
        cleanReg,
        card.aircraftModel || card.subtitle,
        card.airline || '',
        'all',
        controller.signal
      )
        .then((photos) => {
          clearTimeout(timeoutId);
          if (isMounted && photos && photos.length > 0) {
            setAvailablePhotos(photos);
            const safeIdx = Math.min(photoIndex, photos.length - 1);
            setCurrentPhoto(photos[safeIdx].url);
            setPhotoIndex(safeIdx);
            setPhotoCredit(photos[safeIdx].photographer);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingPhoto(false);
        });

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
        controller.abort();
      };
    }
  }, [card.category, card.registration, card.airportCode, card.title, card.aircraftModel, card.subtitle, card.airline]);

  // Handler to cycle to next photo across JetPhotos and Planespotters
  const handleShufflePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (availablePhotos.length <= 1) return;

    const nextIdx = (photoIndex + 1) % availablePhotos.length;
    setPhotoIndex(nextIdx);
    const chosen = availablePhotos[nextIdx];
    setCurrentPhoto(chosen.url);
    setPhotoCredit(chosen.photographer);
    if (onPhotoChanged) onPhotoChanged(chosen.url, nextIdx);
  };

  const activePhotoMeta = availablePhotos[photoIndex];
  const photoSourceBadge = activePhotoMeta?.source === 'jetphotos'
    ? { label: 'JetPhotos', color: 'text-amber-300 border-amber-400/50 bg-amber-950/80' }
    : activePhotoMeta?.source === 'planespotters'
    ? { label: 'Planespotters', color: 'text-cyan-300 border-cyan-400/50 bg-cyan-950/80' }
    : { label: card.registration ? `Matrícula ${card.registration}` : card.airportCode ? `Aeroporto ${card.airportCode}` : 'Foto Real', color: 'text-slate-300 border-slate-700 bg-slate-950/80' };

  const getCategoryIcon = (cat: CardCategory) => {
    switch (cat) {
      case 'AIRPORT':
        return Building2;
      case 'SPECIFIC_AIRCRAFT':
        return Zap;
      case 'LEGENDARY_AIRCRAFT':
        return Crown;
      default:
        return Plane;
    }
  };

  const CategoryIcon = getCategoryIcon(card.category);

  return (
    <div
      className={`perspective-1000 relative select-none ${className}`}
      onClick={() => {
        if (!isInspected && card.isUnlocked && onInspect) {
          onInspect(card);
        }
      }}
    >
      <motion.div
        animate={{ rotateY: forceFront ? 0 : isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full h-full relative rounded-3xl preserve-3d"
      >
        {/* ========================================================================= */}
        {/* CARD FRONT FACE                                                           */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between backface-hidden shadow-2xl transition-all duration-300 ${
            rarityInfo.borderClass
          } ${rarityInfo.glowClass} ${
            !card.isUnlocked ? 'opacity-40 grayscale pointer-events-none' : ''
          }`}
        >
          {/* Card Top Banner: Category + Dynamic Rarity Level */}
          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded-md bg-slate-950/80 border border-slate-700/80 flex items-center justify-center text-amber-400 shrink-0">
                  <CategoryIcon className="w-3 h-3" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-tight text-slate-300 truncate uppercase">
                  {card.category === 'AIRPORT' && 'Aeroporto'}
                  {card.category === 'AIRCRAFT_MODEL' && 'Modelo'}
                  {card.category === 'SPECIFIC_AIRCRAFT' && 'Aeronave Real'}
                  {card.category === 'LEGENDARY_AIRCRAFT' && 'Lendário'}
                </span>
              </div>

              {/* Dynamic Rarity Badge */}
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`text-[8.5px] font-mono uppercase px-2 py-0.5 rounded-full border ${rarityInfo.badgeBg}`}
                >
                  {rarityInfo.label}
                </span>

                {card.quantity > 1 && (
                  <span className="text-[9.5px] font-mono font-black px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    x{card.quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Real Aircraft Photo Stage */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 mb-2.5 border border-slate-700/70 shadow-inner group">
              <img
                src={currentPhoto}
                alt={card.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Photo Source Tag with Provider Indicator */}
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
                <div className={`px-2 py-0.5 rounded-full backdrop-blur-md border text-[8.5px] font-mono font-bold flex items-center gap-1 shadow-sm ${photoSourceBadge.color}`}>
                  <Camera className="w-2.5 h-2.5" />
                  <span>{photoSourceBadge.label}</span>
                </div>
              </div>

              {/* Photographer attribution if available */}
              {photoCredit && (
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-xs border border-slate-800 text-[8px] font-mono text-slate-300 truncate max-w-[50%] pointer-events-none">
                  {photoCredit}
                </div>
              )}

              {/* Randomize / Cycle Photo Button */}
              {availablePhotos.length > 1 && card.isUnlocked && (
                <button
                  onClick={handleShufflePhoto}
                  title="Alternar entre fotos do JetPhotos e Planespotters"
                  className="absolute bottom-1.5 right-1.5 px-2 py-1 rounded-lg bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 text-amber-300 text-[8.5px] font-mono font-bold flex items-center gap-1 backdrop-blur-md shadow-md cursor-pointer hover:scale-105 transition-all z-10"
                >
                  <RefreshCw className="w-2.5 h-2.5 text-amber-400" />
                  <span>Foto {photoIndex + 1}/{availablePhotos.length}</span>
                </button>
              )}

              {!card.isUnlocked && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-slate-400">
                  <Lock className="w-7 h-7 mb-1 text-slate-500" />
                  <span className="text-[10px] font-mono uppercase font-bold">Não Conquistada</span>
                </div>
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="mb-2">
              <h4 className="font-black text-sm text-white line-clamp-1 leading-tight">
                {card.title}
              </h4>
              <span className="text-[11px] text-amber-400/90 font-mono font-semibold block truncate mt-0.5">
                {card.subtitle}
              </span>
            </div>

            {/* Super Trunfo Stats Box */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1 my-1">
              {card.stats.slice(0, isInspected ? 5 : 3).map((st, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[9.5px] sm:text-[10px] font-mono leading-tight"
                >
                  <span className="text-slate-400 truncate max-w-[95px] sm:max-w-[110px]">
                    {st.label}:
                  </span>
                  <span className="font-bold text-slate-100 truncate max-w-[110px] sm:max-w-[125px]">
                    {st.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Next Rarity Evolution Progress Bar */}
            {rarityInfo.nextTier && (
              <div className="mt-2 pt-1">
                <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 mb-1">
                  <span>Evolução p/ {rarityInfo.nextTier.name}:</span>
                  <span className="text-amber-400 font-bold">
                    {card.quantity}/{rarityInfo.nextTier.requiredQty}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-[#EC6726] h-full rounded-full transition-all duration-500"
                    style={{ width: `${rarityInfo.nextTier.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls: Flip & Status */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
            {showFlipButton ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-800/60 transition-colors"
              >
                <RotateCw className="w-3 h-3 text-amber-400" />
                <span>Virar Verso</span>
              </button>
            ) : (
              <span className="text-slate-500">FlyDiary TCG</span>
            )}

            {card.isPasted ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> No Álbum
              </span>
            ) : (
              <span className="text-slate-400">Desbloqueada</span>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD BACK FACE (Category Specific Vector Artwork Backs)                   */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl bg-[#0a0d14] backface-hidden rotate-y-180 shadow-2xl overflow-hidden flex flex-col justify-between"
        >
          {/* Custom Category Colored SVG Card Back */}
          <div className="absolute inset-0 w-full h-full">
            <AviationCardBackSvg
              category={card.category}
              className="w-full h-full object-cover"
              idSuffix={`card-${card.id}`}
            />
          </div>

          {/* Top Back Category Pill */}
          <div className="relative z-10 text-center pt-3 px-3">
            <span className="text-[9px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-slate-950/85 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-md inline-block">
              {card.category === 'AIRPORT' && 'Aeroporto • FlyDiary TCG'}
              {card.category === 'AIRCRAFT_MODEL' && 'Modelo • FlyDiary TCG'}
              {card.category === 'SPECIFIC_AIRCRAFT' && 'Aeronave Real • FlyDiary TCG'}
              {card.category === 'LEGENDARY_AIRCRAFT' && 'Lenda da Aviação • FlyDiary TCG'}
            </span>
          </div>

          {/* Center Card Title & Subtitle Badge */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/85 border border-amber-400/50 backdrop-blur-md shadow-xl text-center max-w-[85%]">
              <div className="text-white font-black text-xs font-mono drop-shadow-md truncate">
                {card.title}
              </div>
              <div className="text-[9.5px] text-amber-300 font-mono drop-shadow truncate mt-0.5">
                {card.subtitle}
              </div>
            </div>
          </div>

          {/* Bottom Card Back Controls */}
          <div className="relative z-10 flex items-center justify-between px-3 pb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-amber-400/60 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg cursor-pointer hover:scale-105 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Frente</span>
            </button>

            <span className="text-[9px] font-mono text-amber-200/90 bg-slate-950/85 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-700 font-bold">
              {rarityInfo.label.split('•')[0].trim()}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
