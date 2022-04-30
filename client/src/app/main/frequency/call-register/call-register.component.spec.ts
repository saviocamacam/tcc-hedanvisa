import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRegisterComponent } from './call-register.component';

describe('CallRegisterComponent', () => {
  let component: CallRegisterComponent;
  let fixture: ComponentFixture<CallRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
