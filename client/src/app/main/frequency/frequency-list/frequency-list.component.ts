import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { Profile } from "app/model/profile";
import { ProfilesService } from "app/services/profiles.service";
import { takeUntil, filter } from "rxjs/operators";
import { FrequencyService } from "../frequency.service";
import { ClassroomService } from "app/main/classroom/classroom.service";
import {
    MatTableDataSource,
    MatPaginator,
    MatSort,
    MatDialog
} from "@angular/material";
import { fuseAnimations } from "@fuse/animations";
import { FrequencyFormComponent } from "../frequency-form/frequency-form.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { ConfirmDeleteDialogComponent } from "../../shared-private/confirm-delete-dialog/confirm-delete-dialog.component";
import { SchoolYearService } from "app/services/school-year.service";

@Component({
    selector: "app-frequency-list",
    templateUrl: "./frequency-list.component.html",
    styleUrls: ["./frequency-list.component.scss"],
    animations: fuseAnimations
})
export class FrequencyListComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    profile: Profile;
    classroom: any;
    frequencies: any;
    dataSource = {
        data: [],
        backup: []
    };

    frequenciesLength = 0;
    orderColumn = "date";
    orderDirection = "desc";

    isLoading = false;

    // dataSource: MatTableDataSource<any>;
    displayedColumns = ["date", "updatedAt", "owner", "content", "menu"];

    period: any;

    constructor(
        private _profilesService: ProfilesService,
        private _classroomService: ClassroomService,
        private _frequencyService: FrequencyService,
        private _schoolYearService: SchoolYearService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World FrequencyListComponent");
        this._unsubscribeAll = new Subject();
        this.isLoading = true;
    }

    loadUserProfile() {
        // Carregando dados do perfil do usuário
        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(
                profile => {
                    this.profile = profile;
                },
                error => {
                    console.log(error);
                }
            );
    }

    loadSchoolYearPeriodData() {
        // Carregando os dados dos periodos de uma escola (Periodos dos (bi|tri|se)mestres)
        this._schoolYearService.currentPeriod
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(period => period != null)
            )
            .subscribe(period => {
                if (this.paginator) {
                    this.paginator.pageIndex = 0;
                }
                this.period = period;
                this.getFrequenciesPage();
            });
    }

    /*
    loadClassroomInformations() {
        // Carregando as informações da turma, como alunos, frequencias, horario, série...
        this._classroomService
            .currentClassroom()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(classroom => {
                setTimeout(() => {
                    this.classroom = classroom;
                    if (this.classroom) {
                        this.getFrequencies(this.classroom._id);
                    }
                    this.isLoading = false;
                });
            });
    }
    */

    loadClassroomInformationsPage() {
        this._classroomService
            .currentClassroom()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(classroom => {
                this.classroom = classroom;
                this.getFrequenciesPage();
            });
    }

    ngOnInit() {
        this.loadUserProfile();
        this.loadSchoolYearPeriodData();
        this.loadClassroomInformationsPage();
        // this.loadClassroomInformations();
        this._frequencyService.onSearchTextChanged.subscribe(searchText => {
            if (this.dataSource) {
                this.dataSource.data = this.dataSource.backup.filter(
                    frequency => {
                        return Object.values(frequency)
                            .join("")
                            .toLowerCase()
                            .match(searchText.trim().toLowerCase());
                    }
                );

                if (this.paginator) {
                    this.paginator.firstPage();
                }
            }
        });
        this.isLoading = false;
    }

    onPaginateChange() {
        this.getFrequenciesPage();
    }

    onSortChange(event) {
        this.orderColumn = event.active;
        this.orderDirection = event.direction;

        if (this.frequenciesLength > this.paginator.pageSize) {
            this.paginator.pageIndex = 0;
        }
        if (this.orderDirection !== "") { this.getFrequenciesPage(); }
    }

    /*
    getFrequencies(classroomId) {
        this._frequencyService
            .getClassroomFrequencies(classroomId)
            .then(frequencies => {
                if (frequencies) {
                    this.frequencies = frequencies;
                    const _frequencies = this.frequencies.map(frequency => {
                        return {
                            _id: frequency._id,
                            date: frequency.date,
                            showDate: moment(frequency.date).format("DD/MM/YYYY"),
                            owner: frequency.owner.user.people.name,
                            owner_shortName: frequency.owner.user.people.shortName,
                            owner_id: frequency.owner._id,
                            content: frequency.content,
                            students: frequency.students
                        };
                    });
                    this.isLoading = false;

                    this.dataSource = _frequencies;
                    // setTimeout(() => {
                    //     this.dataSource.paginator = this.paginator;
                    //     this.dataSource.sort = this.sort;
                    // });
                }

                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;

                console.log(error);

                this._matDialog.open(ErrorAlertDialogComponent, {
                    width: "400px",
                    data: {
                        justification:
                            "Não foi possível recuperar as Frequências no momento."
                    }
                });
            });
    }
    */

    getFrequenciesPage() {
        if (!this.classroom) {
            return;
        }
        this._frequencyService
            .getClassroomFrequenciesPageFilterPeriod(
                this.classroom._id,
                this.paginator ? this.paginator.pageIndex : 0,
                this.paginator ? this.paginator.pageSize : 10,
                this.orderDirection,
                this.orderColumn,
                this.period.start.start,
                this.period.end.start
            )
            .then(data => {
                if (data.frequencies) {
                    this.frequencies = data.frequencies;
                    const _frequencies = this.frequencies.map(frequency => {
                        return {
                            _id: frequency._id,
                            date: frequency.date,
                            owner: frequency.owner.user.people.name,
                            owner_shortName:
                                frequency.owner.user.shortName,
                            owner_id: frequency.owner._id,
                            content: frequency.content,
                            obs: frequency.obs,
                            students: frequency.students,
                            updatedAt: frequency.updatedAt
                        };
                    });
                    this.frequenciesLength = data.length;
                    this.dataSource.data = _frequencies;
                    this.dataSource.backup = _frequencies;
                }
                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;

                console.log(error);

                this._matDialog.open(ErrorAlertDialogComponent, {
                    width: "400px",
                    data: {
                        justification:
                            "Não foi possível recuperar as Frequências no momento."
                    }
                });
            });
    }

    viewFrequency(frequency) {
        const dialogRef = this._matDialog.open(FrequencyFormComponent, {
            disableClose: true,
            panelClass: "custom-dialog-container",
            data: {
                action: "view",
                frequency
            }
        });

        dialogRef.afterClosed().subscribe(() => {
            this._classroomService._currentClassroom.next(this.classroom);
        });
    }

    deleteFrequency(frequency) {
        this._matDialog
            .open(ConfirmDeleteDialogComponent, {
                width: "400px",
                data: {
                    title: "Deseja excluir a chamada?",
                    message: "Essa ação não poderá ser desfeita!"
                }
            })
            .afterClosed()
            .subscribe(response => {
                if (response) {
                    this._frequencyService
                        .deleteFrequency(frequency._id)
                        .then(res => {
                            this._matDialog
                                .open(SuccessAlertDialogComponent, {
                                    width: "400px",
                                    data: {
                                        justification:
                                            "Frequência deletada com sucesso!"
                                    }
                                })
                                .afterClosed()
                                .subscribe(() => {
                                    this._classroomService._currentClassroom.next(
                                        this.classroom
                                    );
                                });
                        })
                        .catch(error => {
                            console.log(error);
                            this._matDialog.open(ErrorAlertDialogComponent, {
                                width: "400px",
                                data: {
                                    justification:
                                        "Não foi possível excluir a frequência no momento."
                                }
                            });
                        });
                }
            });
    }

    editFrequency(frequency) {
        console.log(frequency);
        const dialogRef = this._matDialog.open(FrequencyFormComponent, {
            disableClose: true,
            panelClass: "custom-dialog-container",
            data: {
                action: "edit",
                frequency
            }
        });

        dialogRef.afterClosed().subscribe(() => {
            this._classroomService._currentClassroom.next(this.classroom);
        });
    }

    ngOnDestroy() {
        console.log("FrequencyListComponent destroyed.");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
