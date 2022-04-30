import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlanningDatabaseService } from "app/main/plannings/planning-database/planning-database.service";

import { PlanningEditComponent } from "app/main/plannings/planning-database/planning-edit/planning-edit.component";
import { PlanningNewComponent } from "app/main/plannings/planning-database/planning-new/planning-new.component";
import { PlanningDatabaseModule } from "app/main/plannings/planning-database/planning-database.module";

import { PlanningViewComponent } from "app/main/plannings/planning-database/planning-view/planning-view.component";

import { PlanningsService } from "app/main/plannings/plannings.service";
import { PlanningCenterComponent } from "app/main/plannings/planning-database/planning-center.component";
import { PlanningCenterService } from "app/main/plannings/planning-database/planning-center.service";

const routes: Routes = [
    {
        path: "view/:id/:stepSlug/:version",
        component: PlanningViewComponent,
        resolve: {
            data: PlanningDatabaseService
        }
    },
    {
        path: "",
        component: PlanningCenterComponent,
        resolve: {
            data: PlanningCenterService
        }
    },
    {
        path: "new/:stepSlug",
        component: PlanningNewComponent,
        resolve: {
            data: PlanningDatabaseService
        }
    },
    {
        path: "edit/:id/:stepSlug/:version",
        component: PlanningEditComponent,
        resolve: {
            data: PlanningDatabaseService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), PlanningDatabaseModule],
    exports: [RouterModule]
})
export class PlanningDatabaseRoutingModule {}
