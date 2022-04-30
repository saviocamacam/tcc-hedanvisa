import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";

@Component({
    selector: "app-confirm-delete-dialog",
    templateUrl: "./confirm-delete-dialog.component.html",
    styleUrls: ["./confirm-delete-dialog.component.scss"]
})
export class ConfirmDeleteDialogComponent {
    title: string;
    message: string;
    action: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
    ) {
        // Update view with given values
        this.title = data.title;
        this.message = data.message;
        this.action = data.action || "Excluir";
    }

    onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close(false);
    }
}

export class ConfirmDialogModel {
    constructor(
        public title: string,
        public message: string,
        public action?: string
    ) {}
}
