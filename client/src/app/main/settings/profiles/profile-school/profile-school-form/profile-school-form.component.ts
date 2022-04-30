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
import { ProfilesService } from "../../../../../services/profiles.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../../services/authentication.service";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { AddressService } from "../../../../../services/address.service";
import { AccountService } from "../../../../../services/account.service";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ProfileSchool } from "app/model/profile-school";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { ThrowStmt } from "@angular/compiler";
import { User } from "app/model/user";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";

@Component({
    selector: "profile-school-form",
    templateUrl: "./profile-school-form.component.html",
    styleUrls: ["./profile-school-form.component.scss"]
})
export class ProfileSchoolFormComponent implements OnInit, OnDestroy {
    profile: ProfileSchool;
    profileForm: FormGroup;
    roles: any;
    states: any;
    state: any;
    counties: any;
    county: any;
    schools: any;
    navigationSchool: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profilesService: ProfilesService,
        private _addressService: AddressService,
        private _accountService: AccountService,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World ProfileSchoolForm Component");

        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.profileForm = this.createProfileForm();

        this._accountService.currentUser
            .pipe(
                filter(user => user instanceof User),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(user => (this._user = new FormControl(user.id)));
    }

    ngOnDestroy() {
        console.log("ProfileSchoolFormComponent destroyed");

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Create profile form
     *
     * @returns {FormGroup}
     */
    createProfileForm(): FormGroup {
        this.setStatesToSelect();
        this.roles = this._profilesService.getSchoolRoles();

        return this._formBuilder.group({
            user: [null, Validators.required],
            role: [null, Validators.required],
            hasSchool: [false, Validators.required],
            school: [null, Validators.required]
        });
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

    onSubmit() {
        this._fuseProgressBarService.show();

        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");
        if (this.profileForm.valid) {
            if (this.profileForm.get("school").value) {
                this.profileForm.controls["hasSchool"].setValue(true);
            }

            this._profilesService
                .createProfile("school", this.profileForm.value)
                .then(profile => {
                    this._fuseProgressBarService.hide();
                    const dialogRef = this._matDialog.open(
                        SuccessAlertDialogComponent,
                        {
                            width: "400px",
                            data: {
                                justification: `Perfil de Professor criado com sucesso! 
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

    getInstitutionByCounty(countyId) {
        this._profilesService.getSchoolsByCounty(countyId).then(response => {
            this.schools = response;
        });
    }

    // -----------------------------------------------------------------------
    // Getters and Setters to profileForm

    get _user(): AbstractControl {
        return this.profileForm.get("user");
    }

    set _user(abstractControl: AbstractControl) {
        this.profileForm.controls["user"].setValue(abstractControl.value);
    }

    get _role(): AbstractControl {
        return this.profileForm.get("role");
    }

    set _role(abstractControl: AbstractControl) {
        this.profileForm.controls["role"].setValue(abstractControl.value);
    }

    get _school(): AbstractControl {
        return this.profileForm.get("school");
    }

    set _school(abstractControl: AbstractControl) {
        this.profileForm.controls["school"].setValue(abstractControl.value);
    }
}
