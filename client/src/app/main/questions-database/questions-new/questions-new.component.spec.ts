import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsNewComponent } from './questions-new.component';

describe('QuestionsNewComponent', () => {
  let component: QuestionsNewComponent;
  let fixture: ComponentFixture<QuestionsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
