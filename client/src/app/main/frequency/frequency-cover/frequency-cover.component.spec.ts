import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyCoverComponent } from './frequency-cover.component';

describe('FrequencyCoverComponent', () => {
  let component: FrequencyCoverComponent;
  let fixture: ComponentFixture<FrequencyCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequencyCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
