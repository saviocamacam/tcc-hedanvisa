import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BnccListItemComponent } from './bncc-list-item.component';

describe('BnccListItemComponent', () => {
  let component: BnccListItemComponent;
  let fixture: ComponentFixture<BnccListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BnccListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BnccListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
