export interface AirlineInfo {
  name: string;
  code: string;
  logoUrl: string;
  color: string;
}

export function getAirlineLogo(rawAirline: string): { name: string; logoUrl: string; color: string } {
  const name = (rawAirline || 'Companhia Aérea').split('(')[0].trim();
  const lower = name.toLowerCase();

  if (lower.includes('azul')) {
    return {
      name: 'Azul Brazilian Airlines',
      logoUrl: 'https://images.seeklogo.com/logo-png/38/1/azul-linhas-aereas-logo-png_seeklogo-382977.png',
      color: '#002060',
    };
  }
  if (lower.includes('latam') || lower.includes('tam')) {
    return {
      name: 'LATAM Airlines',
      logoUrl: 'https://images.seeklogo.com/logo-png/28/2/latam-airlines-logo-png_seeklogo-289568.png',
      color: '#e2001a',
    };
  }
  if (lower.includes('gol')) {
    return {
      name: 'GOL Linhas Aéreas',
      logoUrl: 'https://images.seeklogo.com/logo-png/27/2/gol-linhas-aereas-logo-png_seeklogo-278078.png',
      color: '#ff6600',
    };
  }
  if (lower.includes('tap')) {
    return {
      name: 'TAP Air Portugal',
      logoUrl: 'https://images.seeklogo.com/logo-png/13/2/tap-portugal-logo-png_seeklogo-135894.png',
      color: '#00833e',
    };
  }
  if (lower.includes('passaredo') || lower.includes('voepass')) {
    return {
      name: 'VOEPASS / Passaredo',
      logoUrl: 'https://images.seeklogo.com/logo-png/36/2/voepass-logo-png_seeklogo-362241.png',
      color: '#ee3124',
    };
  }
  if (lower.includes('united')) {
    return {
      name: 'United Airlines',
      logoUrl: 'https://images.seeklogo.com/logo-png/14/1/united-airlines-logo-png_seeklogo-148154.png',
      color: '#002244',
    };
  }
  if (lower.includes('american')) {
    return {
      name: 'American Airlines',
      logoUrl: 'https://images.seeklogo.com/logo-png/26/1/american-airlines-logo-png_seeklogo-262334.png',
      color: '#0078d2',
    };
  }

  // Fallback
  return {
    name,
    logoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80',
    color: '#2563eb',
  };
}
