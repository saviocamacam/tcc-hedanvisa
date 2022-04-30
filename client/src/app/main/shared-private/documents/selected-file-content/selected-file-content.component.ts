import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { DocumentsService } from "../documents.service";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { PDFProgressData } from "pdfjs-dist";

@Component({
    selector: "app-selected-file-content",
    templateUrl: "./selected-file-content.component.html",
    styleUrls: ["./selected-file-content.component.scss"]
})
export class SelectedFileContentComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;

    pdfSrc: any = "";

    constructor(
        private _documentsService: DocumentsService,
        private _activatedRoute: ActivatedRoute,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        console.log("Hello World SelectedFileContent Component");
        this._unsubscribeAll = new Subject();
        this._fuseProgressBarService.setMode("indeterminate");
    }

    ngOnInit() {
        this._documentsService
            .currentFile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fileURL => {
                this.pdfSrc = fileURL;
            });
    }

    onProgress(progressData: PDFProgressData) {
        this._fuseProgressBarService.show();
    }

    afterLoadCompete(e) {}

    textLayerRendered(e) {
        this._fuseProgressBarService.hide();
    }

    ngOnDestroy(): void {
        console.log("SelectedFileContent Component destroyed.");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
