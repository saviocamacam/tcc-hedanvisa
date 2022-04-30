import { Component, OnDestroy } from "@angular/core";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material";
import { UploadDocumentDialogComponent } from "./upload-document-dialog/upload-document-dialog.component";
import { Subject } from "rxjs";

@Component({
    selector: "app-documents",
    templateUrl: "./documents.component.html",
    styleUrls: ["./documents.component.scss"]
})
export class DocumentsComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World Documents Component");
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    upload() {
        this._matDialog.open(UploadDocumentDialogComponent, {
            height: "400px",
            width: "600px"
        });
    }

    /**
     * Toggle sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    ngOnDestroy() {
        console.log("Documents Component destroyed.");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
