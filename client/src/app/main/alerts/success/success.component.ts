import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: "app-success",
    templateUrl: "./success.component.html",
    styleUrls: ["./success.component.scss"]
})
export class SuccessAlertDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {}
}
