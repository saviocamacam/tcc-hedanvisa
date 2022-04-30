import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyReportInstructionsComponent } from './frequency-report-instructions.component';

describe('FrequencyReportInstructionsComponent', () => {
  let component: FrequencyReportInstructionsComponent;
  let fixture: ComponentFixture<FrequencyReportInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequencyReportInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyReportInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
