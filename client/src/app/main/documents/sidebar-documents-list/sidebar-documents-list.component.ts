import { Component, OnInit, OnDestroy } from "@angular/core";
import { DocumentsService } from "../documents.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DailyService } from "app/main/plannings/daily/daily.service";

@Component({
    selector: "app-sidebar-documents-list",
    templateUrl: "./sidebar-documents-list.component.html",
    styleUrls: ["./sidebar-documents-list.component.scss"]
})
export class SidebarDocumentsListComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    documents = [];
    currentFile: any;

    constructor(
        private _documentsService: DocumentsService,
        private _dailyService: DailyService
    ) {
        console.log("SidebarDocumentsList Component");
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this._dailyService
            .attachmentsList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(documents => {
                this.documents = documents;
            });
    }

    changeCurrentfile(hashname) {
        this._documentsService.renderFile(hashname);
        this.currentFile = hashname;
    }

    ngOnDestroy(): void {
        console.log("SidebarDocumentsList Component destroyed.");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
