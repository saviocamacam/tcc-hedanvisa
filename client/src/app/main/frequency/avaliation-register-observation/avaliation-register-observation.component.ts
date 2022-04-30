import { Component, Input } from "@angular/core";
import { TableControl } from "../TableControl";

@Component({
    selector: "app-avaliation-register-observation",
    templateUrl: "./avaliation-register-observation.component.html",
    styleUrls: ["./avaliation-register-observation.component.scss"]
})
export class AvaliationRegisterObservationComponent {
    @Input() tableControl: TableControl;

    constructor() {}
}
