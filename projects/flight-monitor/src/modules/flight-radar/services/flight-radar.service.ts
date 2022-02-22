import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

import { environment } from "projects/flight-monitor/src/environments/environment";
import { BoundingBox } from "../../shared/model/map";
import { FlightRadarQueryResponse } from "../model/flight-radar";
import response from "../../../../../../samples/flightradar24/flight-radar-response2.json";

export interface QueryOptions {
  bbox: BoundingBox,

  /**
   * Maximum age of the track, in seconds. Default value is 14400.
   */
  maxAge?: number
}

@Injectable({
  providedIn: "root"
})
export class FlightRadarService {
  private _fakeData = false;

  constructor(
    private http: HttpClient
  ) { }

  public query(queryOpts: QueryOptions): Promise<FlightRadarQueryResponse> {
    if (!queryOpts) {
      throw new Error("Query options cannot be null.");
    }


    if (!this._fakeData) {
      const url = environment.flightRadar.baseUrl + "/query";
      return lastValueFrom(this.http.post<FlightRadarQueryResponse>(url, queryOpts));
    } else {
      return Promise.resolve<FlightRadarQueryResponse>(response);
    }
  }
}
