import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { ClassroomService } from "../classroom.service";
import { takeUntil, filter } from "rxjs/operators";
import {
    MatTableDataSource,
    MatPaginator,
    MatSort,
    MatDialog
} from "@angular/material";
import { fuseAnimations } from "@fuse/animations";
import { EnrollmentDetailComponent } from "../enrollment-detail/enrollment-detail.component";
import { ProfilesService } from "app/services/profiles.service";
import { Profile } from "app/model/profile";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";

@Component({
    selector: "app-enrollment-list",
    templateUrl: "./enrollment-list.component.html",
    styleUrls: ["./enrollment-list.component.scss"],
    animations: fuseAnimations
})
export class EnrollmentListComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;

    profile: Profile;
    classroom: any;

    enrollments: any;

    displayedColumns = ["name", "situation"];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _classroomService: ClassroomService,
        private _profilesService: ProfilesService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World EnrollmentListComponent");
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        // Carregando os dados das turmas
        this._classroomService
            .currentClassroom()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(classroom => {
                if (classroom) {
                    this.classroom = classroom;
                    setTimeout(() => {
                        if (this.profile) {
                            this.verifyProfileStatus();
                        }
                    });
                }
            });
            
        // Carregado os dados do usuário requerente
        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(profile => {
                setTimeout(() => {
                    if (profile) {
                        this.profile = profile;
                        this.verifyProfileStatus();
                    }
                });
            });

        this._classroomService.onSearchTextChanged.subscribe(searchText => {
            if (this.dataSource) {
                this.dataSource.filter = searchText.trim().toLowerCase();

                if (this.dataSource.paginator) {
                    this.dataSource.paginator.firstPage();
                }
            }
        });
    }

    verifyProfileStatus() {
        if (
            this.profile.$profileType === "ProfileCounty" &&
            this.profile["county"].status === "accepted"
        ) {
            if (this.classroom) {
                this.getEnrollments();
            }
        } else if (
            (this.profile.$profileType === "ProfileProfessor" ||
                this.profile.$profileType === "ProfileSchool") &&
            this.profile["school"].status === "accepted"
        ) {
            if (this.classroom) {
                this.getEnrollments();
            }
        }
    }

    getEnrollments() {
        // Carregando os dados dos alunos
        this._classroomService
            .getEnrollments(this.classroom._id)
            .then(enrollments => {
                if (enrollments) {
                    this.enrollments = enrollments;
                    const _enrollments = [];
                    this.enrollments.forEach(enrollment => {
                        _enrollments.push({
                            _id: enrollment._id,
                            name: enrollment.basic.nome_do_aluno,
                            situation: enrollment.basic.sit_da_matricula,
                        });
                    });
                    this.dataSource = new MatTableDataSource(_enrollments);
                    setTimeout(() => {
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    });
                }
            })
            .catch(error => {
                console.log(error);
                this._matDialog.open(ErrorAlertDialogComponent, {
                    width: "400px",
                    data: {
                        justification:
                            "Não foi possível recuperar as matrículas no momento."
                    }
                });
            });
    }

    enrollmentDetail(enrollmentId) {
        const enrollment = this.enrollments.find(
            _enrollment => _enrollment._id === enrollmentId
        );
        const dialog = this._matDialog.open(EnrollmentDetailComponent, {
            width: "600px",
            data: {
                enrollment,
            }
        });
        dialog.afterClosed().subscribe((result) => {
            console.log("result", result);
            if (result) {
                this.getEnrollments();
            }
        });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
