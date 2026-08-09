export interface AirportLocation {
  iata: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export const AIRPORT_COORDINATES: Record<string, AirportLocation> = {
  // Brazil Hubs
  VCP: { iata: 'VCP', name: 'Campinas / Viracopos', city: 'Campinas, SP', lat: -23.0074, lng: -47.1345 },
  JOI: { iata: 'JOI', name: 'Joinville / Lauro Carneiro', city: 'Joinville, SC', lat: -26.2231, lng: -48.7972 },
  NVT: { iata: 'NVT', name: 'Navegantes / Victor Konder', city: 'Navegantes, SC', lat: -26.8800, lng: -48.6514 },
  CGH: { iata: 'CGH', name: 'São Paulo / Congonhas', city: 'São Paulo, SP', lat: -23.6273, lng: -46.6565 },
  GRU: { iata: 'GRU', name: 'São Paulo / Guarulhos', city: 'Guarulhos, SP', lat: -23.4356, lng: -46.4731 },
  SDU: { iata: 'SDU', name: 'Rio de Janeiro / Santos Dumont', city: 'Rio de Janeiro, RJ', lat: -22.9100, lng: -43.1625 },
  GIG: { iata: 'GIG', name: 'Rio de Janeiro / Galeão', city: 'Rio de Janeiro, RJ', lat: -22.8089, lng: -43.2436 },
  CWB: { iata: 'CWB', name: 'Curitiba / Afonso Pena', city: 'Curitiba, PR', lat: -25.5317, lng: -49.1761 },
  FLN: { iata: 'FLN', name: 'Florianópolis / Hercílio Luz', city: 'Florianópolis, SC', lat: -27.6703, lng: -48.5525 },
  XAP: { iata: 'XAP', name: 'Chapecó / Serafim Enoss', city: 'Chapecó, SC', lat: -27.1347, lng: -52.6619 },
  SSA: { iata: 'SSA', name: 'Salvador / Dep. Luís Eduardo Magalhães', city: 'Salvador, BA', lat: -12.9086, lng: -38.3225 },
  BPS: { iata: 'BPS', name: 'Porto Seguro', city: 'Porto Seguro, BA', lat: -16.4389, lng: -39.0808 },
  BSB: { iata: 'BSB', name: 'Brasília / Juscelino Kubitschek', city: 'Brasília, DF', lat: -15.8697, lng: -47.9208 },
  CNF: { iata: 'CNF', name: 'Belo Horizonte / Confins', city: 'Confins, MG', lat: -19.6244, lng: -43.9719 },
  REC: { iata: 'REC', name: 'Recife / Guararapes', city: 'Recife, PE', lat: -8.1264, lng: -34.9228 },
  FOR: { iata: 'FOR', name: 'Fortaleza / Pinto Martins', city: 'Fortaleza, CE', lat: -3.7763, lng: -38.5326 },
  POA: { iata: 'POA', name: 'Porto Alegre / Salgado Filho', city: 'Porto Alegre, RS', lat: -29.9939, lng: -51.1711 },
  MAO: { iata: 'MAO', name: 'Manaus / Eduardo Gomes', city: 'Manaus, AM', lat: -3.0386, lng: -60.0497 },
  CGB: { iata: 'CGB', name: 'Cuiabá / Marechal Rondon', city: 'Cuiabá, MT', lat: -15.6529, lng: -56.1167 },
  CGR: { iata: 'CGR', name: 'Campo Grande', city: 'Campo Grande, MS', lat: -20.4687, lng: -54.6725 },
  GYN: { iata: 'GYN', name: 'Goiânia / Santa Genoveva', city: 'Goiânia, GO', lat: -16.6322, lng: -49.2206 },
  SLZ: { iata: 'SLZ', name: 'São Luís / Marechal Cunha Machado', city: 'São Luís, MA', lat: -2.5867, lng: -44.2361 },
  NAT: { iata: 'NAT', name: 'Natal / Aluízio Alves', city: 'Natal, RN', lat: -5.7689, lng: -35.3664 },
  MCZ: { iata: 'MCZ', name: 'Maceió / Zumbi dos Palmares', city: 'Maceió, AL', lat: -9.5108, lng: -35.7917 },
  JPA: { iata: 'JPA', name: 'João Pessoa / Castro Pinto', city: 'João Pessoa, PB', lat: -7.1481, lng: -34.9503 },
  VIX: { iata: 'VIX', name: 'Vitória / Eurico de Aguiar Salles', city: 'Vitória, ES', lat: -20.2581, lng: -40.2864 },
  IGU: { iata: 'IGU', name: 'Foz do Iguaçu / Cataratas', city: 'Foz do Iguaçu, PR', lat: -25.5964, lng: -54.4872 },
  CAC: { iata: 'CAC', name: 'Cascavel / Adalberto Mendes', city: 'Cascavel, PR', lat: -24.9861, lng: -53.5011 },
  CXJ: { iata: 'CXJ', name: 'Caxias do Sul / Hugo Cantergiani', city: 'Caxias do Sul, RS', lat: -29.1961, lng: -51.1883 },
  UDI: { iata: 'UDI', name: 'Uberlândia / Ten. Cel. Av. César Bombonato', city: 'Uberlândia, MG', lat: -18.8828, lng: -48.2256 },
  RAO: { iata: 'RAO', name: 'Ribeirão Preto / Leite Lopes', city: 'Ribeirão Preto, SP', lat: -21.1364, lng: -47.7719 },
  SJP: { iata: 'SJP', name: 'São José do Rio Preto', city: 'São José do Rio Preto, SP', lat: -20.8161, lng: -49.4047 },

  // International
  FLL: { iata: 'FLL', name: 'Fort Lauderdale / Hollywood', city: 'Fort Lauderdale, EUA', lat: 26.0742, lng: -80.1506 },
  MCO: { iata: 'MCO', name: 'Orlando International', city: 'Orlando, EUA', lat: 28.4312, lng: -81.3081 },
  MIA: { iata: 'MIA', name: 'Miami International', city: 'Miami, EUA', lat: 25.7959, lng: -80.2870 },
  SFO: { iata: 'SFO', name: 'San Francisco International', city: 'San Francisco, EUA', lat: 37.6213, lng: -122.3790 },
  JFK: { iata: 'JFK', name: 'New York / John F. Kennedy', city: 'Nova York, EUA', lat: 40.6413, lng: -73.7781 },
  EWR: { iata: 'EWR', name: 'Newark Liberty', city: 'Newark/Nova York, EUA', lat: 40.6895, lng: -74.1745 },
  LGA: { iata: 'LGA', name: 'New York / LaGuardia', city: 'Nova York, EUA', lat: 40.7769, lng: -73.8740 },
  LAX: { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles, EUA', lat: 33.9416, lng: -118.4085 },
  ORD: { iata: 'ORD', name: 'Chicago O\'Hare', city: 'Chicago, EUA', lat: 41.9742, lng: -87.9073 },
  ATL: { iata: 'ATL', name: 'Atlanta Hartsfield-Jackson', city: 'Atlanta, EUA', lat: 33.6407, lng: -84.4277 },

  LIS: { iata: 'LIS', name: 'Lisboa / Humberto Delgado', city: 'Lisboa, Portugal', lat: 38.7742, lng: -9.1342 },
  OPO: { iata: 'OPO', name: 'Porto / Francisco Sá Carneiro', city: 'Porto, Portugal', lat: 41.2481, lng: -8.6814 },
  FNC: { iata: 'FNC', name: 'Madeira / Funchal', city: 'Madeira, Portugal', lat: 32.6925, lng: -16.7744 },

  CDG: { iata: 'CDG', name: 'Paris / Charles de Gaulle', city: 'Paris, França', lat: 49.0097, lng: 2.5479 },
  ORY: { iata: 'ORY', name: 'Paris / Orly', city: 'Paris, França', lat: 48.7262, lng: 2.3652 },
  LHR: { iata: 'LHR', name: 'Londres / Heathrow', city: 'Londres, Reino Unido', lat: 51.4700, lng: -0.4543 },
  LGW: { iata: 'LGW', name: 'Londres / Gatwick', city: 'Londres, Reino Unido', lat: 51.1537, lng: -0.1821 },
  MAD: { iata: 'MAD', name: 'Madrid / Barajas', city: 'Madrid, Espanha', lat: 40.4839, lng: -3.5680 },
  BCN: { iata: 'BCN', name: 'Barcelona / El Prat', city: 'Barcelona, Espanha', lat: 41.2974, lng: 2.0833 },
  FRA: { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt, Alemanha', lat: 50.0379, lng: 8.5622 },
  MUC: { iata: 'MUC', name: 'Munique Airport', city: 'Munique, Alemanha', lat: 48.3536, lng: 11.7860 },

  EZE: { iata: 'EZE', name: 'Buenos Aires / Ezeiza', city: 'Buenos Aires, Argentina', lat: -34.8222, lng: -58.5358 },
  AEP: { iata: 'AEP', name: 'Buenos Aires / Jorge Newbery', city: 'Buenos Aires, Argentina', lat: -34.5592, lng: -58.4156 },
  SCL: { iata: 'SCL', name: 'Santiago / Arturo Merino Benítez', city: 'Santiago, Chile', lat: -33.3930, lng: -70.7858 },
  BOG: { iata: 'BOG', name: 'Bogotá / El Dorado', city: 'Bogotá, Colômbia', lat: 4.7016, lng: -74.1469 },
  MEX: { iata: 'MEX', name: 'Cidade do México / Benito Juárez', city: 'Cidade do México, México', lat: 19.4363, lng: -99.0721 },
  CUN: { iata: 'CUN', name: 'Cancún International', city: 'Cancún, México', lat: 21.0365, lng: -86.8771 },
  PTY: { iata: 'PTY', name: 'Panamá / Tocumen', city: 'Cidade do Panamá, Panamá', lat: 9.0714, lng: -79.3835 },
  LIM: { iata: 'LIM', name: 'Lima / Jorge Chávez', city: 'Lima, Peru', lat: -12.0219, lng: -77.1143 },
  MVD: { iata: 'MVD', name: 'Montevidéu / Carrasco', city: 'Montevidéu, Uruguai', lat: -34.8384, lng: -56.0308 },
};

export function parseAirport(rawStr: string): AirportLocation {
  if (!rawStr) {
    return { iata: 'VCP', name: 'Campinas / Viracopos', city: 'Campinas, SP', lat: -23.0074, lng: -47.1345 };
  }

  const upperStr = rawStr.toUpperCase().trim();

  // 1. First priority: Extract 3-letter IATA code inside parentheses e.g. "(FLL/KFLL)" or "(FOR/SBFZ)" or "(VCP)"
  const parenMatch = rawStr.match(/\(([A-Z]{3})(?:[\/\)][A-Z0-9]*)?/i);
  if (parenMatch && parenMatch[1]) {
    const code = parenMatch[1].toUpperCase();
    if (AIRPORT_COORDINATES[code]) {
      return AIRPORT_COORDINATES[code];
    }
  }

  // 2. Second priority: Match exact word boundary for 3-letter IATA code, e.g. "FLL/KFLL" or "VCP"
  for (const iata of Object.keys(AIRPORT_COORDINATES)) {
    const regex = new RegExp(`\\b${iata}\\b`, 'i');
    if (regex.test(rawStr)) {
      return AIRPORT_COORDINATES[iata];
    }
  }

  // 3. Third priority: Cross-reference city names in AIRPORT_COORDINATES with high precision
  // Check for multi-word or distinct city matches first (e.g., "Fort Lauderdale" before "Fortaleza")
  for (const airport of Object.values(AIRPORT_COORDINATES)) {
    const cityNamePart = airport.city.split(',')[0].trim().toUpperCase();
    const airportNamePart = airport.name.split('/')[0].trim().toUpperCase();

    if (cityNamePart.length >= 4 && upperStr.includes(cityNamePart)) {
      return airport;
    }
    if (airportNamePart.length >= 4 && upperStr.includes(airportNamePart)) {
      return airport;
    }
  }

  // 4. Fallback for custom or unlisted airports
  const cityName = rawStr.split('/')[0]?.trim() || rawStr.trim();
  const extractedIata = parenMatch ? parenMatch[1].toUpperCase() : cityName.substring(0, 3).toUpperCase();

  // Deterministic coordinate calculation derived from string hash
  let hash = 0;
  for (let i = 0; i < rawStr.length; i++) {
    hash = rawStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const posHash = Math.abs(hash);
  const latOffset = ((posHash % 100) / 100) * 8;
  const lngOffset = (((posHash >> 2) % 100) / 100) * 8;

  return {
    iata: extractedIata,
    name: cityName,
    city: cityName,
    lat: -23.50 + (posHash % 2 === 0 ? latOffset : -latOffset),
    lng: -47.00 + (posHash % 3 === 0 ? lngOffset : -lngOffset),
  };
}
