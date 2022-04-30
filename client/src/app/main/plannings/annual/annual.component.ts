import { Component, OnInit } from "@angular/core";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-annual",
    templateUrl: "./annual.component.html",
    styleUrls: ["./annual.component.scss"],
    animations: fuseAnimations
})
export class AnnualComponent implements OnInit {
    constructor(private _fuseSidebarService: FuseSidebarService) {}

    ngOnInit() {}

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
