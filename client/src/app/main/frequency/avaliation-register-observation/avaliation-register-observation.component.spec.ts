import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AvaliationRegisterObservationComponent } from "./avaliation-register-observation.component";

describe("AvaliationRegisterComponent", () => {
    let component: AvaliationRegisterObservationComponent;
    let fixture: ComponentFixture<AvaliationRegisterObservationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AvaliationRegisterObservationComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AvaliationRegisterObservationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
