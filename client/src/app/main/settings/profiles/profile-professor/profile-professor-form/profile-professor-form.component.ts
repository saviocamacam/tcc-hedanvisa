import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy
} from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    AbstractControl
} from "@angular/forms";
import { ProfilesService } from "../../../../../services/profiles.service";
import { AccountService } from "../../../../../services/account.service";
import { AddressService } from "../../../../../services/address.service";
import { ProfileProfessor } from "app/model/profile-professor";
import { Subject } from "rxjs";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { filter, takeUntil } from "rxjs/operators";
import { User } from "app/model/user";
import { MatDialog } from "@angular/material";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";

@Component({
    selector: "profile-professor-form",
    templateUrl: "./profile-professor-form.component.html",
    styleUrls: ["./profile-professor-form.component.scss"]
})
export class ProfileProfessorFormComponent implements OnInit, OnDestroy {
    profile: ProfileProfessor;
    profileForm: FormGroup;
    states: any;
    state: any;
    counties: any;
    county: any;
    schools: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profilesService: ProfilesService,
        private _accountService: AccountService,
        private _addressService: AddressService,
        private _formBuilder: FormBuilder,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World ProfileProfessorForm Component");

        this._unsubscribeAll = new Subject<any>();

        this._fuseProgressBarService.setMode("indeterminate");
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

    ngOnDestroy(): void {
        console.log("ProfileProfessorFormComponent destroyed");
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

        return this._formBuilder.group({
            user: [null, Validators.required],
            hasSchool: [false],
            school: [null, Validators.required]
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
                .createProfile("professor", this.profileForm.value)
                .then(profile => {
                    this._fuseProgressBarService.hide();
                    const dialogRef = this._matDialog.open(
                        SuccessAlertDialogComponent,
                        {
                            width: "400px",
                            data: {
                                justification: `Perfil de Professor criado com sucesso! 
                                Entre em contato com o Gestor Escolar para lhe autorizar.`
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

    getInstitutionByCounty(countyId) {
        this._profilesService.getSchoolsByCounty(countyId).then(response => {
            console.log(response);
            this.schools = response;
        });
    }

    // ------------------------------------------------------------------------------------------
    // Getters amd Setters to profileForm

    get _user(): AbstractControl {
        return this.profileForm.get("user");
    }

    set _user(abstractControl: AbstractControl) {
        this.profileForm.controls["user"].setValue(abstractControl.value);
    }

    get _school(): AbstractControl {
        return this.profileForm.get("school");
    }

    set _school(abstractControl: AbstractControl) {
        this.profileForm.controls["school"].setValue(abstractControl.value);
    }
}
