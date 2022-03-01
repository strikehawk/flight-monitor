import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { FlightRadarModule } from "../modules/flight-radar/flight-radar.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app-root/app.component";
import { SituationAwarenessModule } from "../modules/situation-awareness/situation-awareness.module";
import { SharedModule } from "../modules/shared/shared.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    FlightRadarModule,
    SituationAwarenessModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
