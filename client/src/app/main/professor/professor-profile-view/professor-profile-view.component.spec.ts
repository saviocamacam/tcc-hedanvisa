import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorProfileViewComponent } from './professor-profile-view.component';

describe('ProfessorProfileViewComponent', () => {
  let component: ProfessorProfileViewComponent;
  let fixture: ComponentFixture<ProfessorProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessorProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
