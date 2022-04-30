import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PlanningDatabaseRoutingModule } from "./planning-database-routing.module";

import {
    PlanningListComponent,
    DialogOverviewExampleDialog as ShowHabilityDialog
} from "./planning-list/planning-list.component";
import { PlanningEditComponent } from "./planning-edit/planning-edit.component";
import { PlanningNewComponent } from "./planning-new/planning-new.component";
import { RouterModule } from "@angular/router";
import {
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatMenuModule
} from "@angular/material";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseSidebarModule } from "@fuse/components";
import { PlanningsModule } from "app/main/plannings/plannings.module";
import { SharedModule } from "app/main/shared-private/shared.module";
import { AgreementsModule } from "app/main/agreements/agreements.module";
import { PlanningViewComponent } from "./planning-view/planning-view.component";
import { PipesModule } from "app/pipes/pipes.module";
import { PlanningCenterComponent } from "app/main/plannings/planning-database/planning-center.component";

@NgModule({
    declarations: [
        PlanningCenterComponent,
        PlanningListComponent,
        PlanningEditComponent,
        PlanningNewComponent,
        PlanningViewComponent,
        ShowHabilityDialog
    ],
    imports: [
        PipesModule,
        RouterModule,
        MatCardModule,
        MatListModule,
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDividerModule,
        MatSelectModule,
        MatMenuModule,
        MatRadioModule,
        MatTabsModule,
        MatPaginatorModule,
        MatCheckboxModule,
        FuseSharedModule,
        FuseSidebarModule,
        SharedModule,
        PlanningsModule,
        AgreementsModule,
        MatIconModule,
        MatChipsModule,
        MatDialogModule
    ],
    entryComponents: [ShowHabilityDialog],
    exports: [ShowHabilityDialog]
})
export class PlanningDatabaseModule {}
