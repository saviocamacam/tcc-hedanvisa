import { Component, Input } from "@angular/core";
import { TableControl } from '../TableControl';

@Component({
    selector: "app-call-register",
    templateUrl: "./call-register.component.html",
    styleUrls: ["./call-register.component.scss"]
})
export class CallRegisterComponent {
    @Input() tableControl: TableControl;

    constructor() { }
}
