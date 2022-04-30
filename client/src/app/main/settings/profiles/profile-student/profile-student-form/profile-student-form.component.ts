import {
    Component,
    OnInit,
    OnDestroy,
    EventEmitter,
    Output
} from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    AbstractControl
} from "@angular/forms";
import { AccountService } from "../../../../../services/account.service";
import { ProfilesService } from "../../../../../services/profiles.service";
import { MatDialog } from "@angular/material";

import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { AddressService } from "../../../../../services/address.service";
import { ProfileStudent } from "app/model/profile-student";
import { Subject } from "rxjs";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { takeUntil, filter } from "rxjs/operators";
import { User } from "app/model/user";

import { ProfileParent } from "app/model/profile-parent";

@Component({
    selector: "profile-student-form",
    templateUrl: "./profile-student-form.component.html",
    styleUrls: ["./profile-student-form.component.scss"]
})
export class ProfileStudentFormComponent implements OnInit, OnDestroy {
    profile: ProfileStudent;
    profileForm: FormGroup;
    states: any;
    state: any;
    counties: any;
    county: any;
    schools: any;
    school: any;
    levels: any;
    years: any;
    navigationStudent: any;
    parent: any;

    @Output()
    hasProfileForm = new EventEmitter<Object>();

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _profilesService: ProfilesService,
        private _addressService: AddressService,
        private _accountService: AccountService,
        private _formBuilder: FormBuilder,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matDialog: MatDialog
    ) {
        console.log("Hello World ProfileStudentForm Component");

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

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Create profile form
     *
     * @returns {FormGroup}
     */
    createProfileForm(): FormGroup {
        this.setLevelsToSelect();
        this.setStatesToSelect();

        return this._formBuilder.group({
            user: [null, Validators.required],
            level: [null, Validators.required],
            serie: [null, Validators.required],
            hasSchool: [false],
            school: [null, Validators.required],
            relatives: [null]
        });
    }

    onSubmit() {
        if (this.profileForm.valid) {
            if (this.profileForm.get("school").value) {
                this.profileForm.controls["hasSchool"].setValue(true);
            }

            this.hasProfileForm.emit(this.profileForm.value);
        }
    }

    setLevelsToSelect() {
        this.levels = this._profilesService.getCourseLevelsExcept("infantil");
    }

    setStatesToSelect() {
        this._addressService
            .getStates()
            .then(states => {
                this.states = states.sort((a, b) => {
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
                });
                console.log(this.states);
            })
            .catch(error => {
                console.log(error);
            });
    }

    levelChanged(ev) {
        if (ev === "f1") {
            this.years = this._profilesService.changeYearsRange(1, 5);
        } else if (ev === "f2") {
            this.years = this._profilesService.changeYearsRange(6, 9);
        } else if (ev === "medio") {
            this.years = this._profilesService.changeYearsRange(1, 3);
        } else if (ev === "superior") {
            this.years = this._profilesService.changeYearsRange(1, 7);
        } else if (ev === "eja") {
            this.years = this._profilesService.changeYearsRange(1, 9);
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
            this.schools = response["data"]["schools"];
            this.schools.sort((a, b) => {
                if (a.institution.name > b.institution.name) {
                    return 1;
                }
                if (a.institution.name < b.institution.name) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        });
    }

    onKey(data) {
        if (data.target.value) {
            this._profilesService
                .getProfileByContact("parent", data.target.value)
                .then(parent => {
                    this.parent = Object.assign(new ProfileParent(), parent);
                    this.profileForm.addControl(
                        "hasParent",
                        new FormControl(true)
                    );
                    this.profileForm.controls["parentId"].setValue(
                        this.parent.profile._id
                    );
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    // ----------------------------------------------------------------
    // Getters and Setters to profileForm

    get _user(): AbstractControl {
        return this.profileForm.get("user");
    }

    set _user(abstractControl: AbstractControl) {
        this.profileForm.controls["user"].setValue(abstractControl.value);
    }

    get _level(): AbstractControl {
        return this.profileForm.get("level");
    }

    set _level(abstractControl: AbstractControl) {
        console.log(abstractControl.value.value);
        this.profileForm.controls["level"].setValue(abstractControl.value);
    }

    get _serie(): AbstractControl {
        return this.profileForm.get("serie");
    }

    set _serie(abstractControl: AbstractControl) {
        this.profileForm.controls["serie"].setValue(abstractControl.value);
    }

    get _school(): AbstractControl {
        return this.profileForm.get("school");
    }

    set _school(abstractControl: AbstractControl) {
        this.profileForm.controls["school"].setValue(abstractControl.value);
    }

    get _relatives(): AbstractControl {
        return this.profileForm.get("relatives");
    }

    set _relatives(abstractControl: AbstractControl) {
        this.profileForm.controls["relatives"].setValue(abstractControl.value);
    }
}
