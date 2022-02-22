import { TestBed } from "@angular/core/testing";

import { FlightRadarService } from "./flight-radar.service";

describe("FlightRadarService", () => {
  let service: FlightRadarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightRadarService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
