import { FlightRadarAircraftData } from "../model/flight-radar";

export interface FlightRadarAircraftAnalysisTag {
  readonly analyzer: string;
  readonly reason: string;
}

export interface FlightRadarAircraftAnalyzer {
  readonly identifier: string;
  readonly description: string;
  evaluate(plane: FlightRadarAircraftData): FlightRadarAircraftAnalysisTag | null;
}

export abstract class FlightRadarAircraftAnalyzerBase implements FlightRadarAircraftAnalyzer {
  protected _identifier: string;

  public get identifier(): string {
    return this._identifier;
  }

  protected _description: string;

  public get description(): string {
    return this._description;
  }

  constructor(
    identifier: string,
    description: string
  ) {
    this._identifier = identifier;
    this._description = description;
  }

  public abstract evaluate(plane: FlightRadarAircraftData): FlightRadarAircraftAnalysisTag | null;
}

export class FlightRadarHighAltitudeAircraftAnalyzer extends FlightRadarAircraftAnalyzerBase {
  public readonly minAltitude: number;

  constructor(minAltitude: number) {
    const description = `Find aircrafts with altitude superior to ${minAltitude} feet`;
    super("FlightRadarHighAltitudeAircraftAnalyzer", description);
    this.minAltitude = minAltitude;
  }

  public evaluate(plane: FlightRadarAircraftData): FlightRadarAircraftAnalysisTag | null {
    if (!plane) {
      return null;
    }

    if (plane.altitude >= this.minAltitude) {
      return {
        analyzer: this._identifier,
        reason: `Plane is flying at ${plane.altitude} feet`
      };
    }

    return null;
  }
}

export class FlightRadarHighSpeedAircraftAnalyzer extends FlightRadarAircraftAnalyzerBase {
  public readonly minSpeed: number;

  constructor(minSpeed: number) {
    const description = `Find aircrafts with speed superior to ${minSpeed} knots`;
    super("FlightRadarHighSpeedAircraftAnalyzer", description);
    this.minSpeed = minSpeed;
  }

  public evaluate(plane: FlightRadarAircraftData): FlightRadarAircraftAnalysisTag | null {
    if (!plane) {
      return null;
    }

    if (plane.groundSpeed >= this.minSpeed) {
      return {
        analyzer: this._identifier,
        reason: `Plane is flying at ${plane.groundSpeed} knots`
      };
    }

    return null;
  }
}

export class FlightRadarTrackAnomalyAircraftAnalyzer extends FlightRadarAircraftAnalyzerBase {
  constructor() {
    const description = `Find aircrafts with no callsign`;
    super("FlightRadarTrackAnomalyAircraftAnalyzer", description);
  }

  public evaluate(plane: FlightRadarAircraftData): FlightRadarAircraftAnalysisTag | null {
    if (!plane) {
      return null;
    }

    if (plane.airline.trim() === "" && plane.aircraftType?.trim() !== "GRND") {
      return {
        analyzer: this._identifier,
        reason: "Plane has no airline"
      };
    }

    if (plane.callsign.trim() === "" && plane.airline.trim() === "" && plane.aircraftType?.trim() !== "GRND") {
      return {
        analyzer: this._identifier,
        reason: "Plane has no callsign"
      };
    }

    if (plane.aircraftType.trim() === "") {
      return {
        analyzer: this._identifier,
        reason: "Plane has no aircraft type"
      };
    }

    return null;
  }
}

export class FlightRadarTypeAircraftAnalyzer extends FlightRadarAircraftAnalyzerBase {
  public readonly aircraftTypes: Set<string>

  constructor(aircraftTypes: Set<string>) {
    const description = `Find aircrafts matching a specific list of ICAO aircraft types`;
    super("FlightRadarTypeAircraftAnalyzer", description);
    this.aircraftTypes = aircraftTypes;
  }

  public evaluate(plane: FlightRadarAircraftData): FlightRadarAircraftAnalysisTag | null {
    if (!plane) {
      return null;
    }

    if (this.aircraftTypes.has(plane.aircraftType)) {
      return {
        analyzer: this._identifier,
        reason: `Plane is of aircraft type '${plane.aircraftType}'`
      };
    }

    return null;
  }
}

export class FlightRadarAirlineAircraftAnalyzer extends FlightRadarAircraftAnalyzerBase {
  public readonly airlines: Set<string>

  constructor(aircraftTypes: Set<string>) {
    const description = `Find aircrafts matching a specific list of ICAO airline codes`;
    super("FlightRadarAirlineAircraftAnalyzer", description);
    this.airlines = aircraftTypes;
  }

  public evaluate(plane: FlightRadarAircraftData): FlightRadarAircraftAnalysisTag | null {
    if (!plane) {
      return null;
    }

    if (this.airlines.has(plane.airline)) {
      return {
        analyzer: this._identifier,
        reason: `Plane is operated by airline '${plane.airline}'`
      };
    }

    return null;
  }
}
