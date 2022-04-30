import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { FuseConfigService } from "@fuse/services/config.service";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { FuseSplashScreenService } from "@fuse/services/splash-screen.service";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";

import { navigation } from "./navigation/navigation";
import { navigationStudent } from "./navigation/navigationStudent";
import { navigationProfessor } from "./navigation/navigationProfessor";
import { navigationParent } from "./navigation/navigationParent";
import { navigationComunity } from "./navigation/navigationComunity";
import { navigationSchool } from "./navigation/navigationSchool";
import { navigationCounty } from "./navigation/navigationCounty";

import { locale as navigationEnglish } from "./navigation/i18n/en";
import { locale as navigationTurkish } from "./navigation/i18n/tr";
import { AuthService } from "./services/authentication.service";
import { Router } from "@angular/router";
import { ProfilesService } from "./services/profiles.service";
import { AccountService } from "./services/account.service";

@Component({
    selector: "app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
    navigation: any;
    fuseConfig: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    navigationStudent: any;
    navigationProfessor: any;
    navigationParent: any;
    navigationComunity: any;
    navigationSchool: any;
    navigationCounty: any;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _authService: AuthService,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _router: Router,
        private _profilesService: ProfilesService,
        private _accountService: AccountService
    ) {
        // Get default navigation
        this.navigation = navigation;
        this.navigationProfessor = navigationProfessor;
        this.navigationStudent = navigationStudent;
        this.navigationParent = navigationParent;
        this.navigationComunity = navigationComunity;
        this.navigationSchool = navigationSchool;
        this.navigationCounty = navigationCounty;

        // Register the navigation to the service

        this._profilesService.profilesOptions().subscribe(profiles => {
            if (profiles) {
                profiles.forEach(element => {
                    if (
                        element.$profileType === "ProfileProfessor" &&
                        !this._fuseNavigationService.getNavigation(
                            "ProfileProfessor"
                        )
                    ) {
                        this._fuseNavigationService.register(
                            "ProfileProfessor",
                            this.navigationProfessor
                        );
                    } else if (
                        element.$profileType === "ProfileParent" &&
                        !this._fuseNavigationService.getNavigation(
                            "ProfileParent"
                        )
                    ) {
                        this._fuseNavigationService.register(
                            "ProfileParent",
                            this.navigationParent
                        );
                    } else if (
                        element.$profileType === "ProfileStudent" &&
                        !this._fuseNavigationService.getNavigation(
                            "ProfileStudent"
                        )
                    ) {
                        this._fuseNavigationService.register(
                            "ProfileStudent",
                            this.navigationStudent
                        );
                    } else if (
                        element.$profileType === "ProfileSchool" &&
                        !this._fuseNavigationService.getNavigation(
                            "ProfileSchool"
                        )
                    ) {
                        this._fuseNavigationService.register(
                            "ProfileSchool",
                            this.navigationSchool
                        );
                    } else if (
                        element.$profileType === "ProfileCounty" &&
                        !this._fuseNavigationService.getNavigation(
                            "ProfileCounty"
                        )
                    ) {
                        this._fuseNavigationService.register(
                            "ProfileCounty",
                            this.navigationCounty
                        );
                    }
                });
            }
        });

        this._fuseNavigationService.register("main", this.navigation);

        // // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation("main");

        // Add languages
        this._translateService.addLangs(["en", "tr"]);

        // Set the default language
        this._translateService.setDefaultLang("en");

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(
            navigationEnglish,
            navigationTurkish
        );

        // Use a language
        this._translateService.use("en");

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
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(config => {
                this.fuseConfig = config;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
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
}
