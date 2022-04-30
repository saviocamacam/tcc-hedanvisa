import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfessorModule } from "app/main/professor/professor.module";
import { ProfessorProfileViewComponent } from "app/main/professor/professor-profile-view/professor-profile-view.component";
import { ProfessorProfileService } from "app/main/professor/professor-profile.service";

const routes: Routes = [
    {
        path: "banco-questoes",
        loadChildren:
            "../questions-database/questions-database-routing.module#QuestionsDatabaseRoutingModule"
    },
    {
        path: "notas",
        loadChildren: "../evaluative-matrixes/todo.module#TodoModule"
    },
    {
        path: "banco-planejamentos",
        loadChildren:
            "../plannings/planning-database/planning-database-routing.module#PlanningDatabaseRoutingModule"
    },
    {
        path: ":_id",
        component: ProfessorProfileViewComponent,
        resolve: {
            professor_profile: ProfessorProfileService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), ProfessorModule],
    exports: [RouterModule]
})
export class ProfessorRoutingModule { }
