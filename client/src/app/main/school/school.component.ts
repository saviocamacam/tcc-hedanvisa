import { Component, OnInit, OnDestroy } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { FormControl } from "@angular/forms";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs";
import { SchoolService } from "./school.service";

@Component({
    selector: "app-schools",
    templateUrl: "./school.component.html",
    styleUrls: ["./school.component.scss"],
    animations: fuseAnimations
})
export class SchoolsComponent implements OnInit, OnDestroy {
    searchInput: FormControl;

    private _unsubscribeAll: Subject<any>;

    constructor(private _schoolsService: SchoolService) {
        console.log("Hello World SchoolsComponent");

        this.searchInput = new FormControl("");
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._schoolsService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
        console.log("SchoolsComponent destroyed");
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
