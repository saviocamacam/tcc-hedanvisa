import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentNewComponent } from './enrollment-new.component';

describe('EnrollmentNewComponent', () => {
  let component: EnrollmentNewComponent;
  let fixture: ComponentFixture<EnrollmentNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
