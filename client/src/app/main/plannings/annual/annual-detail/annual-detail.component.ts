import { Component, OnInit, OnDestroy } from "@angular/core";
import { SchoolService } from "app/main/school/school.service";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { ProfilesService } from "app/services/profiles.service";
import { Profile } from "app/model/profile";
import { DocumentsService } from "app/main/documents/documents.service";
import { MatDialog } from "@angular/material";
import { AnnualUploadComponent } from "../annual-upload/annual-upload.component";

@Component({
    selector: "app-annual-detail",
    templateUrl: "./annual-detail.component.html",
    styleUrls: ["./annual-detail.component.scss"]
})
export class AnnualDetailComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    currentSchoolYear: any;
    profile: Profile;
    pdfSrc: string;
    hasFile: boolean;

    constructor(
        private _schoolsService: SchoolService,
        private _profilesService: ProfilesService,
        private _documentsService: DocumentsService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World AnnualDetailComponent");

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
                    this.profile = profile;
                },
                error => {
                    console.log(error);
                }
            );

        this._documentsService
            .currentFile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                fileURL => {
                    if (fileURL) {
                        this.pdfSrc = fileURL;
                        this.hasFile = true;
                    } else {
                        this.hasFile = false;
                    }
                },
                error => {
                    console.log(error);
                    this.hasFile = false;
                }
            );
    }

    ngOnDestroy() {
        console.log("AnnualDetailComponent destroyed.");

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
