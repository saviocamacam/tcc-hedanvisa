import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { Profile } from "app/model/profile";
import { fuseAnimations } from "@fuse/animations";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { AuthorizationService } from "./authorization.service";
import { FormControl } from "@angular/forms";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
    selector: "app-authorization",
    templateUrl: "./authorization.component.html",
    styleUrls: ["./authorization.component.scss"],
    animations: fuseAnimations
})
export class AuthorizationComponent implements OnInit, OnDestroy {
    profile: Profile;
    institution: any;
    step: string;
    requests: any;
    filterBy: any;
    private _unsubscribeAll: Subject<any>;

    searchInput: FormControl;

    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _authorizationService: AuthorizationService
    ) {
        console.log("Hello World Authorization Component");

        this._unsubscribeAll = new Subject<any>();

        this.searchInput = new FormControl("");
    }

    ngOnInit() {
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._authorizationService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy(): void {
        console.log("AuthorizationComponent destroyed.");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    changeFilter(filter): void {
        if (filter === 0) {
            this.filterBy = "waiting";
        } else if (filter === 1) {
            this.filterBy = "accepted";
        } else if (filter === 2) {
            this.filterBy = "closed";
        } else {
            this.filterBy = null;
        }
        this._authorizationService.onFilterChanged.next(this.filterBy);
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
