import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyReportComponent } from './frequency-report.component';

describe('FrequencyReportComponent', () => {
  let component: FrequencyReportComponent;
  let fixture: ComponentFixture<FrequencyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequencyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
