import { Component, OnInit, OnDestroy } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { DailyService } from "../../daily.service";
import { SubjectsService } from "../../../../subjects/subjects.service";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { Discipline } from "app/model/subject";
import { MatSnackBar } from "@angular/material";

@Component({
    selector: "app-days",
    templateUrl: "./days.component.html",
    styleUrls: ["./days.component.scss"],
    animations: fuseAnimations
})
export class DaysComponent implements OnInit, OnDestroy {
    subject: any;
    days: any;
    discipline: any;
    disciplines: any;
    subjectFilter: any;
    selectedAccount: any;
    accounts: any;
    composeDialog: any;
    selectedSortFilter: any;
    selectedTypeFilter: any;
    private _unsubscribeAll: Subject<any>;

    filters = [
        { value: "name", viewValue: "Título" },
        { value: "date", viewValue: "Data" }
    ];

    sorts = [
        { value: "cresc", viewValue: "Crescente" },
        { value: "decresc", viewValue: "Decrescente" }
    ];

    constructor(
        public _dailyService: DailyService,
        private _subjectsService: SubjectsService,
        private _matSnackBar: MatSnackBar
    ) {
        console.log("Hello World Sidebar Days Component");
        this._unsubscribeAll = new Subject();
        this.selectedSortFilter = this.sorts[0].value;
        this.selectedTypeFilter = this.filters[0].value;

        this._dailyService.currentPlanning.subscribe(planning => {
            this.subjectFilter = planning._id;
        });
    }

    ngOnInit() {
        this._subjectsService
            .currentSubject()
            .pipe(
                filter(subject => subject instanceof Discipline),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(subject => {
                this._dailyService
                    .getByTheme(subject.$value)
                    .then(res => {
                        if (res["success"]) {
                            this.days = res["data"];
                            this.days.forEach(day => {
                                if (!day.meta.name) {
                                    day.meta.name = "** Sem Título **";
                                }
                            });

                            this.changeFilterSort();
                        } else {
                            this.days = null;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this._matSnackBar.open(
                            "Ocorreu uma falha na recuperação dos Diários.",
                            "Ok",
                            {
                                duration: 3000,
                                verticalPosition: "top",
                                horizontalPosition: "center"
                            }
                        );
                    });
            });
    }

    changeSubjectFilter(day) {
        this.subjectFilter = day._id;
        this._dailyService.currentPlanning.next(day);
        this._dailyService.getAttachments();
    }

    newDocument() {}

    changeFilter() {}

    changeFilterSort() {
        this.days.sort((a, b) => {
            if (this.selectedTypeFilter === "name") {
                if (this.selectedSortFilter === "cresc") {
                    if (a.meta.name.toLowerCase() > b.meta.name.toLowerCase()) {
                        return 1;
                    }
                    if (a.meta.name.toLowerCase() < b.meta.name.toLowerCase()) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                } else if (this.selectedSortFilter === "decresc") {
                    if (a.meta.name.toLowerCase() > b.meta.name.toLowerCase()) {
                        return -1;
                    }
                    if (a.meta.name.toLowerCase() < b.meta.name.toLowerCase()) {
                        return 1;
                    }
                    // a must be equal to b
                    return 0;
                }
            } else if (this.selectedTypeFilter === "date") {
                if (this.selectedSortFilter === "cresc") {
                    if (a.meta.date > b.meta.date) {
                        return 1;
                    }
                    if (a.meta.date < b.meta.date) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                } else if (this.selectedSortFilter === "decresc") {
                    if (a.meta.date > b.meta.date) {
                        return -1;
                    }
                    if (a.meta.date < b.meta.date) {
                        return 1;
                    }
                    // a must be equal to b
                    return 0;
                }
            }
        });
    }

    ngOnDestroy() {
        console.log("Sidebar Days Component destroyed.");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
