// ADS-B Exchange Live Radar & Aircraft Tracking Service
export interface AdsbAircraft {
  hex: string;
  flight?: string;
  registration?: string;
  type?: string;
  altitudeFt?: number | string;
  groundSpeedKnots?: number;
  trackDeg?: number;
  lat: number;
  lon: number;
  squawk?: string;
  distanceNm?: number;
  seenSec?: number;
  isOnGround?: boolean;
}

export interface AdsbRadarResponse {
  source: string;
  configured: boolean;
  total: number;
  aircraft: AdsbAircraft[];
  message?: string;
  timestamp: number;
}

export async function fetchAirportLiveTraffic(
  lat: number,
  lon: number,
  distNm: number = 30,
  signal?: AbortSignal
): Promise<AdsbRadarResponse> {
  try {
    const res = await fetch(`/api/adsb/radius?lat=${lat}&lon=${lon}&dist=${distNm}`, { signal });
    if (!res.ok) {
      throw new Error(`Falha ao consultar radar ADS-B (${res.status})`);
    }

    const data = await res.json();
    const rawList = data.ac || [];

    const aircraft: AdsbAircraft[] = rawList.map((item: any) => {
      const isGround = item.alt_baro === 'ground' || item.alt_geom === 'ground' || item.ground === true;
      const alt = isGround
        ? 'Solo (Ground)'
        : typeof item.alt_baro === 'number'
        ? item.alt_baro
        : typeof item.alt_geom === 'number'
        ? item.alt_geom
        : item.alt_baro || item.alt_geom || 0;

      return {
        hex: item.hex || item.icao,
        flight: (item.flight || item.callsign || '').trim(),
        registration: item.r || item.registration || item.reg,
        type: item.t || item.type || item.icaotype,
        altitudeFt: alt,
        groundSpeedKnots: item.gs || item.speed,
        trackDeg: item.track || item.dir || item.heading,
        lat: item.lat,
        lon: item.lon,
        squawk: item.squawk || item.sqk,
        distanceNm: typeof item.dst === 'number' ? Math.round(item.dst * 10) / 10 : undefined,
        seenSec: item.seen,
        isOnGround: isGround,
      };
    });

    return {
      source: data.source || 'adsbx',
      configured: data.source !== 'fallback',
      total: aircraft.length,
      aircraft,
      message: data.message,
      timestamp: Date.now(),
    };
  } catch (err: any) {
    return {
      source: 'error',
      configured: false,
      total: 0,
      aircraft: [],
      message: err?.message || 'Erro ao conectar ao serviço de radar.',
      timestamp: Date.now(),
    };
  }
}

export async function fetchAircraftLivePosition(
  registration: string,
  signal?: AbortSignal
): Promise<{ airborne: boolean; aircraft?: AdsbAircraft; message?: string }> {
  const clean = registration.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!clean) return { airborne: false };

  try {
    const res = await fetch(`/api/adsb/registration/${clean}`, { signal });
    if (!res.ok) return { airborne: false };

    const data = await res.json();
    if (data.source === 'not_airborne' || !data.ac || (Array.isArray(data.ac) && data.ac.length === 0)) {
      return { airborne: false, message: data.message || `Aeronave ${clean} não está no ar.` };
    }

    const item = Array.isArray(data.ac) ? data.ac[0] : data.ac;
    const isGround = item.alt_baro === 'ground' || item.alt_geom === 'ground';

    return {
      airborne: !isGround,
      aircraft: {
        hex: item.hex,
        flight: (item.flight || '').trim(),
        registration: item.r || clean,
        type: item.t,
        altitudeFt: item.alt_baro || item.alt_geom,
        groundSpeedKnots: item.gs,
        trackDeg: item.track,
        lat: item.lat,
        lon: item.lon,
        squawk: item.squawk,
      },
    };
  } catch {
    return { airborne: false };
  }
}
