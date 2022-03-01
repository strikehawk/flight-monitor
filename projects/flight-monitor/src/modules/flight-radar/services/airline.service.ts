import { Injectable } from "@angular/core";
import airlines from "../../../../../../samples/airlines.json";
import { Airline } from "../model/general";

@Injectable({
  providedIn: "root"
})
export class AirlineService {

  public readonly airlines: Map<string, Airline> = new Map<string, Airline>();

  constructor() {
    this._parseData();
  }

  private _parseData(): void {
    for (const airline of (airlines as Airline[])) {
      if (!airline.icao) {
        continue;
      }

      this.airlines.set(airline.icao, airline);
    }
  }
}
