import { TestBed } from "@angular/core/testing";

import { BnccService } from "./bncc.service";

describe("BnccService", () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it("should be created", () => {
        const service: BnccService = TestBed.get(BnccService);
        expect(service).toBeTruthy();
    });
});
