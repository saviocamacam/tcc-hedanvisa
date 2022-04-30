import { Component, OnInit } from "@angular/core";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

@Component({
    selector: "app-county-annual-planning",
    templateUrl: "./county-annual-planning.component.html",
    styleUrls: ["./county-annual-planning.component.scss"]
})
export class CountyAnnualPlanningComponent implements OnInit {
    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(private _fuseSidebarService: FuseSidebarService) {}

    ngOnInit() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
