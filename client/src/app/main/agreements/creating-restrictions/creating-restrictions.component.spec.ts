import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingRestrictionsComponent } from './creating-restrictions.component';

describe('CreatingRestrictionsComponent', () => {
  let component: CreatingRestrictionsComponent;
  let fixture: ComponentFixture<CreatingRestrictionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatingRestrictionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatingRestrictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
