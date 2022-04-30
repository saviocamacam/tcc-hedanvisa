import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { SchoolService } from "../school.service";
import { ProfilesService } from "app/services/profiles.service";
import { takeUntil, filter } from "rxjs/operators";
import { Profile } from "app/model/profile";
import {
    MatTableDataSource,
    MatPaginator,
    MatSort,
    MatDialog
} from "@angular/material";
import { fuseAnimations } from "@fuse/animations";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";
import { Router } from "@angular/router";

@Component({
    selector: "app-schools-list",
    templateUrl: "./schools-list.component.html",
    styleUrls: ["./schools-list.component.scss"],
    animations: fuseAnimations
})
export class SchoolsListComponent implements OnInit, OnDestroy {
    profile: Profile;
    schools: any;

    isLoading = false;

    displayedColumns = ["name", "classes", "professors", "managers", "updateAt"];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _schoolsService: SchoolService,
        private _profilesService: ProfilesService,
        private _matDialog: MatDialog,
        private _router: Router
    ) {
        console.log("Hello World SchoolsListComponent");

        this._unsubscribeAll = new Subject();
        this.isLoading = true;
    }

    ngOnInit() {
        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(
                profile => {
                    setTimeout(() => {
                        if (profile) {
                            this.profile = profile;
                            if (this.profile.$profileType === "ProfileCounty") {
                                if (
                                    this.profile["county"].status !== "accepted"
                                ) {
                                    this.isLoading = false;
                                    this._matDialog.open(
                                        AttentionAlertDialogComponent,
                                        {
                                            width: "400px",
                                            data: {
                                                justification: `
                                                Você ainda não tem autorização para vizualizar as escolas. 
                                                Entre em contato conosco`
                                            }
                                        }
                                    );
                                } else {
                                    this.getSchoolsByCounty();
                                }
                            }
                        }
                    });
                },
                error => {
                    console.log(error);
                }
            );

        this._schoolsService.onSearchTextChanged.subscribe(searchText => {
            if (this.dataSource) {
                this.dataSource.filter = searchText.trim().toLowerCase();

                if (this.dataSource.paginator) {
                    this.dataSource.paginator.firstPage();
                }
            }
        });
    }

    getSchoolsByCounty() {
        this._schoolsService
            .getSchoolsByCounty(this.profile["county"].requested._id)
            .then(schools => {
                if (schools) {
                    console.log(schools);
                    this.schools = schools;
                    const _schools = [];
                    this.schools.forEach(school => {
                        _schools.push({
                            _id: school._id,
                            name: school.institution.name,
                            classes: school.schoolYearClassrooms[1].classrooms.length,
                            professors: school.professors.length,
                            managers: school.school_managers.length,
                            updateAt: new Date(school.updatedAt),
                        });
                    });
                    // Inicialmente, as escolas veem ordenadas por nome
                    _schools.sort((a, b) => {
                        if (a.name > b.name) {
                            return 1;
                        }
                        if (a.name < b.name) {
                            return -1;
                        }
                        return 0;
                    });
                    this.dataSource = new MatTableDataSource(_schools);
                    setTimeout(() => {
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    });
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
                            "Não foi possível recuperar as escolas no momento."
                    }
                });
            });
    }

    schoolClassrooms(school) {
        console.log(school);
        this._schoolsService.$currentSchoolInstituional = school;
        this._router.navigate([`/escola/${school._id}/turmas`]);
    }

    ngOnDestroy() {
        console.log("SchoolsListComponent destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
