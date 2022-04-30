import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: "app-attention",
    templateUrl: "./attention.component.html",
    styleUrls: ["./attention.component.scss"]
})
export class AttentionAlertDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {}
}
