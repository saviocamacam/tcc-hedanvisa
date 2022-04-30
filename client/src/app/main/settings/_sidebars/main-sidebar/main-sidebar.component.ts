import { Component, OnInit, OnDestroy } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { Subject } from "rxjs";
import { MainSidebarService } from "./main-sidebar.service";
import { AccountService } from "../../../../services/account.service";
import { ProfilesService } from "../../../../services/profiles.service";
import { AuthService } from "app/services/authentication.service";
import { filter, takeUntil } from "rxjs/operators";
import { PersonalService } from "../../../../services/personal.service";
import { AddressService } from "../../../../services/address.service";
import { User } from "app/model/user";

@Component({
    selector: "app-main-sidebar",
    templateUrl: "./main-sidebar.component.html",
    styleUrls: ["./main-sidebar.component.scss"],
    animations: fuseAnimations
})
export class MainSidebarComponent implements OnInit, OnDestroy {
    component: any;
    user: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MainSidebarService} _mainSidebarService
     * @param {AccountService} _accountService
     */
    constructor(
        private _mainSidebarService: MainSidebarService,
        private _accountService: AccountService,
        private _profilesService: ProfilesService,
        private _authService: AuthService,
        private _personalService: PersonalService,
        private _addressService: AddressService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.changeComponent("account");

        this._mainSidebarService
            .nextStep()
            .pipe(
                filter(nextStep => nextStep !== ""),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(nextStep => {
                this.changeComponent(nextStep);
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._accountService.currentUser
            .pipe(
                filter(user => user instanceof User),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(
                user => {
                    this.user = user;
                },
                error => console.log(error)
            );
    }

    /**
     * On destroy
     */
    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Change the component
     *
     * @param component
     */
    changeComponent(component): void {
        this.component = component;
        this._mainSidebarService.onFilterChanged.next(component);
    }
}
