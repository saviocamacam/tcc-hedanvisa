import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PlanningsRoutingModule } from "./plannings-routing.module";
import { DaysComponent } from "./daily/sidebars/days/days.component";
import { DailyComponent } from "./daily/daily.component";
import { RouterModule } from "@angular/router";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseSidebarModule } from "@fuse/components";
import {
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatGridListModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatMenuModule,
    MatCheckboxModule,
    MatRippleModule
} from "@angular/material";
import { AttachmentsComponent } from "./daily/sidebars/attachments/attachments.component";
import { BnccComponent } from "./bncc/bncc.component";
import { PtdComponent } from "./ptd/ptd.component";
import { DocumentsModule } from "../documents/documents.module";

import { SubjectsModule } from "../subjects/subjects.module";
import { PipesModule } from "app/pipes/pipes.module";
import { AnnualComponent } from "./annual/annual.component";
import { AnnualSidebarComponent } from "./annual/annual-sidebar/annual-sidebar.component";
import { AnnualDetailComponent } from "./annual/annual-detail/annual-detail.component";
import { AnnualUploadComponent } from "./annual/annual-upload/annual-upload.component";
import { AlertsModule } from "../alerts/alerts.module";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { FormsModule } from "@angular/forms";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { SharedModule } from "app/main/shared-private/shared.module";
import { BnccListItemComponent } from "app/main/plannings/bncc/bncc-list/bncc-list-item/bncc-list-item.component";
import { BnccListComponent } from "app/main/plannings/bncc/bncc-list/bncc-list.component";
import { DescriptorsListComponent } from "./bncc/descriptors-list/descriptors-list.component";
import { DescriptorItemComponent } from "./bncc/descriptors-list/descriptor-item/descriptor-item.component";

@NgModule({
    declarations: [
        DaysComponent,
        DailyComponent,
        AttachmentsComponent,
        BnccComponent,
        BnccListComponent,
        BnccListItemComponent,
        PtdComponent,
        AnnualComponent,
        AnnualSidebarComponent,
        AnnualDetailComponent,
        AnnualUploadComponent,

        DaysComponent,
        DailyComponent,
        AttachmentsComponent,
        DescriptorsListComponent,
        DescriptorItemComponent
    ],
    entryComponents: [AnnualUploadComponent, DaysComponent],
    imports: [
        CommonModule,
        RouterModule,

        FuseSharedModule,
        FuseSidebarModule,
        MatIconModule,
        MatTabsModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatGridListModule,
        MatSnackBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatCardModule,
        MatListModule,
        MatDividerModule,
        MatToolbarModule,
        MatMenuModule,
        CommonModule,

        SharedModule,

        PipesModule,

        DocumentsModule,

        SubjectsModule,

        FuseProgressBarModule,
        FormsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatCheckboxModule,

        PdfViewerModule,

        AlertsModule
    ],
    exports: [
        BnccListComponent,
        BnccListItemComponent,
        DescriptorsListComponent,
        DescriptorItemComponent
    ]
})
export class PlanningsModule {}
