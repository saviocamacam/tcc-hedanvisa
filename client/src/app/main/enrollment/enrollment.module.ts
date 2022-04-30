import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmentsComponent } from "./enrollments/enrollments.component";
import { EnrollmentEditComponent } from "./enrollment-edit/enrollment-edit.component";
import { EnrollmentNewComponent } from "./enrollment-new/enrollment-new.component";
import { EnrollmentViewComponent } from "./enrollment-view/enrollment-view.component";

@NgModule({
    declarations: [
        EnrollmentsComponent,
        EnrollmentEditComponent,
        EnrollmentNewComponent,
        EnrollmentViewComponent
    ],
    imports: [CommonModule]
})
export class EnrollmentModule {}
