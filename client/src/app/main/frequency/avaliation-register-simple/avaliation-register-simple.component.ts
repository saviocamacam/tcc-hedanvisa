import { Component, Input } from "@angular/core";
import { TableControl } from "../TableControl";

@Component({
    selector: "app-avaliation-register-simple",
    templateUrl: "./avaliation-register-simple.component.html",
    styleUrls: ["./avaliation-register-simple.component.scss"]
})
export class AvaliationRegisterSimpleComponent {
    @Input() tableControl: TableControl;

    constructor() {}
}
