import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { FileDocument } from "app/model/file-document";
import { DocumentModel } from "app/model/document";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ProfilesService } from "app/services/profiles.service";
import { DocumentsService } from "app/main/documents/documents.service";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { filter, takeUntil } from "rxjs/operators";
import { Profile } from "app/model/profile";
import { ProfileCounty } from "app/model/profile-county";
import { PlanningsService } from "../../plannings.service";
import { SchoolService } from "app/main/school/school.service";

@Component({
    selector: "app-annual-upload",
    templateUrl: "./annual-upload.component.html",
    styleUrls: ["./annual-upload.component.scss"]
})
export class AnnualUploadComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;

    formData: FormData = new FormData();
    attachment: FileDocument;
    selectedFile: File;
    hasFile = false;
    file: any;
    filename: any;
    document: DocumentModel;

    currentProfile: any;
    years: any;
    year: any;

    currentSchoolYear: any;

    constructor(
        public dialogRef: MatDialogRef<AnnualUploadComponent>,
        private _profilesService: ProfilesService,
        private _documentsService: DocumentsService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _planningsService: PlanningsService,
        private _schoolsService: SchoolService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log("Hello World AnnualUploadComponent");

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

                        this.getYears();
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

    getYears() {
        if (this.currentProfile["county"]) {
            this._schoolsService
                .getSchoolYearByCounty(
                    this.currentProfile["county"].requested._id
                )
                .then(schoolYears => (this.years = schoolYears))
                .catch();
        } else if (this.currentProfile["school"]) {
            this._schoolsService
                .getSchoolYearByCounty(
                    this.currentProfile["school"].contyInstitutional.requested
                        ._id
                )
                .then(schoolYears => (this.years = schoolYears))
                .catch();
        }
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
        await this._planningsService
            .uploadSchoolYearAttachment(this.formData)
            .then(file => {
                if (file) {
                    this.file = file;
                }
            })
            .catch();

        await this.createDocument();
    }

    async createDocument() {
        this.document = new DocumentModel();
        this.document.$content = this.file.filename;
        this.document.$meta = {
            type: "AnnualPlanning",
            date: new Date(this.year.year),
            course: this.data.course,
            serie: this.data.serie
        };

        console.log("createDocument");
        await this._documentsService
            .createDocument(this.document)
            .then(document => {
                if (document) {
                    this.document = Object.assign(
                        new DocumentModel(),
                        document
                    );
                }
            })
            .catch(error => console.log(error));

        await this.addAttachmentToSchoolYear(this.document.id);
    }

    async addAttachmentToSchoolYear(attachment) {
        console.log("addAttachmentToSchoolYear");
        await this._planningsService
            .editSchoolYearDocument(this.year._id, {
                attachment
            })
            .then(async schoolYear => {
                if (await schoolYear) {
                    await this._schoolsService._currentSchoolYear.next(
                        schoolYear
                    );

                    if (await (schoolYear.attachments.length > 0)) {
                        await this._documentsService.renderFile(
                            schoolYear.attachments[
                                schoolYear.attachments.length - 1
                            ].content
                        );
                        await this._schoolsService.getSchoolYearByCounty(
                            schoolYear.county
                        );
                    }
                    await this._fuseProgressBarService.hide();

                    await this.dialogRef.close();
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
}
