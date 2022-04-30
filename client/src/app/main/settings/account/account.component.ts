import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import {
    Validators,
    FormGroup,
    FormBuilder,
    AbstractControl
} from "@angular/forms";
import { AccountService } from "../../../services/account.service";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Subject } from "rxjs";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { User } from "app/model/user";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { MainSidebarService } from "../_sidebars/main-sidebar/main-sidebar.service";

import { Contact } from "app/model/contact";
import { takeUntil, filter } from "rxjs/operators";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit, OnDestroy {
    userForm: FormGroup;
    user: User;

    passwordFields: Boolean = false;

    emailChecked: Boolean = false;
    phoneChecked: Boolean = false;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _formBuilder: FormBuilder,
        private _accountService: AccountService,
        private _matDialog: MatDialog,
        private _fuseProgressBarService: FuseProgressBarService,
        private _settingsMainSidebarService: MainSidebarService
    ) {
        console.log("Hello World AccountComponent");
        this._unsubscribeAll = new Subject();

        this._fuseProgressBarService.setMode("indeterminate");

        this.userForm = this.createUserForm();

        setTimeout(() => {
            this._accountService.buildUser();
        });
    }

    // --------------------------------------------------------------------------------------------
    /**
     *  Lifecycle Hooks
     */
    ngOnInit() {
        setTimeout(() => {
            this._accountService.currentUser
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(user => {
                    if (user) {
                        this.user = user;
                        this.populateUserForm();
                    } else {
                        this._accountService.buildUser().catch(error => {
                            console.log(error);
                            this._matDialog.open(ErrorAlertDialogComponent, {
                                width: "400px",
                                data: {
                                    justification:
                                        "Não foi possível recuperar as informações de Conta no momento."
                                }
                            });
                        });
                    }
                });
        });
    }

    ngOnDestroy(): void {
        console.log("AccountComponent destroyed");
        this._matDialog.closeAll();

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // --------------------------------------------------------------------------------------------
    /**
     *  Public methods
     */
    createUserForm() {
        const formGroup = this._formBuilder.group(
            {
                shortName: [null, Validators.required],
                mainEmail: [null, Validators.compose([Validators.email])],
                mainPhone: [null],
                // oldPassword: [null, Validators.minLength(8)],
                password: [null, Validators.minLength(8)],
                oldPassword: [null, Validators.minLength(8)],
                passwordConfirm: [
                    null,
                    Validators.compose([
                        Validators.minLength(8),
                        confirmPassword
                    ])
                ]
            },
            { validator: this.matchingPasswords("password", "passwordConfirm") }
        );

        return formGroup;
    }

    populateUserForm() {
        this.userForm.get("shortName").setValue(this.user.$shortName);

        if (
            this.user.$mainEmailAsObject &&
            this.user.$mainEmailAsObject.$address
        ) {
            this.userForm
                .get("mainEmail")
                .setValue(this.user.$mainEmailAsObject.$address);
            if (this.user.$mainEmailAsObject.$checked) {
                this.userForm.controls["mainEmail"].disable();
            }
        }
        if (
            this.user.$mainPhoneAsObject &&
            this.user.$mainPhoneAsObject.$address
        ) {
            const phone = this.user.$mainPhoneAsObject.$address.slice(3);
            this.userForm.get("mainPhone").setValue(phone);
            if (this.user.$mainPhoneAsObject.$checked) {
                this.userForm.controls["mainPhone"].disable();
            }
        }
    }

    convertUser(user) {
        console.log(user);
        this.user = Object.assign(new User(), user);
        this.user.$mainEmailAsObject = Object.assign(
            new Contact(),
            this.user.$mainEmailAsObject
        );
        this.user.$mainPhoneAsObject = Object.assign(
            new Contact(),
            this.user.$mainPhoneAsObject
        );
        console.log(this.user);
    }

    updateUser() {
        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");

        this._fuseProgressBarService.show();

        if (
            this.userForm.get("mainPhone") &&
            this.userForm.get("mainPhone").value
        ) {
            this.userForm.get("mainPhone").setValue(
                "+55".concat(
                    this.userForm
                        .get("mainPhone")
                        .value.match(/\d+/g)
                        .join("")
                )
            );
        }

        if (this.userForm.valid) {
            this._accountService
                .updateUserInfo(this.user.id, this.userForm.value)
                .then(user => {
                    this.convertUser(user);
                    this.populateUserForm();
                    this._accountService.buildUser();

                    this.clearPasswords();

                    this._fuseProgressBarService.hide();
                    this._matDialog.open(SuccessAlertDialogComponent, {
                        data: {
                            justification:
                                "As informações de conta foram atualizadas com sucesso."
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                    this._matDialog.open(ErrorAlertDialogComponent, {
                        data: {
                            justification:
                                "Não foi possível atualizar as informações de conta no momento."
                        }
                    });
                });
        }
    }

    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
        // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
        return (group: FormGroup): { [key: string]: any } => {
            const password = group.controls[passwordKey];
            const confirmPasswordv = group.controls[confirmPasswordKey];
            if (password.value !== confirmPasswordv.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        };
    }

    validateContact(contact) {
        this._fuseProgressBarService.show();
        if (contact === "email") {
            this.verifyEmailValidation();
        } else if (contact === "phone") {
            this.validateCellphone();
        } else {
            console.log("Tipo de contato inválido. (email ou phone)");
            this._fuseProgressBarService.hide();
        }
    }

    sendEmailValidation() {
        this._accountService
            .sendEmailValidation(
                this.userForm.get("mainEmail").value,
                this.userForm.get("shortName").value
            )
            .then(() => {
                this._fuseProgressBarService.hide();
            })
            .catch(error => {
                this._fuseProgressBarService.hide();

                this._matDialog.open(ErrorAlertDialogComponent, {
                    data: {
                        justification:
                            "Não foi possível enviar o link de validação para o seu email."
                    }
                });
            });
    }

    verifyEmailValidation() {
        if (
            this.user.$mainEmailAsObject &&
            !this.user.$mainEmailAsObject.$checked
        ) {
            this.sendEmailValidation();
            const dialogRef = this._matDialog.open(ConfirmEmailDialog, {
                maxWidth: "600px",
                disableClose: true,
                data: {
                    email: this.userForm.get("mainEmail").value,
                    shortName: this.user.$shortName,
                    text: `Um link para a validação de email foi enviado ao endereço '${
                        this.userForm.get("mainEmail").value
                    }'.`
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                this.emailChecked = result;
            });
        }
    }

    validateCellphone() {
        this._matDialog
            .open(AttentionAlertDialogComponent, {
                width: "400px",
                data: {
                    justification:
                        "Para validar o número de celular, baixe o nosso aplicativo em seu aparelho e faça o login."
                }
            })
            .afterClosed()
            .subscribe(() => this._fuseProgressBarService.hide());
    }

    desativeAccount() {
        this._matDialog.open(AttentionAlertDialogComponent, {
            data: {
                justification:
                    "A opção de desativar a conta estará disponível em breve."
            }
        });
    }

    clearPasswords() {
        this.passwordFields = false;
        // this.userForm.get("oldPassword").value.value = null;
        this.userForm.get("password").setValue(null);
        this.userForm.get("passwordConfirm").setValue(null);
    }

    nextStep() {
        this._settingsMainSidebarService._nextStep.next("personal");
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

@Component({
    selector: `confirm-email-dialog`,
    template: `
        <fuse-progress-bar></fuse-progress-bar>
        <h1 mat-dialog-title style="text-align: center" class="primary-fg">
            Atenção!
        </h1>
        <mat-dialog-content>
            <mat-card class="primary-50-bg">
                <p class="h3">{{ data.text }}</p>
                <a
                    style="text-align: center"
                    *ngIf="_verified"
                    (click)="resendEmail()"
                >
                    Reenviar link ao mesmo endereço.
                </a>
            </mat-card>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button
                *ngIf="!_contactIsChecked"
                mat-raised-button
                class="accent-bg"
                (click)="verifyValidateEmail()"
            >
                Verificar
            </button>
            <button
                [disabled]="!_contactIsChecked"
                mat-raised-button
                (click)="closeDialog()"
                class="primary-100-bg"
            >
                Ok.
            </button>
        </mat-dialog-actions>
    `
})
// tslint:disable-next-line:component-class-suffix
export class ConfirmEmailDialog implements OnInit, OnDestroy {
    _contactIsChecked: Boolean = false;
    _verified: Boolean = false;

    private _unsubscribeAll: Subject<any>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _accountService: AccountService,
        private _fuseProgressBarService: FuseProgressBarService,
        public dialogRef: MatDialogRef<ConfirmEmailDialog>
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseProgressBarService.setMode("indeterminate");
    }

    ngOnInit(): void {
        // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        // Add 'implements OnInit' to the class.
    }

    ngOnDestroy(): void {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    verifyValidateEmail() {
        this._fuseProgressBarService.show();

        this._accountService
            .contactIsChecked(this.data.email)
            .then(async contactIsChecked => {
                await this._fuseProgressBarService.hide();

                console.log(contactIsChecked);

                if (contactIsChecked) {
                    await this._accountService.buildUser();
                    this.data.text = await "Email validado com sucesso!";
                } else {
                    this.data.text = await `O link enviado ao endereço '${
                        this.data.email
                    }' ainda não foi validado. 
                        Obs.: Procure pelo email mais recente.`;
                }

                this._verified = await !contactIsChecked;
                this._contactIsChecked = await contactIsChecked;
            })
            .catch(error => {
                this._fuseProgressBarService.hide();

                this.data.text = `Verifique a caixa de entrada do email '${
                    this.data.email
                }'.`;

                this._verified = true;
            });
    }

    closeDialog() {
        this.dialogRef.close(this._contactIsChecked);
    }

    resendEmail() {
        this._fuseProgressBarService.show();
        console.log("resend email");

        this._accountService
            .sendEmailValidation(this.data.email, this.data.shortName)
            .then(response => {
                this._fuseProgressBarService.hide();

                this._verified = false;
                this.data.text = `Um link para a validação de email foi enviado ao endereço '${
                    this.data.email
                }`;
            })
            .catch(error => {
                this._fuseProgressBarService.hide();
                console.log(error);

                this.data.text = `Houve um erro ao tentar enviar o link de validação para o endereço '${
                    this.data.email
                }'`;
            });
    }
}
