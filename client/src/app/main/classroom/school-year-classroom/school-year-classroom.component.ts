import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { ProfilesService } from "app/services/profiles.service";
import { Profile } from "app/model/profile";
import { filter, takeUntil } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClassroomService } from "../classroom.service";
import { SchoolService } from "app/main/school/school.service";

@Component({
    selector: "app-school-year-classroom",
    templateUrl: "./school-year-classroom.component.html",
    styleUrls: ["./school-year-classroom.component.scss"]
})
export class SchoolYearClassroomComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    profile: Profile;

    schoolYears: any;

    schoolYearClassroomForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _classroomService: ClassroomService,
        private _schoolService: SchoolService,
        private _profilesService: ProfilesService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SchoolYearClassroomComponent>
    ) {
        console.log("Hello World SchoolYearClassroomComponent");

        this._unsubscribeAll = new Subject();

        this.schoolYearClassroomForm = this.createSchoolYearClassroomForm();
    }

    ngOnInit() {
        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(profile => {
                if (profile) {
                    this.profile = profile;

                    this.schoolYearClassroomForm.controls["createdBy"].setValue(
                        this.profile.id
                    );
                    if (this.profile["school"]) {
                        this.schoolYearClassroomForm.controls[
                            "school"
                        ].setValue(this.profile["school"].requested._id);

                        this.getSchoolYears();
                    }
                }
            });
    }

    createSchoolYearClassroomForm(): FormGroup {
        return this._formBuilder.group({
            schoolYear: [null, Validators.required],
            school: [null, Validators.required],
            createdBy: [null, Validators.required],
            classrooms: [null],
            events: [null],
            attachments: [null]
        });
    }

    getSchoolYears() {
        const countyId = this.profile["school"].requested.countyInstitutional
            ._id;

        this._schoolService
            .getSchoolYearByCounty(countyId)
            .then(schoolYears => {
                if (schoolYears) {
                    this.schoolYears = schoolYears;
                    console.log(this.schoolYears);
                    this.getSchoolYearClassroom();
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    getSchoolYearClassroom() {
        const schoolId = this.profile["school"].requested._id;

        this._classroomService
            .getSchoolYearClassroomBySchool(schoolId)
            .then(schoolYearClassroom => {
                const schoolYearClassroomAlreadyExist = [];
                schoolYearClassroom.forEach(_schoolYearClassrom => {
                    this.schoolYears.forEach(schoolYear => {
                        if (
                            _schoolYearClassrom.schoolYear._id ===
                            schoolYear._id
                        ) {
                            schoolYearClassroomAlreadyExist.push(
                                schoolYear._id
                            );
                        }
                    });
                });
                this.schoolYears = this.schoolYears.filter(
                    item => !schoolYearClassroomAlreadyExist.includes(item._id)
                );
            });
    }

    onSubmit() {
        document
            .getElementById("onSubmitButton")
            .setAttribute("disabled", "true");

        this._classroomService
            .createSchoolYearClassroom(this.schoolYearClassroomForm.value)
            .then(schoolYearClassroom => {
                console.log(schoolYearClassroom);
                this.closeDialog(schoolYearClassroom);
            })
            .catch(error => {
                console.log(error);
                this.closeDialog(null);
            });
    }

    ngOnDestroy() {
        console.log("SchoolYearClassroomComponent destroyed");

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDialog(response) {
        if (response) {
            this.dialogRef.close(response);
        } else {
            this.dialogRef.close();
        }
    }
}
