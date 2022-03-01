import { Type, ViewContainerRef } from "@angular/core";
import { Layer } from "@deck.gl/core";
import { PickInfo } from "@deck.gl/core/lib/deck";
import { LayerProps } from "@deck.gl/core/lib/layer";
import { TileLayer } from "@deck.gl/geo-layers";
import { AircraftTooltipComponent } from "../../flight-radar/components/aircraft-tooltip/aircraft-tooltip.component";
import { AircraftTypePack, FlightRadarLayer } from "../../flight-radar/map/flight-radar.layer";
import { FlightRadarAircraftData } from "../../flight-radar/model/flight-radar";
import { AircraftTypeData, AircraftTypeService } from "../../flight-radar/services/aircraft-type.service";
import { MapViewComponent } from "../../map/components/map-view/map-view.component";
import { OsmLayer } from "../../map/layers/osm-layer";

export class MapContentProvider {
  private _mapViewComponent: MapViewComponent;

  public get mapViewComponent(): MapViewComponent {
    return this._mapViewComponent;
  }

  public set mapViewComponent(value: MapViewComponent) {
    const forceUpdate = !!value && value !== this._mapViewComponent && value.isReady;

    this._mapViewComponent = value;

    if (forceUpdate) {
      this._forceUpdate();
    }
  }

  private _viewContainerRef: ViewContainerRef;

  public get viewContainerRef(): ViewContainerRef {
    return this._viewContainerRef;
  }

  public set viewContainerRef(value: ViewContainerRef) {
    this._viewContainerRef = value;
  }

  /* global window */
  public readonly devicePixelRatio = (typeof window !== "undefined" && window.devicePixelRatio) || 1;

  private _data?: FlightRadarAircraftData[];
  private _aircraftPacks: Map<string, AircraftTypePack>;
  private _defautAircraftType: AircraftTypeData;

  constructor(
    private aircraftTypeService: AircraftTypeService
  ) {
    this._defautAircraftType = aircraftTypeService.aircraftTypes.get("A320") as AircraftTypeData;
  }

  public getLayers(): Layer<any, LayerProps<any>>[] {
    const layers: Layer<any, LayerProps<any>>[] = [
      this._createOSMLayer(),
    ];

    if (this._data) {
      layers.push(this._createAircraftsLayer(
        this._aircraftPacks,
        this._data
      ));
    }

    return layers;
  }

  public getTooltip(info: PickInfo<any>): null | string | { text?: string, html?: string, className?: string, style?: any } {
    if (info.object && info.layer.id === "flightRadar") {
      // return {
      //   html: `<div style="font-weight: bold;font-size: 12px;">${info.object.callsign}</div><div>${info.object.aircraftType}</div>`,
      //   style: {
      //     fontSize: "10px",
      //     fontFamily: "Verdana",
      //     padding: "4px"
      //   }
      // };
      return this._getAircraftTooltip(info.object);
    }

    return null;
  }

  public setAircraftData(data?: FlightRadarAircraftData[]): void {
    // split aircrafts by types
    this._data = [];
    this._aircraftPacks = new Map<string, AircraftTypePack>();

    if (data) {
      for (const a of data) {
        if (a.aircraftType === "GRND") {
          continue;
        }

        let pack: AircraftTypePack | undefined;
        let aircraftTypeData: AircraftTypeData | undefined;

        // get pack
        pack = this._aircraftPacks.get(a.aircraftType);
        if (!pack) {
          aircraftTypeData = this.aircraftTypeService.aircraftTypes.get(a.aircraftType);

          if (!aircraftTypeData) {
            console.log(`Unknown aircraft type '${a.aircraftType}'`);
          }

          pack = {
            id: a.aircraftType,
            mesh: "assets/meshes/" + (aircraftTypeData ? aircraftTypeData.filename : this._defautAircraftType.filename),
            hasDefaultMesh: !aircraftTypeData,
            realSize: aircraftTypeData ? aircraftTypeData.size : this._defautAircraftType.size,
            data: []
          }

          this._aircraftPacks.set(pack.id, pack);
        }

        pack.data.push(a);
        this._data.push(a);
      }
    }

    // update viewport
    this._forceUpdate();
  }

  private _forceUpdate(): void {
    if (!this._mapViewComponent) {
      return;
    }

    this._mapViewComponent.render();
  }

  private _createOSMLayer(): TileLayer<any> {
    return new OsmLayer();
  }

  private _createAircraftsLayer(
    aircraftPacks: Map<string, AircraftTypePack>,
    data: FlightRadarAircraftData[]
  ): FlightRadarLayer {
    return new FlightRadarLayer({
      id: "flightRadar",
      aircraftPacks: aircraftPacks,
      data: data,
      pickable: true
    });
  }

  private _getAircraftTooltip(aircraft: FlightRadarAircraftData): null | string | { text?: string, html?: string, className?: string, style?: any } {
    if (!this._viewContainerRef) {
      return null;
    }

    this.viewContainerRef.clear();
    const componentRef = this._viewContainerRef.createComponent<AircraftTooltipComponent>(AircraftTooltipComponent);
    componentRef.instance.aircraft = aircraft;
    componentRef.changeDetectorRef.detectChanges();

    return {
      html: componentRef.location.nativeElement.outerHTML
    };
  }
}
