import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { BoundingBox } from "../../../shared/model/map";
import { FlightRadarQueryResponse } from "../../../flight-radar/model/flight-radar";
import { FlightRadarAnalyzerService } from "../../../flight-radar/services/flight-radar-analyzer.service";
import { FlightRadarService, QueryOptions } from "../../../flight-radar/services/flight-radar.service";
import { MapViewComponent } from "../../../map/components/map-view/map-view.component";
import { debounceTime, Subscription } from "rxjs";

import { MapContentProvider } from "../../model/map-content.provider";
import { AircraftTypeService } from "../../../flight-radar/services/aircraft-type.service";

@Component({
  selector: "app-situation-awareness",
  templateUrl: "./situation-awareness.component.html",
  styleUrls: ["./situation-awareness.component.scss"]
})
export class SituationAwarenessComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MapViewComponent)
  public mapView: MapViewComponent;

  public readonly mapContentProvider: MapContentProvider;

  private _lastBbox: BoundingBox;

  private _viewExtentChangedSub?: Subscription;

  constructor(
    private flightRadarService: FlightRadarService,
    private flightRadarAnalyzerService: FlightRadarAnalyzerService,
    aircraftTypeService: AircraftTypeService
  ) {
    this.mapContentProvider = new MapContentProvider(aircraftTypeService);
   }

  public ngAfterViewInit(): void {
    if (!this.mapView) {
      return;
    }

    this._viewExtentChangedSub = this.mapView.$extentChangedThrottled.pipe(
      debounceTime(2000)
    ).subscribe(o => this._onExtentChanged(o));
    this._onExtentChanged(this.mapView.extent);
  }

  public ngOnDestroy(): void {
    this._removeSubscriptions();
  }

  public async getResults(): Promise<void> {
    if (!this._lastBbox) {
      return;
    }

    this._onExtentChanged(this._lastBbox);
  }

  private _findAnomalies(response: FlightRadarQueryResponse): void {
    const analysis = this.flightRadarAnalyzerService.analyze(response);
    console.log(analysis);
  }

  private _buildDesignatorList(response: FlightRadarQueryResponse): void {
    const setDesignators = new Set<string>();

    for (const p of response.planes) {
      setDesignators.add(p.aircraftType);
    }

    console.log(Array.from(setDesignators.keys()));
  }

  private async _onExtentChanged(bbox: BoundingBox): Promise<void> {
    this._lastBbox = bbox;
    const queryOpts: QueryOptions = {
      bbox
    };

    const results = await this.flightRadarService.query(queryOpts);
    this._findAnomalies(results);
    // this._buildDesignatorList(results);
    this.mapContentProvider.setAircraftData(results.planes);
  }

  private _removeSubscriptions(): void {
    if (this._viewExtentChangedSub) {
      this._viewExtentChangedSub.unsubscribe();
      this._viewExtentChangedSub = undefined;
    }
  }
}
