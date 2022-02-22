import { Injectable } from "@angular/core";
import { FlightRadarAircraftData, FlightRadarQueryResponse } from "../model/flight-radar";
import { FlightRadarHighAltitudeAircraftAnalyzer, FlightRadarAircraftAnalyzer, FlightRadarAircraftAnalysisTag, FlightRadarHighSpeedAircraftAnalyzer, FlightRadarTypeAircraftAnalyzer, FlightRadarAirlineAircraftAnalyzer, FlightRadarTrackAnomalyAircraftAnalyzer } from "./analyzers";

import aircraftTypesList from "../../../../../../samples/monitored-aircraft-types.json";
import airlinesList from "../../../../../../samples/monitored-airlines.json";

export interface FlightRadarAircraftAnalysis {
  plane: FlightRadarAircraftData;
  tags: FlightRadarAircraftAnalysisTag[];
}

@Injectable({
  providedIn: "root"
})
export class FlightRadarAnalyzerService {

  private _analyzers: ReadonlyArray<FlightRadarAircraftAnalyzer>;

  public get analyzers(): ReadonlyArray<FlightRadarAircraftAnalyzer> {
    return this._analyzers;
  }

  constructor() {
    this._analyzers = this._getAnalyzers();
  }

  public analyze(response: FlightRadarQueryResponse): Map<string, FlightRadarAircraftAnalysis> {
    const result = new Map<string, FlightRadarAircraftAnalysis>();

    let analysis: FlightRadarAircraftAnalysis | null;
    for (const plane of response.planes) {
      analysis = this.analyzePlane(plane);
      if (!analysis) {
        continue;
      }

      if (analysis.tags.length === 0) {
        continue;
      }

      result.set(plane.trackId, analysis);
    }

    return result;
  }

  public analyzePlane(plane: FlightRadarAircraftData): FlightRadarAircraftAnalysis | null {
    const analysis: FlightRadarAircraftAnalysis = {
      plane: plane,
      tags: []
    };

    let tag: FlightRadarAircraftAnalysisTag | null;
    for (const analyzer of this._analyzers) {
      tag = analyzer.evaluate(plane);
      if (tag) {
        analysis.tags.push(tag);
      }
    }

    return analysis.tags.length === 0 ? null : analysis;
  }

  private _getAnalyzers(): FlightRadarAircraftAnalyzer[] {
    return [
      new FlightRadarTrackAnomalyAircraftAnalyzer(),
      new FlightRadarHighAltitudeAircraftAnalyzer(45000),
      new FlightRadarHighSpeedAircraftAnalyzer(530),
      new FlightRadarTypeAircraftAnalyzer(new Set(aircraftTypesList)),
      new FlightRadarAirlineAircraftAnalyzer(new Set(airlinesList)),
    ];
  }
}
