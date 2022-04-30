import { Component, OnInit, OnDestroy } from "@angular/core";
import { DailyService } from "../plannings/daily/daily.service";
import { fuseAnimations } from "@fuse/animations";
import { SubjectsService } from "./subjects.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Discipline } from "../../model/subject";

@Component({
    selector: "app-subjects",
    templateUrl: "./subjects.component.html",
    styleUrls: ["./subjects.component.scss"],
    animations: fuseAnimations
})
export class SubjectsComponent implements OnInit, OnDestroy {
    subject: any;
    subjects: any;
    subjectFilter: any;
    themeSelected: any;
    themes: Discipline[];
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dailyService: DailyService,
        private _subjectsService: SubjectsService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this._subjectsService
            .showingSubjects()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(subjects => {
                this.themes = new Array<Discipline>();
                subjects.forEach(element => {
                    if (element.value === "lp") {
                        element.$viewValue = "Língua Portuguesa";
                    } else if (element.value === "mat") {
                        element.$viewValue = "Matemática";
                    } else if (element.value === "cie") {
                        element.$viewValue = "Ciências";
                    } else if (element.value === "geo") {
                        element.$viewValue = "Geografia";
                    } else if (element.value === "his") {
                        element.$viewValue = "História";
                    } else if (element.value === "ef") {
                        element.$viewValue = "Educação Física";
                    } else if (element.value === "art") {
                        element.$viewValue = "Arte";
                    }
                    this.themes.push(element);
                });
                this.themeSelected = this.themes[0];

                this._subjectsService._currentSubject.next(this.themeSelected);
            });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    changeSubjectFilter(subject) {
        this.subjectFilter = subject;
    }

    updatePlannings(ev) {
        this._subjectsService._currentSubject.next(ev.value);
    }

    newDocument() {
        this._subjectsService._newDocument.next(true);
    }
}
