import { Component, OnInit, Inject, OnDestroy, ViewChild } from "@angular/core";
import { AuthorizationService } from "../authorization.service";
import { Profile } from "app/model/profile";
import { Subject } from "rxjs";
import { ProfilesService } from "../../../services/profiles.service";
import { takeUntil, filter } from "rxjs/operators";
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatTableDataSource,
    MatPaginator,
    MatSort
} from "@angular/material";
import { fuseAnimations } from "@fuse/animations";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import profiles from "../../../fake-db/profiles";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";
import { AccountService } from "app/services/account.service";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";

@Component({
    selector: "authorization-list",
    templateUrl: "./authorization-list.component.html",
    styleUrls: ["./authorization-list.component.scss"],
    animations: fuseAnimations
})
export class AuthorizationListComponent implements OnInit, OnDestroy {
    profile: Profile;
    requests: any;
    filterBy: any;

    isLoading = false;

    dataSource: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[];

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _authorizationService: AuthorizationService,
        private _profilesService: ProfilesService,
        private _matDialog: MatDialog,
        private _fuseProgressbarService: FuseProgressBarService
    ) {
        console.log("Hello World AuthorizationListComponent");

        this._unsubscribeAll = new Subject<any>();

        this._fuseProgressbarService.setMode("indeterminate");

        this.isLoading = true;
    }

    ngOnInit() {
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
                        this._authorizationService.onFilterChanged.next(
                            "waiting"
                        );
                    }
                });
            });

        setTimeout(() => {
            this._authorizationService.onFilterChanged.subscribe(filterBy => {
                this.filterBy = filterBy;
                if (this.profile) {
                    this.updateRequestings();
                }
            });
        });

        this._authorizationService.onSearchTextChanged.subscribe(searchText => {
            if (this.dataSource) {
                this.dataSource.filter = searchText.trim().toLowerCase();

                if (this.dataSource.paginator) {
                    this.dataSource.paginator.firstPage();
                }
            }
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updateRequestings() {
        this._fuseProgressbarService.show();

        if (this.profile.$profileType === "ProfileSchool") {
            this.getSchoolProfessorsRequestings();
        } else if (this.profile.$profileType === "ProfileCounty") {
            this.getSchoolManagersRequestings();
        }
    }

    getSchoolManagersRequestings() {
        if (this.profile["county"].status !== "accepted") {
            this.isLoading = false;

            this._matDialog.open(AttentionAlertDialogComponent, {
                data: {
                    justification:
                        "Você não está autorizado ainda para ter acesso. Contate-nos!"
                }
            });
        } else {
            this._authorizationService
                .getSchoolManagersRequestings(
                    this.profile["county"].requested._id
                )
                .then(res => {
                    this.isLoading = false;

                    if (res) {
                        this.requests = res;
                        this.filterRequests();
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log(err);
                    this._fuseProgressbarService.hide();
                    this._matDialog.open(ErrorAlertDialogComponent, {
                        width: "400px",
                        data: {
                            justification:
                                "Não foi possível recuperar as autorizações no momento."
                        }
                    });
                });
        }
    }

    getSchoolProfessorsRequestings() {
        if (this.profile["school"].status !== "accepted") {
            this.isLoading = false;
            this._matDialog.open(AttentionAlertDialogComponent, {
                data: {
                    justification:
                        "Você não está autorizado ainda para ter acesso. Contate-nos!"
                }
            });
        } else {
            this._authorizationService
                .getSchoolProfessorsRequestings(
                    this.profile["school"].requested._id
                )
                .then(res => {
                    this.isLoading = false;
                    if (res) {
                        this.requests = res;
                        this.filterRequests();
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log(err);
                    this._fuseProgressbarService.hide();
                    this._matDialog.open(ErrorAlertDialogComponent, {
                        width: "400px",
                        data: {
                            justification:
                                "Não foi possível recuperar as autorizações no momento."
                        }
                    });
                });
        }
    }

    filterRequests() {
        if (this.requests) {
            const requests = [];

            this.requests.forEach(request => {
                if (request.status === this.filterBy) {
                    requests.push(request);
                }
            });

            let _role;
            requests.forEach(request => {
                if (request.requesting.profileType === "ProfileSchool") {
                    _role = profiles.schoolRoles.find(
                        role => role.value === request.requesting.role.type
                    );
                    if (_role) {
                        request.requesting.role.type = _role.viewValue;
                    }
                }
            });
            this.requests = requests;
            this.buildDataSource();
        }
    }

    buildDataSource() {
        if (this.requests) {
            const requests = [];

            this.requests.forEach(request => {
                requests.push({
                    _id: request._id,
                    shortName: request.requesting.user.shortName,
                    name: request.requesting.user.people
                        ? request.requesting.user.people.name
                        : request.requesting.user.shortName,
                    locale: request.requesting.role
                        ? request.requesting.role.school.institution.name
                        : "",
                    email: request.requesting.user.mainEmail
                        ? request.requesting.user.mainEmail.address
                        : "Não cadastrado",
                    checkedEmail: request.requesting.user.mainEmail
                        ? request.requesting.user.mainEmail.checked
                        : false,
                    phone: request.requesting.user.mainPhone
                        ? request.requesting.user.mainPhone.address
                        : "Não cadastrado",
                    checkedPhone: request.requesting.user.mainPhone
                        ? request.requesting.user.mainPhone.checked
                        : false,
                    role: request.requesting.role
                        ? request.requesting.role.type
                        : "Professor"
                });
            });

            this.displayedColumns = [
                "name",
                "role",
                "checkedPhone",
                "phone",
                "checkedEmail",
                "email"
            ];
            if (this.profile.$profileType === "ProfileCounty") {
                this.displayedColumns.push("locale");
            }
            console.log(requests);
            this.dataSource = new MatTableDataSource(requests);
            setTimeout(() => {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });

            this._fuseProgressbarService.hide();
        }
    }

    judgeTheRequest(request) {
        this._matDialog
            .open(ConfirmRequestDialog, {
                width: "400px",
                data: {
                    filter: this.filterBy,
                    name: request.name
                }
            })
            .afterClosed()
            .subscribe(response => {
                if (response && response !== "cancel") {
                    this._fuseProgressbarService.show();
                    this._authorizationService
                        .changeStatus(response, request._id)
                        .then(() => {
                            this._matDialog.open(SuccessAlertDialogComponent, {
                                width: "400px",
                                data: {
                                    justification:
                                        "Requisição atualizada com sucesso!"
                                }
                            });
                            this.updateRequestings();
                            this._fuseProgressbarService.hide();
                        })
                        .catch(error => {
                            console.log(error);
                            this._matDialog.open(ErrorAlertDialogComponent, {
                                width: "400px",
                                data: {
                                    justification:
                                        "Houve um problema ao atualizar a requisição. Tente novamente!"
                                }
                            });
                        });
                }
            });
    }
}

@Component({
    selector: "confirm-request-dialog",
    template: `
        <h1 mat-dialog-title style="text-align: center" class="primary-fg">
            Atenção!
        </h1>
        <mat-dialog-content>
            <mat-card
                class="primary-50-bg"
                *ngIf="!reconfirm && data.filter === 'waiting'"
            >
                <p class="h3" style="text-align:center">
                    Você deseja aceitar ou recusar a solicitação de
                    {{ data.name }}?
                </p>
                <mat-grid-list cols="2">
                    <mat-grid-tile>
                        <button
                            id="closedButton"
                            mat-fab
                            isIconButton
                            (click)="
                                judge({
                                    denied: true,
                                    accepted: false,
                                    closed: false
                                })
                            "
                            color="warn-bg"
                        >
                            <mat-icon>close</mat-icon>
                        </button>
                    </mat-grid-tile>
                    <mat-grid-tile>
                        <button
                            id="acceptButton"
                            mat-fab
                            isIconButton
                            (click)="
                                judge({
                                    accepted: true,
                                    denied: false,
                                    closed: false
                                })
                            "
                            color="green-bg"
                        >
                            <mat-icon>check</mat-icon>
                        </button>
                    </mat-grid-tile>
                </mat-grid-list>
            </mat-card>

            <mat-card
                class="primary-50-bg"
                *ngIf="
                    !reconfirm &&
                    (data.filter === 'accepted' || data.filter === 'closed')
                "
            >
                <p class="h3" style="text-align:center">
                    Você deseja {{ confirmText }} a solicitação de
                    {{ data.name }}?
                </p>
            </mat-card>

            <mat-card class="primary-50-bg" *ngIf="reconfirm">
                <p class="h3" style="text-align:center">
                    Tem certeza que deseja {{ confirmText }} a requisição de
                    {{ data.name }}?
                </p>
                <br />
            </mat-card>
        </mat-dialog-content>
        <mat-dialog-actions align="end" *ngIf="!reconfirm">
            <button
                mat-raised-button
                class="primary-100-bg"
                (click)="closeDialog('cancel')"
            >
                Cancelar
            </button>

            <button
                *ngIf="data.filter === 'accepted'"
                mat-raised-button
                class="accent-bg"
                (click)="closeDialog('closed')"
            >
                Sim
            </button>

            <button
                *ngIf="data.filter === 'closed'"
                mat-raised-button
                class="accent-bg"
                (click)="closeDialog('accepted')"
            >
                Sim
            </button>
        </mat-dialog-actions>
        <mat-dialog-actions align="end" *ngIf="reconfirm">
            <button
                mat-raised-button
                class="primary-100-bg"
                (click)="closeDialog('cancel')"
            >
                Cancelar
            </button>
            <button mat-raised-button class="accent-bg" (click)="closeDialog()">
                Sim
            </button>
        </mat-dialog-actions>
    `
})
// tslint:disable-next-line:component-class-suffix
export class ConfirmRequestDialog {
    reconfirm = false;
    confirmText: string;
    response: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ConfirmRequestDialog>
    ) {
        if (this.data.filter === "accepted") {
            this.confirmText = "suspender";
        } else if (this.data.filter === "closed") {
            this.confirmText = "aceitar";
        }
    }

    judge(response) {
        if (response.accepted) {
            this.confirmText = "aceitar";
            this.response = "accepted";
        } else if (response.denied) {
            this.confirmText = "rejeitar";
            this.response = "denied";
        } else if (response.closed) {
            this.confirmText = "suspender";
            this.response = "closed";
        }

        this.reconfirm = true;
    }

    closeDialog(response) {
        this.dialogRef.close(response ? response : this.response);
    }
}
