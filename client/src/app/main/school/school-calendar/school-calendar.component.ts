import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProfilesService } from "app/services/profiles.service";
import { Profile } from "app/model/profile";
import { takeUntil, filter } from "rxjs/operators";
import { Subject } from "rxjs";
import { ProfileComunity } from "app/model/profile-comunity";
import { ProfileCounty } from "app/model/profile-county";
import { CountySchoolsService } from "../../county/county-schools/county-schools.service";
import { SchoolYear } from "app/model/school-year";
import { MatDialog } from "@angular/material";
import { SchoolYearComponent } from "../school-year/school-year.component";
import profiles from "../../../fake-db/profiles";
import { SchoolService } from "../school.service";

@Component({
    selector: "app-school-calendar",
    templateUrl: "./school-calendar.component.html",
    styleUrls: ["./school-calendar.component.scss"]
})
export class SchoolCalendarComponent implements OnInit, OnDestroy {
    profile: ProfileCounty;
    schoolYears: [{}];

    currentSchoolYear: SchoolYear;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profilesService: ProfilesService,
        private _schoolsService: SchoolService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World SchoolCalendarComponent");

        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.getCurrentProfile();
    }

    ngOnDestroy() {
        console.log("SchoolCalendarComponent has Destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getCurrentProfile() {
        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(
                profile => {
                    this.profile = profile;
                    console.log(this.profile);
                    if (profile) {
                        this.getSchoolYearByCounty();
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }

    getSchoolYearByCounty() {
        this._schoolsService
            .getSchoolYearByCounty(this.profile.$role.county)
            .then(schoolYears => {
                schoolYears.forEach(schoolYear => {
                    schoolYear.regime = profiles.periods.find(
                        period => period.value === schoolYear.regime
                    );
                });
                this.schoolYears = schoolYears;
                console.log(this.schoolYears);
            })
            .catch(err => {
                console.log(err);
            });
    }

    async openSchoolYearForm(currentSchoolYear) {
        this.currentSchoolYear = await currentSchoolYear;
        await this._schoolsService._currentSchoolYear.next(
            this.currentSchoolYear
        );

        const yearsAlreadyExist = [];
        this.schoolYears.forEach(schoolYear => {
            yearsAlreadyExist.push(schoolYear["year"].substring(0, 4));
        });

        const dialogRef = await this._matDialog.open(SchoolYearComponent, {
            width: "600px",
            data: {
                yearsAlreadyExist
            }
        });

        await dialogRef.afterClosed().subscribe(() => {
            this.getSchoolYearByCounty();
        });
    }
}
