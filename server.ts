import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Status & Configuration Check
  app.get('/api/adsb/status', (req, res) => {
    const hasKey = Boolean(process.env.ADSBEXCHANGE_API_KEY && process.env.ADSBEXCHANGE_API_KEY.trim().length > 0);
    res.json({
      configured: hasKey,
      message: hasKey
        ? 'ADS-B Exchange API Key configurada com sucesso.'
        : 'Chave ADSBEXCHANGE_API_KEY não detectada. Usando modo de contingência/simulação.',
    });
  });

  // ADS-B Exchange: Query by Coordinates / Radius (Radar near Airport)
  app.get('/api/adsb/radius', async (req, res) => {
    const { lat, lon, dist = 25 } = req.query;
    const apiKey = process.env.ADSBEXCHANGE_API_KEY?.trim();

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude e Longitude são obrigatórios.' });
    }

    if (!apiKey) {
      return res.json({
        source: 'fallback',
        ac: [],
        total: 0,
        message: 'Cadastre sua ADSBEXCHANGE_API_KEY nas Configurações (Secrets) para ver o tráfego 100% em tempo real.',
      });
    }

    try {
      // Check if user provided RapidAPI key or direct ADSBx key
      const isRapidApi = apiKey.length > 40 || req.headers['x-use-rapidapi'];
      
      let url = `https://adsbexchange-com1.p.rapidapi.com/v2/lat/${lat}/lon/${lon}/dist/${dist}/`;
      let headers: Record<string, string> = {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'adsbexchange-com1.p.rapidapi.com',
      };

      // If direct ADSBExchange enterprise/v2 key
      if (!isRapidApi) {
        url = `https://globe.adsbexchange.com/v2/lat/${lat}/lon/${lon}/dist/${dist}`;
        headers = {
          'api-auth': apiKey,
        };
      }

      const response = await fetch(url, { headers });
      if (!response.ok) {
        // Try alternate direct endpoint
        const fallbackUrl = `https://globe.adsbexchange.com/v2/lat/${lat}/lon/${lon}/dist/${dist}`;
        const fallbackRes = await fetch(fallbackUrl, { headers: { 'api-auth': apiKey } });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          return res.json({ source: 'adsbx-direct', ...fallbackData });
        }
        return res.status(response.status).json({
          error: `ADS-B Exchange API error: ${response.statusText}`,
          source: 'error',
        });
      }

      const data = await response.json();
      return res.json({ source: 'adsbx-live', ...data });
    } catch (err: any) {
      console.error('Error fetching ADS-B radius data:', err);
      return res.status(500).json({ error: err?.message || 'Erro interno ao consultar ADS-B Exchange' });
    }
  });

  // ADS-B Exchange: Query by Registration / Tail Number
  app.get('/api/adsb/registration/:reg', async (req, res) => {
    const cleanReg = req.params.reg.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const apiKey = process.env.ADSBEXCHANGE_API_KEY?.trim();

    if (!cleanReg) {
      return res.status(400).json({ error: 'Matrícula inválida.' });
    }

    if (!apiKey) {
      return res.json({
        source: 'fallback',
        ac: null,
        message: 'Cadastre sua ADSBEXCHANGE_API_KEY nas Configurações (Secrets) para rastreamento ao vivo.',
      });
    }

    try {
      const isRapidApi = apiKey.length > 40;
      let url = `https://adsbexchange-com1.p.rapidapi.com/v2/registration/${cleanReg}/`;
      let headers: Record<string, string> = {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'adsbexchange-com1.p.rapidapi.com',
      };

      if (!isRapidApi) {
        url = `https://globe.adsbexchange.com/v2/registration/${cleanReg}`;
        headers = { 'api-auth': apiKey };
      }

      const response = await fetch(url, { headers });
      if (!response.ok) {
        return res.json({
          source: 'not_airborne',
          message: `Aeronave ${cleanReg} não detectada em voo no momento.`,
        });
      }

      const data = await response.json();
      return res.json({ source: 'adsbx-live', ...data });
    } catch (err: any) {
      console.error('Error fetching ADS-B reg data:', err);
      return res.status(500).json({ error: err?.message || 'Erro ao consultar ADS-B Exchange' });
    }
  });

  // Unsplash & Pexels Photo API Proxy for Airports & Aviation
  app.get('/api/photos/airport', async (req, res) => {
    const { code, name, city } = req.query;
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
    const pexelsKey = process.env.PEXELS_API_KEY?.trim();

    const photos: any[] = [];
    const searchTerms = [
      `${code} airport`,
      `${name} airport`,
      `${city} airport terminal`,
      `airplane runway ${code || ''}`,
    ].filter(Boolean);

    const primaryQuery = `${name || code || 'airport'} aviation`;

    // 1. Fetch from Unsplash if key is present
    if (unsplashKey) {
      try {
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          primaryQuery
        )}&per_page=8&orientation=landscape&client_id=${unsplashKey}`;
        const uRes = await fetch(unsplashUrl);
        if (uRes.ok) {
          const uData = await uRes.json();
          if (Array.isArray(uData.results)) {
            for (const item of uData.results) {
              photos.push({
                id: `unsplash-${item.id}`,
                url: item.urls?.regular || item.urls?.full || item.urls?.small,
                thumbnailUrl: item.urls?.small || item.urls?.thumb,
                source: 'unsplash',
                sourceLabel: 'Unsplash',
                photographer: item.user?.name || 'Unsplash Contributor',
                link: item.links?.html || `https://unsplash.com/photos/${item.id}`,
                airportCode: code,
                airportName: name,
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching from Unsplash:', err);
      }
    }

    // 2. Fetch from Pexels if key is present
    if (pexelsKey) {
      try {
        const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          primaryQuery
        )}&per_page=8&orientation=landscape`;
        const pRes = await fetch(pexelsUrl, {
          headers: { Authorization: pexelsKey },
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (Array.isArray(pData.photos)) {
            for (const item of pData.photos) {
              photos.push({
                id: `pexels-${item.id}`,
                url: item.src?.large2x || item.src?.large || item.src?.medium,
                thumbnailUrl: item.src?.medium || item.src?.small,
                source: 'pexels',
                sourceLabel: 'Pexels',
                photographer: item.photographer || 'Pexels Photographer',
                link: item.url,
                airportCode: code,
                airportName: name,
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching from Pexels:', err);
      }
    }

    return res.json({
      photos,
      count: photos.length,
      hasUnsplashKey: Boolean(unsplashKey),
      hasPexelsKey: Boolean(pexelsKey),
    });
  });

  // Vite development middleware vs Static Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FlyDiary Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
