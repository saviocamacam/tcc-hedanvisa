import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClassroomService } from "app/main/classroom/classroom.service";
import { Subject } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { CountySchoolsService } from "../county-schools.service";
import { CountyPlanningsService } from "../../county-plannings/county-plannings.service";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-school-detail",
    templateUrl: "./school-detail.component.html",
    styleUrls: ["./school-detail.component.scss"]
})
export class SchoolDetailComponent implements OnInit, OnDestroy {
    schoolYears: any;
    classrooms: any;

    currentClassroom: any;

    currentSchoolYear: any;

    enrollments: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef: MatDialogRef<SchoolDetailComponent>,
        private _classRoomService: ClassroomService,
        private _countySchoolsService: CountySchoolsService
    ) {
        console.log("Hello World SchoolDetailComponent");

        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this._countySchoolsService
            .schoolYearList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                schoolYears => {
                    if (schoolYears) {
                        this.schoolYears = schoolYears;

                        if (!this.currentSchoolYear) {
                            this.currentSchoolYear = this.schoolYears[
                                this.schoolYears.length - 1
                            ];
                        }
                    }
                },
                error => console.log(error)
            );

        this.getClassRooms();
    }

    ngOnDestroy() {
        console.log("SchoolDetailComponent has destroyed.");

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getClassRooms() {
        console.log(this.data.school._id);
        let params = new HttpParams();
        params = params.set("school", this.data.school._id);
        // params = params.set("year", this.currentSchoolYear._id);
        this._classRoomService
            .getClassRoomsBySchoolId(params)
            .then(res => {
                this.classrooms = res;
                console.log(this.classrooms);
            })
            .catch(err => {
                console.error(err);
                // this._matDialog.open(ErrorAlertDialogComponent, {
                //     data: {
                //         justification:
                //             "Não foi possível recuperar as turmas. Tente novamente mais tarde."
                //     }
                // });
            });
    }

    classroomDetail(classroom) {
        console.log(classroom);
        this._dialogRef.close(classroom);
    }
}
