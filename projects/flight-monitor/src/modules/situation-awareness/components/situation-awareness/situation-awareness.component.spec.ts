import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationAwarenessComponent } from './situation-awareness.component';

describe('SituationAwarenessComponent', () => {
  let component: SituationAwarenessComponent;
  let fixture: ComponentFixture<SituationAwarenessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SituationAwarenessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationAwarenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
