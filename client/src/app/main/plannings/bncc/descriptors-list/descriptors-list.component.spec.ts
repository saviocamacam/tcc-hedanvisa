import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptorsListComponent } from './descriptors-list.component';

describe('DescriptorsListComponent', () => {
  let component: DescriptorsListComponent;
  let fixture: ComponentFixture<DescriptorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
