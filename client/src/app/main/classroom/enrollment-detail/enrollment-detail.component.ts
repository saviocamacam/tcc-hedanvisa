import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { EnrollmentService } from "./enrollment.service";

@Component({
    selector: "app-enrollment-detail",
    templateUrl: "./enrollment-detail.component.html",
    styleUrls: ["./enrollment-detail.component.scss"]
})
export class EnrollmentDetailComponent implements OnInit {
    student: any;

    enrollmentControl = new FormControl('', [Validators.required]);

    enrollmentStates = [
        {
            name: 'Matriculado',
        },
        {
            name: 'Transferido',
        },
        {
            name: 'Remanejado',
        },
        {
            name: 'Desistente',
        },
    ];

    changed = false;

    constructor(
        public dialogRef: MatDialogRef<EnrollmentDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _enrollmentService: EnrollmentService,
        ) {}

    ngOnInit() {
        if (this.data && this.data.enrollment) {
            this.student = this.data.enrollment;
        }
    }
    
    changeEnrollment(event) {
        const state = event.value;

        this.changed = true;
        console.log(`mudar matricula do aluno para ${state}`);
        console.log(this.enrollmentControl.value, "content");
        if(this.enrollmentControl.value === this.student.basic["sit_da_matricula"]) {
            this.changed = false;
            console.log("resetou");
        }
    }

    closeDialog() {
        if(this.changed === true) {
            this._enrollmentService
                .setEnrollmentState(this.student._id, this.enrollmentControl.value);
            console.log("mudando estado");
        }
        
        this.dialogRef.close(this.changed);
    }
}
