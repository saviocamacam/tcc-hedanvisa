import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    AbstractControl,
    FormGroup,
    Validators,
    FormBuilder
} from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { Subject } from "rxjs";
import { AuthService } from "../../../services/authentication.service";
import { Router } from "@angular/router";
import { AccountService } from "../../../services/account.service";
import { MatDialog } from "@angular/material";
import { TermsAndConditionsComponent } from "../../terms/terms-and-conditions/terms-and-conditions.component";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";

@Component({
    selector: "register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;

    _emailExists = false;
    _shortNameExists = false;

    // Private
    private _unsubscribeAll: Subject<any>;
    profiles: { value: string; viewValue: string; path: string }[];

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private _accountService: AccountService,
        private _matDialog: MatDialog,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        console.log("Hello World RegisterFormComponent");

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

        this._fuseProgressBarService.setMode("indeterminate");
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.registerForm = this.createRegisterForm();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        console.log("RegisterFormComponent destroyed.");
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods

    createRegisterForm() {
        return this._formBuilder.group({
            shortName: [
                null,
                Validators.compose([
                    Validators.required
                    // Validators.pattern("^[a-z0-9_-]{8,15}$")
                ])
            ],
            mainEmail: [
                null,
                Validators.compose([Validators.required, Validators.email])
            ],
            password: [
                null,
                Validators.compose([
                    Validators.minLength(8),
                    Validators.required
                ])
            ],
            passwordConfirm: [
                null,
                Validators.compose([
                    Validators.minLength(8),
                    Validators.required,
                    confirmPassword
                ])
            ],
            checked: [false, Validators.requiredTrue]
        });
    }

    convertToLower(value) {
        console.log(value);
        this.registerForm.controls["shortName"].setValue(
            value.toLowerCase().replace(/\s+/g, "")
        );
    }

    signup() {
        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");
        this._fuseProgressBarService.show();
        this.authService
            .signup(
                // this.fullname.value,
                this.shortName.value.toLowerCase(),
                this.mainEmail.value,
                this.password.value
            )
            .subscribe(
                async resp => {
                    if (resp["success"]) {
                        await localStorage.setItem("token", resp["token"]);

                        // await this._accountService.sendEmailValidation(
                        //     this.mainEmail.value,
                        //     this.shortName.value
                        // );

                        await setTimeout(async () => {
                            await this.router.navigate([
                                `configuracoes/usuario`
                            ]);
                        });

                        // await setTimeout(async () => {
                        //     await this._accountService.buildUser();
                        // });
                        await this._fuseProgressBarService.hide();
                    }
                },
                err => {
                    this._fuseProgressBarService.hide();
                    this._matDialog.open(ErrorAlertDialogComponent, {
                        maxWidth: "400px",
                        data: {
                            justification:
                                "Não foi possível se cadastrar no OCAMACAM. Verifique se as informações estão corretas e tente novamente!"
                        }
                    });
                }
            );
    }

    shortNameExists() {
        if (!this.shortName.errors) {
            this._accountService
                .shortNameExists(this.shortName.value)
                .then(shortNameExists => {
                    this._shortNameExists = shortNameExists;
                })
                .catch(error => {
                    this._shortNameExists = false;
                });
        }
    }

    emailExists() {
        if (!this.mainEmail.errors) {
            this._accountService
                .contactExists(this.mainEmail.value)
                .then(contactExists => {
                    this._emailExists = contactExists;
                })
                .catch(error => {
                    this._emailExists = false;
                });
        }
    }

    termsAndConditions() {
        this._matDialog.open(TermsAndConditionsComponent, {});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Getters and Setters of registerForm

    get shortName(): any {
        return this.registerForm.get("shortName");
    }

    set shortName(value: any) {
        this.registerForm.setValue({ shortName: value });
    }

    // get fullname(): any {
    //     return this.registerForm.get("fullname");
    // }

    // set fullname(value: any) {
    //     this.registerForm.setValue({ fullname: value });
    // }

    get mainEmail(): any {
        return this.registerForm.get("mainEmail");
    }

    set mainEmail(value: any) {
        this.registerForm.setValue({ mainEmail: value });
    }

    get password(): any {
        return this.registerForm.get("password");
    }

    set password(value: any) {
        this.registerForm.setValue({ password: value });
    }

    get passwordConfirm(): any {
        return this.registerForm.get("passwordConfirm");
    }

    set passwordConfirm(value: any) {
        this.registerForm.setValue({ passwordConfirm: value });
    }

    get check(): any {
        return this.registerForm.get("check");
    }

    set check(value: any) {
        this.registerForm.setValue({ check: value });
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
