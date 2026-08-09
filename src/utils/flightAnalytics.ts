import {
  Flight,
  MonthYearData,
  SpecificModelStat,
  GroupedModelStat,
  ManufacturerStat,
} from '../types';

export const MONTH_NAMES_PT = [
  { short: 'Jan', full: 'Janeiro' },
  { short: 'Fev', full: 'Fevereiro' },
  { short: 'Mar', full: 'Março' },
  { short: 'Abr', full: 'Abril' },
  { short: 'Mai', full: 'Maio' },
  { short: 'Jun', full: 'Junho' },
  { short: 'Jul', full: 'Julho' },
  { short: 'Ago', full: 'Agosto' },
  { short: 'Set', full: 'Setembro' },
  { short: 'Out', full: 'Outubro' },
  { short: 'Nov', full: 'Novembro' },
  { short: 'Dez', full: 'Dezembro' },
];

export const YEAR_COLORS: Record<string, string> = {
  '2010': '#a855f7', // Purple
  '2012': '#06b6d4', // Cyan
  '2013': '#14b8a6', // Teal
  '2014': '#f59e0b', // Amber
  '2017': '#ec4899', // Pink
  '2019': '#10b981', // Emerald
  '2020': '#ef4444', // Red
  '2023': '#f97316', // Orange
  '2024': '#3b82f6', // Blue
  '2025': '#6366f1', // Indigo
  '2026': '#8b5cf6', // Violet
};

// Helper to clean raw aircraft string into a readable specific model name
export function cleanSpecificModel(rawAircraft: string): {
  cleanName: string;
  manufacturer: string;
} {
  const str = rawAircraft.trim();

  if (str.includes('E195-E2') || str.includes('E295')) {
    return { cleanName: 'Embraer E195-E2', manufacturer: 'Embraer' };
  }
  if (str.includes('ERJ-195') || (str.includes('E195') && !str.includes('E2'))) {
    return { cleanName: 'Embraer ERJ-195', manufacturer: 'Embraer' };
  }
  if (str.includes('ERJ-190') || str.includes('E190')) {
    return { cleanName: 'Embraer ERJ-190', manufacturer: 'Embraer' };
  }
  if (str.includes('ATR 72') || str.includes('AT76')) {
    return { cleanName: 'ATR 72-600', manufacturer: 'ATR' };
  }
  if (str.includes('A330-900') || str.includes('A339')) {
    return { cleanName: 'Airbus A330-900neo', manufacturer: 'Airbus' };
  }
  if (str.includes('A330-300') || str.includes('A333')) {
    return { cleanName: 'Airbus A330-300', manufacturer: 'Airbus' };
  }
  if (str.includes('A330-200') || str.includes('A332')) {
    return { cleanName: 'Airbus A330-200', manufacturer: 'Airbus' };
  }
  if (str.includes('A320neo') || str.includes('A20N')) {
    return { cleanName: 'Airbus A320neo', manufacturer: 'Airbus' };
  }
  if (str.includes('A320')) {
    return { cleanName: 'Airbus A320', manufacturer: 'Airbus' };
  }
  if (str.includes('A321neo') || str.includes('A21N')) {
    return { cleanName: 'Airbus A321neo', manufacturer: 'Airbus' };
  }
  if (str.includes('A321')) {
    return { cleanName: 'Airbus A321', manufacturer: 'Airbus' };
  }
  if (str.includes('A319')) {
    return { cleanName: 'Airbus A319', manufacturer: 'Airbus' };
  }
  if (str.includes('787') || str.includes('B787')) {
    return { cleanName: 'Boeing 787', manufacturer: 'Boeing' };
  }
  if (str.includes('737') || str.includes('B738')) {
    return { cleanName: 'Boeing 737-800', manufacturer: 'Boeing' };
  }

  // Fallback
  let mfg = 'Outro';
  if (str.toLowerCase().includes('embraer')) mfg = 'Embraer';
  else if (str.toLowerCase().includes('airbus')) mfg = 'Airbus';
  else if (str.toLowerCase().includes('boeing')) mfg = 'Boeing';
  else if (str.toLowerCase().includes('atr')) mfg = 'ATR';

  return { cleanName: str, manufacturer: mfg };
}

// Group specific models into Model Families
export function getGroupedFamily(specificCleanName: string): {
  familyName: string;
  description: string;
  manufacturer: string;
} {
  if (
    specificCleanName.includes('E195') ||
    specificCleanName.includes('ERJ-190') ||
    specificCleanName.includes('E-Jets')
  ) {
    return {
      familyName: 'Embraer E-Jets (E190/E195/E2)',
      description: 'E195-E2, ERJ-195, ERJ-190',
      manufacturer: 'Embraer',
    };
  }
  if (specificCleanName.includes('ATR')) {
    return {
      familyName: 'Família ATR 72',
      description: 'ATR 72-600',
      manufacturer: 'ATR',
    };
  }
  if (
    specificCleanName.includes('A319') ||
    specificCleanName.includes('A320') ||
    specificCleanName.includes('A321')
  ) {
    return {
      familyName: 'Família Airbus A320',
      description: 'A319, A320, A320neo, A321, A321neo',
      manufacturer: 'Airbus',
    };
  }
  if (specificCleanName.includes('A330')) {
    return {
      familyName: 'Família Airbus A330',
      description: 'A330-200, A330-300, A330-900neo',
      manufacturer: 'Airbus',
    };
  }
  if (specificCleanName.includes('737')) {
    return {
      familyName: 'Família Boeing 737',
      description: 'Boeing 737-800',
      manufacturer: 'Boeing',
    };
  }
  if (specificCleanName.includes('787')) {
    return {
      familyName: 'Família Boeing 787',
      description: 'Boeing 787 Dreamliner',
      manufacturer: 'Boeing',
    };
  }

  return {
    familyName: specificCleanName,
    description: specificCleanName,
    manufacturer: 'Outros',
  };
}

// Compute Monthly Chart Data
export function computeMonthlyData(
  flights: Flight[],
  activeYears?: string[]
): {
  monthlyData: MonthYearData[];
  allYears: string[];
} {
  // Extract all distinct years from flights
  const yearSet = new Set<string>();
  flights.forEach((f) => {
    if (f.date) {
      const year = f.date.substring(0, 4);
      if (year) yearSet.add(year);
    }
  });

  const allYears = Array.from(yearSet).sort((a, b) => Number(a) - Number(b));
  const filterYears = activeYears && activeYears.length > 0 ? activeYears : allYears;

  // Initialize 12 months structure
  const monthlyData: MonthYearData[] = MONTH_NAMES_PT.map((m, idx) => {
    const monthObj: MonthYearData = {
      monthIndex: idx,
      monthName: m.full,
      monthShort: m.short,
      total: 0,
    };
    allYears.forEach((y) => {
      monthObj[y] = 0;
    });
    return monthObj;
  });

  // Aggregate flights
  flights.forEach((f) => {
    if (!f.date) return;
    const parts = f.date.split('-');
    if (parts.length < 2) return;
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1; // 0-indexed

    if (monthIdx >= 0 && monthIdx < 12) {
      if (filterYears.includes(year)) {
        monthlyData[monthIdx][year] = ((monthlyData[monthIdx][year] as number) || 0) + 1;
        monthlyData[monthIdx].total += 1;
      }
    }
  });

  return { monthlyData, allYears };
}

// Compute Specific Models Stat
export function computeSpecificModelStats(flights: Flight[]): SpecificModelStat[] {
  const total = flights.length || 1;
  const map = new Map<
    string,
    {
      rawName: string;
      manufacturer: string;
      count: number;
      registrations: Set<string>;
      airlines: Set<string>;
    }
  >();

  flights.forEach((f) => {
    const { cleanName, manufacturer } = cleanSpecificModel(f.aircraft);
    if (!map.has(cleanName)) {
      map.set(cleanName, {
        rawName: f.aircraft,
        manufacturer,
        count: 0,
        registrations: new Set<string>(),
        airlines: new Set<string>(),
      });
    }
    const item = map.get(cleanName)!;
    item.count += 1;
    if (f.registration) item.registrations.add(f.registration);
    if (f.airline) {
      // Clean airline name e.g. "Azul Brazilian Airlines (AD/AZU)" -> "Azul"
      const cleanAirline = f.airline.split('(')[0].trim();
      item.airlines.add(cleanAirline);
    }
  });

  const result: SpecificModelStat[] = [];
  map.forEach((value, key) => {
    result.push({
      modelName: key,
      rawName: value.rawName,
      manufacturer: value.manufacturer,
      count: value.count,
      percentage: Number(((value.count / total) * 100).toFixed(1)),
      registrations: Array.from(value.registrations),
      airlines: Array.from(value.airlines),
    });
  });

  return result.sort((a, b) => b.count - a.count);
}

// Compute Grouped Models Stat
export function computeGroupedModelStats(flights: Flight[]): GroupedModelStat[] {
  const total = flights.length || 1;
  const map = new Map<
    string,
    {
      description: string;
      manufacturer: string;
      count: number;
      subModelCounts: Map<string, number>;
    }
  >();

  flights.forEach((f) => {
    const { cleanName } = cleanSpecificModel(f.aircraft);
    const { familyName, description, manufacturer } = getGroupedFamily(cleanName);

    if (!map.has(familyName)) {
      map.set(familyName, {
        description,
        manufacturer,
        count: 0,
        subModelCounts: new Map<string, number>(),
      });
    }

    const item = map.get(familyName)!;
    item.count += 1;
    item.subModelCounts.set(cleanName, (item.subModelCounts.get(cleanName) || 0) + 1);
  });

  const result: GroupedModelStat[] = [];
  map.forEach((value, key) => {
    const subModels: { name: string; count: number }[] = [];
    value.subModelCounts.forEach((cnt, name) => {
      subModels.push({ name, count: cnt });
    });
    subModels.sort((a, b) => b.count - a.count);

    result.push({
      familyGroup: key,
      description: value.description,
      manufacturer: value.manufacturer,
      count: value.count,
      percentage: Number(((value.count / total) * 100).toFixed(1)),
      subModels,
    });
  });

  return result.sort((a, b) => b.count - a.count);
}

// Compute Manufacturer Stats
export function computeManufacturerStats(flights: Flight[]): ManufacturerStat[] {
  const total = flights.length || 1;
  const map = new Map<
    string,
    {
      count: number;
      modelCounts: Map<string, number>;
    }
  >();

  flights.forEach((f) => {
    const { cleanName, manufacturer } = cleanSpecificModel(f.aircraft);

    if (!map.has(manufacturer)) {
      map.set(manufacturer, {
        count: 0,
        modelCounts: new Map<string, number>(),
      });
    }

    const item = map.get(manufacturer)!;
    item.count += 1;
    item.modelCounts.set(cleanName, (item.modelCounts.get(cleanName) || 0) + 1);
  });

  const result: ManufacturerStat[] = [];
  map.forEach((value, key) => {
    let topModel = 'N/A';
    let maxCnt = 0;
    value.modelCounts.forEach((cnt, mName) => {
      if (cnt > maxCnt) {
        maxCnt = cnt;
        topModel = mName;
      }
    });

    result.push({
      name: key,
      count: value.count,
      percentage: Number(((value.count / total) * 100).toFixed(1)),
      topModel,
    });
  });

  return result.sort((a, b) => b.count - a.count);
}

// Parse duration "HH:MM:SS" to total minutes
export function parseDurationMinutes(durationStr: string): number {
  if (!durationStr) return 0;
  const parts = durationStr.split(':');
  if (parts.length < 2) return 0;
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

// Format minutes to "Xh Ym"
export function formatTotalHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}
