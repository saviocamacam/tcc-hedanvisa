import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptorItemComponent } from './descriptor-item.component';

describe('DescriptorItemComponent', () => {
  let component: DescriptorItemComponent;
  let fixture: ComponentFixture<DescriptorItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptorItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
