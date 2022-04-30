import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-content-blocked",
    templateUrl: "./content-blocked.component.html",
    styleUrls: ["./content-blocked.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ContentBlockedComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
