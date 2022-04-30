import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material";
import { UploadDocumentDialogComponent } from "../../documents/upload-document-dialog/upload-document-dialog.component";
import { DocumentsService } from "../../documents/documents.service";
import { Subject } from "rxjs";
import { DailyService } from "../../plannings/daily/daily.service";

@Component({
    selector: "app-documents-attachments",
    templateUrl: "./document-attachments.component.html",
    styleUrls: ["./document-attachments.component.scss"]
})
export class DocumentAttachmentsComponent implements OnInit, OnDestroy {
    selectedFile: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _matDialog: MatDialog,
        private _documentsService: DocumentsService,
        private _dailyService: DailyService
    ) {
        console.log("Hello World DocumentAttachments Component");
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this._documentsService._currentFile.subscribe(file => {
            this.selectedFile = file;
        });

        // this._dailyService.getAttachments();
    }

    upload() {
        this._matDialog.open(UploadDocumentDialogComponent, {
            height: "400px",
            width: "600px"
        });
    }

    ngOnDestroy(): void {
        console.log("DocumentAttachments Component destroyed.");
        this._documentsService._currentFile.next(null);
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
