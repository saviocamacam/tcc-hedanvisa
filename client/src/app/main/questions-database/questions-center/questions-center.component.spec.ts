import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsCenterComponent } from './questions-center.component';

describe('QuestionsCenterComponent', () => {
  let component: QuestionsCenterComponent;
  let fixture: ComponentFixture<QuestionsCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
