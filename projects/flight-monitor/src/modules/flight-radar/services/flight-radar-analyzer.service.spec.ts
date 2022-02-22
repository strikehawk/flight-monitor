import { TestBed } from "@angular/core/testing";

import { FlightRadarAnalyzerService } from "./flight-radar-analyzer.service";

describe("FlightRadarAnalyzerService", () => {
  let service: FlightRadarAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightRadarAnalyzerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
