import React, { useState, useEffect } from 'react';
import { Camera, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import {
  AviationPhoto,
  fetchDualSourcePhotos,
  getCuratedFallbackPhoto,
} from '../utils/aviationPhotos';

interface PlanespottersPhotoProps {
  registration: string;
  aircraftModel?: string;
  airline?: string;
  className?: string;
  badgeLabel?: string;
  badgeColor?: 'blue' | 'amber' | 'emerald' | 'cyan' | 'rose';
  photoIndex?: number;
  allowCycle?: boolean;
}

export const PlanespottersPhoto: React.FC<PlanespottersPhotoProps> = ({
  registration,
  aircraftModel = '',
  airline = '',
  className = 'h-36 w-full',
  badgeLabel = 'Foto Real',
  badgeColor = 'blue',
  photoIndex = 0,
  allowCycle = true,
}) => {
  const [photos, setPhotos] = useState<AviationPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(photoIndex);
  const [loading, setLoading] = useState<boolean>(true);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'planespotters' | 'jetphotos'>('all');

  useEffect(() => {
    let isMounted = true;
    const cleanReg = (registration || '').toUpperCase().trim();

    if (!cleanReg || cleanReg === 'SEM-PREFIXO') {
      const fallback = [getCuratedFallbackPhoto(aircraftModel, airline, photoIndex)];
      setPhotos(fallback);
      setCurrentIndex(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    fetchDualSourcePhotos(cleanReg, aircraftModel, airline, sourceFilter, controller.signal)
      .then((fetched) => {
        clearTimeout(timeoutId);
        if (isMounted) {
          if (fetched && fetched.length > 0) {
            setPhotos(fetched);
            const validIndex = Math.abs(photoIndex) % fetched.length;
            setCurrentIndex(validIndex);
          } else {
            setPhotos([getCuratedFallbackPhoto(aircraftModel, airline, photoIndex)]);
            setCurrentIndex(0);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        if (isMounted) {
          setPhotos([getCuratedFallbackPhoto(aircraftModel, airline, photoIndex)]);
          setCurrentIndex(0);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [registration, aircraftModel, airline, sourceFilter, photoIndex]);

  const activePhoto = photos[currentIndex] || getCuratedFallbackPhoto(aircraftModel, airline, 0);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Source-specific badge styling
  const getSourceBadge = () => {
    if (activePhoto.source === 'jetphotos') {
      return {
        text: `JetPhotos (${registration || 'Spotter'})`,
        classes: 'border-amber-400/60 text-amber-300 bg-slate-950/85 shadow-amber-500/20',
        dot: 'bg-amber-400',
      };
    }
    if (activePhoto.source === 'planespotters') {
      return {
        text: `Planespotters (${registration || 'Spotter'})`,
        classes: 'border-cyan-400/60 text-cyan-300 bg-slate-950/85 shadow-cyan-500/20',
        dot: 'bg-cyan-400',
      };
    }
    return {
      text: badgeLabel || 'Acervo FlyDiary',
      classes: 'border-slate-600 text-slate-300 bg-slate-950/85',
      dot: 'bg-slate-400',
    };
  };

  const badgeInfo = getSourceBadge();

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-800 shadow-md group select-none ${className}`}>
      {loading ? (
        <div className="w-full h-full bg-slate-950/90 animate-pulse flex flex-col items-center justify-center gap-2">
          <Camera className="w-5 h-5 text-amber-400 animate-bounce" />
          <span className="text-[10px] font-mono text-slate-400">Buscando JetPhotos & Planespotters...</span>
        </div>
      ) : (
        <>
          <img
            src={activePhoto.url}
            alt={`Aeronave ${registration || aircraftModel}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = getCuratedFallbackPhoto(aircraftModel, airline, 0).url;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Top Source Badge with Dual-Source Indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
            <div
              className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold backdrop-blur-md flex items-center gap-1.5 shadow-md ${badgeInfo.classes}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badgeInfo.dot} animate-pulse`} />
              <Camera className="w-3 h-3" />
              <span>{badgeInfo.text}</span>
            </div>
          </div>

          {/* Multi-photo Navigation Arrows & Count */}
          {allowCycle && photos.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto">
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="w-6 h-6 rounded-full bg-slate-950/80 border border-slate-700 text-white flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-lg cursor-pointer"
                title="Foto anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                className="w-6 h-6 rounded-full bg-slate-950/80 border border-slate-700 text-white flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-lg cursor-pointer"
                title="Próxima foto"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Bottom Info: Photographer Credit & Multi-Photo Pill */}
          <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-between z-10 pointer-events-none">
            {activePhoto.photographer ? (
              <div className="text-[9px] font-mono text-slate-300 bg-slate-950/75 border border-slate-800/80 px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-[65%]">
                Foto: {activePhoto.photographer}
              </div>
            ) : <div />}

            {photos.length > 1 && (
              <div className="text-[9px] font-mono font-bold text-amber-300 bg-slate-950/85 border border-amber-500/30 px-1.5 py-0.5 rounded backdrop-blur-sm">
                {currentIndex + 1}/{photos.length}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
