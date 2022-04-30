import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { CountySchoolsService } from "../county-schools.service";
import { filter, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-county-schools-sidebar",
  templateUrl: "./county-schools-sidebar.component.html",
  styleUrls: ["./county-schools-sidebar.component.scss"]
})
export class CountySchoolsSidebarComponent implements OnInit, OnDestroy {
  user: any;
  filterBy: string;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CountySchoolsService} _countySchoolsService
   */
  constructor(
    private _countySchoolsService: CountySchoolsService
  ) {
    console.log("Hello World CountySchoolsSidebarComponent");
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
    // this.filterBy = this._countySchoolsService.filterBy || 'schools';

    this._countySchoolsService.filterBy()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(filterBy => {
        this.filterBy = filterBy;
      }, error => {
        console.log(error);
        this.filterBy = "schools";
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
  // tslint:disable-next-line:no-shadowed-variable
  changeFilter(filter): void {
    this.filterBy = filter;
    this._countySchoolsService._filterBy.next(this.filterBy);
  }

}
