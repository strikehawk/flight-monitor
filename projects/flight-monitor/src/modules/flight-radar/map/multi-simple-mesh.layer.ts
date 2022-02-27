import Layer, { LayerProps, UpdateStateInfo } from "@deck.gl/core/lib/layer";
import { CompositeLayer } from "@deck.gl/core";
import { LineLayer } from "@deck.gl/layers";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { SimpleMeshLayerProps } from "@deck.gl/mesh-layers/simple-mesh-layer/simple-mesh-layer";
import { OBJLoader } from "@loaders.gl/obj";
import { Viewport } from "../../map/types/deck.gl";

import { BoundingBox } from "../../shared/model/map";

export interface MeshLayerData<D> {
  id: string;
  mesh: string;
  hasDefaultMesh: boolean;
  realSize: number;
  data: D[];
}

export interface MultiSimpleMeshLayerProps<D> extends LayerProps<D> {
  packs: Map<string, MeshLayerData<D>>;
  data: D[];
  showLeaderLine?: boolean;
  getPosition: (d: D) => [number, number, number],
  getGroundPosition: (d: D) => [number, number, number],
  getOrientation: (d: D) => [number, number, number],
  getColor: (d: D, defaultMesh: boolean) => [number, number, number, number],
  getSizeScale: (zoom: number, realSize: number) => number;
}

interface MultiSimpleMeshLayerState<D> {
  packs: Map<string, MeshLayerData<D>>;
  data: D[];
  showLeaderLine: boolean;
  zoom: number;
}

export class MultiSimpleMeshLayer<D> extends CompositeLayer<D, MultiSimpleMeshLayerProps<D>> {
  constructor(props: MultiSimpleMeshLayerProps<D>) {
    super(props);
  }

  public override initializeState(params?: any): void {
    super.initializeState(params);
    const bounds = (params.viewport as Viewport).getBounds();
    const state: MultiSimpleMeshLayerState<D> = this._getState(this.props, bounds, params.viewport.zoom);

    this.setState(state);
  }

  public override shouldUpdateState({ changeFlags }: UpdateStateInfo<MultiSimpleMeshLayerProps<D>>) {
    if (changeFlags.propsOrDataChanged) {
      return true;
    }
  }

  public override updateState({ oldProps, props, context, changeFlags, }: UpdateStateInfo<MultiSimpleMeshLayerProps<D>>): void {
    super.updateState({ oldProps, props, context, changeFlags, });

    if (changeFlags.viewportChanged) {
      const bounds = (context.viewport as Viewport).getBounds();
      const state: MultiSimpleMeshLayerState<D> = this._getState(props, bounds, context.viewport.zoom);

      this.setState(state);
    }
  }

  public override renderLayers(): Layer<D>[] {
    const state: MultiSimpleMeshLayerState<D> = this.state as MultiSimpleMeshLayerState<D>;

    const layers: Layer<D>[] = [];

    let meshLayer: SimpleMeshLayer<D>
    for (const pack of state.packs.values()) {
      meshLayer = this._getMeshLayer(this.props, pack, state);
      layers.push(meshLayer);
    }

    if (state.showLeaderLine) {
      layers.push(this._getLeaderLineLayer(this.props, state));
    }

    return layers;
  }

  private _getState(props: MultiSimpleMeshLayerProps<D>, bounds: BoundingBox, zoom: number): MultiSimpleMeshLayerState<D> {
    const state: MultiSimpleMeshLayerState<D> = Object.assign(this.state, {
      packs: props.packs,
      data: props.data,
      showLeaderLine: !!props.showLeaderLine,
      zoom: zoom
    });

    return state;
  }

  private _getMeshLayer(props: MultiSimpleMeshLayerProps<D>, pack: MeshLayerData<D>, state: MultiSimpleMeshLayerState<D>): SimpleMeshLayer<D> {
    return new SimpleMeshLayer<D>(this.getSubLayerProps<D>({
      // `getSubLayerProps` will concat the parent layer id with this id
      id: pack.id,
      data: pack.data,
      pickable: true,
      autoHighlight: true,
      highlightColor: [100, 70, 9, 255],

      mesh: pack.mesh,
      loaders: [OBJLoader],
      sizeScale: props.getSizeScale(state.zoom, pack.realSize),
      getPosition: props.getPosition,
      getColor: d => props.getColor(d, pack.hasDefaultMesh),
      getOrientation: props.getOrientation
    }) as SimpleMeshLayerProps<D>);
  }

  private _getLeaderLineLayer(props: MultiSimpleMeshLayerProps<D>, state: MultiSimpleMeshLayerState<D>): LineLayer<D> {
    return new LineLayer<D>(this.getSubLayerProps<D>({
      id: "leader-line",
      data: state.data,

      getWidth: 1,
      getSourcePosition: props.getGroundPosition,
      getTargetPosition: props.getPosition,
      getColor: [0, 0, 0, 80]
    }));
  }
}


MultiSimpleMeshLayer.layerName = "MultiSimpleMeshLayer";
MultiSimpleMeshLayer.defaultProps = {}
