import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FrequencyModule } from "./frequency.module";
import { FrequencyComponent } from "./frequency.component";
import { RoleGuardService } from "../authentication/guards/role-guard.service";
import { FrequencyReportComponent } from "app/main/frequency/frequency-report/frequency-report.component";
import { FrequencyService } from "app/main/frequency/frequency.service";

const routes: Routes = [
    {
        path: "",
        component: FrequencyComponent
    },
    {
        path: ":classroomId/relatorio",
        component: FrequencyReportComponent,
        resolve: {
            frequency: FrequencyService
        }
    },
    {
        path: "**",
        loadChildren: "../errors/error404/error404.module#Error404Module"
    }
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes), FrequencyModule],
    exports: [RouterModule]
})
export class FrequencyRoutingModule {}
