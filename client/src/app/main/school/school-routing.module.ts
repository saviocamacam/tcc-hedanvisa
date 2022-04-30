import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuardService } from "../authentication/guards/role-guard.service";
import { SchoolModule } from "./school.module";
import { SchoolsComponent } from "./school.component";
import { AuthGuardService } from "app/main/authentication/guards/auth-guard.service";

const routes: Routes = [
    {
        path: "",
        component: SchoolsComponent,
        canActivate: [AuthGuardService]
        // canActivate: [RoleGuardService],
        // data: {
        //     permission: {
        //         only: ["ProfileCounty"]
        //     }
        // }
    },
    {
        path: ":school_id/turmas",
        loadChildren:
            "../classroom/classroom-routing.module#ClassroomRoutingModule",
        canActivate: [AuthGuardService]
        // canActivate: [RoleGuardService],
        // data: {
        //     permission: {
        //         only: ["ProfileCounty", "ProfileSchool", "ProfileProfessor"]
        //     }
        // }
    },
    {
        path: "banco-questoes",
        loadChildren:
            "../questions-database/questions-database-routing.module#QuestionsDatabaseRoutingModule",
        canActivate: [AuthGuardService]
    },
    {
        path: "banco-planejamentos",
        loadChildren:
            "../plannings/planning-database/planning-database-routing.module#PlanningDatabaseRoutingModule",
        canActivate: [AuthGuardService]
    },
    {
        path: "matriculas",
        loadChildren:
            "../enrollment/enrollment-routing.module#EnrollmentRoutingModule"
    },
    {
        path: "**",
        loadChildren: "../errors/error404/error404.module#Error404Module"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), SchoolModule],
    exports: [RouterModule]
})
export class SchoolRoutingModule {}
