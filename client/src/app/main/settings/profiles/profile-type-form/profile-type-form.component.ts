import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import profiles from "../../../../fake-db/profiles";
import { ProfilesService } from "../../../../services/profiles.service";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { Profile } from "app/model/profile";

import { AccountService } from "../../../../services/account.service";
import { filter, takeUntil } from "rxjs/operators";
import { User } from "app/model/user";
import { Subject } from "rxjs";
import { AddressService } from "../../../../services/address.service";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";

@Component({
    selector: "app-profile-type-form",
    templateUrl: "./profile-type-form.component.html",
    styleUrls: ["./profile-type-form.component.scss"]
})
export class ProfileTypeFormDialogComponent implements OnInit, OnDestroy {
    profileType: any;
    profiles = profiles.profileTypes;

    levels: any;
    level: any;
    state: any;
    county: any;

    profile: any;

    profileForm: any;

    mainProfileAlready = true;

    dialogTitle: string;

    user: User;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<TaskFormDialogComponent>} matDialogRef
     * @param data
     *
     */
    constructor(
        public matDialogRef: MatDialogRef<ProfileTypeFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _profilesService: ProfilesService,
        private _matDialog: MatDialog,
        private _fuseNavigationService: FuseNavigationService,
        private _accountService: AccountService,
        private _addressService: AddressService,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        if (this.data.action === "new") {
            this.dialogTitle = "Novo Perfil";
        } else if (this.data.action === "view") {
            this.profile = this.data.profile;
            this.profileType = this.data.profile.profileType
                .slice(7)
                .toLowerCase();
            if (this.profile.school) {
                this.levels = this._profilesService.getCourseLevelsExcept(
                    "infantil"
                );
                this.level = this.levels.find(
                    level => level.value === this.profile.level
                );

                this._addressService.getStates().then(states => {
                    states = states.sort((a, b) => {
                        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
                    });
                    this.state = states.find(
                        state =>
                            state.id ===
                            this.profile.school.requested.countyInstitutional
                                .state_id
                    );
                });

                this.county = this.capital_letter(
                    this.profile.school.requested.countyInstitutional.name.toLowerCase()
                );
            }
        }
    }

    ngOnDestroy(): void {
        console.log("ProfileTypeFormDialogComponent destroyed");

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDialog() {
        this.matDialogRef.close();
    }

    verifyHasProfileForm(profileForm) {
        this.profileForm = profileForm;
    }

    capital_letter(str) {
        str = str.split(" ");

        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }

        return str.join(" ");
    }

    createProfile() {
        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");
        this._fuseProgressBarService.show();
        this._profilesService
            .createProfile(this.profileType, this.profileForm)
            .then(async profile => {
                this.profile = await Object.assign(new Profile(), profile);

                await this._fuseNavigationService.setCurrentNavigation(
                    this.profile.$profileType
                );
                await this._fuseNavigationService.updateNavigationOptions();

                await this._accountService.buildUser();

                await this._fuseProgressBarService.hide();

                await this._matDialog
                    .open(SuccessAlertDialogComponent, {
                        width: "400px",
                        data: {
                            justification: "Perfil criado com sucesso!"
                        }
                    })
                    .afterClosed()
                    .subscribe(() => {
                        this.closeDialog();
                    });
            })
            .catch(error => {
                this._fuseProgressBarService.hide();

                console.log(error);
                this._matDialog
                    .open(ErrorAlertDialogComponent, {
                        maxWidth: "400px",
                        data: {
                            justification:
                                "Não foi possível criar o perfil no momento."
                        }
                    })
                    .afterClosed()
                    .subscribe(() => {
                        this.closeDialog();
                    });
            });
    }
}
