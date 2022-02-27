import { Viewport as DeckViewport } from "@deck.gl/core";
import { BoundingBox } from "../../shared/model/map";

export type ViewStateChangeArgs = {
  viewState: ViewState;
  interactionState: {
    inTransition?: boolean;
    isDragging?: boolean;
    isPanning?: boolean;
    isRotating?: boolean;
    isZooming?: boolean;
  };
  oldViewState: ViewState;
};

export type Viewport = DeckViewport & {
  getBounds(): BoundingBox;
};

export type ViewState = any;
