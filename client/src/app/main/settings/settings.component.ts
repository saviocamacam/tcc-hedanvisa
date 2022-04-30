import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { MainSidebarService } from "./_sidebars/main-sidebar/main-sidebar.service";
import { ProfilesService } from "../../services/profiles.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material";
import { FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"],
    animations: fuseAnimations
})
export class SettingsComponent implements OnInit, OnDestroy {
    component = "account";

    constructor(
        private _mainSidebarService: MainSidebarService,
        private _fuseSidebarService: FuseSidebarService
    ) {
        this._mainSidebarService.onFilterChanged.subscribe(component => {
            this.component = component;
        });
    }

    /**
     * On init
     */
    ngOnInit() {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {}

    /**
     * Toggle sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
