import { Component, OnInit, OnDestroy } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { MatDialog } from "@angular/material";
import { ProfilesService } from "../../../services/profiles.service";
import { ProfileTypeFormDialogComponent } from "./profile-type-form/profile-type-form.component";
import { Subject } from "rxjs";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";
import profiles from "../../../fake-db/profiles";

@Component({
    selector: "app-profiles",
    templateUrl: "./profiles.component.html",
    styleUrls: ["./profiles.component.scss"],
    animations: fuseAnimations
})
export class ProfilesComponent implements OnInit, OnDestroy {
    profiles: Array<any>;

    displayedColumns: any;

    breakdown = false;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     * @param {ProfilesService} _profilesService
     * @param {MatDialog} _matDialog
     *
     */
    constructor(
        private _profilesService: ProfilesService,
        private _matDialog: MatDialog,
        private _fuseProgressBarService: FuseProgressBarService
    ) {
        this._unsubscribeAll = new Subject<any>();

        this._fuseProgressBarService.setMode("indeterminate");

        this.getAllProfiles();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        if (window.innerWidth <= 700) {
            this.breakdown = true;
            this.displayedColumns = ["profileType"];
        } else {
            this.displayedColumns = ["profileType", "mainProfile", "status"];
        }

        this._profilesService._profilesListChange.subscribe(() => {
            this.getAllProfiles();
        });
    }

    ngOnDestroy(): void {
        this._matDialog.closeAll();

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getAllProfiles() {
        this._profilesService.getAllProfiles().then(_profiles => {
            this.profiles = _profiles;
            this.profiles.forEach(profile => {
                if (profile.role) {
                    if (profile.profileType === "ProfileCounty") {
                        if (
                            profiles.countyRoles.find(
                                e => e.value === profile.role.type
                            )
                        ) {
                            profile.role.type = profiles.countyRoles.find(
                                e => e.value === profile.role.type
                            ).viewValue;
                        }
                    } else if (profile.profileType === "ProfileSchool") {
                        if (
                            profiles.schoolRoles.find(
                                e => e.value === profile.role.type
                            )
                        ) {
                            profile.role.type = profiles.schoolRoles.find(
                                e => e.value === profile.role.type
                            ).viewValue;
                        }
                    }
                }
            });

            setTimeout(() => {
                if (this.profiles && !(this.profiles.length > 0)) {
                    this._matDialog.open(AttentionAlertDialogComponent, {
                        width: "400px",
                        data: {
                            justification:
                                "Crie um perfil, de acordo com o seu papel no ambiente escolar, para usufruir das nossas funcionalidades."
                        }
                    });
                }
            }, 0);
        });
    }

    newProfile() {
        this._matDialog.open(ProfileTypeFormDialogComponent, {
            width: "600px",
            panelClass: "custom-dialog-container",
            disableClose: true,
            data: { action: "new" }
        });
    }

    viewProfile(profile) {
        this._matDialog.open(ProfileTypeFormDialogComponent, {
            width: "600px",
            panelClass: "custom-dialog-container",
            disableClose: true,
            data: { profile, action: "view" }
        });
    }

    onResize(event) {
        if (event.target.innerWidth <= 700) {
            this.breakdown = true;
            this.displayedColumns = ["profileType"];
        } else {
            this.breakdown = false;
            this.displayedColumns = ["profileType", "mainProfile", "status"];
        }
    }
}
