import {
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from "@angular/core";
import { MediaService } from "@angular/flex-layout";
import { CookieService } from "ngx-cookie-service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { FuseMatchMediaService } from "../../services/match-media.service";
import { FuseNavigationService } from "../navigation/navigation.service";
import { AuthService } from "app/services/authentication.service";
import { TokenService } from "app/services/token.service";

@Component({
    selector: "fuse-shortcuts",
    templateUrl: "./shortcuts.component.html",
    styleUrls: ["./shortcuts.component.scss"]
})
export class FuseShortcutsComponent implements OnInit, OnDestroy {
    shortcutItems: any[];
    navigationItems: any[];
    filteredNavigationItems: any[];
    searching: boolean;
    mobileShortcutsPanelActive: boolean;

    @Input()
    navigation: any;

    @ViewChild("searchInput")
    searchInputField;

    @ViewChild("shortcuts")
    shortcutsEl: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {Renderer2} _renderer
     * @param {CookieService} _cookieService
     * @param {FuseMatchMediaService} _fuseMatchMediaService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {ObservableMedia} _observableMedia
     */
    constructor(
        private _cookieService: CookieService,
        private _fuseMatchMediaService: FuseMatchMediaService,
        private _fuseNavigationService: FuseNavigationService,
        private _observableMedia: MediaService,
        private _renderer: Renderer2,
        private _authService: AuthService,
        private _tokenService: TokenService
    ) {
        // Set the defaults
        this.shortcutItems = [];
        this.searching = false;
        this.mobileShortcutsPanelActive = false;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.shortcutItems = [];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the navigation items and flatten them
        this.filteredNavigationItems = this.navigationItems = this._fuseNavigationService.getFlatNavigation(
            this.navigation
        );

        const cookieExists = this._cookieService.check("FUSE2.shortcuts");

        if (cookieExists) {
            this.shortcutItems = JSON.parse(
                this._cookieService.get("FUSE2.shortcuts")
            );
            console.log(this.shortcutItems);
        } else {
            if (this._tokenService.getTokenDecoded()) {
                this._authService.hasProfile.subscribe(response => {
                    if (response) {
                        this.shortcutItems = [
                            {
                                title: "Início",
                                type: "item",
                                icon: "home",
                                url: "/inicio"
                            }
                        ];
                    }
                });
            }
        }

        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if (this._observableMedia.isActive("gt-sm")) {
                    this.hideMobileShortcutsPanel();
                }
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
     * Search
     *
     * @param event
     */
    search(event): void {
        const value = event.target.value.toLowerCase();

        if (value === "") {
            this.searching = false;
            this.filteredNavigationItems = this.navigationItems;

            return;
        }

        this.searching = true;

        this.filteredNavigationItems = this.navigationItems.filter(
            navigationItem => {
                return navigationItem.title.toLowerCase().includes(value);
            }
        );
    }

    /**
     * Toggle shortcut
     *
     * @param event
     * @param itemToToggle
     */
    toggleShortcut(event, itemToToggle): void {
        event.stopPropagation();

        for (let i = 0; i < this.shortcutItems.length; i++) {
            if (this.shortcutItems[i].url === itemToToggle.url) {
                this.shortcutItems.splice(i, 1);

                // Save to the cookies
                this._cookieService.set(
                    "FUSE2.shortcuts",
                    JSON.stringify(this.shortcutItems)
                );

                return;
            }
        }

        this.shortcutItems.push(itemToToggle);

        // Save to the cookies
        this._cookieService.set(
            "FUSE2.shortcuts",
            JSON.stringify(this.shortcutItems)
        );
    }

    /**
     * Is in shortcuts?
     *
     * @param navigationItem
     * @returns {any}
     */
    isInShortcuts(navigationItem): any {
        return this.shortcutItems.find(item => {
            return item.url === navigationItem.url;
        });
    }

    /**
     * On menu open
     */
    onMenuOpen(): void {
        setTimeout(() => {
            this.searchInputField.nativeElement.focus();
        });
    }

    /**
     * Show mobile shortcuts
     */
    showMobileShortcutsPanel(): void {
        this.mobileShortcutsPanelActive = true;
        this._renderer.addClass(
            this.shortcutsEl.nativeElement,
            "show-mobile-panel"
        );
    }

    /**
     * Hide mobile shortcuts
     */
    hideMobileShortcutsPanel(): void {
        this.mobileShortcutsPanelActive = false;
        this._renderer.removeClass(
            this.shortcutsEl.nativeElement,
            "show-mobile-panel"
        );
    }
}
