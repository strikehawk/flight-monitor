import { Layer } from "@deck.gl/core";
import { LayerProps } from "@deck.gl/core/lib/layer";
import { TileLayer } from "@deck.gl/geo-layers";
import { TileLayerProps } from "@deck.gl/geo-layers/tile-layer/tile-layer";
import { BitmapLayer } from "@deck.gl/layers";

export class OsmLayer extends TileLayer<any> {
  constructor() {
    super(OsmLayer._createTileLayerProps())
  }

  private static _createTileLayerProps(): TileLayerProps<any> {
    return {
      id: "osm-background",
      // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
      data: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],

      // Since these OSM tiles support HTTP/2, we can make many concurrent requests
      // and we aren't limited by the browser to a certain number per domain.
      maxRequests: 20,

      pickable: true,
      autoHighlight: false,
      highlightColor: [60, 60, 60, 40],
      // https://wiki.openstreetmap.org/wiki/Zoom_levels
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      renderSubLayers: (props: any): Layer<any, LayerProps<any>>[] => {
        const {
          bbox: { west, south, east, north }
        } = props.tile;

        const subLayers: Layer<any, LayerProps<any>>[] = [
          new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north]
          })
        ];

        return subLayers;
      }
    }
  }
}
