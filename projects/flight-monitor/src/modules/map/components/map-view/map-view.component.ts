import { AfterViewInit, Component, Input, OnDestroy } from "@angular/core";
import { Deck, MapView } from "@deck.gl/core";
import ViewState from "@deck.gl/core/controllers/view-state";
import ViewManager from "@deck.gl/core/lib/view-manager";
import { Observable, Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators"

import { BoundingBox } from "../../../shared/model/map";
import { MapContentProvider } from "../../../situation-awareness/model/map-content.provider";
import { Viewport } from "../../types/deck.gl";

export const MAIN_VIEW = "main";

@Component({
  selector: "app-map-view",
  templateUrl: "./map-view.component.html",
  styleUrls: ["./map-view.component.scss"]
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  private _mapContentProvider: MapContentProvider;

  @Input()
  public get mapContentProvider(): MapContentProvider {
    return this._mapContentProvider;
  }

  public set mapContentProvider(value: MapContentProvider) {
    this._mapContentProvider = value;

    if (this._mapContentProvider) {
      this._mapContentProvider.mapViewComponent = this;
    }
  }

  private _isReady = false;

  public get isReady(): boolean {
    return this._isReady;
  }

  private readonly INITIAL_VIEW_STATE = {
    latitude: 49.186,
    longitude: 32.930,
    zoom: 6
  };

  private _deck: Deck | null;
  private _mainViewport: Viewport | null;

  public get deck(): Deck | null {
    return this._deck;
  }

  private _extent: BoundingBox;

  public get extent(): BoundingBox {
    return this._extent;
  }

  private _viewStateChangeSubject: Subject<ViewState> = new Subject<ViewState>();
  public readonly $viewStateChanged: Observable<ViewState> = this._viewStateChangeSubject.asObservable();
  public readonly $viewStateChangedThrottled: Observable<ViewState> = this._viewStateChangeSubject.pipe(
    debounceTime(200)
  );

  private _extentChangedSubject: Subject<BoundingBox> = new Subject<BoundingBox>();
  public readonly $extentChangedThrottled: Observable<BoundingBox> = this._extentChangedSubject.asObservable();

  private _viewStateChangedSub?: Subscription;

  public ngAfterViewInit(): void {
    if (this._mapContentProvider) {
      this._createMap();
      this._createSubscriptions();
      this._isReady = true;
    }
  }

  public ngOnDestroy(): void {
    this._isReady = false;
    this._removeSubscriptions();
  }

  public render(): void {
    this._render();
  }

  private _createMap(): void {
    this._deck = new Deck({
      canvas: "deck-canvas",
      width: "100%",
      height: "100%",
      views: [new MapView({ id: MAIN_VIEW, repeat: true })],
      initialViewState: this.INITIAL_VIEW_STATE,
      controller: true,
      onViewStateChange: (args) => this._viewStateChangeSubject.next(args.viewState)
    });

    const bbox = this._getViewportBounds();
    if (bbox) {
      this._extent = bbox;
      this._extentChangedSubject.next(bbox);
    }

    this._render();
  }

  private _render(): void {
    if (!this._mapContentProvider) {
      return;
    }

    const layers = this._mapContentProvider.getLayers();
    this._deck?.setProps({
      layers,
      getTooltip: info => this._mapContentProvider.getTooltip(info)
    })
  }

  private _getViewportBounds(): BoundingBox | undefined {
    let bbox: BoundingBox | undefined = undefined;

    this._mainViewport = ((this._deck as any).viewManager as ViewManager)?.getViewport(MAIN_VIEW) as Viewport;

    // console.log(viewState);
    if (this._mainViewport) {
      bbox = this._mainViewport.getBounds();
    }

    return bbox;
  }

  private _onViewStateChange(viewState: ViewState): any {
    const bbox = this._getViewportBounds()

    // console.log(viewState);
    if (bbox) {
      this._extentChangedSubject.next(bbox);
    }
  }

  private _createSubscriptions(): void {
    this._viewStateChangedSub = this.$viewStateChangedThrottled.subscribe(viewState => this._onViewStateChange(viewState));
  }

  private _removeSubscriptions(): void {
    if (this._viewStateChangedSub) {
      this._viewStateChangedSub.unsubscribe();
      this._viewStateChangedSub = undefined;
    }
  }
}
