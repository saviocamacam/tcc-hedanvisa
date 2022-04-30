import { Component, OnInit, OnDestroy } from "@angular/core";
import { CountyPlanningsService } from "../../county-plannings.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DocumentsService } from "app/main/documents/documents.service";
import { PDFProgressData } from "pdfjs-dist";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { MatDialog } from "@angular/material";
import { CountyAnnualPlanningUploadComponent } from "../county-annual-planning-upload/county-annual-planning-upload.component";
import { ProfilesService } from "app/services/profiles.service";

@Component({
    selector: "app-county-annual-planning-detail",
    templateUrl: "./county-annual-planning-detail.component.html",
    styleUrls: ["./county-annual-planning-detail.component.scss"]
})
export class CountyAnnualPlanningDetailComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    attachment: any;
    currentFile: any;
    pdfSrc: any;
    currentProfile: any;
    hasFile = false;

    constructor(
        private _documentsService: DocumentsService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matDialog: MatDialog,
        private _profilesService: ProfilesService
    ) {
        console.log("Hello World CountyAnnualPlanningDetailComponent");
        this._unsubscribeAll = new Subject();
        this._fuseProgressBarService.setMode("indeterminate");
    }

    ngOnInit() {
        this._profilesService
            .currentProfile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                profile => {
                    this.currentProfile = profile;
                    console.log(this.currentProfile);
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

    onProgress(progressData: PDFProgressData) {
        this._fuseProgressBarService.show();
    }

    afterLoadCompete(e) {
        console.log("afterLoadCompete");
    }

    textLayerRendered(e) {
        console.log("textLayerRendered");
        this._fuseProgressBarService.hide();
    }

    newDocument() {
        this._matDialog.open(CountyAnnualPlanningUploadComponent, {
            width: "600px"
        });
    }

    ngOnDestroy(): void {
        console.log("CountyAnnualPlanningDetailComponent destroyed.");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
