import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";

import { AircraftTooltipComponent } from "./components/aircraft-tooltip/aircraft-tooltip.component";
import { SharedModule } from "../shared/shared.module";



@NgModule({
  declarations: [
    AircraftTooltipComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule
  ]
})
export class FlightRadarModule { }
