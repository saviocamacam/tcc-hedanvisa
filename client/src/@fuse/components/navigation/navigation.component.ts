import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnDestroy
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { navigationProfessor } from "app/navigation/navigationProfessor";

import { FuseNavigationService } from "./navigation.service";
import { ProfilesService } from "app/services/profiles.service";
import { Profile } from "../../../app/model/profile";
import { Router } from "@angular/router";

@Component({
    selector: "fuse-navigation",
    templateUrl: "./navigation.component.html",
    styleUrls: ["./navigation.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class FuseNavigationComponent implements OnInit, OnDestroy {
    @Input()
    layout = "vertical";

    @Input()
    navigation: any;

    profileGroups = [
        {
            name: "Aluno",
            profile: "student",
            role: [
                { value: "bulbasaur-0", viewValue: "Bulbasaur" },
                { value: "oddish-1", viewValue: "Oddish" },
                { value: "bellsprout-2", viewValue: "Bellsprout" }
            ]
        },
        {
            name: "Família",
            profile: "parent",
            role: [
                { value: "pai de ", viewValue: "Agata Feffeira" },
                { value: "pai de ", viewValue: "Amélia Ferreira" }
            ]
        },
        {
            name: "Professor",
            profile: "professor",
            role: [
                { value: "charmander-6", viewValue: "Charmander" },
                { value: "vulpix-7", viewValue: "Vulpix" },
                { value: "flareon-8", viewValue: "Flareon" }
            ]
        },
        {
            name: "Escola",
            profile: "schoolm",
            role: [
                { value: "diretor na escola ", viewValue: "Parigot de Souza" },
                {
                    value: "chefe administrativo ",
                    viewValue: "Parigot de Souza"
                }
            ]
        },
        {
            name: "Município",
            profile: "countym",
            role: [
                { value: "chefe pedagógico ", viewValue: "Campo Mourão" },
                { value: "chefe administrativo ", viewValue: "Campo Mourão" }
            ]
        }
    ];

    profiles: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    profileSelected: Profile;
    label: any;

    /**
     * Constructor
     */
    constructor(
        private _fuseNavigationService: FuseNavigationService,
        private _profilesService: ProfilesService,
        private _router: Router
    ) {
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
        this._profilesService
            .profilesOptions()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(value => {
                if (value) {
                    this.profiles = value;
                    this.profiles.forEach(element => {
                        if (element.role) {
                            if (element.school) {
                                if (
                                    this._profilesService
                                        .getSchoolRoles()
                                        .find(
                                            role =>
                                                role.value === element.role.type
                                        )
                                ) {
                                    element.role.type = this._profilesService
                                        .getSchoolRoles()
                                        .find(
                                            role =>
                                                role.value === element.role.type
                                        ).viewValue;
                                }
                            } else if (element.county) {
                                if (
                                    this._profilesService
                                        .getCountyRoles()
                                        .find(
                                            role =>
                                                role.value === element.role.type
                                        )
                                ) {
                                    element.role.type = this._profilesService
                                        .getCountyRoles()
                                        .find(
                                            role =>
                                                role.value === element.role.type
                                        ).viewValue;
                                }
                            }
                        }
                    });
                }
            });

        this._profilesService._currentProfile
            .pipe(
                filter(
                    profile => profile instanceof Profile,
                    takeUntil(this._unsubscribeAll)
                )
            )
            .subscribe(profile => {
                this.profileSelected = profile;
                this._fuseNavigationService.setCurrentNavigation(
                    this.profileSelected.$profileType
                );
            });

        // Load the navigation either from the input or from the service
        this.navigation =
            this.navigation ||
            this._fuseNavigationService.getCurrentNavigation();

        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
            });
    }

    selectOpened(ev) {
        console.log(ev);
        // console.log(this.profiles);
    }

    changeSelected(ev) {
        // this.label = this.profileSelected[0]["label"];
        this.profileSelected = ev.value;
        this._profilesService._currentProfile.next(this.profileSelected);
        this._router.navigate(["/"]);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
