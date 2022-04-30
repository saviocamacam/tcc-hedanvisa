import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EnrollmentModule } from "app/main/enrollment/enrollment.module";
import { EnrollmentNewComponent } from "app/main/enrollment/enrollment-new/enrollment-new.component";
import { EnrollmentsComponent } from "app/main/enrollment/enrollments/enrollments.component";
import { EnrollmentsCenterService } from "app/main/enrollment/enrollments-center.service";
import { EnrollmentEditComponent } from "app/main/enrollment/enrollment-edit/enrollment-edit.component";
import { EnrollmentViewComponent } from "app/main/enrollment/enrollment-view/enrollment-view.component";

const routes: Routes = [
    {
        path: "",
        component: EnrollmentsComponent,
        resolve: {
            questions_database: EnrollmentsCenterService
        }
    },
    {
        path: "new/:stepSlug",
        component: EnrollmentNewComponent,
        resolve: {
            questions_database: EnrollmentsCenterService
        }
    },
    {
        path: "edit/:id/:stepSlug",
        component: EnrollmentEditComponent,
        resolve: {
            questions_database: EnrollmentsCenterService
        }
    },
    {
        path: "view/:id/:stepSlug",
        component: EnrollmentViewComponent,
        resolve: {
            questions_database: EnrollmentsCenterService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), EnrollmentModule],
    exports: [RouterModule]
})
export class EnrollmentRoutingModule {}
