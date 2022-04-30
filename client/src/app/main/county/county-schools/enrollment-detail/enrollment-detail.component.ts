import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: "app-enrollment-detail",
    templateUrl: "./enrollment-detail.component.html",
    styleUrls: ["./enrollment-detail.component.scss"]
})
export class EnrollmentDetailComponent implements OnInit {
    student: any;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        console.log(this.data);
        if (this.data && this.data.enrollment) {
            this.student = this.data.enrollment;
        }
    }
}
