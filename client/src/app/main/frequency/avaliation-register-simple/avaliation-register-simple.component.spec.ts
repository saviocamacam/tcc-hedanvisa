import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AvaliationRegisterSimpleComponent } from "./avaliation-register-simple.component";

describe("AvaliationRegisterSimpleComponent", () => {
    let component: AvaliationRegisterSimpleComponent;
    let fixture: ComponentFixture<AvaliationRegisterSimpleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AvaliationRegisterSimpleComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AvaliationRegisterSimpleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
