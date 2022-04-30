import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAttachmentsComponent } from './document-attachments.component';

describe('DocumentAttachmentsComponent', () => {
  let component: DocumentAttachmentsComponent;
  let fixture: ComponentFixture<DocumentAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
