import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PtdComponent } from "./ptd/ptd.component";
import { PlanningsModule } from "./plannings.module";
import { AnnualComponent } from "./annual/annual.component";
import { BnccComponent } from "./bncc/bncc.component";
import { DailyComponent } from "./daily/daily.component";
import { SubjectsService } from "app/main/subjects/subjects.service";
import { PlanningsService } from "app/main/plannings/plannings.service";

const routes: Routes = [
    {
        path: "bncc",
        component: BnccComponent
    },
    {
        path: "anual",
        component: AnnualComponent
    },
    {
        path: "diario",
        component: DailyComponent,
        resolve: {
            daily: PlanningsService
        }
    },
    {
        path: "**",
        loadChildren: "../errors/error404/error404.module#Error404Module"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), PlanningsModule],
    exports: [RouterModule]
})
export class PlanningsRoutingModule {}
