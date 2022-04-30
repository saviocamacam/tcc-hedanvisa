import { HttpParams } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import {
    Component,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Renderer
} from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { takeUntil, filter } from "rxjs/operators";
import { Subject } from "rxjs";
import { PlanningDatabaseService } from "app/main/plannings/planning-database/planning-database.service";
import { ConfirmDeleteDialogComponent } from "app/main/shared-private/confirm-delete-dialog/confirm-delete-dialog.component";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { Location } from "@angular/common";
import HtmlDiff from "htmldiff-js";
import { ProfilesService } from "app/services/profiles.service";
import { MatDialog } from "@angular/material";

@Component({
    selector: "app-planning-view",
    templateUrl: "./planning-view.component.html",
    styleUrls: ["./planning-view.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PlanningViewComponent implements OnInit, OnDestroy, AfterViewInit {
    discipline: string;
    year: string;
    planning: any;
    @ViewChild("oldHtml") oldHtml: ElementRef;
    @ViewChild("newHtml") newHtml: ElementRef;
    @ViewChild("diffHtml") diffHtml: ElementRef;
    compared = this.planningDatabaseService.planning.version;

    // Private
    private _unsubscribeAll: Subject<any>;
    bla: any;
    compare: any;
    profile: any;
    obj: Object;
    why: string;
    otherVersion: any;

    constructor(
        public planningDatabaseService: PlanningDatabaseService,
        public _planningsService: PlanningsService,
        private _location: Location,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _renderer: Renderer,
        private _profilesService: ProfilesService,
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
        // this.diffHtml = HtmlDiff.execute(this.oldHtml.nativeElement.innerHTML, this.newHtml.nativeElement.innerHTML);

        // this._renderer.setElementProperty(
        //     this.diffHtml.nativeElement,
        //     "innerHTML",
        //     HtmlDiff.execute(
        //         this.oldHtml.nativeElement.innerHTML,
        //         this.newHtml.nativeElement.innerHTML
        //     )
        // );

        this.planningDatabaseService.compare$
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(planning => planning !== null)
            )
            .subscribe(planning => {
                this.compare = planning;
                this.bla = HtmlDiff.execute(
                    planning.content,
                    this.planningDatabaseService.planning.content
                );
            });
    }

    ngAfterViewInit(): void {}

    compareVersion(ev) {
        let params = new HttpParams().set("compare", ev.value);
        this.planningDatabaseService.getPlanning(
            this._activatedRoute.snapshot.params.id,
            this._activatedRoute.snapshot.params.version,
            params
        );
        this.planningDatabaseService.getPlanningVersions(
            this._activatedRoute.snapshot.params.id
        );
    }
    compareAncestralVersion(ev) {
        let foundVersion = this.planningDatabaseService.forkedVerions.find(
            el => el.version == ev.value
        );
        let params = new HttpParams().set("compare", ev.value);
        params = params.set("parent", foundVersion.parent);
        this.planningDatabaseService.getPlanning(
            this._activatedRoute.snapshot.params.id,
            this._activatedRoute.snapshot.params.version,
            params
        );
        this.planningDatabaseService.getPlanningVersions(
            this._activatedRoute.snapshot.params.id
        );
    }
    compareOtherVersion(ev) {
        this.otherVersion = ev.value;
        let foundVersion = this.planningDatabaseService.otherVersions.find(
            el => el.owner._id == ev.value.owner._id && el.version == ev.value.version
        );
        let params = new HttpParams().set("compare", ev.value.version);
        params = params.set("parent", foundVersion.parent);
        this.planningDatabaseService.getPlanning(
            this._activatedRoute.snapshot.params.id,
            this._activatedRoute.snapshot.params.version,
            params
        );
        this.planningDatabaseService.getPlanningVersions(
            this._activatedRoute.snapshot.params.id
        );
    }

    pullRequest(planning) {
        console.log(planning);
        this.dialog
            .open(ConfirmDeleteDialogComponent, {
                width: "400px",
                data: {
                    title: "Deseja enviar sugestão de atualização?",
                    message: "A professora receberá sua sugestão",
                    action: "Enviar"
                }
            })
            .afterClosed()
            .subscribe(response => {
                if (response) {
                    this.planningDatabaseService
                        .pullPlanning(planning, this.why)
                        .then(res => {
                            // console.log(res);

                            this.dialog
                                .open(SuccessAlertDialogComponent, {
                                    width: "400px",
                                    data: {
                                        justification:
                                            "Sugestão enviada com sucesso!"
                                    }
                                })
                                .afterClosed()
                                .subscribe(() => {
                                    this._router.navigate([`../`], {
                                        relativeTo: this._activatedRoute
                                    });
                                });
                        })
                        .catch(error => {
                            // console.log(error);
                            this.dialog.open(ErrorAlertDialogComponent, {
                                width: "400px",
                                data: {
                                    justification:
                                        "Não foi possível realizar sugestão no momento."
                                }
                            });
                        });
                }
            });
    }

    deleteSuggestion(v) {
        console.log(v);
        this.dialog
            .open(ConfirmDeleteDialogComponent, {
                width: "400px",
                data: {
                    title: "Deseja desfazer esta sugestão de atualização?",
                    message: "Sua sugestão não será visível na aula original",
                    action: "Enviar"
                }
            })
            .afterClosed()
            .subscribe(response => {
                if (response) {
                    this.planningDatabaseService
                        .deleteSuggestion(v._id)
                        .then(res => {
                            // console.log(res);

                            this.dialog
                                .open(SuccessAlertDialogComponent, {
                                    width: "400px",
                                    data: {
                                        justification:
                                            "Sugestão desfeita com sucesso!"
                                    }
                                })
                                .afterClosed()
                                .subscribe(() => {
                                    // this._router.navigate([`../`], {
                                    //     relativeTo: this._activatedRoute
                                    // });
                                });
                        })
                        .catch(error => {
                            // console.log(error);
                            this.dialog.open(ErrorAlertDialogComponent, {
                                width: "400px",
                                data: {
                                    justification:
                                        "Não foi possível realizar sugestão no momento."
                                }
                            });
                        });
                }
            });
    }

    changeVersion(ev) {
        this._router.navigate([`../${ev.value}`], {
            relativeTo: this._activatedRoute
        });
    }

    denySuggestion(v) {
        console.log(v);
        // this.planningDatabaseService.denySuggestion(v.pulling, v.pullingVersion);
        this.dialog
            .open(ConfirmDeleteDialogComponent, {
                width: "400px",
                data: {
                    title: "Deseja recusar esta sugestão?",
                    message:
                        "Uma nova sugestão poderá ser feita posteriormente!"
                }
            })
            .afterClosed()
            .subscribe(response => {
                if (response) {
                    this.planningDatabaseService
                        .denySuggestion(v._id)
                        .then(res => {
                            // console.log(res);

                            this.dialog
                                .open(SuccessAlertDialogComponent, {
                                    width: "400px",
                                    data: {
                                        justification:
                                            "Sugestão recusada com sucesso!"
                                    }
                                })
                                .afterClosed()
                                .subscribe(() => {
                                    // this._router.navigate(["../../../../"]);
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

    acceptSuggestion(v) {
        console.log(v);
        // this.planningDatabaseService.denySuggestion(v.pulling, v.pullingVersion);
        this.dialog
            .open(ConfirmDeleteDialogComponent, {
                width: "400px",
                data: {
                    title: "Deseja aceitar esta sugestão?",
                    message:
                        "Esta sugestão será incorporada ao histórico da aula!"
                }
            })
            .afterClosed()
            .subscribe(response => {
                if (response) {
                    this.planningDatabaseService
                        .acceptSuggestion(v._id)
                        .then(res => {
                            // console.log(res);

                            this.dialog
                                .open(SuccessAlertDialogComponent, {
                                    width: "400px",
                                    data: {
                                        justification:
                                            "Sugestão aceita com sucesso!"
                                    }
                                })
                                .afterClosed()
                                .subscribe(() => {
                                    // this._router.navigate(["../../../../"]);
                                });
                        })
                        .catch(error => {
                            console.log(error);
                            this.dialog.open(ErrorAlertDialogComponent, {
                                width: "400px",
                                data: {
                                    justification:
                                        "Não foi possível aceitar a sugestão no momento."
                                }
                            });
                        });
                }
            });
    }

    getCompare(v) {
        this.planningDatabaseService.getSuggestion(v.pulling, v.pullingVersion);
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
                                    this._router.navigate(["../../../../"]);
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

    ngOnDestroy(): void {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    back() {
        this._location.back();
    }
}
