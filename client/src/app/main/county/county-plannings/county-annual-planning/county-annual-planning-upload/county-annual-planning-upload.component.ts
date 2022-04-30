import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { FileDocument } from "app/model/file-document";
import { CountyPlanningsService } from "../../county-plannings.service";
import { DocumentsService } from "app/main/documents/documents.service";
import { DocumentModel } from "app/model/document";
import { takeUntil, filter } from "rxjs/operators";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { ProfilesService } from "app/services/profiles.service";
import { Profile } from "app/model/profile";
import { ProfileCounty } from "app/model/profile-county";
import { SchoolYear } from "app/model/school-year";
import { CountySchoolsService } from "../../../county-schools/county-schools.service";

@Component({
    selector: "app-county-annual-planning-upload",
    templateUrl: "./county-annual-planning-upload.component.html",
    styleUrls: ["./county-annual-planning-upload.component.scss"]
})
export class CountyAnnualPlanningUploadComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;

    formData: FormData = new FormData();
    attachment: FileDocument;
    selectedFile: File;
    hasFile = false;
    file: any;
    filename: any;
    document: DocumentModel;

    currentAnnualPlanning: any;

    currentProfile: any;

    constructor(
        public dialogRef: MatDialogRef<CountyAnnualPlanningUploadComponent>,
        private _countyPlanningsService: CountyPlanningsService,
        private _countySchoolsService: CountySchoolsService,
        private _profilesService: ProfilesService,
        private _documentsService: DocumentsService,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        console.log("Hello World CountyAnnualPlanningUploadComponent");

        this._unsubscribeAll = new Subject();

        this.attachment = new FileDocument();

        this._fuseProgressBarService.setMode("indeterminate");
    }

    ngOnInit() {
        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(
                currentProfile => {
                    if (currentProfile) {
                        this.currentProfile = Object.assign(
                            new ProfileCounty(),
                            currentProfile
                        );
                    }

                    console.log(this.currentProfile);
                },
                error => {
                    console.log(error);
                }
            );

        this._countyPlanningsService
            .currentAnnualPlanning()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                currentAnnualPlanning => {
                    if (currentAnnualPlanning) {
                        this.currentAnnualPlanning = currentAnnualPlanning;
                        console.log(this.currentAnnualPlanning);
                    }
                },
                error => {
                    console.log(error);
                }
            );
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onFileChanged(event) {
        this.selectedFile = event.target.files[0];
        if (this.selectedFile) {
            this.hasFile = true;
            this.filename = this.selectedFile.name.split(".")[0];
        }
    }

    async onSubmit() {
        console.log("onSubmit");
        await this._fuseProgressBarService.show();
        await this.formData.append("file", this.selectedFile);
        await this._countyPlanningsService
            .uploadSchoolYearAttachment(this.formData)
            .then(file => {
                if (file) {
                    this.file = file;
                    console.log(this.file);
                }
            })
            .catch(error => console.log(error));

        await this.createDocument();
    }

    async createDocument() {
        this.document = new DocumentModel();
        this.document.$content = this.file.filename;

        console.log("createDocument");
        await this._documentsService
            .createDocument(this.document)
            .then(document => {
                if (document) {
                    this.document = Object.assign(
                        new DocumentModel(),
                        document
                    );

                    console.log(this.document);
                }
            })
            .catch(error => console.log(error));

        await this.addAttachmentToSchoolYear(this.document.id);
    }

    async addAttachmentToSchoolYear(attachment) {
        console.log("addAttachmentToSchoolYear");
        await this._countyPlanningsService
            .editSchoolYearDocument(this.currentAnnualPlanning._id, {
                attachment
            })
            .then(async schoolYear => {
                await console.log(schoolYear);
                if (await schoolYear) {
                    await console.log(schoolYear);
                    await this._countyPlanningsService._currentAnnualPlanning.next(
                        schoolYear
                    );

                    if (await (schoolYear.attachments.length > 0)) {
                        await console.log("schoolYear.attachments.length > 0");

                        await this._documentsService.renderFile(
                            schoolYear.attachments[0].content
                        );
                        await this._countySchoolsService.getSchoolYearByCounty(
                            schoolYear.county
                        );
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
        await this._fuseProgressBarService.hide();

        await this.dialogRef.close();
    }
}
