import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsEditComponent } from './questions-edit.component';

describe('QuestionsEditComponent', () => {
  let component: QuestionsEditComponent;
  let fixture: ComponentFixture<QuestionsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
