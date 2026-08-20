import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Compass,
  Building,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Plane,
  Layers,
  Search,
  Loader2,
  Navigation,
  Ticket,
  PlaneTakeoff,
  QrCode,
  Sparkles,
  Camera,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  User,
} from 'lucide-react';
import { AirportDetail, fetchAirportDetails } from '../utils/airportDb';
import { AviationPhoto, fetchAirportPhotos } from '../utils/aviationPhotos';

interface AirportDetailsModalProps {
  airportQuery: string | null; // e.g. "VCP", "SBKP", "Campinas / Viracopos (VCP/SBKP)"
  onClose: () => void;
}

export const AirportDetailsModal: React.FC<AirportDetailsModalProps> = ({
  airportQuery,
  onClose,
}) => {
  const [airport, setAirport] = useState<AirportDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState<string>('');
  const [airportPhotos, setAirportPhotos] = useState<AviationPhoto[]>([]);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean>(false);

  useEffect(() => {
    if (!airportQuery) return;
    let isMounted = true;
    setLoading(true);

    fetchAirportDetails(airportQuery).then((data) => {
      if (isMounted) {
        setAirport(data);
        setSearchVal(`${data.iata} / ${data.icao}`);
        setLoading(false);

        // Fetch airport photos from JetPhotos + Planespotters
        setLoadingPhotos(true);
        const controller = new AbortController();
        fetchAirportPhotos(data.iata || data.icao, data.name, controller.signal)
          .then((photos) => {
            if (isMounted && photos && photos.length > 0) {
              setAirportPhotos(photos);
              setCurrentPhotoIdx(0);
            }
          })
          .catch(() => {})
          .finally(() => {
            if (isMounted) setLoadingPhotos(false);
          });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [airportQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setLoading(true);
    fetchAirportDetails(searchVal).then((data) => {
      setAirport(data);
      setLoading(false);
      setLoadingPhotos(true);
      fetchAirportPhotos(data.iata || data.icao, data.name).then((photos) => {
        setAirportPhotos(photos || []);
        setCurrentPhotoIdx(0);
        setLoadingPhotos(false);
      });
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!airportQuery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Outer Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EC6726]/20 border border-[#EC6726]/30 flex items-center justify-center text-[#EC6726] shadow-sm">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
                Cartão de Embarque & Inf. do Aeroporto
              </h3>
              <p className="text-[11px] text-slate-400">
                Ficha técnica aeronáutica • AirportDB.io & ICAO
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Input */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Digite IATA, ICAO ou Cidade (ex: VCP, GRU, BSB, SBNF)..."
              className="w-full pl-9 pr-24 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#EC6726] font-mono transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 text-[11px] font-bold bg-[#EC6726] hover:bg-orange-500 text-white rounded-md transition-colors"
            >
              Consultar
            </button>
          </form>
        </div>

        {/* Main Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-9 h-9 text-[#EC6726] animate-spin" />
              <p className="text-xs text-slate-400 font-mono animate-pulse">
                Emitindo cartão de embarque & consultando AirportDB.io...
              </p>
            </div>
          ) : airport ? (
            /* BOARDING PASS TICKET CONTAINER */
            <div className="relative bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-1">
              {/* Decorative Ticket Side Circular Notches */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border border-slate-800 z-30" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border border-slate-800 z-30" />

              {/* TICKET HEADER BANNER */}
              <div className="bg-slate-950 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-800 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EC6726] text-white flex items-center justify-center shadow-md">
                    <PlaneTakeoff className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-black text-[#EC6726] uppercase tracking-widest block">
                      BOARDING PASS / CARTÃO DE EMBARQUE
                    </span>
                    <h2 className="text-lg font-black tracking-tight text-white font-mono">
                      AIRPORT INFORMATION CARD
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-extrabold bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-md">
                    CLASS: HUB
                  </span>
                  <span className="text-xs font-extrabold bg-[#EC6726]/20 text-[#EC6726] border border-[#EC6726]/30 px-2.5 py-1 rounded-md">
                    {airport.type}
                  </span>
                </div>
              </div>

              {/* TICKET MAIN SECTION: AIRPORT CODES & NAME */}
              <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
                {/* Subtle Radial Backlight */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Airport Identifiers */}
                  <div className="space-y-2 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{airport.flag}</span>
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                        {airport.city}, {airport.country}
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-black text-white leading-tight font-sans">
                      {airport.name}
                    </h1>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      Estado: <span className="text-slate-200 font-semibold">{airport.state}</span>
                    </p>
                  </div>

                  {/* Right: Big IATA / ICAO Codes Boarding Badge */}
                  <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
                    {/* IATA Code Box */}
                    <div className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl bg-blue-950/80 border border-blue-500/40 text-center min-w-[85px] shadow-lg">
                      <span className="text-[10px] uppercase text-blue-400 font-mono font-black tracking-widest">
                        IATA
                      </span>
                      <span className="text-2xl font-black text-white font-mono tracking-tight">
                        {airport.iata}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(airport.iata, 'IATA')}
                        className="mt-1 flex items-center gap-1 text-[10px] text-blue-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedCode === 'IATA' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedCode === 'IATA' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>

                    {/* ICAO Code Box */}
                    <div className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl bg-slate-900 border border-amber-500/40 text-center min-w-[85px] shadow-lg">
                      <span className="text-[10px] uppercase text-amber-400 font-mono font-black tracking-widest">
                        ICAO
                      </span>
                      <span className="text-2xl font-black text-amber-300 font-mono tracking-tight">
                        {airport.icao}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(airport.icao, 'ICAO')}
                        className="mt-1 flex items-center gap-1 text-[10px] text-amber-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedCode === 'ICAO' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedCode === 'ICAO' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PERFORATED DOTTED TICKET SEPARATOR */}
              <div className="relative bg-slate-100 py-1.5 border-y border-slate-300/80 flex items-center justify-between px-6">
                <div className="w-full border-t-2 border-dashed border-slate-300" />
              </div>

              {/* TICKET DETAILS GRID & SPECS */}
              <div className="p-5 sm:p-6 bg-slate-50 space-y-5">
                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Elevation */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 font-bold uppercase">
                      <Compass className="w-3.5 h-3.5 text-blue-600" />
                      Elevação (ALT)
                    </span>
                    <div className="mt-1">
                      <span className="text-base font-black text-slate-900 font-mono">
                        {airport.elevation_m} m
                      </span>
                      <span className="text-xs text-slate-500 ml-1 font-mono font-semibold">
                        ({airport.elevation_ft.toLocaleString()} ft)
                      </span>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 font-bold uppercase">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      Coordenadas
                    </span>
                    <div className="mt-1">
                      <span className="text-xs font-black text-slate-900 font-mono block truncate">
                        {airport.lat.toFixed(4)}°, {airport.lng.toFixed(4)}°
                      </span>
                    </div>
                  </div>

                  {/* Timezone */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 font-bold uppercase">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      Fuso Horário
                    </span>
                    <div className="mt-1">
                      <span className="text-xs font-black text-slate-900 font-mono truncate block">
                        {airport.timezone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Runways Section */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#EC6726]" />
                      Pistas de Pouso e Decolagem ({airport.runways.length} Pistas)
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      SURFACE & LENGTH
                    </span>
                  </div>

                  <div className="space-y-2">
                    {airport.runways.map((runway, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-amber-400 font-black text-xs">
                            {runway.name}
                          </span>
                          <span className="text-slate-700 font-bold">
                            {runway.surface}
                          </span>
                        </div>
                        <div className="text-slate-900 font-black">
                          {runway.length_m} m{' '}
                          <span className="text-slate-500 font-normal">
                            ({runway.length_ft.toLocaleString()} ft)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real Airport Photography Section (JetPhotos & Planespotters) */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-700">
                        Galeria Real do Aeroporto
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 text-[9.5px] font-mono font-bold">
                        JetPhotos & Planespotters
                      </span>
                    </div>

                    {airportPhotos.length > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentPhotoIdx(
                              (prev) => (prev - 1 + airportPhotos.length) % airportPhotos.length
                            )
                          }
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                          title="Foto anterior"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          {currentPhotoIdx + 1}/{airportPhotos.length}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentPhotoIdx((prev) => (prev + 1) % airportPhotos.length)
                          }
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                          title="Próxima foto"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {loadingPhotos ? (
                    <div className="h-44 bg-slate-900 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                      <span className="text-xs font-mono">Buscando fotos no JetPhotos...</span>
                    </div>
                  ) : airportPhotos.length > 0 ? (
                    <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md group">
                      <img
                        src={airportPhotos[currentPhotoIdx]?.url}
                        alt={`${airport.name} photo`}
                        referrerPolicy="no-referrer"
                        className="w-full h-52 sm:h-64 object-cover group-hover:scale-102 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src =
                            'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80';
                        }}
                      />

                      {/* Source Badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                        <div
                          className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold backdrop-blur-md flex items-center gap-1 shadow-md ${
                            airportPhotos[currentPhotoIdx]?.source === 'jetphotos'
                              ? 'bg-amber-950/85 text-amber-300 border-amber-400/60'
                              : airportPhotos[currentPhotoIdx]?.source === 'planespotters'
                              ? 'bg-cyan-950/85 text-cyan-300 border-cyan-400/60'
                              : 'bg-slate-950/85 text-slate-200 border-slate-700'
                          }`}
                        >
                          <Camera className="w-3 h-3" />
                          <span>{airportPhotos[currentPhotoIdx]?.sourceLabel}</span>
                        </div>
                      </div>

                      {/* Photographer Info & Links */}
                      <div className="absolute bottom-2 inset-x-2 flex items-center justify-between z-10">
                        <div className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>
                            Fotógrafo: <strong className="text-white">{airportPhotos[currentPhotoIdx]?.photographer}</strong>
                          </span>
                        </div>

                        {airportPhotos[currentPhotoIdx]?.link && (
                          <a
                            href={airportPhotos[currentPhotoIdx]?.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-slate-950/85 hover:bg-blue-600 hover:text-white backdrop-blur-md border border-slate-800 text-[10px] font-mono text-blue-400 flex items-center gap-1 transition-colors"
                          >
                            <span>Ver no site</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs font-mono text-slate-500 bg-slate-50 rounded-xl">
                      Nenhuma foto de spotter disponível no momento para este aeroporto.
                    </div>
                  )}
                </div>

                {/* Summary text if available */}
                {airport.summary && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-800 leading-relaxed font-sans">
                    <p className="font-medium">{airport.summary}</p>
                  </div>
                )}

                {/* Action External Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${airport.lat},${airport.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    Ver no Google Maps
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {airport.wikipedia && (
                    <a
                      href={airport.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-bold transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      Wikipédia
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  )}

                  {airport.website && (
                    <a
                      href={airport.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EC6726]/10 hover:bg-[#EC6726]/20 text-[#EC6726] border border-[#EC6726]/30 text-xs font-bold transition-colors"
                    >
                      Site Oficial
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* TICKET FOOTER WITH BARCODE */}
              <div className="bg-slate-950 p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 opacity-80">
                  <div className="w-0.5 h-7 bg-white" />
                  <div className="w-1.5 h-7 bg-white" />
                  <div className="w-0.5 h-7 bg-white" />
                  <div className="w-1 h-7 bg-white" />
                  <div className="w-2 h-7 bg-white" />
                  <div className="w-0.5 h-7 bg-white" />
                  <div className="w-1 h-7 bg-white" />
                  <div className="w-2.5 h-7 bg-white" />
                  <div className="w-0.5 h-7 bg-white" />
                  <div className="w-1.5 h-7 bg-white" />
                  <div className="w-0.5 h-7 bg-white" />
                </div>

                <div className="text-center sm:text-right font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                    PASSENGER BOARDING TICKET NO.
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    AIRPORTDB-{airport.iata}-{airport.icao}-2026
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs font-mono">
              Nenhum aeroporto encontrado para &quot;{airportQuery}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
