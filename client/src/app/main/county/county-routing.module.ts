import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CountyModule } from "app/main/county/county.module";
import { AuthGuardService } from "app/main/authentication/guards/auth-guard.service";

const routes: Routes = [
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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), CountyModule],
    exports: [RouterModule]
})
export class CountyRoutingModule {}
