export interface AircraftType {
  modelFullName: string;
  description: string;
  wtc: string;
  wtg: string;
  designator: string;
  manufacturerCode: string;
  aircraftDescription: string;
  engineCount: string;
  engineType: string;
}

export interface Airline {
  icao: string;
  name: string;
  callsign: string;
  country: string;
  isoAlpha3: string;
}
