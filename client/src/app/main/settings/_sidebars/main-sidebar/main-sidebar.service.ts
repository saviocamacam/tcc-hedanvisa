import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class MainSidebarService {
    onFilterChanged: Subject<any>;

    _nextStep: BehaviorSubject<string>;

    constructor() {
        this.onFilterChanged = new Subject();
        this._nextStep = new BehaviorSubject<string>("");
    }

    nextStep(): Observable<string> {
        return this._nextStep.asObservable();
    }
}
