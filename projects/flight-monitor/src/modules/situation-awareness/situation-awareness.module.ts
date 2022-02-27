import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SituationAwarenessComponent } from "./components/situation-awareness/situation-awareness.component";
import { MapModule } from "../map/map.module";

@NgModule({
  declarations: [
    SituationAwarenessComponent
  ],
  imports: [
    CommonModule,
    MapModule
  ],
  exports: [
    SituationAwarenessComponent
  ]
})
export class SituationAwarenessModule { }
