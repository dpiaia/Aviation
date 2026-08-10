import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface PlanespottersPhotoProps {
  registration: string;
  aircraftModel?: string;
  airline?: string;
  className?: string;
  badgeLabel?: string;
  badgeColor?: 'blue' | 'amber' | 'emerald' | 'cyan' | 'rose';
  photoIndex?: number;
}

// Fallback high-quality aviation imagery mapped by model/airline keywords with multi-photo variety pools
const FALLBACK_POOLS = {
  atr: [
    'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=800&q=80',
    'https://upload.wikimedia.org/wikipedia/commons/9/9e/ATR_72-600_%28Azul%29_Rafael_Luiz_%2830204149731%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/23/PR-TQI_ATR.72-212A_ATR_Azul_Linhas_A%C3%A9reas_Brasileiras_%2835940989063%29.jpg',
    'https://images.unsplash.com/photo-1583551538520-2175949a20a4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  ],
  embraerE2: [
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544016768-982d1554c0b7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=800&q=80',
  ],
  embraerE1: [
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?auto=format&fit=crop&w=800&q=80',
  ],
  airbus: [
    'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&w=800&q=80',
  ],
  boeing: [
    'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
  ],
};

function getFallbackImage(
  aircraftModel: string = '',
  airline: string = '',
  index: number = 0
): string {
  const modelLower = aircraftModel.toLowerCase();
  const airlineLower = airline.toLowerCase();

  let pool = FALLBACK_POOLS.default;

  if (
    modelLower.includes('atr') ||
    modelLower.includes('at76') ||
    modelLower.includes('at72')
  ) {
    pool = FALLBACK_POOLS.atr;
  } else if (
    modelLower.includes('e195-e2') ||
    modelLower.includes('e295') ||
    modelLower.includes('ps-ae')
  ) {
    pool = FALLBACK_POOLS.embraerE2;
  } else if (
    modelLower.includes('e195') ||
    modelLower.includes('erj') ||
    modelLower.includes('e190') ||
    modelLower.includes('embraer')
  ) {
    pool = FALLBACK_POOLS.embraerE1;
  } else if (
    modelLower.includes('a320') ||
    modelLower.includes('a321') ||
    modelLower.includes('a319') ||
    modelLower.includes('airbus')
  ) {
    pool = FALLBACK_POOLS.airbus;
  } else if (
    modelLower.includes('737') ||
    modelLower.includes('787') ||
    modelLower.includes('boeing')
  ) {
    pool = FALLBACK_POOLS.boeing;
  } else if (airlineLower.includes('azul')) {
    pool = FALLBACK_POOLS.embraerE2;
  }

  const safeIndex = Math.abs(index) % pool.length;
  return pool[safeIndex];
}

export const PlanespottersPhoto: React.FC<PlanespottersPhotoProps> = ({
  registration,
  aircraftModel = '',
  airline = '',
  className = 'h-36 w-full',
  badgeLabel = 'Foto Real',
  badgeColor = 'blue',
  photoIndex = 0,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photographer, setPhotographer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlanespotters, setIsPlanespotters] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const cleanReg = (registration || '').toUpperCase().trim();

    if (!cleanReg || cleanReg === 'SEM-PREFIXO') {
      setPhotoUrl(getFallbackImage(aircraftModel, airline, photoIndex));
      setLoading(false);
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

    fetch(`https://api.planespotters.net/pub/photos/reg/${cleanReg}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => {
        clearTimeout(timeoutId);
        if (isMounted) {
          if (data && data.photos && data.photos.length > 0) {
            const selectedIdx = Math.abs(photoIndex) % data.photos.length;
            const chosenPhoto = data.photos[selectedIdx] || data.photos[0];
            const src = chosenPhoto.thumbnail_large?.src || chosenPhoto.thumbnail?.src;

            if (src) {
              setPhotoUrl(src);
              setPhotographer(chosenPhoto.photographer || 'Planespotters.net');
              setIsPlanespotters(true);
            } else {
              setPhotoUrl(getFallbackImage(aircraftModel, airline, photoIndex));
              setIsPlanespotters(false);
            }
          } else {
            setPhotoUrl(getFallbackImage(aircraftModel, airline, photoIndex));
            setIsPlanespotters(false);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        if (isMounted) {
          setPhotoUrl(getFallbackImage(aircraftModel, airline, photoIndex));
          setIsPlanespotters(false);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [registration, aircraftModel, airline, photoIndex]);

  const colorBadgeClasses = {
    blue: 'border-blue-400/40 text-blue-300 bg-slate-950/80',
    amber: 'border-amber-400/40 text-amber-300 bg-slate-950/80',
    emerald: 'border-emerald-400/40 text-emerald-300 bg-slate-950/80',
    cyan: 'border-cyan-400/40 text-cyan-300 bg-slate-950/80',
    rose: 'border-rose-400/40 text-rose-300 bg-slate-950/80',
  }[badgeColor];

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-800 shadow-md group ${className}`}>
      {loading ? (
        <div className="w-full h-full bg-slate-950/80 animate-pulse flex items-center justify-center">
          <Camera className="w-5 h-5 text-slate-600 animate-bounce" />
        </div>
      ) : (
        <>
          <img
            src={photoUrl || getFallbackImage(aircraftModel, airline)}
            alt={`Aeronave ${registration}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getFallbackImage(aircraftModel, airline);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Badge */}
          <div
            className={`absolute top-2 right-2 px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold backdrop-blur-md flex items-center gap-1 shadow-sm ${colorBadgeClasses}`}
          >
            <Camera className="w-3 h-3" />
            <span>{isPlanespotters ? `Planespotters (${registration})` : badgeLabel}</span>
          </div>

          {/* Photographer Credit if available */}
          {photographer && isPlanespotters && (
            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400/80 bg-slate-950/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              Foto: {photographer}
            </div>
          )}
        </>
      )}
    </div>
  );
};
