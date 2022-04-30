import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl
} from "@angular/forms";
import { MatDialog } from "@angular/material";

import { PersonalService } from "../../../services/personal.service";
import { AddressService } from "../../../services/address.service";
import { MainSidebarService } from "../_sidebars/main-sidebar/main-sidebar.service";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";

import { People } from "app/model/people";

import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { AccountService } from "../../../services/account.service";
import { User } from "app/model/user";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";

@Component({
    selector: "app-personal",
    templateUrl: "./personal.component.html",
    styleUrls: ["./personal.component.scss"]
})
export class PersonalComponent implements OnInit, OnDestroy {
    /**
     *  Variables instances
     */
    user: User;

    people: People;
    peopleForm: FormGroup;

    states: Array<Object>;
    minDate: Date;
    maxDate: Date;

    genders: Array<Object> = [
        { value: "m", viewValue: "Masculino" },
        { value: "f", viewValue: "Feminino" }
    ];

    private _unsubscribeAll: Subject<any>;

    // --------------------------------------------------------------------------------------------
    /**
     *  Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _peopleService: PersonalService,
        private _addressService: AddressService,
        private _accountService: AccountService,
        private _matDialog: MatDialog,
        private _fuseProgressBarService: FuseProgressBarService,
        private _settingsMainSidebarService: MainSidebarService
    ) {
        this._unsubscribeAll = new Subject();

        this._fuseProgressBarService.setMode("indeterminate");

        this.peopleForm = this.createPeopleForm();
    }

    // --------------------------------------------------------------------------------------------
    /**
     *  Lifecycle Hooks
     */

    ngOnInit() {
        this._accountService
            .getBasicInfo()
            .then(user => {
                this.user = Object.assign(new User(), user);
            })
            .catch(error => {
                console.log(error);
            });

        this._peopleService
            .getPeople()
            .then(people => {
                this.people = Object.assign(new People(), people);
                this.populatePeopleForm();
            })
            .catch(error => {
                if (error.status === 404) {
                    this._matDialog.open(AttentionAlertDialogComponent, {
                        width: "400px",
                        data: {
                            justification:
                                "Neste passo é necessário inserir ao menos o seu nome completo."
                        }
                    });
                } else {
                    console.log(error);
                    this._matDialog.open(ErrorAlertDialogComponent, {
                        width: "400px",
                        data: {
                            justification:
                                "Não foi possível recuperar as Informações Pessoais no momento."
                        }
                    });
                }
            });
    }

    ngOnDestroy(): void {
        this._matDialog.closeAll();

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // --------------------------------------------------------------------------------------------
    /**
     *  Public methods
     */
    createPeopleForm(): FormGroup {
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

        this.minDate = new Date("1919-02-01");
        this.maxDate = new Date();

        return this._formBuilder.group({
            name: [null, Validators.required],
            born: [null],
            cpf: [null],
            rg: [null],
            rg_uf: [null],
            gender: [null]
        });
    }

    populatePeopleForm() {
        this.name.setValue(this.people.$name);
        this.born.setValue(this.people.$born);
        this.cpf.setValue(this.people.$cpf);
        this.rg.setValue(this.people.$rg);
        this.rg_uf.setValue(this.people.$rg_uf);
        this.gender.setValue(this.people.$gender);
    }

    onSubmit() {
        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");
        this._fuseProgressBarService.show();
        if (this.people) {
            this.updatePeople();
        } else {
            this.createPeople();
        }
    }

    createPeople(): void {
        this._peopleService
            .createPeople(this.peopleForm.value)
            .then(async people => {
                this.people = await Object.assign(new People(), people);

                this._accountService.buildUser();

                this._fuseProgressBarService.hide();
                this._matDialog.open(SuccessAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "As suas informações pessoais foram criadas com sucesso!"
                    }
                });
            })
            .catch(error => {
                this._fuseProgressBarService.hide();

                console.log(error);
                this._matDialog.open(ErrorAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "Não foi possível salvar as suas informações pessoais."
                    }
                });
            });
    }

    updatePeople(): void {
        this._peopleService
            .updatePeople(this.peopleForm.value)
            .then(people => {
                this.people = Object.assign(new People(), people);

                this._accountService.buildUser();

                this._fuseProgressBarService.hide();
                this._matDialog.open(SuccessAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "As suas informações pessoais foram atualizadas com sucesso!"
                    }
                });
            })
            .catch(error => {
                this._fuseProgressBarService.hide();

                console.log(error);
                this._matDialog.open(ErrorAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "Não foi possível atualizar as suas informações pessoais."
                    }
                });
            });
    }

    nextStep(): void {
        this._settingsMainSidebarService._nextStep.next("address");
    }

    // --------------------------------------------------------------------------------------------
    // Getters and Setters to peopleForm

    get name(): AbstractControl {
        return this.peopleForm.get("name");
    }

    set name(abstractControl: AbstractControl) {
        this.peopleForm.controls["name"].setValue(abstractControl.value);
    }

    get born(): AbstractControl {
        return this.peopleForm.get("born");
    }

    set born(abstractControl: AbstractControl) {
        this.peopleForm.controls["born"].setValue(abstractControl.value);
    }

    get cpf(): AbstractControl {
        return this.peopleForm.get("cpf");
    }

    set cpf(abstractControl: AbstractControl) {
        this.peopleForm.controls["cpf"].setValue(abstractControl.value);
    }

    get rg(): AbstractControl {
        return this.peopleForm.get("rg");
    }

    set rg(abstractControl: AbstractControl) {
        this.peopleForm.controls["rg"].setValue(abstractControl.value);
    }

    get rg_uf(): AbstractControl {
        return this.peopleForm.get("rg_uf");
    }

    set rg_uf(abstractControl: AbstractControl) {
        this.peopleForm.controls["rg_cpf"].setValue(abstractControl.value);
    }

    get gender(): AbstractControl {
        return this.peopleForm.get("gender");
    }

    set gender(abstractControl: AbstractControl) {
        this.peopleForm.controls["gender"].setValue(abstractControl.value);
    }
}
