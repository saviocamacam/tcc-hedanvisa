import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { ClassroomService } from "../classroom.service";
import { ProfilesService } from "app/services/profiles.service";
import {
    MatDialog,
    MatTableDataSource,
    MatPaginator,
    MatSort
} from "@angular/material";
import { takeUntil, filter } from "rxjs/operators";
import { Profile } from "app/model/profile";
import { AuthorizationService } from "app/main/authorization/authorization.service";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-professor-list",
    templateUrl: "./professor-list.component.html",
    styleUrls: ["./professor-list.component.scss"],
    animations: fuseAnimations
})
export class ProfessorListComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    profile: Profile;
    classroom: any;
    requests: any;
    professors: any;

    displayedColumns: string[];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _classroomService: ClassroomService,
        private _profilesService: ProfilesService,
        private _authorizationService: AuthorizationService
    ) {
        console.log("Hello World ProfessorListComponent");
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        // Carregando dados das turmas
        this._classroomService
            .currentClassroom()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(classroom => {
                if (classroom) {
                    this.classroom = classroom;
                    setTimeout(() => {
                        if (this.profile) {
                            this.verifiyProfileType();
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
                        this.verifiyProfileType();
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

    ngOnDestroy() {
        console.log("ProfessorListComponent destroyed");

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    verifiyProfileType() {
        if (
            this.profile.$profileType === "ProfileSchool" &&
            this.profile["school"].status === "accepted"
        ) {
            this.getRequests();
        } else if (
            (this.profile.$profileType === "ProfileProfessor" &&
                this.profile["school"].status === "accepted") ||
            (this.profile.$profileType === "ProfileCounty" &&
                this.profile["county"].status === "accepted")
        ) {
            if (this.classroom) {
                this.getProfessors();
            }
        }
    }

    getRequests() {
        this._authorizationService
            .getSchoolProfessorsRequestings(
                this.profile["school"].requested._id
            )
            .then(res => {
                this.requests = res;

                if (this.profile.$profileType !== "ProfileSchool") {
                    this.requests = res.filter(element => {
                        return element.requesting.classrooms.includes(
                            this.classroom._id
                        );
                    });
                }

                const _requests = [];
                this.requests.forEach(request => {
                    _requests.push({
                        _id: request.requesting._id,
                        name: request.requesting.user.people
                            ? request.requesting.user.people.name
                            : request.requesting.user.shortName
                    });
                });

                this.displayedColumns = ["name", "buttons"];

                this.dataSource = new MatTableDataSource(_requests);
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });

                // this.translateProfessorsSubjects(this.professors);
            })
            .catch(err => {
                console.error(err);
            });
    }

    getProfessors() {
        // Carregando os dados dos professores e construindo a estrutura de exibição da tabela
        this._classroomService
            .getProfessors(this.classroom._id)
            .then(professors => {
                if (professors) {
                    this.professors = professors;

                    const _professors = [];
                    this.professors.forEach(professor => {
                        const _classes = [];
                        professor.classrooms.forEach(classroom => 
                            _classes.push(classroom.series.replace(" Ano", "") + " " + classroom.subClass)
                        );
                        _classes.sort();
                        _professors.push({
                            _id: professor._id,
                            name: professor.user.people
                                ? professor.user.people.name
                                : professor.user.shortName,
                            classes: _classes.join(" , "),
                            shortName: professor.user.shortName
                        });
                    });
                    this.displayedColumns = ["name", "classes"];

                    this.dataSource = new MatTableDataSource(_professors);
                    setTimeout(() => {
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    activateProfessor(id) {
        this._classroomService
            .activateProfessor(id, this.classroom._id)
            .then(res => {
                this.getRequests();
            })
            .catch(err => {
                console.log(err);
            });
    }

    professorHasClassroom(professorId) {
        let professor = this.requests.find(
            request => request.requesting._id === professorId
        );
        if (professor) {
            professor = professor.requesting;
            return professor.classrooms.some(
                classroom => classroom["_id"] === this.classroom._id
            );
        }
    }

    deactivateProfessor(id) {
        this._classroomService
            .deactivateProfessor(id, this.classroom._id)
            .then(res => {
                this.getRequests();
            })
            .catch(err => {
                console.log(err);
            });
    }
}
