import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import { PlanningsService } from "app/main/plannings/plannings.service";
import { PlanningCenterService } from "app/main/plannings/planning-database/planning-center.service";

@Component({
    selector: "app-planning-center",
    templateUrl: "./planning-center.component.html",
    styleUrls: ["./planning-center.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PlanningCenterComponent implements OnInit, OnDestroy {
    discipline: string;
    disciplines: {}[];
    year: string;
    years: {}[];
    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _planningCenterService: PlanningCenterService,
        private _planningsService: PlanningsService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to courses
        this._planningsService.onDisciplinesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(disciplines => {
                this.disciplines = disciplines;
            });
        // Subscribe to courses
        this._planningsService.onYearsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(years => {
                this.years = years;
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
     * Toggle sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    changeFilter() {
        this._planningCenterService.onDisciplineFilterChanged.next(
            this.discipline
        );
        this._planningCenterService.onYearFilterChanged.next(this.year);
    }

    tabChanged(ev) {
        console.log(ev);
        if (ev.index === 2) {
            this._planningCenterService.getBySchool();
        } else if (ev.index === 3) {
            this._planningCenterService.get();
        }
    }
}
