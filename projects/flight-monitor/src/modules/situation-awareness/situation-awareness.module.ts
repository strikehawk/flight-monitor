import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SituationAwarenessComponent } from "./components/situation-awareness/situation-awareness.component";
import { MapModule } from "../map/map.module";
import { SharedModule } from "../shared/shared.module";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [
    SituationAwarenessComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MapModule
  ],
  exports: [
    SituationAwarenessComponent
  ]
})
export class SituationAwarenessModule { }
