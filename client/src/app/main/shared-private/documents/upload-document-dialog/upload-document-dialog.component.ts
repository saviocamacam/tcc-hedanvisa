import { Component, OnInit, OnDestroy } from "@angular/core";
import { DocumentsService } from "../documents.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { FileDocument } from "app/model/file-document";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { DailyService } from "app/main/plannings/daily/daily.service";

import { Subject } from "rxjs";

@Component({
    selector: "app-upload-document-dialog",
    templateUrl: "./upload-document-dialog.component.html",
    styleUrls: ["./upload-document-dialog.component.scss"]
})
export class UploadDocumentDialogComponent implements OnInit, OnDestroy {
    selectedFile: File;
    formData: FormData = new FormData();
    hasFile: Boolean = false;
    file: any;

    currentDocument: any;
    attachments: any[];
    currentPlanning: any;

    document: FileDocument;
    documentForm: FormGroup;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _documentsService: DocumentsService,
        private _formBuilder: FormBuilder,
        private _fuseProgressBarService: FuseProgressBarService,
        private _dailyService: DailyService
    ) {
        console.log("Hello World UploadDocumentDialog Component");
        this._unsubscribeAll = new Subject();
        this.document = new FileDocument();
        this.documentForm = this.createDocumentForm();
    }

    ngOnInit() {}

    onFileChanged(event) {
        this.selectedFile = event.target.files[0];
        if (this.selectedFile) {
            this.hasFile = true;
        }

        this.documentForm.controls["filename"].setValue(
            this.selectedFile.name.split(".")[0]
        );
    }

    async onSubmit() {
        this._fuseProgressBarService.show();

        this.formData.append("file", this.selectedFile);
        await this._documentsService
            .uploadFile(this.formData)
            .then(file => {
                this.file = file;
            })
            .catch(error => {
                console.log("Component error");
                console.log(error);
            });

        this.documentForm.controls["filename"].setValue(
            this.documentForm.value.filename +
                "." +
                this.selectedFile.name.split(".")[1]
        );
        this.documentForm.controls["filetype"].setValue(this.file.contentType);
        this.documentForm.controls["hashname"].setValue(this.file.filename);

        await this._documentsService
            .createDocument({
                owner: this.documentForm.value.owner,
                meta: {
                    name: this.documentForm.value.filename,
                    type: this.documentForm.value.filetype,
                    hashname: this.documentForm.value.hashname
                }
            })
            .then(document => {
                this.currentDocument = document;
            })
            .catch(error => {
                console.log(error);
            });

        await this._dailyService.currentPlanning.subscribe(planning => {
            this.currentPlanning = planning;
        });

        this.attachments = this.currentPlanning.attachments;
        this.attachments.push(this.currentDocument._id);
        this.currentPlanning.attachments = this.attachments;

        await this._dailyService.update(
            this.currentPlanning,
            this.currentPlanning._id
        );

        await this._dailyService.getAttachments();

        this._fuseProgressBarService.hide();
    }

    createDocumentForm(): FormGroup {
        return this._formBuilder.group({
            owner: [null, this.document.$owner],
            filename: [null, this.document.$filename],
            filetype: [null, this.document.$filetype],
            hashname: [null, this.document.$hashname]
        });
    }

    ngOnDestroy() {
        console.log("UploadDocumentDialogComponent destroyed.");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
