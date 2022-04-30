import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
} from "@angular/material";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { EmailValidationComponent } from "../validations/email-validation/email-validation.component";
import { AlertsModule } from "../alerts/alerts.module";
import { ValidationsModule } from "../validations/validations.module";
import { TermsModule } from "../terms/terms.module";

@NgModule({
    imports: [
        CommonModule,

        ReactiveFormsModule,

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule,
        RouterModule,

        FuseProgressBarModule,

        FuseSharedModule,

        AlertsModule,
        ValidationsModule,
        TermsModule
    ],
    declarations: [
        ForgotPasswordComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent
    ]
})
export class AuthenticationModule {}
