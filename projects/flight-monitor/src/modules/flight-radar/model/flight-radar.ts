export interface FlightRadarAircraftData {
  trackId: string;
  icao24: string;
  latitude: number;
  longitude: number;
  track: number;
  altitude: number;
  groundSpeed: number;
  squawk: string;
  sensor: string;
  aircraftType: string;
  registration: string;
  positionEpoch: number;
  departure: string;
  arrival: string;
  flight: string;
  onGround: boolean;
  verticalRate: number;
  callsign: string;
  unknown: number;
  airline: string;
}

export interface FlightRadarStatsBlock {
  adsb: number;
  mlat: number;
  faa: number;
  flarm: number;
  estimated: number;
  satellite: number;
  uat: number;
  other: number;
}

export interface FlightRadarStats {
  total: FlightRadarStatsBlock;
  visible: FlightRadarStatsBlock;
}

export interface FlightRadarQueryResponse {
  fullCount: number;
  version: number;
  planes: FlightRadarAircraftData[];
  stats?: FlightRadarStats;
}
