import {
    Component,
    OnInit,
    OnDestroy,
    Inject,
    ViewEncapsulation
} from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfigService } from "@fuse/services/config.service";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { ProfilesService } from "../../services/profiles.service";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { Profile } from "app/model/profile";
import { AccountService } from "../../services/account.service";
import { Router } from "@angular/router";
import {
    MatBottomSheet,
    MatBottomSheetRef,
    MAT_BOTTOM_SHEET_DATA
} from "@angular/material";
import { AuthService } from "app/services/authentication.service";
import { User } from "app/model/user";
import { CookieService } from "ngx-cookie-service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class HomeComponent implements OnInit, OnDestroy {
    profiles: any[];
    currentProfile: any;

    user: any;
    navigation: any;

    breakpoint: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _profilesService: ProfilesService,
        private _accountService: AccountService,
        private _router: Router,
        private _bottomSheet: MatBottomSheet,
        private _authService: AuthService,
        private router: Router,
        private _cookieService: CookieService
    ) {

        this._unsubscribeAll = new Subject();

        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                // toolbar: {
                //     hidden: true
                // },
                footer: {
                    hidden: true
                }
            }
        };
    }

    ngOnInit() {
        this.breakpoint = window.innerWidth <= 700 ? 1 : 3;
        if (window.innerWidth <= 700) {
            document
                .getElementById("selectedProject")
                .setAttribute("style", "height: 70px;");
            document
                .getElementById("menuProjectsButton")
                .setAttribute("style", "height: 70px;");
        } else {
            document
                .getElementById("selectedProject")
                .setAttribute("style", "height: 40px;");
            document
                .getElementById("menuProjectsButton")
                .setAttribute("style", "height: 40px;");
        }

        this._accountService.currentUser
            .pipe(filter(user => user instanceof User), takeUntil(this._unsubscribeAll))
            .subscribe(
                async user => {
                    // console.log(user);
                    this.user = user;
                    if (await (!user.$mainProfile && !user.$peopleAsObject)) {
                        await this.router.navigate(["/configuracoes/usuario"]);
                    }
                },
                error => {
                    console.log(error);
                }
            );

        this._profilesService
            .profilesOptions()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(profiles => {
                if (profiles) {
                    this.profiles = profiles;
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

        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(profile => {
                // console.log(profile);
                this.currentProfile = profile;
                this._fuseNavigationService.setCurrentNavigation(
                    this.currentProfile.$profileType
                );
            });

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

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onResize(event) {
        this.breakpoint = event.target.innerWidth <= 700 ? 1 : 3;
        if (event.target.innerWidth <= 700) {
            document
                .getElementById("selectedProject")
                .setAttribute("style", "height: 68px;");
            document
                .getElementById("menuProjectsButton")
                .setAttribute("style", "height: 68px;");
        } else {
            document
                .getElementById("selectedProject")
                .setAttribute("style", "height: 40px;");
            document
                .getElementById("menuProjectsButton")
                .setAttribute("style", "height: 40px;");
        }
    }

    changeSelected(profile) {
        this.currentProfile = profile;
        console.log(this.currentProfile);
        this._cookieService.set(
            "atla.currentProfile",
            JSON.stringify({ id: this.currentProfile._id }),
            0,
            "/"
        );
        this._profilesService._currentProfile.next(this.currentProfile);
    }

    loadDestine(item) {
        if (item.url) {
            this._router.navigate([item.url]);
        } else {
            this._bottomSheet.open(HomeChildrenOptionsComponent, {
                data: {
                    children: item.children,
                    title: item.title
                }
            });
        }
    }
}

@Component({
    selector: "home-children-options",
    template: `
        <h3 style="text-align:center" class="mb-16">{{ data.title }}</h3>
        <mat-divider></mat-divider>
        <mat-nav-list *ngFor="let item of data.children">
            <a
                href="{{ item.url }}"
                mat-list-item
                (click)="openLink($event, item.url)"
            >
                <span mat-line>{{ item.title }}</span>
            </a>
        </mat-nav-list>
    `
})
// tslint:disable-next-line:component-class-suffix
export class HomeChildrenOptionsComponent {
    constructor(
        private bottomSheetRef: MatBottomSheetRef<HomeChildrenOptionsComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _router: Router
    ) { }

    openLink(event: MouseEvent, url: string): void {
        this._router.navigate([url]);
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }
}
