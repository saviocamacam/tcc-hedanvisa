import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    OnDestroy
} from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { CountySchoolsService } from "./county-schools.service";
import { Subject } from "rxjs";
import { ProfilesService } from "../../../services/profiles.service";
import { Profile } from "app/model/profile";
import { takeUntil, filter } from "rxjs/operators";
import { ProfileCounty } from "app/model/profile-county";
import { MatDialog } from "@angular/material";
import { AttentionAlertDialogComponent } from "app/main/alerts/attention/attention.component";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

@Component({
    selector: "app-county-schools",
    templateUrl: "./county-schools.component.html",
    styleUrls: ["./county-schools.component.scss"],
    animations: fuseAnimations
})
export class CountySchoolsComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    profile: any;

    filterBy: String;

    constructor(
        private _profilesService: ProfilesService,
        private _countySchoolsService: CountySchoolsService,
        private _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService
    ) {
        console.log("Hello World CountySchoolsComponent");

        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this._profilesService
            .currentProfile()
            .pipe(
                filter(profile => profile instanceof Profile),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(
                profile => {
                    if (profile) {
                        this.profile = Object.assign(
                            new ProfileCounty(),
                            profile
                        );

                        setTimeout(() => {
                            if (
                                this.profile.$county &&
                                this.profile.$county.status !== "accepted"
                            ) {
                                this._matDialog.open(
                                    AttentionAlertDialogComponent,
                                    {
                                        width: "400px",
                                        data: {
                                            justification: `Você ainda não tem permissão para acessar estas informacões.
                                Entre em contato conosco!`
                                        }
                                    }
                                );
                            }
                        });
                    }
                },
                error => {
                    console.log(error);
                }
            );

        this._countySchoolsService
            .filterBy()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                filterBy => {
                    this.filterBy = filterBy;
                },
                error => {
                    console.log(error);
                    this.filterBy = "schools";
                }
            );
    }

    ngOnDestroy() {}

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
