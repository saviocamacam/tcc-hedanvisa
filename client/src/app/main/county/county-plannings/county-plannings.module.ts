import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountyAnnualPlanningComponent } from "./county-annual-planning/county-annual-planning.component";
import { CountyAnnualPlanningSidebarComponent } from "./county-annual-planning/county-annual-planning-sidebar/county-annual-planning-sidebar.component";
import { Routes, RouterModule } from "@angular/router";
import { CountyAnnualPlanningDetailComponent } from "./county-annual-planning/county-annual-planning-detail/county-annual-planning-detail.component";
import { FuseSidebarModule } from "@fuse/components";
import {
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatOptionModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule
} from "@angular/material";
import { FuseSharedModule } from "@fuse/shared.module";
import { CountyAnnualPlanningUploadComponent } from "./county-annual-planning/county-annual-planning-upload/county-annual-planning-upload.component";
import { FormsModule } from "@angular/forms";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { BnccComponent } from "../../plannings/bncc/bncc.component";
import { AlertsModule } from "app/main/alerts/alerts.module";

const routes: Routes = [
    {
        path: "anual",
        component: CountyAnnualPlanningComponent
    },
    {
        path: "bncc",
        component: BnccComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseSharedModule,
        FormsModule,
        MatInputModule,
        MatListModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatOptionModule,
        MatDialogModule,
        MatCardModule,

        PdfViewerModule,

        AlertsModule
    ],
    declarations: [
        CountyAnnualPlanningComponent,
        CountyAnnualPlanningSidebarComponent,
        CountyAnnualPlanningDetailComponent,
        CountyAnnualPlanningUploadComponent
    ],
    exports: [CountyAnnualPlanningComponent],
    entryComponents: [CountyAnnualPlanningUploadComponent]
})
export class CountyPlanningsModule {}
