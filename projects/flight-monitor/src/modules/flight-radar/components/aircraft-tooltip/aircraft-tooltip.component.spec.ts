import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AircraftTooltipComponent } from './aircraft-tooltip.component';

describe('AircraftTooltipComponent', () => {
  let component: AircraftTooltipComponent;
  let fixture: ComponentFixture<AircraftTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AircraftTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AircraftTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
