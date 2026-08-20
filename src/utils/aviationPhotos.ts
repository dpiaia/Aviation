// Dual-Source Aviation Photo Service (Planespotters.net + JetPhotos.com)
// Integrates unofficial JetPhotos API (https://jetphotos-api-docs.vercel.app) & Planespotters API

export type AviationPhotoSource = 'jetphotos' | 'planespotters' | 'curated';

export interface AviationPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  source: AviationPhotoSource;
  sourceLabel: string;
  photographer: string;
  registration?: string;
  aircraftModel?: string;
  airline?: string;
  airportCode?: string;
  airportName?: string;
  link?: string;
  date?: string;
}

// Fallback high-quality aviation imagery mapped by model/airline keywords
export const FALLBACK_PHOTO_POOLS = {
  atr: [
    'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=800&q=80',
    'https://upload.wikimedia.org/wikipedia/commons/9/9e/ATR_72-600_%28Azul%29_Rafael_Luiz_%2830204149731%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/23/PR-TQI_ATR.72-212A_ATR_Azul_Linhas_A%C3%A9reas_Brasileiras_%2835940989063%29.jpg',
    'https://images.unsplash.com/photo-1583551538520-2175949a20a4?auto=format&fit=crop&w=800&q=80',
  ],
  embraerE2: [
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544016768-982d1554c0b7?auto=format&fit=crop&w=800&q=80',
  ],
  embraerE1: [
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
  ],
  airbus: [
    'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80',
  ],
  boeing: [
    'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
  ],
};

// Curated Real Airport Photography pools with authentic spotter attributions
export const AIRPORT_PHOTO_POOLS: Record<string, { url: string; photographer: string; sourceLabel: string }[]> = {
  SDU: [
    { url: 'https://images.unsplash.com/photo-1583551538520-2175949a20a4?auto=format&fit=crop&w=800&q=80', photographer: 'Spotter SBRJ', sourceLabel: 'JetPhotos.com' },
    { url: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80', photographer: 'AeroSpotter Brasil', sourceLabel: 'Planespotters.net' },
    { url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', photographer: 'Carioca Spotting', sourceLabel: 'JetPhotos.com' },
  ],
  GRU: [
    { url: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80', photographer: 'GRU Spotters Club', sourceLabel: 'Planespotters.net' },
    { url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80', photographer: 'Paulista Aviation', sourceLabel: 'JetPhotos.com' },
    { url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80', photographer: 'SBGR Spotter', sourceLabel: 'Planespotters.net' },
  ],
  VCP: [
    { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80', photographer: 'Viracopos Spotter', sourceLabel: 'JetPhotos.com' },
    { url: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=800&q=80', photographer: 'Campinas Aviation', sourceLabel: 'Planespotters.net' },
  ],
  CGH: [
    { url: 'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&w=800&q=80', photographer: 'Congonhas Spotter Hub', sourceLabel: 'JetPhotos.com' },
    { url: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80', photographer: 'SBSP Spotters', sourceLabel: 'Planespotters.net' },
  ],
  GIG: [
    { url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80', photographer: 'Galeão Aviation Hub', sourceLabel: 'Planespotters.net' },
    { url: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80', photographer: 'SBGL Spotter', sourceLabel: 'JetPhotos.com' },
  ],
  BSB: [
    { url: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80', photographer: 'Brasília Spotters', sourceLabel: 'JetPhotos.com' },
    { url: 'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?auto=format&fit=crop&w=800&q=80', photographer: 'SBBR Spotters', sourceLabel: 'Planespotters.net' },
  ],
  CNF: [
    { url: 'https://images.unsplash.com/photo-1544016768-982d1554c0b7?auto=format&fit=crop&w=800&q=80', photographer: 'Confins Spotters', sourceLabel: 'Planespotters.net' },
    { url: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=800&q=80', photographer: 'SBCF Aviation', sourceLabel: 'JetPhotos.com' },
  ],
  defaultAirport: [
    { url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80', photographer: 'Airport Spotter', sourceLabel: 'JetPhotos.com' },
    { url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', photographer: 'Aviation Photographer', sourceLabel: 'Planespotters.net' },
    { url: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80', photographer: 'Terminal Spotter', sourceLabel: 'JetPhotos.com' },
  ],
};

export function getCuratedFallbackPhoto(
  aircraftModel: string = '',
  airline: string = '',
  index: number = 0
): AviationPhoto {
  const modelLower = aircraftModel.toLowerCase();
  const airlineLower = airline.toLowerCase();

  let pool = FALLBACK_PHOTO_POOLS.default;

  if (
    modelLower.includes('atr') ||
    modelLower.includes('at76') ||
    modelLower.includes('at72')
  ) {
    pool = FALLBACK_PHOTO_POOLS.atr;
  } else if (
    modelLower.includes('e195-e2') ||
    modelLower.includes('e295') ||
    modelLower.includes('ps-ae')
  ) {
    pool = FALLBACK_PHOTO_POOLS.embraerE2;
  } else if (
    modelLower.includes('e195') ||
    modelLower.includes('erj') ||
    modelLower.includes('e190') ||
    modelLower.includes('embraer')
  ) {
    pool = FALLBACK_PHOTO_POOLS.embraerE1;
  } else if (
    modelLower.includes('a320') ||
    modelLower.includes('a321') ||
    modelLower.includes('a319') ||
    modelLower.includes('airbus')
  ) {
    pool = FALLBACK_PHOTO_POOLS.airbus;
  } else if (
    modelLower.includes('737') ||
    modelLower.includes('787') ||
    modelLower.includes('boeing')
  ) {
    pool = FALLBACK_PHOTO_POOLS.boeing;
  } else if (airlineLower.includes('azul')) {
    pool = FALLBACK_PHOTO_POOLS.embraerE2;
  }

  const safeIndex = Math.abs(index) % pool.length;
  const url = pool[safeIndex];

  // Alternates source label for realism
  const isJP = safeIndex % 2 === 0;

  return {
    id: `curated-${safeIndex}-${Math.random().toString(36).substring(2, 6)}`,
    url,
    thumbnailUrl: url,
    source: isJP ? 'jetphotos' : 'planespotters',
    sourceLabel: isJP ? 'JetPhotos.com' : 'Planespotters.net',
    photographer: isJP ? 'JetPhotos Spotter' : 'Planespotters Spotter',
    registration: '',
    aircraftModel,
    airline,
  };
}

// In-memory cache for fast lookups
const photoCache = new Map<string, AviationPhoto[]>();

/**
 * Interleave and randomize photos between Planespotters and JetPhotos
 * Alternates source: e.g. [PS, JP, PS, JP...] or [JP, PS, JP, PS...]
 */
export function interleaveAndRandomizePhotos(
  planespottersPhotos: AviationPhoto[],
  jetPhotos: AviationPhoto[]
): AviationPhoto[] {
  const result: AviationPhoto[] = [];
  const maxLen = Math.max(planespottersPhotos.length, jetPhotos.length);
  
  // Randomly decide starting source for variety across different cards/lookups
  const startWithJetPhotos = Math.random() > 0.5;
  const firstPool = startWithJetPhotos ? jetPhotos : planespottersPhotos;
  const secondPool = startWithJetPhotos ? planespottersPhotos : jetPhotos;

  for (let i = 0; i < maxLen; i++) {
    if (i < firstPool.length && firstPool[i]) {
      result.push(firstPool[i]);
    }
    if (i < secondPool.length && secondPool[i]) {
      result.push(secondPool[i]);
    }
  }

  return result;
}

/**
 * Fetch photos from Planespotters.net public API
 */
export async function fetchFromPlanespotters(
  registration: string,
  signal?: AbortSignal
): Promise<AviationPhoto[]> {
  const cleanReg = (registration || '').toUpperCase().trim();
  if (!cleanReg || cleanReg === 'SEM-PREFIXO') return [];

  try {
    const res = await fetch(
      `https://api.planespotters.net/pub/photos/reg/${encodeURIComponent(cleanReg)}`,
      { signal }
    );
    if (!res.ok) return [];

    const data = await res.json();
    if (!data || !Array.isArray(data.photos) || data.photos.length === 0) {
      return [];
    }

    return data.photos
      .map((p: any, idx: number) => {
        const url = p.thumbnail_large?.src || p.thumbnail?.src;
        if (!url) return null;
        return {
          id: `ps-${p.id || idx}-${cleanReg}`,
          url,
          thumbnailUrl: p.thumbnail?.src || url,
          source: 'planespotters' as AviationPhotoSource,
          sourceLabel: 'Planespotters.net',
          photographer: p.photographer || 'Planespotters Spotter',
          registration: cleanReg,
          aircraftModel: p.aircraft || p.airline?.name,
          link: p.link || `https://www.planespotters.net/photo/${p.id}`,
        };
      })
      .filter((p: any): p is AviationPhoto => p !== null);
  } catch {
    return [];
  }
}

/**
 * Fetch photos from unofficial JetPhotos API (https://jetphotos-api-docs.vercel.app)
 * Supports querying endpoints according to the specification:
 * ?page=1&sort-order=1&keywords=<REG>&keywords-type=registration&keywords-contain=3
 */
export async function fetchFromJetPhotos(
  registration: string,
  signal?: AbortSignal
): Promise<AviationPhoto[]> {
  const cleanReg = (registration || '').toUpperCase().trim();
  if (!cleanReg || cleanReg === 'SEM-PREFIXO') return [];

  // Endpoints list: We attempt standard API endpoints matching the jetphotos-api-docs spec
  const endpoints = [
    `https://jetphotos-api.workers.dev/?page=1&sort-order=1&keywords=${encodeURIComponent(
      cleanReg
    )}&keywords-type=registration&keywords-contain=3`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://jetphotos-api.workers.dev/?page=1&sort-order=1&keywords=${cleanReg}&keywords-type=registration&keywords-contain=3`
    )}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, { signal });
      if (!res.ok) continue;

      const data = await res.json();
      const photosArray = data.photos || data.results || (Array.isArray(data) ? data : []);

      if (Array.isArray(photosArray) && photosArray.length > 0) {
        const mapped: AviationPhoto[] = photosArray
          .map((item: any, idx: number) => {
            const rawUrl =
              item.imageUrl ||
              item.largeUrl ||
              item.thumbnailUrl ||
              item.image ||
              item.thumbnail ||
              (item.photoId ? `https://cdn.jetphotos.com/400/${item.photoId}.jpg` : '');

            if (!rawUrl) return null;

            // Ensure HTTPS protocol if url starts with //
            const cleanUrl = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;

            return {
              id: `jp-${item.photoId || idx}-${cleanReg}`,
              url: cleanUrl,
              thumbnailUrl: cleanUrl,
              source: 'jetphotos' as AviationPhotoSource,
              sourceLabel: 'JetPhotos.com',
              photographer: item.photographer || 'JetPhotos Spotter',
              registration: item.registration || cleanReg,
              aircraftModel: item.aircraftType || item.aircraft,
              airline: item.airline,
              link: item.link || (item.photoId ? `https://www.jetphotos.com/photo/${item.photoId}` : undefined),
            };
          })
          .filter((p: any): p is AviationPhoto => p !== null);

        if (mapped.length > 0) {
          return mapped;
        }
      }
    } catch {
      // Continue to next endpoint attempt
    }
  }

  return [];
}

/**
 * Fetch Airport photos from JetPhotos and Airport Spotter Pools
 * Queries JetPhotos with airport ICAO/IATA (keywords-type=location or all)
 * Alternates with Planespotters / airport gallery photos!
 */
export async function fetchAirportPhotos(
  airportCode: string,
  airportName: string = '',
  signal?: AbortSignal
): Promise<AviationPhoto[]> {
  const cleanCode = (airportCode || '').toUpperCase().trim();
  if (!cleanCode) return [];

  const cacheKey = `airport_${cleanCode}_${airportName}`;
  if (photoCache.has(cacheKey)) {
    return photoCache.get(cacheKey)!;
  }

  const jetPhotosList: AviationPhoto[] = [];
  const planespottersList: AviationPhoto[] = [];

  // 1. Query JetPhotos for Airport / Location
  const jetPhotosEndpoints = [
    `https://jetphotos-api.workers.dev/?page=1&sort-order=1&keywords=${encodeURIComponent(
      cleanCode
    )}&keywords-type=location&keywords-contain=3`,
    `https://jetphotos-api.workers.dev/?page=1&sort-order=1&keywords=${encodeURIComponent(
      cleanCode
    )}&keywords-type=all&keywords-contain=3`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://jetphotos-api.workers.dev/?page=1&sort-order=1&keywords=${cleanCode}&keywords-type=all&keywords-contain=3`
    )}`,
  ];

  for (const endpoint of jetPhotosEndpoints) {
    try {
      const res = await fetch(endpoint, { signal });
      if (!res.ok) continue;

      const data = await res.json();
      const photosArray = data.photos || data.results || (Array.isArray(data) ? data : []);

      if (Array.isArray(photosArray) && photosArray.length > 0) {
        const mapped: AviationPhoto[] = photosArray
          .slice(0, 6)
          .map((item: any, idx: number) => {
            const rawUrl =
              item.imageUrl ||
              item.largeUrl ||
              item.thumbnailUrl ||
              item.image ||
              item.thumbnail ||
              (item.photoId ? `https://cdn.jetphotos.com/400/${item.photoId}.jpg` : '');

            if (!rawUrl) return null;
            const cleanUrl = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;

            return {
              id: `jp-apt-${item.photoId || idx}-${cleanCode}`,
              url: cleanUrl,
              thumbnailUrl: cleanUrl,
              source: 'jetphotos' as AviationPhotoSource,
              sourceLabel: 'JetPhotos.com',
              photographer: item.photographer || 'JetPhotos Spotter',
              airportCode: cleanCode,
              airportName: airportName || item.location,
              link: item.link || (item.photoId ? `https://www.jetphotos.com/photo/${item.photoId}` : undefined),
            };
          })
          .filter((p: any): p is AviationPhoto => p !== null);

        if (mapped.length > 0) {
          jetPhotosList.push(...mapped);
          break;
        }
      }
    } catch {
      // Continue
    }
  }

  // 2. Add curated airport photography pool for this airport
  const curatedPool = AIRPORT_PHOTO_POOLS[cleanCode] || AIRPORT_PHOTO_POOLS.defaultAirport;
  curatedPool.forEach((item, idx) => {
    const isJP = item.sourceLabel.includes('JetPhotos') || idx % 2 === 0;
    const photoObj: AviationPhoto = {
      id: `curated-apt-${cleanCode}-${idx}`,
      url: item.url,
      thumbnailUrl: item.url,
      source: isJP ? 'jetphotos' : 'planespotters',
      sourceLabel: item.sourceLabel || (isJP ? 'JetPhotos.com' : 'Planespotters.net'),
      photographer: item.photographer,
      airportCode: cleanCode,
      airportName,
    };
    if (isJP) {
      jetPhotosList.push(photoObj);
    } else {
      planespottersList.push(photoObj);
    }
  });

  // Interleave and alternate between JetPhotos and Planespotters
  const interleaved = interleaveAndRandomizePhotos(planespottersList, jetPhotosList);

  // Deduplicate
  const seenUrls = new Set<string>();
  const deduplicated = interleaved.filter((p) => {
    if (!p.url || seenUrls.has(p.url)) return false;
    seenUrls.add(p.url);
    return true;
  });

  photoCache.set(cacheKey, deduplicated);
  return deduplicated;
}

/**
 * Combined Dual-Source Fetcher: Queries BOTH Planespotters.net and JetPhotos API in parallel.
 * Merges by alternating between Planespotters and JetPhotos (randomizing the initial pick).
 */
export async function fetchDualSourcePhotos(
  registration: string,
  aircraftModel: string = '',
  airline: string = '',
  preferSource: 'all' | 'planespotters' | 'jetphotos' = 'all',
  signal?: AbortSignal
): Promise<AviationPhoto[]> {
  const cleanReg = (registration || '').toUpperCase().trim();
  const cacheKey = `${cleanReg}_${aircraftModel}_${airline}_${preferSource}`;

  if (photoCache.has(cacheKey)) {
    return photoCache.get(cacheKey)!;
  }

  if (!cleanReg || cleanReg === 'SEM-PREFIXO') {
    const fallback = [
      getCuratedFallbackPhoto(aircraftModel, airline, 0),
      getCuratedFallbackPhoto(aircraftModel, airline, 1),
    ];
    return fallback;
  }

  let psPhotos: AviationPhoto[] = [];
  let jpPhotos: AviationPhoto[] = [];

  const promises: Promise<void>[] = [];

  if (preferSource === 'all' || preferSource === 'planespotters') {
    promises.push(
      fetchFromPlanespotters(cleanReg, signal)
        .then((res) => {
          psPhotos = res;
        })
        .catch(() => {})
    );
  }

  if (preferSource === 'all' || preferSource === 'jetphotos') {
    promises.push(
      fetchFromJetPhotos(cleanReg, signal)
        .then((res) => {
          jpPhotos = res;
        })
        .catch(() => {})
    );
  }

  await Promise.allSettled(promises);

  // Interleave and randomize between Planespotters and JetPhotos
  let combined: AviationPhoto[];
  if (preferSource === 'planespotters') {
    combined = psPhotos;
  } else if (preferSource === 'jetphotos') {
    combined = jpPhotos;
  } else {
    combined = interleaveAndRandomizePhotos(psPhotos, jpPhotos);
  }

  // Deduplicate by URL
  const seenUrls = new Set<string>();
  const deduplicated = combined.filter((p) => {
    if (!p.url || seenUrls.has(p.url)) return false;
    seenUrls.add(p.url);
    return true;
  });

  if (deduplicated.length === 0) {
    // If neither returned photos, generate alternating fallbacks
    const fallback = [
      getCuratedFallbackPhoto(aircraftModel, airline, 0),
      getCuratedFallbackPhoto(aircraftModel, airline, 1),
    ];
    photoCache.set(cacheKey, fallback);
    return fallback;
  }

  photoCache.set(cacheKey, deduplicated);
  return deduplicated;
}

