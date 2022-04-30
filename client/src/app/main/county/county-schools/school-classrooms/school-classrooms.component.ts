import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClassroomService } from "app/main/classroom/classroom.service";
import { fuseAnimations } from "@fuse/animations";
import { MatDialog } from "@angular/material";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { HttpParams } from "@angular/common/http";
import { EnrollmentDetailComponent } from "../enrollment-detail/enrollment-detail.component";

@Component({
    selector: "app-school-classrooms",
    templateUrl: "./school-classrooms.component.html",
    styleUrls: ["./school-classrooms.component.scss"],
    animations: fuseAnimations
})
export class SchoolClassroomsComponent implements OnInit {
    school: any;
    classrooms: any;
    currentClassroom: any;
    enrollments: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _classroomService: ClassroomService,
        private _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService
    ) {
        console.log("Hello World SchoolClassroomsComponent");

        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this._classroomService
            .currentSchool()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                school => {
                    if (!school) {
                        this._router.navigate(["/municipio/escolas"]);
                    } else {
                        this.school = school;
                        console.log(this.school);
                    }
                },
                error => {
                    console.log(error);
                }
            );

        if (this.school) {
            let params = new HttpParams();
            params = params.set(
                "school",
                this._route.snapshot.params.school_id
            );

            this._classroomService
                .getClassRoomsBySchoolId(params)
                .then(classrooms => {
                    if (classrooms) {
                        this.classrooms = classrooms;
                        this.classroomDetail(this.classrooms[0]);
                    }

                    if (this.classrooms.length === 0) {
                        this._matDialog.open(ErrorAlertDialogComponent, {
                            width: "400px",
                            data: {
                                justification:
                                    "Ainda não cadastramos as turmas para este calendário. Por favor, aguarde ou entre em contato conosco."
                            }
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    this._matDialog.open(ErrorAlertDialogComponent, {
                        width: "400px",
                        data: {
                            justification:
                                "Não foi possível recuperar as turmas da escola no momento."
                        }
                    });
                });
        }
    }

    classroomDetail(classroom) {
        this.currentClassroom = classroom;
        if (this.currentClassroom) {
            this._classroomService
                .getEnrollments(classroom._id)
                .then(enrollments => {
                    console.log(enrollments);
                    this.enrollments = enrollments;
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    enrollmentDetail(enrollment) {
        console.log(enrollment);
        this._matDialog.open(EnrollmentDetailComponent, {
            width: "600px",
            data: {
                enrollment
            }
        });
    }

    /**
     * Toggle sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
