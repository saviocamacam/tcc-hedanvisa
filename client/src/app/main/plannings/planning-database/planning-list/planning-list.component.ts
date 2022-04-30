import { Component, OnInit, OnDestroy, Inject } from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ProfilesService } from "app/services/profiles.service";

import { fuseAnimations } from "@fuse/animations";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BnccService } from "app/main/plannings/bncc/bncc.service";
import { HttpParams } from "@angular/common/http";
import { ConfirmDeleteDialogComponent } from "app/main/shared-private/confirm-delete-dialog/confirm-delete-dialog.component";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { PlanningDatabaseService } from "app/main/plannings/planning-database/planning-database.service";
import { PlanningCenterService } from "app/main/plannings/planning-database/planning-center.service";

export interface HabilityData {
    key: string;
    value: string;
    camposDeAtuacao: string;
    objetosDeConhecimento: string;
}

@Component({
    selector: "app-planning-list",
    templateUrl: "./planning-list.component.html",
    styleUrls: ["./planning-list.component.scss"],
    animations: fuseAnimations
})
export class PlanningListComponent implements OnInit, OnDestroy {
    plannings = [];
    disciplines: {}[];
    years: {}[];
    private _unsubscribeAll: Subject<any>;
    profile: any;

    constructor(
        private _planningCenterService: PlanningCenterService,
        private _profilesService: ProfilesService,
        public _planningsService: PlanningsService,
        public planningDatabaseService: PlanningDatabaseService,
        public dialog: MatDialog
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this._profilesService
            .currentProfile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(profile => {
                this.profile = profile;
            });
        this._planningCenterService._documents
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                this.plannings = res.sort((a, b) => {
                    return a.updatedAt > b.updatedAt ? -1 : 1;
                });
            });
        // Subscribe to courses
        this._planningsService.onDisciplinesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(disciplines => {
                // console.log(disciplines);
                this.disciplines = disciplines;
            });
        // Subscribe to courses
        this._planningsService.onYearsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(years => {
                // console.log(years);
                this.years = years;
            });
    }

    forkPlanning(planning) {
        this.dialog
            .open(ConfirmDeleteDialogComponent, {
                width: "400px",
                data: {
                    title: "Deseja adicionar esta aula à sua Biblioteca?",
                    message: "Essa ação não poderá ser desfeita!",
                    action: "Duplicar"
                }
            })
            .afterClosed()
            .subscribe(response => {
                if (response) {
                    this.planningDatabaseService
                        .forkPlanning(planning)
                        .then(res => {
                            // console.log(res);

                            this.dialog
                                .open(SuccessAlertDialogComponent, {
                                    width: "400px",
                                    data: {
                                        justification:
                                            "Documento deletado com sucesso!"
                                    }
                                })
                                .afterClosed()
                                .subscribe(() => {
                                    this._planningCenterService.get();
                                });
                        })
                        .catch(error => {
                            // console.log(error);
                            this.dialog.open(ErrorAlertDialogComponent, {
                                width: "400px",
                                data: {
                                    justification:
                                        "Não foi possível excluir o documento no momento."
                                }
                            });
                        });
                }
            });
    }

    deletePlanning(planning) {
        // console.log(planningId);

        this.dialog
            .open(ConfirmDeleteDialogComponent, {
                width: "400px",
                data: {
                    title: "Deseja excluir este documento?",
                    message: "Essa ação não poderá ser desfeita!"
                }
            })
            .afterClosed()
            .subscribe(response => {
                if (response) {
                    this.planningDatabaseService
                        .deletePlanning(planning._id)
                        .then(res => {
                            this.dialog
                                .open(SuccessAlertDialogComponent, {
                                    width: "400px",
                                    data: {
                                        justification:
                                            "Documento deletado com sucesso!"
                                    }
                                })
                                .afterClosed()
                                .subscribe(() => {
                                    this._planningCenterService.get();
                                });
                        })
                        .catch(error => {
                            // console.log(error);
                            this.dialog.open(ErrorAlertDialogComponent, {
                                width: "400px",
                                data: {
                                    justification:
                                        "Não foi possível excluir o documento no momento."
                                }
                            });
                        });
                }
            });
    }

    ngOnDestroy() {
        console.log("Planning List Component destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getPlanningYear(year) {
        const value = this.years.find(el => el["id"] === year);
        // console.log(value);

        if (value) {
            return value["viewValue"];
        }
    }
    openHability(hability) {
        console.log(this.dialog);
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            maxWidth: "400px",
            data: { key: hability, value: "" }
        });
    }
    getPlanningTheme(theme) {
        const value = this.disciplines.find(el => el["id"] === theme);
        // console.log(value);
        if (value) {
            return value["viewValue"];
        }
    }
}

@Component({
    selector: "dialog-overview-example-dialog",
    template: `
        <h1 mat-dialog-title>{{ data.key }}</h1>
        <div mat-dialog-content>
            <h3>{{ data.camposDeAtuacao }}</h3>
            <h3>{{ data.objetosDeConhecimento }}</h3>
            <h3>{{ data.value }}</h3>
        </div>
        <div mat-dialog-actions>
            <button mat-button mat-dialog-close cdkFocusInitial>Fechar</button>
        </div>
    `
})
// tslint:disable-next-line:component-class-suffix
export class DialogOverviewExampleDialog {
    constructor(
        public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
        private bnccService: BnccService,
        @Inject(MAT_DIALOG_DATA) public data: HabilityData
    ) {
        console.log(this.data);
        const params = new HttpParams().set("codigo", this.data.key);
        console.log(params);
        this.bnccService.getHabilities(params).then(res => {
            console.log(res.habilities);
            if (res.habilities) {
                this.data.value = res.habilities[0]["habilidades"];
                this.data.objetosDeConhecimento =
                    res.habilities[0]["objetosDeConhecimento"];
            }
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
