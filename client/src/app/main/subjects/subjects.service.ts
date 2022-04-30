import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Discipline } from "../../model/subject";

@Injectable({
    providedIn: "root"
})
export class SubjectsService {
    _currentSubject: BehaviorSubject<Discipline>;
    _showingSubjects: BehaviorSubject<Discipline[]>;
    _newDocument: BehaviorSubject<boolean>;

    constructor() {
        console.log("Helloworld Subjects Service");
        this._currentSubject = new BehaviorSubject(null);
        this._showingSubjects = new BehaviorSubject(null);
        this._newDocument = new BehaviorSubject(null);
    }

    currentSubject(): Observable<Discipline> {
        return this._currentSubject.asObservable();
    }

    showingSubjects(): Observable<any> {
        return this._showingSubjects.asObservable();
    }
}
