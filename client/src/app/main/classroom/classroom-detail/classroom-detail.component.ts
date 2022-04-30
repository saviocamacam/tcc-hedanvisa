import { Component, OnInit, OnDestroy } from "@angular/core";
import { ClassroomService } from "../classroom.service";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { MatDialog } from "@angular/material";
import { EnrollmentDetailComponent } from "../enrollment-detail/enrollment-detail.component";
import { ProfilesService } from "../../../services/profiles.service";
import { Profile } from "app/model/profile";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import subjects from "../../../fake-db/subjects";
import { AuthorizationService } from "app/main/authorization/authorization.service";

@Component({
    selector: "app-classroom-detail",
    templateUrl: "./classroom-detail.component.html",
    styleUrls: ["./classroom-detail.component.scss"]
})
export class ClassroomDetailComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    enrollments: any;
    classroom: any;
    _idSchool: any;
    profile: any;
    requests: any;
    professors: any;

    isLoading = false;

    constructor(
        private _classroomService: ClassroomService,
        private _matDialog: MatDialog
    ) {
        this._unsubscribeAll = new Subject<any>();
        this.isLoading = true;
    }

    ngOnInit() {
        this._classroomService
            .currentClassroom()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                classroom => {
                    this.classroom = classroom;
                    this.isLoading = false;
                },
                error => this.handleError(error)
            );
    }

    handleError(error) {
        console.log(error);
        this.isLoading = false;
        this._matDialog.open(ErrorAlertDialogComponent, {
            width: "400px",
            data: {
                justification:
                    "Não foi possível recuperar as Turmas no momento."
            }
        });
    }

    ngOnDestroy(): void {
        this._classroomService._currentClassroom.next(null);
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
