import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
    FormControl
} from "@angular/forms";
import { ProfilesService } from "app/services/profiles.service";
import { Profile } from "app/model/profile";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ProfileCounty } from "app/model/profile-county";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { SchoolYear } from "app/model/school-year";
import * as moment from "dayjs";
import { SchoolService } from "../school.service";

@Component({
    selector: "app-school-year",
    templateUrl: "./school-year.component.html",
    styleUrls: ["./school-year.component.scss"]
})
export class SchoolYearComponent implements OnInit, OnDestroy {
    schoolYearForm: FormGroup;
    schoolYear: SchoolYear;

    minDate: Date;
    maxDate: Date;

    periodStart: any;
    periodEnd: any;

    profile: ProfileCounty;

    regimes = [
        { value: "bi", showValue: "Bimestral", periods: 4 },
        { value: "tri", showValue: "Trimestral", periods: 3 },
        { value: "sem", showValue: "Semestral", periods: 2 }
    ];

    years = [
        // {
        //     value: new Date((new Date().getFullYear() - 2).toString()),
        //     showValue: (new Date().getFullYear() - 2).toString()
        // },
        // {
        //     value: new Date((new Date().getFullYear() - 1).toString()),
        //     showValue: (new Date().getFullYear() - 1).toString()
        // },
        {
            value: new Date(new Date().getFullYear().toString()),
            showValue: new Date().getFullYear().toString(),
            disabled: this.data.yearsAlreadyExist.find(
                element => element === new Date().getFullYear().toString()
            )
        },
        {
            value: new Date((new Date().getFullYear() + 1).toString()),
            showValue: (new Date().getFullYear() + 1).toString(),
            disabled: this.data.yearsAlreadyExist.find(
                element => element === (new Date().getFullYear() + 1).toString()
            )
        },
        {
            value: new Date((new Date().getFullYear() + 2).toString()),
            showValue: (new Date().getFullYear() + 2).toString(),
            disabled: this.data.yearsAlreadyExist.find(
                element => element === (new Date().getFullYear() + 2).toString()
            )
        }
    ];

    periods: any;

    _newPeriod = false;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _formBuilder: FormBuilder,
        private _schoolsService: SchoolService,
        private _profilesService: ProfilesService,
        public _dialogRef: MatDialogRef<SchoolYearComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        console.log("Hello World SchoolYearComponent");

        this._unsubscribeAll = new Subject();

        this.schoolYearForm = this.createSchoolYearForm();

        this._fuseProgressBarService.setMode("indeterminate");
    }

    ngOnInit() {
        this.getCurrentProfile();

        this.getCurrentSchoolYear();
    }

    ngOnDestroy() {
        console.log("SchoolYearComponent has destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getCurrentProfile() {
        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(profile => {
                console.log(profile);
                if (profile && this.schoolYearForm) {
                    this.schoolYearForm.controls["createdBy"].setValue(
                        profile.id
                    );

                    this.schoolYearForm.controls["county"].setValue(
                        profile.$county.requested._id
                    );
                }
            });
    }

    getCurrentSchoolYear() {
        this._schoolsService
            .currentSchoolYear()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                currentSchoolYear => {
                    if (currentSchoolYear) {
                        this.schoolYear = Object.assign(
                            new SchoolYear(),
                            currentSchoolYear
                        );
                        console.log(this.schoolYear);

                        if (this.schoolYearForm) {
                            this.schoolYearForm.controls["year"].setValue(
                                this.schoolYear.$year.toString()
                            );

                            this.schoolYearForm.controls["regime"].setValue(
                                this.schoolYear.$regime.value
                            );

                            this.schoolYearForm.controls["year"].disable();
                            this.schoolYearForm.controls["regime"].disable();
                        }

                        if (this.schoolYear.$periods) {
                            if (
                                this.schoolYear.$periods.length >=
                                this.schoolYear.$regime.periods
                            ) {
                                setTimeout(() => {
                                    document
                                        .getElementById("addPeriod")
                                        .setAttribute("disabled", "true");
                                });
                            }

                            this.periods = this.schoolYear.$periods;
                            this.periods.forEach(element => {
                                element.initDateShow = moment(
                                    element.start.start
                                ).format("DD/MM/YYYY");

                                element.endDateShow = moment(
                                    element.end.start
                                ).format("DD/MM/YYYY");
                            });
                        }
                    }
                },
                error => console.log(error)
            );
    }

    createSchoolYearForm(): FormGroup {
        return this._formBuilder.group({
            year: [null, Validators.required],
            regime: [null, Validators.required],
            county: [null, Validators.required],
            createdBy: [null, Validators.required]
        });
    }

    async onSubmit() {
        if (await !this.schoolYear) {
            await this.createSchoolYear();
        } else {
            await this.updateSchoolYear();
        }

        await this.closeDialog();
    }

    createSchoolYear() {
        this._schoolsService
            .createSchoolYear(this.schoolYearForm.value)
            .then(schoolYear => {
                this.schoolYear = Object.assign(new SchoolYear(), schoolYear);

                this.schoolYearForm.controls["year"].setValue(
                    this.schoolYear.$year.toString()
                );
            })
            .catch(error => {
                console.log(error);
            });
    }

    updateSchoolYear() {
        this._schoolsService
            .updateSchoolYear(this.schoolYear.id, this.schoolYearForm.value)
            .then(schoolYear => {
                this.schoolYear = Object.assign(new SchoolYear(), schoolYear);
            })
            .catch(error => {
                console.log(error);
            });
    }

    editPeriod(period) {
        console.log("editPeriod");
        console.log(period);
    }

    deletePeriod(period) {
        console.log("deletePeriod");
        console.log(period);
    }

    newPeriod() {
        console.log("newPeriod");
        this.minDate = this.maxDate = null;
        this._newPeriod = true;
        const currentYear = this.schoolYear.$year.substring(0, 4);
        this.minDate = new Date(`${currentYear}-01-01`);
        this.maxDate = new Date(`${currentYear}-12-31`);
    }

    dateChange(date) {
        this.minDate = date;
    }

    createPeriod() {
        this._fuseProgressBarService.show();

        this._schoolsService
            .savePeriod(this.createPeriodForm().value)
            .then(() => {
                this._newPeriod = false;
                this.minDate = this.maxDate = null;
                this._fuseProgressBarService.hide();
            })
            .catch(error => console.log(error));
    }

    cancelCreatePeriod() {
        this.periodStart = this.periodEnd = null;
        this._newPeriod = false;
    }

    createPeriodForm(): FormGroup {
        return this._formBuilder.group({
            start: [
                this.periodStart ? this.periodStart : null,
                Validators.required
            ],
            end: [this.periodEnd ? this.periodEnd : null, Validators.required],
            owner: [
                this.schoolYear ? this.schoolYear.$county : null,
                Validators.required
            ],
            createdBy: [
                this.profile ? this.profile.id : null,
                Validators.required
            ],
            schoolYear: [
                this.schoolYear ? this.schoolYear.id : null,
                Validators.required
            ]
        });
    }

    closeDialog() {
        this._dialogRef.close();
    }
}
