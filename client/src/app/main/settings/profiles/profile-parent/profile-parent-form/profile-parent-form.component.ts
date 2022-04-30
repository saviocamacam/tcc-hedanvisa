import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { ProfilesService } from "../../../../../services/profiles.service";
import { MatDialog } from "@angular/material";
import { AuthService } from "../../../../../services/authentication.service";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { Subject } from "rxjs";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { ProfileParent } from "app/model/profile-parent";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";

@Component({
    selector: "profile-parent-form",
    templateUrl: "./profile-parent-form.component.html",
    styleUrls: ["./profile-parent-form.component.scss"]
})
export class ProfileParentFormComponent implements OnInit, OnDestroy {
    profileForm: FormGroup;
    profile: ProfileParent;
    child: any;
    navigationParent: any;

    kinships: any[];

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _formBuilder: FormBuilder,
        private _profilesService: ProfilesService,
        private _authService: AuthService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World ProfileParentFormComponent");

        this._unsubscribeAll = new Subject<any>();

        this._fuseProgressBarService.setMode("indeterminate");
    }

    ngOnInit(): void {
        this._fuseProgressBarService.show();

        this.profileForm = this.createProfileForm();

        this._profilesService
            .getOneProfile("parent", this.profile.id)
            .then(profile => {
                this._fuseProgressBarService.hide();

                this.profile = Object.assign(new ProfileParent(), profile);
                console.log(this.profile);

                this.profileForm.controls["kinship"].setValue(
                    this.profile.$kinship
                );

                this.profileForm.controls["childs"].setValue(
                    this.profile.$childs
                );
            })
            .catch(error => {
                this._fuseProgressBarService.hide();
                console.log(error);

                this._matDialog.open(ErrorAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "Não foi possível recuperar as informações de perfil de Família."
                    }
                });
            });
    }

    ngOnDestroy(): void {
        console.log("ProfileParentFormComponent destroyed.");
        this._matDialog.closeAll();

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Create profile form
     *
     * @returns {FormGroup}
     */
    createProfileForm(): FormGroup {
        return this._formBuilder.group({
            kinship: [null, Validators.required],
            childs: [null, Validators.required]
        });
    }

    onSubmit() {
        this._fuseProgressBarService.show();
        if (this.profileForm.valid) {
            if (this.profile.id) {
                this._profilesService
                    .updateProfile("parent", this.profileForm.value)
                    .then(profile => {
                        this._fuseProgressBarService.hide();
                        console.log(profile);
                        this._matDialog.open(SuccessAlertDialogComponent, {
                            maxWidth: "400px",
                            data: {
                                justification:
                                    "O perfil Familiar foi criado com sucesso!"
                            }
                        });
                    })
                    .catch(err => {
                        this._fuseProgressBarService.hide();
                        console.log(err);

                        this._matDialog.open(ErrorAlertDialogComponent, {
                            maxWidth: "400px",
                            data: {
                                justification:
                                    "Não foi possível criar o perfil Familiar."
                            }
                        });
                    });
            } else {
                delete this.profileForm.value["_id"];
                this._profilesService
                    .createProfile("parent", this.profileForm.value)
                    .then(response => {
                        this._fuseProgressBarService.hide();

                        console.log(response);
                        this._matDialog.open(SuccessAlertDialogComponent, {
                            maxWidth: "400px",
                            data: {
                                justification:
                                    "O perfil Familiar foi atualizado com sucesso!"
                            }
                        });
                        this._authService
                            .updateToken()
                            .then(() => {
                                this._fuseNavigationService.register(
                                    "ProfileParent",
                                    this.navigationParent
                                );
                                this._fuseNavigationService.setCurrentNavigation(
                                    "ProfileParent"
                                );
                                this._fuseNavigationService.updateNavigationOptions();
                            })
                            .catch(error => console.log(error));
                    })
                    .catch(err => {
                        this._fuseProgressBarService.hide();
                        console.log(err);

                        this._matDialog.open(ErrorAlertDialogComponent, {
                            maxWidth: "400px",
                            data: {
                                justification:
                                    "Não foi possível atualizar o perfil Familiar"
                            }
                        });
                    });
            }
        }
    }

    searchChild() {
        this._fuseProgressBarService.show();

        this._profilesService
            .getProfileByContact("student", this.child)
            .then(profile => {
                this._fuseProgressBarService.hide();

                this.child = profile;
            })
            .catch(error => {
                console.log(error);
            });
    }
}
