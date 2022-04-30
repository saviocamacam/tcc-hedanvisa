import { Component, Input } from '@angular/core';
import { TableControl } from '../TableControl';


@Component({
    selector: 'app-avaliation-register',
    templateUrl: './avaliation-register.component.html',
    styleUrls: ['./avaliation-register.component.scss']
})
export class AvaliationRegisterComponent {
    @Input() tableControl: TableControl;

    constructor() { }
}
