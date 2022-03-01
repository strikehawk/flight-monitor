import { Component, Input } from "@angular/core";
import { FlightRadarAircraftData } from "../../model/flight-radar";
import { AircraftType, Airline } from "../../model/general";
import { AircraftTypeService } from "../../services/aircraft-type.service";
import { AirlineService } from "../../services/airline.service";

@Component({
  selector: "app-aircraft-tooltip",
  templateUrl: "./aircraft-tooltip.component.html",
  styleUrls: ["./aircraft-tooltip.component.scss"]
})
export class AircraftTooltipComponent {
  private _aircraft: FlightRadarAircraftData;

  @Input()
  public get aircraft(): FlightRadarAircraftData {
    return this._aircraft;
  }

  public set aircraft(value: FlightRadarAircraftData) {
    this._aircraft = value;

    if (this._aircraft) {
      this.aircraftType = this.aircraftTypeService.aircraftTypes.get(this._aircraft.aircraftType);
      this.airline = this.airlineService.airlines.get(this._aircraft.airline);
    } else {
      this.aircraftType = undefined;
      this.airline = undefined;
    }
  }

  public aircraftType: AircraftType | undefined;
  public airline: Airline | undefined;

  constructor(
    private aircraftTypeService: AircraftTypeService,
    private airlineService: AirlineService
  ) {}
}
