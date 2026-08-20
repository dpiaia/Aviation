import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plane,
  Sparkles,
  RefreshCw,
  Layers,
  User,
} from 'lucide-react';
import {
  AviationPhoto,
  fetchDualSourcePhotos,
  getCuratedFallbackPhoto,
} from '../utils/aviationPhotos';

interface AircraftPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: string;
  aircraftModel?: string;
  airline?: string;
}

export const AircraftPhotoModal: React.FC<AircraftPhotoModalProps> = ({
  isOpen,
  onClose,
  registration,
  aircraftModel = '',
  airline = '',
}) => {
  const [photos, setPhotos] = useState<AviationPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterSource, setFilterSource] = useState<'all' | 'jetphotos' | 'planespotters'>('all');

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const cleanReg = (registration || '').toUpperCase().trim();

    if (!cleanReg || cleanReg === 'SEM-PREFIXO') {
      setPhotos([getCuratedFallbackPhoto(aircraftModel, airline, 0)]);
      setCurrentIndex(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    fetchDualSourcePhotos(cleanReg, aircraftModel, airline, 'all', controller.signal)
      .then((fetched) => {
        if (isMounted) {
          if (fetched && fetched.length > 0) {
            setPhotos(fetched);
            setCurrentIndex(0);
          } else {
            setPhotos([getCuratedFallbackPhoto(aircraftModel, airline, 0)]);
            setCurrentIndex(0);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPhotos([getCuratedFallbackPhoto(aircraftModel, airline, 0)]);
          setCurrentIndex(0);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isOpen, registration, aircraftModel, airline]);

  if (!isOpen) return null;

  const filteredPhotos = photos.filter((p) => {
    if (filterSource === 'all') return true;
    return p.source === filterSource;
  });

  const activePhoto = filteredPhotos[currentIndex] || filteredPhotos[0] || getCuratedFallbackPhoto(aircraftModel, airline, 0);

  const jetPhotosCount = photos.filter((p) => p.source === 'jetphotos').length;
  const planespottersCount = photos.filter((p) => p.source === 'planespotters').length;

  const handleNext = () => {
    if (filteredPhotos.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    if (filteredPhotos.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-[#EC6726] text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">
                    {registration ? `Matrícula ${registration}` : 'Galeria da Aeronave'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold">
                    Dual Source API
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {aircraftModel || 'Aeronave'} {airline ? `• ${airline}` : ''}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Source Tabs Selector */}
          <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => {
                  setFilterSource('all');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  filterSource === 'all'
                    ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                Todas ({photos.length})
              </button>

              <button
                onClick={() => {
                  setFilterSource('jetphotos');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  filterSource === 'jetphotos'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-amber-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                JetPhotos ({jetPhotosCount})
              </button>

              <button
                onClick={() => {
                  setFilterSource('planespotters');
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  filterSource === 'planespotters'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-cyan-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Planespotters ({planespottersCount})
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Foto {filteredPhotos.length > 0 ? currentIndex + 1 : 0} de {filteredPhotos.length}
            </span>
          </div>

          {/* Main Photo Viewer */}
          <div className="relative flex-1 bg-black min-h-[320px] max-h-[500px] flex items-center justify-center overflow-hidden group">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
                <p className="text-xs font-mono">Consultando JetPhotos e Planespotters...</p>
              </div>
            ) : (
              <>
                <img
                  src={activePhoto.url}
                  alt={registration}
                  referrerPolicy="no-referrer"
                  className="max-h-[460px] w-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getCuratedFallbackPhoto(aircraftModel, airline, 0).url;
                  }}
                />

                {/* Left / Right Nav buttons */}
                {filteredPhotos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 z-10">
                  <div
                    className={`px-3 py-1 rounded-full border text-xs font-mono font-bold backdrop-blur-md flex items-center gap-1.5 shadow-lg ${
                      activePhoto.source === 'jetphotos'
                        ? 'bg-amber-950/90 text-amber-300 border-amber-400/60'
                        : activePhoto.source === 'planespotters'
                        ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400/60'
                        : 'bg-slate-950/90 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Fonte: {activePhoto.sourceLabel}</span>
                  </div>
                </div>

                {/* Bottom Photographer & Link Bar */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10">
                  <div className="px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Fotógrafo: <strong className="text-white">{activePhoto.photographer}</strong></span>
                  </div>

                  {activePhoto.link && (
                    <a
                      href={activePhoto.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-slate-950/85 hover:bg-blue-600 hover:text-white backdrop-blur-md border border-slate-800 text-xs font-mono text-blue-400 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Ver no {activePhoto.sourceLabel}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Selector Strip */}
          {filteredPhotos.length > 1 && (
            <div className="p-3 bg-slate-950/90 border-t border-slate-800 overflow-x-auto flex items-center gap-2">
              {filteredPhotos.map((photo, idx) => (
                <button
                  key={photo.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 inset-x-0 text-[8px] font-mono font-bold text-center py-0.5 ${
                      photo.source === 'jetphotos'
                        ? 'bg-amber-600/90 text-white'
                        : photo.source === 'planespotters'
                        ? 'bg-cyan-600/90 text-white'
                        : 'bg-slate-700/90 text-slate-200'
                    }`}
                  >
                    {photo.source === 'jetphotos' ? 'JP' : photo.source === 'planespotters' ? 'PS' : 'AC'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
