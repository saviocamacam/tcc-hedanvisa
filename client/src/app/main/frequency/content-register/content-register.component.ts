import { Component, Input } from "@angular/core";
import { TableControl } from '../TableControl';

@Component({
    selector: "app-content-register",
    templateUrl: "./content-register.component.html",
    styleUrls: ["./content-register.component.scss"]
})
export class ContentRegisterComponent {
    @Input() tableControl: TableControl;

    constructor() {}
}
