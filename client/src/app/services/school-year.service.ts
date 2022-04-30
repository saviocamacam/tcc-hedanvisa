import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SchoolYearService {
    currentPeriod: BehaviorSubject<any>;
    constructor() {
        this.currentPeriod = new BehaviorSubject(null);
    }
}
