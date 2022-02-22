import { AfterViewInit, Component } from "@angular/core";
import {Deck} from "@deck.gl/core";

import { BoundingBox } from "../../../shared/model/map";

@Component({
  selector: "app-map-view",
  templateUrl: "./map-view.component.html",
  styleUrls: ["./map-view.component.scss"]
})
export class MapViewComponent implements AfterViewInit {
  private readonly INITIAL_VIEW_STATE = {
    latitude: 0,
    longitude: 0,
    zoom: 1
  };

  private _deck: Deck | null;

  public get deck(): Deck | null {
    return this._deck;
  }

  public ngAfterViewInit(): void {
      this._createMap();
  }

  public render(): void {
    this._render();
  }

  private _createMap(): void {
    this._deck = new Deck({
      canvas: "deck-canvas",
      width: "100%",
      height: "100%",
      initialViewState: this.INITIAL_VIEW_STATE,
      controller: true,
      onViewStateChange: ({viewState}) => {
        // Do stuff

      }
    });

    this._render();
  }

  private _render(): void {
    // Do stuff
  }
}
