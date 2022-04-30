import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { ProfessorProfileService } from "app/main/professor/professor-profile.service";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";

@Component({
    selector: "app-professor-profile-view",
    templateUrl: "./professor-profile-view.component.html",
    styleUrls: ["./professor-profile-view.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProfessorProfileViewComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    profile: any;
    constructor(private _professorProfileService: ProfessorProfileService) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this._professorProfileService._currentProfile
            .pipe(
                filter(profile => profile != null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(profile => {
                this.profile = profile;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
