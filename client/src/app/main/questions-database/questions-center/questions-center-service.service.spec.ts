import { TestBed } from "@angular/core/testing";

import { QuestionsCenterService } from "./questions-center-service.service";

describe("QuestionsCenterServiceService", () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it("should be created", () => {
        const service: QuestionsCenterService = TestBed.get(
            QuestionsCenterService
        );
        expect(service).toBeTruthy();
    });
});
