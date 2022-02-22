import { Component } from "@angular/core";
import { BoundingBox } from "../../../shared/model/map";
import { FlightRadarQueryResponse } from "../../../flight-radar/model/flight-radar";
import { FlightRadarAnalyzerService } from "../../../flight-radar/services/flight-radar-analyzer.service";
import { FlightRadarService, QueryOptions } from "../../../flight-radar/services/flight-radar.service";

@Component({
  selector: "app-situation-awareness",
  templateUrl: "./situation-awareness.component.html",
  styleUrls: ["./situation-awareness.component.scss"]
})
export class SituationAwarenessComponent {

  constructor(
    private flightRadarService: FlightRadarService,
    private flightRadarAnalyzerService: FlightRadarAnalyzerService
  ) { }

  public async getResults(): Promise<void> {
    const bbox: BoundingBox = [19.866, 45.87, 40.959, 52.58];
    const queryOpts: QueryOptions = {
      bbox
    };

    const results = await this.flightRadarService.query(queryOpts);
    this._findAnomalies(results);
  }

  private _findAnomalies(response: FlightRadarQueryResponse): void {
    const analysis = this.flightRadarAnalyzerService.analyze(response);
    console.log(analysis);
  }
}
