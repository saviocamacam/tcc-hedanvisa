import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningNewComponent } from './planning-new.component';

describe('PlanningNewComponent', () => {
  let component: PlanningNewComponent;
  let fixture: ComponentFixture<PlanningNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
