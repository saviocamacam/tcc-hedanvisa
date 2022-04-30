import { Component, OnInit, OnDestroy } from "@angular/core";
import { FuseConfigService } from "@fuse/services/config.service";
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl
} from "@angular/forms";
import { Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { AccountService } from "app/services/account.service";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { MatDialog } from "@angular/material";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";

@Component({
    selector: "app-reset-password",
    templateUrl: "./reset-password.component.html",
    styleUrls: ["./reset-password.component.scss"],
    animations: fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    resetPasswordForm: FormGroup;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _accountService: AccountService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matDialog: MatDialog
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: { hidden: true },
                toolbar: { hidden: true },
                footer: { hidden: true }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.resetPasswordForm = this.createResetPasswordForm();
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

    createResetPasswordForm() {
        return this._formBuilder.group({
            password: ["", Validators.required],
            passwordConfirm: ["", [Validators.required, confirmPassword]]
        });
    }

    onSubmit() {
        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");
        this._fuseProgressBarService.show();

        this._route.queryParams.subscribe(
            queries => {
                const codeCheck = queries["id"];
                const email = queries["email"];

                this._accountService
                    .checkEmailResetPassword(
                        codeCheck,
                        email,
                        this.resetPasswordForm.value.password
                    )
                    .then(response => {
                        this._fuseProgressBarService.hide();

                        this._matDialog.open(SuccessAlertDialogComponent, {
                            maxWidth: "400px",
                            data: {
                                justification:
                                    "A sua senha foi recriada com sucesso!"
                            }
                        });

                        this._router.navigate(["/auth/login"]);
                    });
            },
            error => {
                console.log(error);
                this._matDialog.open(ErrorAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "Não foi possível recriar a senha no momento."
                    }
                });
            }
        );
    }

    // ------------------------------------------------------------------------------------------------------------------------------------
    // Getters and setters to resetPasswordForm

    get password(): any {
        return this.resetPasswordForm.get("password");
    }

    set password(value: any) {
        this.resetPasswordForm.controls["password"].setValue(value);
    }

    get passwordConfirm(): any {
        return this.resetPasswordForm.get("passwordConfirm");
    }

    set passwordConfirm(value: any) {
        this.resetPasswordForm.controls["passwordConfirm"].setValue(value);
    }
}

/**
 * Confirm password
 *
 * @param {AbstractControl} control
 * @returns {{passwordsNotMatch: boolean}}
 */
function confirmPassword(control: AbstractControl): any {
    if (!control.parent || !control) {
        return;
    }

    const password = control.parent.get("password");
    const passwordConfirm = control.parent.get("passwordConfirm");

    if (!password || !passwordConfirm) {
        return;
    }

    if (passwordConfirm.value === "") {
        return;
    }

    if (password.value !== passwordConfirm.value) {
        return {
            passwordsNotMatch: true
        };
    }
}
