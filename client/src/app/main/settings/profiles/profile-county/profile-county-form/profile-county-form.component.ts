import {
    Component,
    OnInit,
    AfterContentInit,
    OnDestroy,
    Output,
    EventEmitter
} from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    AbstractControl
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar, MatDialog } from "@angular/material";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { ProfileCounty } from "app/model/profile-county";
import { ProfilesService } from "../../../../../services/profiles.service";
import { AuthService } from "app/services/authentication.service";
import { Subject } from "rxjs";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { AddressService } from "../../../../../services/address.service";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { AccountService } from "app/services/account.service";
import { filter, takeUntil } from "rxjs/operators";
import { User } from "app/model/user";

@Component({
    selector: "profile-county-form",
    templateUrl: "./profile-county-form.component.html",
    styleUrls: ["./profile-county-form.component.scss"]
})
export class ProfileCountyFormComponent implements OnInit, OnDestroy {
    profileForm: FormGroup;
    profile: ProfileCounty;
    state: any;
    states: any;
    counties: any;
    roles: any;

    navigationCounty: any;

    @Output()
    hasProfileForm = new EventEmitter<Object>();

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _formBuilder: FormBuilder,
        private _profilesService: ProfilesService,
        private _authService: AuthService,
        private _addressService: AddressService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matDialog: MatDialog,
        private _accountService: AccountService
    ) {
        console.log("Hello World ProfileCountyForm Component");

        this._unsubscribeAll = new Subject<any>();
    }

    ngOnInit() {
        this.profileForm = this.createProfileForm();

        this._accountService.currentUser
            .pipe(
                filter(user => user instanceof User),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(user => (this._user = new FormControl(user.id)));
    }

    ngOnDestroy(): void {
        console.log("ProfileCountyFormComponent destroyed");

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createProfileForm(): FormGroup {
        this.setStatesToSelect();
        this.roles = this._profilesService.getCountyRoles();

        return this._formBuilder.group({
            county: [null, Validators.required],
            role: [null, Validators.required],
            user: [null, Validators.required]
        });
    }

    onSubmit() {
        this._fuseProgressBarService.show();

        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");

        if (this.profileForm.valid) {
            this._profilesService
                .createProfile("county", this.profileForm.value)
                .then(profile => {
                    this._fuseProgressBarService.hide();
                    const dialogRef = this._matDialog.open(
                        SuccessAlertDialogComponent,
                        {
                            width: "400px",
                            data: {
                                justification: `Perfil de Gestão de Rede criado com sucesso! 
                                Entre em contato conosco para lhe autorizar.`
                            }
                        }
                    );

                    dialogRef.afterClosed().subscribe(() => {
                        this._matDialog.closeAll();
                    });
                })
                .catch(error => {
                    this._fuseProgressBarService.hide();

                    console.log(error);
                    const dialogRef = this._matDialog.open(
                        ErrorAlertDialogComponent,
                        {
                            width: "400px",
                            data: {
                                justification: `Não foi possível criar o perfil de Professsor no momento.`
                            }
                        }
                    );

                    dialogRef.afterClosed().subscribe(() => {
                        this._matDialog.closeAll();
                    });
                });
        }
    }

    setStatesToSelect() {
        this._addressService
            .getStates()
            .then(states => {
                this.states = states.sort((a, b) => {
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    getCountyByState(stateId) {
        this._addressService.getCountiesByState(stateId).then(response => {
            this.counties = response["data"]["profiles"];
            this.counties.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        });
    }

    // ---------------------------------------------------------------------------------------------------
    // Getters and Setters to profileForm

    get county(): any {
        return this.profileForm.get("county");
    }

    get _user(): AbstractControl {
        return this.profileForm.get("user");
    }

    set _user(abstractControl: AbstractControl) {
        this.profileForm.controls["user"].setValue(abstractControl.value);
    }

    get role(): any {
        return this.profileForm.get("role");
    }
}
