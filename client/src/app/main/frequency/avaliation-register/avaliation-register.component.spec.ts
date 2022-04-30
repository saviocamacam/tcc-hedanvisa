import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliationRegisterComponent } from './avaliation-register.component';

describe('AvaliationRegisterComponent', () => {
  let component: AvaliationRegisterComponent;
  let fixture: ComponentFixture<AvaliationRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliationRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliationRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
