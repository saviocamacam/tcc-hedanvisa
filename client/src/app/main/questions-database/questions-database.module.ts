import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { QuestionsCenterComponent } from "./questions-center/questions-center.component";
import { QuestionsNewComponent } from "./questions-new/questions-new.component";
import { QuestionsEditComponent } from "./questions-edit/questions-edit.component";
import {
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatPaginatorModule,
    MatChipsModule,
    MatCheckboxModule,
    MatListModule
} from "@angular/material";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseSidebarModule } from "@fuse/components";
import { RouterModule } from "@angular/router";
import { QuestionsListComponent } from "./questions-list/questions-list.component";
import { SharedModule } from "app/main/shared-private/shared.module";
import { PlanningsModule } from "app/main/plannings/plannings.module";
import { AgreementsModule } from "app/main/agreements/agreements.module";
import { QuestionsViewComponent } from "./questions-view/questions-view.component";
import { PlanningDatabaseModule } from "app/main/plannings/planning-database/planning-database.module";
import { AlertsModule } from "app/main/alerts/alerts.module";

@NgModule({
    declarations: [
        QuestionsCenterComponent,
        QuestionsNewComponent,
        QuestionsEditComponent,
        QuestionsListComponent,
        QuestionsViewComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatTabsModule,
        MatPaginatorModule,
        MatChipsModule,
        PlanningDatabaseModule,
        FuseSharedModule,
        FuseSidebarModule,
        MatCheckboxModule,
        AlertsModule,
        MatIconModule,
        // MatTabsModule,
        SharedModule,
        PlanningsModule,
        MatListModule,

        AgreementsModule
    ]
})
export class QuestionsDatabaseModule {}
