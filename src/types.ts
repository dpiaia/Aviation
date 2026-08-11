export interface Flight {
  id: string;
  date: string; // YYYY-MM-DD
  flightNumber: string;
  from: string;
  to: string;
  fromIata?: string;
  toIata?: string;
  depTime: string;
  arrTime: string;
  duration: string; // HH:MM:SS
  durationMinutes?: number;
  distanceKm?: number;
  isInternational?: boolean;
  airline: string;
  airlineCode?: string;
  airlineName?: string;
  aircraft: string;
  aircraftFamily?: string;
  manufacturer?: string;
  registration: string;
  aircraftAge?: number;
  seatNumber: string;
  seatType: string;
  flightClass: string;
  flightReason: string;
  rating?: number;
  note?: string;
  notes?: string;
  photos?: string[];
  isPrivate?: boolean;
  createdAt?: string;
  depId?: string;
  arrId?: string;
  airlineId?: string;
  aircraftId?: string;
}

export interface Airport {
  iata: string;
  icao?: string;
  name: string;
  city: string;
  countryCode: string;
  countryName?: string;
  lat: number;
  lng: number;
  timezone?: string;
}

export interface Sticker {
  id: string;
  title: string;
  category: 'aircraft_models' | 'iconic_airports' | 'special_liveries' | 'airlines';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl: string;
  description?: string;
}

export interface BlisterType {
  id: string;
  name: string;
  stickersCount: number;
  coverImageUrl?: string;
  guaranteedRarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface BlisterPack {
  id: string;
  blisterTypeId: string;
  obtainedFromFlightId?: string;
  isOpened: boolean;
  openedAt?: string | null;
  receivedStickers?: string[];
  createdAt: string;
}

export interface UserSticker {
  stickerId: string;
  category: string;
  quantity: number;
  isPasted: boolean;
  firstObtainedAt: string;
}

export interface UserStats {
  totalFlights: number;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  uniqueAirportsCount: number;
  uniqueCountriesCount: number;
  topRegistration?: { reg: string; count: number };
  topAircraftFamily?: { family: string; count: number };
  topManufacturer?: { name: string; count: number };
  topAirline?: { name: string; count: number };
  seatPreference?: { window: number; aisle: number; middle: number };
  longestDomesticFlightKm?: number;
  longestIntlFlightKm?: number;
  monthlyActivity?: Record<string, number>;
  updatedAt?: string;
}

export interface UserProfile {
  username: string; // e.g. "denispiaia"
  name: string;
  email: string;
  avatar?: string;
  isPrivate: boolean; // public or password protected
  password?: string; // required if isPrivate === true
  googleSheetUrl?: string; // sync link
  bio?: string;
}

export interface RegisteredUser {
  id: string;
  uid?: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'email' | 'demo';
  createdAt: string; // ISO or YYYY-MM-DD HH:mm
  lastActive: string;
  flightCount: number;
  role: 'admin' | 'user';
  status: 'active' | 'pending' | 'suspended';
  country?: string;
  isPublic?: boolean;
  shareStats?: boolean;
}

export interface MonthYearData {
  monthIndex: number; // 0..11
  monthName: string;  // Janeiro..Dezembro
  monthShort: string; // Jan..Dez
  total: number;
  [year: string]: number | string; // year line counts e.g. '2024': 5
}

export interface SpecificModelStat {
  modelName: string; // e.g. "Embraer E195-E2"
  rawName: string;   // e.g. "Embraer Embraer E195-E2 (E295)"
  manufacturer: string;
  count: number;
  percentage: number;
  registrations: string[];
  airlines: string[];
}

export interface GroupedModelStat {
  familyGroup: string; // e.g. "Família Embraer E-Jets"
  description: string; // e.g. "E190, ERJ-195, E195-E2"
  manufacturer: string;
  count: number;
  percentage: number;
  subModels: { name: string; count: number }[];
  registrations: string[];
}

export interface ManufacturerStat {
  name: string; // e.g. "Embraer", "Airbus", "ATR", "Boeing"
  count: number;
  percentage: number;
  topModel: string;
  registrations: string[];
}

export interface ColumnMapping {
  date: string;
  flightNumber: string;
  from: string;
  to: string;
  depTime: string;
  arrTime: string;
  duration: string;
  airline: string;
  aircraft: string;
  registration: string;
  seatNumber: string;
  note: string;
}

