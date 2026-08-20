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
