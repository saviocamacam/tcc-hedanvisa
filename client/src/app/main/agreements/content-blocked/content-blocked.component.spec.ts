import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentBlockedComponent } from './content-blocked.component';

describe('ContentBlockedComponent', () => {
  let component: ContentBlockedComponent;
  let fixture: ComponentFixture<ContentBlockedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentBlockedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentBlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
