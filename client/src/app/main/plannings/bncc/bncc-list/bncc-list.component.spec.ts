import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BnccListComponent } from "./bncc-list.component";

describe("BnccListComponent", () => {
    let component: BnccListComponent;
    let fixture: ComponentFixture<BnccListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BnccListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BnccListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
