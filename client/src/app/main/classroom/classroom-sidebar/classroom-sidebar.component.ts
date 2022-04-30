import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";

import { Profile } from "app/model/profile";
import { MatDialog } from "@angular/material";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";

import { ProfilesService } from "../../../services/profiles.service";
import { ClassroomService } from "../classroom.service";
import { SchoolYearService } from "app/services/school-year.service";

import { SchoolYearClassroomComponent } from "../school-year-classroom/school-year-classroom.component";

import DateUtils from "app/utils/date-utils";

@Component({
    selector: "app-classroom-sidebar",
    templateUrl: "./classroom-sidebar.component.html",
    styleUrls: ["./classroom-sidebar.component.scss"]
})
export class ClassroomSidebarComponent implements OnInit, OnDestroy {
    msgErrors = {
        classroom: "Não foi possível recuperar as turmas no momento."
    };

    profile: any;

    years: any; // SchoolYearsClassroom

    year: any;
    yearSelected: any;

    periodsDefault: any;
    periods: any;
    periodSelected: any;

    classrooms: any;
    _classrooms: any;

    isFrequencyPage = false;

    currentClassroom: any;
    currentSchoolYear: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _classRoomService: ClassroomService,
        private _profilesService: ProfilesService,
        private _route: ActivatedRoute,
        private _matDialog: MatDialog,
        private _schoolYearService: SchoolYearService
    ) {
        this._unsubscribeAll = new Subject<any>();

        this.setDefaultPeriods();
    }

    setDefaultPeriods(year?) {
        const currentYear = year || new Date().getFullYear();
        this.periodsDefault = [{
            start: { start: `${currentYear}-01-01` },
            end: { start: `${currentYear}-12-31` },
            formated: "Todos"
        }];
    }

    ngOnInit() {
        this._classRoomService
            .currentClassroom()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(classroom => {
                if (classroom) {
                    this.currentClassroom = classroom;
                }
            });

        this._profilesService
            .currentProfile()
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(profile => profile instanceof Profile)
            )
            .subscribe(profile => {
                this.profile = profile;
            });

        this._classRoomService
            .isFrequencyPage()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(isFrequencyPage => {
                this.isFrequencyPage = isFrequencyPage;
                // if (this.isFrequencyPage) {
                // this.getPeriods();
                // }
            });

        setTimeout(() => {
            let schoolId;
            if (this.profile.profileType === "ProfileCounty") {
                schoolId = this._route.snapshot.paramMap.get("school_id");
            } else if (this.profile.profileType === "ProfileSchool") {
                schoolId = this.profile["school"].requested._id;
            } else if (this.profile.profileType === "ProfileProfessor") {
                // this.getClassroomsByProfessor(this.profile.id);
                schoolId = this.profile["school"].requested._id;
            }
            this.getSchoolYearClassroom(schoolId);
        });
    }

    ngOnDestroy(): void {
        this._matDialog.closeAll();
        this._classRoomService._currentClassroom.next(null);

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getPeriodDefault(year: number) {
        return {
            start: { start: `${year}-01-01` },
            end: { start: `${year + 1}-01-01` },
            formated: "Todos"
        };
    }

    beginSetup() {
        if (this.years.length > 0) {
            // Configurando o ano inicial de exibição
            const currentDate = new Date().toISOString();
            const currentYear = currentDate.slice(0, 4);
            this.year = this.years.find(year => {
                return year.schoolYear.year.slice(0, 4) === currentYear;
            });
            this.periods = [...this.year.schoolYear.periods];
            this.periods.push(this.getPeriodDefault(Number(currentYear)));
            this.initialSelectPeriod();
            this.onPeriodChange();
            return true;
        }
        return false;
    }

    initialSelectPeriod() {
        const currentDate = new Date().toISOString();
        this.periodSelected = this.periods.find(period =>
            DateUtils.between(currentDate, period.start.start, period.end.start)
        );
        if (!this.periodSelected) {
            this.periodSelected = this.periods[this.periods.length - 1];
        }
    }

    getSchoolYearClassroom(schoolId) {
        // Carregando os anos escolares de um escola (Não acessível por professor)
        this._classRoomService
            .getSchoolYearClassroomBySchool(schoolId)
            .then(schoolYearClassroom => {
                if (schoolYearClassroom) {
                    this.years = schoolYearClassroom;
                    this.years.forEach((year, index_y) => {
                        year.schoolYear.periods
                            .sort((a, b) => {
                                a.start.start < b.start.start ? 1 : 0;
                            })
                            .forEach((period, index_p) => {
                                const start = DateUtils.fastFormat(period.start.start);
                                const end = DateUtils.fastFormat(period.end.start);
                                this.years[index_y].schoolYear.periods[index_p]
                                    .formated = `${start} - ${end}`;
                                this.years[index_y].schoolYear.periods[index_p]
                                    .period = index_p + 1
                                const n = this.years[index_y].schoolYear
                                    .periods.length;
                                this.years[index_y].schoolYear.periods[index_p]
                                    .periodType = n === 2
                                        ? "Semestre" : n === 3
                                        ? "Trimestre" : n === 4
                                        ? "Bimestre" : "Anual";
                            });
                    });
                    if (this.beginSetup()) {
                        this.yearSelected = this.year._id;
                        this.onYearChange();
                    }
                }
            })
            .catch(error => this.handlerError(error, this.msgErrors.classroom));
    }

    getClassroomsByProfessor(profileId) {
        // Carregando as turmas de um professor (Somente para professores)
        this._classRoomService
            .getClassroomsByProfessor(profileId)
            .then(classrooms => {
                if (classrooms) {
                    this._classrooms = classrooms;
                    this.years = classrooms.filter(classroom => {
                        return !this.years.find(
                            year => year._id === classroom.year._id
                        );
                    });
                    if (this.beginSetup()) {
                        this.onYearChangeToProfessors(this.year._id);
                    }
                }
            })
            .catch(error => this.handlerError(error, this.msgErrors.classroom));
    }

    getPeriods() {
        console.log("getPeriods");
        /*
        this._schoolsService
            .getCurrentSchoolYearBySchool(this.profile["school"].requested._id)
            .then(currentSchoolYear => {
                this.currentSchoolYear = currentSchoolYear;
            })
            .catch(error => {
                console.log(error);
            });
        */
    }

    onYearChange() {
        const year = this.years.find(year => year._id === this.yearSelected);
 
        this.setDefaultPeriods(Number(year.schoolYear.year.slice(0,4)));

        const schoolYear = Number(year.schoolYear.year.slice(0, 4));
        this.periods = [...year.schoolYear.periods];
        this.periods.push(this.getPeriodDefault(schoolYear));
        this.initialSelectPeriod();
        this.onPeriodChange();

        if (this.profile.profileType === "ProfileProfessor") {
            year.classrooms = year.classrooms.filter(classroom => {
                return this.profile.classrooms.some(
                    element => element._id === classroom._id
                );
            });
        }

        this.setClassrooms(year.classrooms);
    }

    onYearChangeToProfessors(year) {
        this.yearSelected = year;

        const classrooms = this._classrooms.filter(
            _classroom => _classroom.year._id === this.yearSelected
        );

        this.setClassrooms(classrooms);
    }

    onPeriodChange() {
        this._schoolYearService.currentPeriod.next(this.periodSelected);
    }

    setClassrooms(classrooms) {
        this.classrooms = classrooms;
        if (this.classrooms && this.classrooms.length) {
            this.classrooms.sort((a, b) => {
                if (a.series > b.series) return 1;
                if (a.series < b.series) return -1;
                if (a.subClass > b.subClass) return 1;
                if (a.subClass < b.subClass) return -1;
                return 0;
            });

            this.changeClassroom(this.classrooms[0]);
        } else {
            this.changeClassroom(null);
        }
    }

    newSchoolYearClassroom() {
        const dialogRef = this._matDialog.open(SchoolYearClassroomComponent, {});

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.getSchoolYearClassroom(res.schoolYearClassroom.school);
            }
        });
    }

    changeClassroom(classroom): void {
        this.currentClassroom = classroom;
        this._classRoomService._currentClassroom.next(classroom);
    }

    handlerError(error, message) {
        console.error(error);
        this._matDialog.open(ErrorAlertDialogComponent, {
            width: "400px",
            data: { justification: message }
        });
    }
}
