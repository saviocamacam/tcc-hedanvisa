import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { fuseAnimations } from "@fuse/animations";
import { DailyService } from "./daily.service";
import { Discipline } from "app/model/subject";
import { Subject } from "rxjs";
import { SubjectsService } from "../../subjects/subjects.service";
import { filter, takeUntil } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
    selector: "app-daily",
    templateUrl: "./daily.component.html",
    styleUrls: ["./daily.component.scss"],
    animations: fuseAnimations
})
export class DailyComponent implements OnInit, OnDestroy {
    @Input()
    dataModel: any;

    picker: any;
    myDateValue: any;
    periods: { value: string; viewValue: string; begin: string; end: string }[];
    name: any;
    periodSelected: any;
    themeSelected: any;
    themes: { value: string; viewValue: string }[];
    id: any;
    private _unsubscribeAll: Subject<any>;
    planningForm: FormGroup;
    opts: { value: string; name: string }[];
    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     */

    constructor(
        private _fuseSidebarService: FuseSidebarService,
        public _dailyService: DailyService,
        private _subjectsService: SubjectsService,
        private formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar
    ) {
        console.log("Hello World Daily Component.");

        this.opts = [
            {
                value: "a",
                name: "A"
            },
            {
                value: "b",
                name: "B"
            }
        ];
        this._unsubscribeAll = new Subject();

        this.periods = [
            {
                value: "1",
                viewValue: "1º Trimestre",
                begin: "",
                end: ""
            },
            {
                value: "2",
                viewValue: "2º Trimestre",
                begin: "",
                end: ""
            },
            {
                value: "3",
                viewValue: "3º Trimestre",
                begin: "",
                end: ""
            }
        ];
    }

    ngOnInit() {
        this._subjectsService
            .currentSubject()
            .pipe(
                filter(subject => subject instanceof Discipline),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(discipline => {
                this.themeSelected = discipline;
            });
        this._subjectsService._newDocument
            .pipe(
                filter(value => value === true),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(value => {
                if (value) {
                    this.newPlanning();
                }
            });
        this._dailyService.currentPlanning.subscribe(planning => {
            if (planning._id) {
                this.id = planning._id;
                this.name = planning.meta.name;
                this.dataModel = planning.content;
                this.myDateValue = planning.meta.date;
                this.periodSelected = planning.meta.period;
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    onSubmit() {
        this.planningForm = this.formBuilder.group({
            type: ["DailyPlanning", Validators.required],
            name: [this.name],
            period: [this.periodSelected, Validators.required],
            date: [this.myDateValue, Validators.required],
            theme: [this.themeSelected.value, Validators.required]
        });
        if (this.planningForm.valid) {
            console.log(this.planningForm.value);
            console.log(this.dataModel);
            if (this.id) {
                this._dailyService
                    .update(
                        {
                            meta: this.planningForm.value,
                            content: this.dataModel
                        },
                        this.id
                    )
                    .then(planning => {
                        this._dailyService.currentPlanning.next(planning);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            } else {
                this._dailyService
                    .save({
                        meta: this.planningForm.value,
                        content: this.dataModel
                    })
                    .then(planning => {
                        if (planning) {
                            this._subjectsService._currentSubject.next(
                                this.themeSelected
                            );
                            this._dailyService.currentPlanning.next(planning);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        } else {
            this._matSnackBar.open(
                "Informações do Plano Diário estão incompletas",
                "Ok",
                {
                    duration: 3000,
                    verticalPosition: "top",
                    horizontalPosition: "center"
                }
            );
        }
    }

    newPlanning() {
        this._dailyService.currentPlanning.next({});
        this.id = null;
        this.dataModel = "";
        this.name = "";
        this.myDateValue = null;
        this.periodSelected = this.periods[0];
    }

    ngOnDestroy() {
        console.log("Daily Component destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
