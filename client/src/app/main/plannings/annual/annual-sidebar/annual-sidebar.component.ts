import { Component, OnInit, OnDestroy } from "@angular/core";
import { SchoolService } from "app/main/school/school.service";
import { Subject } from "rxjs";
import { ProfilesService } from "app/services/profiles.service";
import { filter, takeUntil } from "rxjs/operators";
import { Profile } from "app/model/profile";
import { DocumentsService } from "app/main/documents/documents.service";
import { MatDialog } from "@angular/material";
import { AnnualUploadComponent } from "../annual-upload/annual-upload.component";

@Component({
    selector: "app-annual-sidebar",
    templateUrl: "./annual-sidebar.component.html",
    styleUrls: ["./annual-sidebar.component.scss"]
})
export class AnnualSidebarComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;

    profile: Profile;
    schoolYear: any;
    currentSchoolYear: any;

    courses: any;
    course: any;
    years: any;
    year: any;

    attachments: any[];
    attachment: any;

    constructor(
        private _schoolsService: SchoolService,
        private _profilesService: ProfilesService,
        private _documentsService: DocumentsService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World AnnualSidebarComponent");

        this._unsubscribeAll = new Subject();
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
                    if (profile) {
                        this.profile = profile;
                    }
                },
                error => {
                    console.log(error);
                }
            );

        this.courses = this._profilesService.getCourseLevels();
    }

    ngOnDestroy() {
        console.log("AnnualSidebarComponent destroyed");

        this._documentsService._currentFile.next(null);
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getSchoolYear(countyId) {
        this._schoolsService
            .getSchoolYearByCounty(countyId)
            .then(schoolYear => {
                if (schoolYear) {
                    this.schoolYear = schoolYear;
                    this.attachments = [];
                    this.schoolYear.forEach(_schoolYear => {
                        if (
                            _schoolYear.attachments &&
                            _schoolYear.attachments.length > 0
                        ) {
                            _schoolYear.attachments.forEach(attachment => {
                                if (
                                    attachment.meta.type === "AnnualPlanning" &&
                                    attachment.meta.course === this.course &&
                                    attachment.meta.serie === this.year
                                ) {
                                    this.attachments.push(attachment);
                                }
                            });
                        }
                    });

                    if (this.attachments.length > 0) {
                        this.onAttachmentChange(
                            this.attachments[this.attachments.length - 1]
                        );
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    onAttachmentChange(attachment) {
        this.attachment = attachment;
        this._documentsService.renderFile(attachment.content);
    }

    courseChanged(course) {
        this.year = null;
        this.attachments = [];

        if (course === "f1") {
            this.years = this._profilesService.changeYearsRange(1, 5);
        } else if (course === "f2") {
            this.years = this._profilesService.changeYearsRange(6, 9);
        } else if (course === "medio") {
            this.years = this._profilesService.changeYearsRange(1, 3);
        } else if (course === "superior") {
            this.years = this._profilesService.changeYearsRange(1, 7);
        } else if (course === "eja") {
            this.years = this._profilesService.changeYearsRange(1, 9);
        }
    }

    yearChanged(year) {
        this.year = year;
        this._documentsService.renderFile(null);

        if (
            this.profile["county"] &&
            this.profile["county"].status === "accepted"
        ) {
            this.getSchoolYear(this.profile["county"].requested._id);
        } else if (
            this.profile["school"] &&
            this.profile["school"].status === "accepted"
        ) {
            this.getSchoolYear(
                this.profile["school"].requested.countyInstitutional._id
            );
        }
    }

    newDocument() {
        const dialogRef = this._matDialog.open(AnnualUploadComponent, {
            width: "600px",
            data: {
                course: this.course,
                serie: this.year
            }
        });

        dialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                this.yearChanged(this.year);
            }, 1000);
        });
    }
}
