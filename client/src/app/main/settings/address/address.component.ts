import { Component, OnInit, OnDestroy } from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl
} from "@angular/forms";
import { AddressService } from "../../../services/address.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { Address } from "app/model/address";
import { ErrorAlertDialogComponent } from "app/main/alerts/error/error.component";
import { FuseProgressBarService } from "@fuse/components/progress-bar/progress-bar.service";
import { SuccessAlertDialogComponent } from "app/main/alerts/success/success.component";
import { MainSidebarService } from "../_sidebars/main-sidebar/main-sidebar.service";
import { AccountService } from "../../../services/account.service";
import { User } from "app/model/user";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";

@Component({
    selector: "app-address",
    templateUrl: "./address.component.html",
    styleUrls: ["./address.component.scss"]
})
export class AddressComponent implements OnInit, OnDestroy {
    /**
     *  Variables instances
     */
    user: User;

    addressForm: FormGroup;
    address: Address;

    states: Array<Object>;
    counties: any;

    private _unsubscribeAll: Subject<any>;

    // --------------------------------------------------------------------------------------------
    /**
     *  Constructor
     */
    constructor(
        private formBuilder: FormBuilder,
        private _addressService: AddressService,
        private _accountService: AccountService,
        private _matDialog: MatDialog,
        private _fuseProgressBarService: FuseProgressBarService,
        private _settingsMainSidebarService: MainSidebarService
    ) {
        this._unsubscribeAll = new Subject();

        this._fuseProgressBarService.setMode("indeterminate");

        this.addressForm = this.createAddressForm();
    }

    // --------------------------------------------------------------------------------------------
    /**
     *  Lifecycle Hooks
     */
    ngOnInit() {
        this._accountService.currentUser
            .pipe(
                filter(user => user instanceof User),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(user => (this.user = user), error => console.log(error));

        this._addressService
            .getPeopleAdrress()
            .then(address => {
                this.address = Object.assign(new Address(), address);
                this.populateAddressForm();
            })
            .catch(error => {
                if (error.status === 404) {
                    this._matDialog.open(AttentionAlertDialogComponent, {
                        width: "400px",
                        data: {
                            justification: `Estado e Cidade são obrigatórios. 
                                Se inserir o CEP, nós completaremos o resto.`
                        }
                    });
                } else {
                    console.log(error);
                    this._matDialog.open(ErrorAlertDialogComponent, {
                        width: "400px",
                        data: {
                            justification:
                                "Não foi possível recuperar as informações de Endereço no momento."
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
    createAddressForm() {
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

        return this.formBuilder.group({
            street: [null],
            number: [null],
            complement: [null],
            block: [null],
            cep: [null],
            county: [null, Validators.required],
            uf: [null]
        });
    }

    populateAddressForm() {
        this.street.setValue(this.address.$street);
        this.number.setValue(this.address.$number);
        this.complement.setValue(this.address.$complement);
        this.block.setValue(this.address.$block);
        this.cep.setValue(this.address.$cep);
        this.county.setValue(this.address.$county);
        this.uf.setValue(this.address.$uf);

        this.stateChanged(this.address.$uf);
    }

    async stateChanged(stateUf) {
        let stateId;
        await this._addressService
            .getStateByUf(stateUf)
            .then(response => {
                stateId = response[0].id;
            })
            .catch(error => console.log(error));
        await this._addressService
            .getCountiesByState(stateId)
            .then(response => {
                this.counties = response["data"]["profiles"].sort((a, b) => {
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

    searchCEP() {
        this._addressService
            .searchCEP(this.cep.value)
            .then(address => {
                console.log(address);
                if (address) {
                    this.address = Object.assign(new Address(), {
                        cep: address.cep,
                        street: address.logradouro,
                        complement: address.complemento,
                        block: address.bairro,
                        uf: address.uf,
                        county: address.localidade
                    });

                    this.stateChanged(this.address.$uf);

                    setTimeout(() => {
                        this.address.$county = this.counties.find(
                            county =>
                                county.name ===
                                this.address.$county
                                    .toUpperCase()
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                        );
                    }, 1000);

                    this.populateAddressForm();
                }
            })
            .catch(error => {
                console.log(error);
                this._fuseProgressBarService.hide();
                if (error.status === 404) {
                    this._matDialog.open(ErrorAlertDialogComponent, {
                        maxWidth: "400px",
                        data: {
                            justification: `Não foi possível encontrar nenhum endereço com o CEP '${
                                this.cep.value
                            }'`
                        }
                    });
                }
            });
    }

    onSubmit() {
        document
            .getElementById("submitButton")
            .setAttribute("disabled", "true");
        this._fuseProgressBarService.show();
        if (this.address && this.address.id) {
            this.updateAddress();
        } else {
            this.createAddress();
        }
    }

    updateAddress() {
        this._addressService
            .updateAddress(this.addressForm.value)
            .then(address => {
                this._fuseProgressBarService.hide();

                this.address = Object.assign(new Address(), address);

                this._accountService.buildUser();

                this._matDialog.open(SuccessAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "As suas informações de endereço foram atualizadas com sucesso!"
                    }
                });
            })
            .catch(error => {
                console.log(error);

                this._matDialog.open(ErrorAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "Não foi possível atualizar as informações de endereço."
                    }
                });
            });
    }

    createAddress() {
        this._addressService
            .createAddress(this.addressForm.value)
            .then(address => {
                this.address = Object.assign(new Address(), address);

                this._accountService.buildUser();

                this._fuseProgressBarService.hide();
                this._matDialog.open(SuccessAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "As suas informações de endereço foram criadas com sucesso!"
                    }
                });
            })
            .catch(error => {
                console.log(error);
                this._matDialog.open(ErrorAlertDialogComponent, {
                    maxWidth: "400px",
                    data: {
                        justification:
                            "Não foi possível atualizar as informações de endereço."
                    }
                });
            });
    }

    nextStep() {
        this._settingsMainSidebarService._nextStep.next("profiles");
    }

    // -------------------------------------------------------------------------------------
    // Getters and Setters

    get street(): AbstractControl {
        return this.addressForm.get("street");
    }

    set street(abstractControl: AbstractControl) {
        this.addressForm.controls["street"].setValue(abstractControl.value);
    }

    get number(): AbstractControl {
        return this.addressForm.get("number");
    }

    set number(abstractControl: AbstractControl) {
        this.addressForm.controls["number"].setValue(abstractControl.value);
    }

    get complement(): AbstractControl {
        return this.addressForm.get("complement");
    }

    set complement(abstractControl: AbstractControl) {
        this.addressForm.controls["complement"].setValue(abstractControl.value);
    }

    get block(): AbstractControl {
        return this.addressForm.get("block");
    }

    set block(abstractControl: AbstractControl) {
        this.addressForm.controls["block"].setValue(abstractControl.value);
    }

    get cep(): AbstractControl {
        return this.addressForm.get("cep");
    }

    set cep(abstractControl: AbstractControl) {
        this.addressForm.controls["cep"].setValue(abstractControl.value);
    }

    get county(): AbstractControl {
        return this.addressForm.get("county");
    }

    set county(abstractControl: AbstractControl) {
        this.addressForm.controls["county"].setValue(abstractControl.value);
    }

    get uf(): AbstractControl {
        return this.addressForm.get("uf");
    }

    set uf(abstractControl: AbstractControl) {
        this.addressForm.controls["uf"].setValue(abstractControl.value);
    }
}
