import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { AuthorizationService } from "../authorization.service";

@Component({
    selector: "authorization-sidebar",
    templateUrl: "./authorization-sidebar.component.html",
    styleUrls: ["./authorization-sidebar.component.scss"]
})
export class AuthorizationSidebarComponent implements OnInit, OnDestroy {
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(private _authorizationService: AuthorizationService) {
        console.log("Hello World AuthoriztaionSidebarComponent");
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this._authorizationService.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Change the filter
     *
     * @param filter
     */
    changeFilter(filter): void {
        this.filterBy = filter;
        this._authorizationService.onFilterChanged.next(this.filterBy);
    }
}
