import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FlightRadarModule } from "../modules/flight-radar/flight-radar.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlightRadarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
