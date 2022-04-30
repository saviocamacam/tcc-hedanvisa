import { Component, OnInit, OnDestroy, Input } from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { ProfilesService } from "app/services/profiles.service";
import { ClassroomService } from "app/main/classroom/classroom.service";
import { Profile } from "app/model/profile";
import { ProfileProfessor } from "app/model/profile-professor";
import { ProfileSchool } from "app/model/profile-school";
import { CountySchoolsService } from "../../county/county-schools/county-schools.service";

@Component({
    selector: "app-ptd",
    templateUrl: "./ptd.component.html",
    styleUrls: ["./ptd.component.scss"]
})
export class PtdComponent implements OnInit, OnDestroy {
    @Input()
    dataModel: any;

    schoolYears: any[];
    years = [];
    schoolYearSelected: any;
    regime: any;
    periods: any;
    periodSelected: any;
    view = false;
    profile: any;
    classrooms: any;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _schoolYearsService: CountySchoolsService,
        private _profilesService: ProfilesService,
        private _classroomService: ClassroomService
    ) {
        console.log("Hello World PtdComponent");

        this._unsubscribeAll = new Subject();
    }

    /**
     * Lifecycle Hooks
     */
    ngOnInit() {
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
                },
                error => {
                    console.log(error);
                }
            );

        this.periods = this._profilesService.fakeProfiles.periods;
        console.log(this.periods);

        this._schoolYearsService
            .schoolYearList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                schoolYears => {
                    if (schoolYears) {
                        this.schoolYears = schoolYears;
                        // if (this.schoolYears.length > 0) {
                        //     this.schoolYearChanged(this.schoolYears[this.schoolYears.length - 1]);
                        // }
                    }
                },
                error => {
                    console.log(error);
                }
            );

        if (this.profile.profileType === "ProfileSchool") {
            this._classroomService
                .getClassRoomsBySchoolId(this.profile.school._id)
                .then(classrooms => {
                    this.classrooms = classrooms;
                    console.log(this.classrooms);
                })
                .catch(error => {
                    console.log(error);
                });
        } else if (this.profile.profileType === "ProfileProfessor") {
            this._classroomService
                .getClassroomsByProfessor(this.profile._id)
                .then(classrooms => {
                    this.classrooms = classrooms;
                    console.log(this.classrooms);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    ngOnDestroy() {
        console.log("PtdComponent has destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getView() {
        this.view = true;
    }

    save() {
        console.log(this.dataModel);
    }

    schoolYearChanged() {}
}
