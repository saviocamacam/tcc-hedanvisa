import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import find from "lodash-es/find";

import { FuseConfigService } from "@fuse/services/config.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

import { navigation } from "../../../navigation/navigation";

import { AuthService } from "../../../services/authentication.service";
import { ProfilesService } from "../../../services/profiles.service";
import { AccountService } from "../../../services/account.service";
import { TokenService } from "../../../services/token.service";
import { User } from "../../../model/user";
import { People } from "../../../model/people";

@Component({
    selector: "toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    userStatusOptions: any[];
    user: string;
    mainProfile: any;
    people: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    currentUser: User;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Router} _router
     * @param {TranslateService} _translateService
     * @param {AuthService} _authService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _router: Router,
        private _translateService: TranslateService,
        private _authService: AuthService,
        private _profilesService: ProfilesService,
        private _accountService: AccountService,
        private _tokenService: TokenService
    ) {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: "Online",
                icon: "icon-checkbox-marked-circle",
                color: "#4CAF50"
            },
            {
                title: "Away",
                icon: "icon-clock",
                color: "#FFC107"
            },
            {
                title: "Do not Disturb",
                icon: "icon-minus-circle",
                color: "#F44336"
            },
            {
                title: "Invisible",
                icon: "icon-checkbox-blank-circle-outline",
                color: "#BDBDBD"
            },
            {
                title: "Offline",
                icon: "icon-checkbox-blank-circle-outline",
                color: "#616161"
            }
        ];

        this.languages = [
            {
                id: "en",
                title: "English",
                flag: "us"
            },
            {
                id: "tr",
                title: "Turkish",
                flag: "tr"
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
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
            .subscribe(user => {
                this.currentUser = user;
            });
        if (this._tokenService.getTokenDecoded()) {
            const token = this._tokenService.getTokenDecoded();
            // this._accountService
            //     .getUserInfo()
            //     .then(user => {
            //         console.log(user._id);
            //         this.people = user.people;
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });
            this.user = token["user"];
            if (token["mainProfile"]) {
                this.mainProfile = this._profilesService.getProfile(
                    token["mainProfile"]
                );
            }
        }

        // Subscribe to the router events to show/hide the loading bar
        this._router.events
            .pipe(
                filter(event => event instanceof NavigationStart),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(event => {
                this.showLoadingBar = true;
            });

        this._router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                this.showLoadingBar = false;
            });

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(settings => {
                this.horizontalNavbar =
                    settings.layout.navbar.position === "top";
                this.rightNavbar = settings.layout.navbar.position === "right";
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = find(this.languages, {
            id: this._translateService.currentLang
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        console.log("Toolbar component destroyed");
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param langId
     */
    setLanguage(langId): void {
        // Set the selected language for toolbar
        this.selectedLanguage = find(this.languages, { id: langId });

        // Use the selected language for translations
        this._translateService.use(langId);
    }

    onLogout() {
        this._authService.logout();
    }

    isUser() {
        return this.currentUser instanceof User;
    }

    hasPeople() {
        return this.currentUser.$peopleAsObject instanceof People;
    }
}
