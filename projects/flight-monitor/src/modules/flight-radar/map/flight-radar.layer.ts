import Layer, { LayerProps, UpdateStateInfo } from "@deck.gl/core/lib/layer";
import { CompositeLayer } from "@deck.gl/core";
import { IconLayer, LineLayer } from "@deck.gl/layers";
import { IconMapping } from "@deck.gl/layers/icon-layer/icon-layer";
import { Texture2D } from "@luma.gl/core";
import { Viewport } from "../../map/types/deck.gl";

import { BoundingBox } from "../../shared/model/map";
import { FlightRadarAircraftData } from "../model/flight-radar";
import { getMetersPerPixel } from "../../map/utils/geo-utils";
import { MultiSimpleMeshLayer, MultiSimpleMeshLayerProps } from "./multi-simple-mesh.layer";

export interface AircraftTypePack {
  /**
   * ICAO aircraft type designator
   */
  id: string;

  /**
   * Associated mesh filename, if any
   */
  mesh: string;

  hasDefaultMesh: boolean;

  /**
   * Real size of the aircraft, in meters.
   */
  realSize: number;

  data: FlightRadarAircraftData[];
}

export interface FlightRadarLayerProps extends LayerProps<FlightRadarAircraftData> {
  aircraftPacks: Map<string, AircraftTypePack>;
  data: FlightRadarAircraftData[];
  iconAtlas?: Texture2D | string;
  iconMapping?: IconMapping;
}

interface FlightRadarLayerState {
  aircraftPacks: Map<string, AircraftTypePack>;
  data: FlightRadarAircraftData[];
  zoom: number;
}

export class FlightRadarLayer extends CompositeLayer<FlightRadarAircraftData, FlightRadarLayerProps> {
  constructor(props: FlightRadarLayerProps) {
    if (!props.iconAtlas || !props.iconMapping) {
      FlightRadarLayer._setSpriteSheet(props);
    }

    super(props);
  }

  public override initializeState(params?: any): void {
    super.initializeState(params);
    const bounds = (params.viewport as Viewport).getBounds();
    const state: FlightRadarLayerState = this._getState(this.props, bounds, params.viewport.zoom);

    this.setState(state);
  }

  public override shouldUpdateState({ changeFlags }: UpdateStateInfo<FlightRadarLayerProps>) {
    if (changeFlags.propsOrDataChanged) {
      return true;
    }

    if (changeFlags.viewportChanged) {
      return true;
    }
  }

  public override updateState({ oldProps, props, context, changeFlags, }: UpdateStateInfo<FlightRadarLayerProps>): void {
    super.updateState({ oldProps, props, context, changeFlags, });

    if (changeFlags.viewportChanged) {
      const bounds = (context.viewport as Viewport).getBounds();
      const state: FlightRadarLayerState = this._getState(props, bounds, context.viewport.zoom);

      this.setState(state);
    }
  }

  public override renderLayers(): Layer<FlightRadarAircraftData>[] {
    const state: FlightRadarLayerState = this.state as FlightRadarLayerState;

    return [
      // the icons
      // this._getAircraftIconLayer(this.props, state)
      this._getAircraftMeshLayer(this.props, state),
      this._getLeaderLineLayer(this.props, state)
    ];
  }

  private _getState(props: FlightRadarLayerProps, bounds: BoundingBox, zoom: number): FlightRadarLayerState {
    const state: FlightRadarLayerState = Object.assign(this.state, {
      aircraftPacks: props.aircraftPacks,
      data: props.data,
      zoom: zoom
    });

    return state;
  }

  private static _setSpriteSheet(props: FlightRadarLayerProps): void {
    props.iconAtlas = "assets/img/plane.png";
    props.iconMapping = {
      plane: { x: 0, y: 0, width: 62, height: 68, mask: false }
    };
  }

  private _getAircraftIconLayer(props: FlightRadarLayerProps, state: FlightRadarLayerState): IconLayer<FlightRadarAircraftData> {
    return new IconLayer<FlightRadarAircraftData>(this.getSubLayerProps<FlightRadarAircraftData>({
      // `getSubLayerProps` will concat the parent layer id with this id
      id: "icon",
      data: state.data,

      iconAtlas: props.iconAtlas,
      iconMapping: props.iconMapping,
      billboard: false,

      getPosition: d => {
        return [d.longitude, d.latitude, d.altitude / 0.33];
      },
      getIcon: () => "plane",
      getSize: 30,
      getColor: [0, 0, 0],
      getAngle: d => d.track
    }));
  }

  private _getAircraftMeshLayer(props: FlightRadarLayerProps, state: FlightRadarLayerState): MultiSimpleMeshLayer<FlightRadarAircraftData> {
    const layerProps: MultiSimpleMeshLayerProps<FlightRadarAircraftData> = {
      // `getSubLayerProps` will concat the parent layer id with this id
      id: "meshes",
      packs: state.aircraftPacks,
      data: state.data,
      showLeaderLine: true,
      getSizeScale: this._getSizeScale,
      getPosition: d => [d.longitude, d.latitude, d.altitude / 0.33],
      getGroundPosition: d => [d.longitude, d.latitude, 0],
      getColor: (data, defaultMesh) => this._getAircraftColor(data, defaultMesh),
      getOrientation: d => [0, 360 - d.track, 90]
    };

    return new MultiSimpleMeshLayer<FlightRadarAircraftData>(
      this.getSubLayerProps<FlightRadarAircraftData>(layerProps) as MultiSimpleMeshLayerProps<FlightRadarAircraftData>
    );
  }

  private _getLeaderLineLayer(props: FlightRadarLayerProps, state: FlightRadarLayerState): LineLayer<FlightRadarAircraftData> {
    return new LineLayer<FlightRadarAircraftData>(this.getSubLayerProps<FlightRadarAircraftData>({
      id: "leader-line",
      data: state.data,

      getWidth: 1,
      getSourcePosition: d => {
        return [d.longitude, d.latitude, 0];
      },
      getTargetPosition: d => {
        return [d.longitude, d.latitude, d.altitude / 0.33];
      },
      getColor: [0, 0, 0, 80]
    }));
  }

  private _getSizeScale(zoom: number, realSize: number): number {
    const PIXEL_SIZE = 50; // desired pixel size
    const BASE_SIZE_FACTOR = 0.0005;

    const metersPerPixel = getMetersPerPixel(zoom);
    const targetMeterSize = metersPerPixel * PIXEL_SIZE;
    const sizeFactorModifier = targetMeterSize / realSize;

    const sizeScale = BASE_SIZE_FACTOR * sizeFactorModifier;
    return sizeScale;
  }

  private _getAircraftColor(o: FlightRadarAircraftData, defaultMesh: boolean): [number, number, number, number] {
    if (!o) {
      return [0, 0, 0, 0];
    }

    if (defaultMesh) {
      const grayLevel = 200;
      return [grayLevel, grayLevel, grayLevel, 255];
    }

    if (o.onGround) {
      const grayLevel = 150;
      return [grayLevel, grayLevel, grayLevel, 255];
    }

    return [0, 255, 0, 255];
  }
}


FlightRadarLayer.layerName = "FlightRadarLayer";
FlightRadarLayer.defaultProps = {}
