import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AttentionAlertDialogComponent } from "./attention/attention.component";
import { ErrorAlertDialogComponent } from "./error/error.component";
import { SuccessAlertDialogComponent } from "./success/success.component";
import {
    MatCardModule,
    MatButtonModule,
    MatDialogModule
} from "@angular/material";

@NgModule({
    declarations: [
        AttentionAlertDialogComponent,
        ErrorAlertDialogComponent,
        SuccessAlertDialogComponent
    ],
    imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
    exports: [
        AttentionAlertDialogComponent,
        ErrorAlertDialogComponent,
        SuccessAlertDialogComponent
    ],
    entryComponents: [
        AttentionAlertDialogComponent,
        ErrorAlertDialogComponent,
        SuccessAlertDialogComponent
    ]
})
export class AlertsModule {}
