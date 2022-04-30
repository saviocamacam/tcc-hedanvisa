import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl
} from "@angular/forms";
import { Subject } from "rxjs";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { MatSnackBar, MatDialog } from "@angular/material";
import { AccountService } from "app/services/account.service";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";

@Component({
    selector: "forgot-password",
    templateUrl: "./forgot-password.component.html",
    styleUrls: ["./forgot-password.component.scss"],
    animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    forgotPasswordForm: FormGroup;

    emailFound: Boolean = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _accountService: AccountService,
        private _matDialog: MatDialog,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.forgotPasswordForm = this.createForgotPassword();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    createForgotPassword() {
        return this._formBuilder.group({
            email: [null, [Validators.required, Validators.email]]
        });
    }

    onSubmit() {
        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");
        this._fuseProgressBarService.show();

        this._accountService
            .sendEmailResetPassword(this.email.value)
            .then(response => {
                this._fuseProgressBarService.hide();

                this._matDialog.open(AttentionAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification: `Por favor, verifique a caixa de entrada de '${
                            this.email.value
                        }'.`
                    }
                });
            })
            .catch(error => {
                this._fuseProgressBarService.hide();

                this._matDialog.open(ErrorAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification: `Não foi possível enviar um link de recriação de senha para o endereço ${
                            this.email.value
                        }`
                    }
                });
            });
    }

    contactExists() {
        if (this.forgotPasswordForm.valid) {
            this._accountService
                .contactExists(this.email.value)
                .then(emailFound => {
                    this.emailFound = emailFound;
                })
                .catch(error => {
                    console.log(error);
                    this.emailFound = false;
                });
        }
    }

    // ------------------------------------------------------------------------------------------------------------------
    // Getters and Setters forgotPasswordForm

    get email(): any {
        return this.forgotPasswordForm.get("email");
    }
    set email(value: any) {
        this.forgotPasswordForm.controls["email"].setValue(value);
    }
}
