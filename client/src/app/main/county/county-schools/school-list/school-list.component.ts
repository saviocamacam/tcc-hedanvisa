import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ProfilesService } from "../../../../services/profiles.service";
import { takeUntil, filter } from "rxjs/operators";
import { Profile } from "app/model/profile";
import { Subject } from "rxjs";
import { ProfileCounty } from "app/model/profile-county";
import { fuseAnimations } from "@fuse/animations";
import { MatDialog, MatTableDataSource, MatPaginator } from "@angular/material";
import { ProfileSchoolInstitutional } from "app/model/profile-school-institutional";
import { ClassroomService } from "app/main/classroom/classroom.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-school-list",
    templateUrl: "./school-list.component.html",
    styleUrls: ["./school-list.component.scss"],
    animations: fuseAnimations
})
export class SchoolListComponent implements OnInit, OnDestroy {
    profile: Profile;
    institution: any;
    schools: MatTableDataSource<ProfileSchoolInstitutional[]>;

    displayedColumns = [
        "avatar",
        "institutionName" /*"classrooms", "school_managers", "professors"*/
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profilesService: ProfilesService,
        private _classroomService: ClassroomService
    ) {
        console.log("Hello World Schools of County Component");

        this._unsubscribeAll = new Subject<any>();
    }

    ngOnInit() {
        this._profilesService
            .currentProfile()
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(profile => profile instanceof Profile)
            )
            .subscribe(profile => {
                this.profile = Object.assign(new ProfileCounty(), profile);
                if (this.profile.$profileType === "ProfileCounty") {
                    this.institution = profile.$county;
                    if (this.institution.status === "accepted") {
                        this._profilesService
                            .getSchoolsProfiles()
                            .then(schools => {
                                this.schools = new MatTableDataSource(schools);
                                this.schools.paginator = this.paginator;
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                }
            });
    }

    ngOnDestroy() {
        console.log("SchoolListComponent has destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    schoolDetails(school) {
        console.log(school);
        this._classroomService._currentSchool.next(school);
    }

    applyFilter(filterValue: string) {
        this.schools.filter = filterValue.trim().toLowerCase();
    }
}
