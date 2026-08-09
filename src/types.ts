export interface Flight {
  id: string;
  date: string; // YYYY-MM-DD
  flightNumber: string;
  from: string;
  to: string;
  depTime: string;
  arrTime: string;
  duration: string; // HH:MM:SS
  airline: string;
  aircraft: string;
  registration: string;
  seatNumber: string;
  seatType: string;
  flightClass: string;
  flightReason: string;
  note: string;
  depId?: string;
  arrId?: string;
  airlineId?: string;
  aircraftId?: string;
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
}

export interface ManufacturerStat {
  name: string; // e.g. "Embraer", "Airbus", "ATR", "Boeing"
  count: number;
  percentage: number;
  topModel: string;
}
