import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    FormGroup,
    Validators,
    FormBuilder
} from "@angular/forms";
import { Subject } from "rxjs";
import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { AuthService } from "../../../services/authentication.service";
import { Router } from "@angular/router";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { AccountService } from "../../../services/account.service";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { MatDialog } from "@angular/material";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;

    _shortNameExists: Boolean = true;

    doLogin: Boolean = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private _fuseNavigationService: FuseNavigationService,
        private _accountService: AccountService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matDialog: MatDialog
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

        this._fuseProgressBarService.setMode("indeterminate");
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this.createLoginForm();
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

    createLoginForm() {
        return this._formBuilder.group({
            shortName: [
                null,
                Validators.compose([
                    Validators.required
                    // Validators.pattern("^[a-z0-9^ ]{8,15}$")
                ])
            ],
            password: [
                null,
                Validators.compose([
                    Validators.required
                    // Validators.minLength(8)
                ])
            ]
        });
    }

    login() {
        if (this.doLogin) return ;
        this.doLogin = true;

        this._fuseProgressBarService.show();

        this.authService
            .login(
                this.loginForm.value.shortName,
                this.loginForm.value.password
            )
            .then(async () => {
                await this._fuseNavigationService.updateNavigationOptions();

                await setTimeout(async () => {
                    if (this.authService.hasProfile) {
                        await this.router.navigate(["/"]);
                    } else {
                        await this.router.navigate(["/configuracoes/usuario"]);
                    }
                    await this._fuseProgressBarService.hide();
                }, 2000);
                this.doLogin = false;
            })
            .catch(_err => {
                // console.log(_err);
                this._fuseProgressBarService.hide();
                this._matDialog.open(ErrorAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "Não foi possível realizar o login. Verifique as informações e tente novamente."
                    }
                });
                this.doLogin = false;
            });
    }

    shortNameExists() {
        if (this.shortName && this.shortName.value) {
            this.shortName.value = this.shortName.value.toLowerCase();
            this._accountService
                .shortNameExists(this.shortName.value)
                .then(shortNameExists => {
                    this._shortNameExists = shortNameExists;
                })
                .catch(err => {
                    this._shortNameExists = false;
                });
        }
    }

    // ---------------------------------------------------------------------------------
    // Getters and Setters to loginForms

    get shortName(): any {
        return this.loginForm.get("shortName");
    }

    set shortName(value: any) {
        this.loginForm.setValue({ shortName: value });
    }

    get password(): any {
        return this.loginForm.get("password");
    }

    set password(value: any) {
        this.loginForm.setValue({ password: value });
    }
}
