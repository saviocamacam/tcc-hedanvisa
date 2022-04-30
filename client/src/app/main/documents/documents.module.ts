import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DocumentsRoutingModule } from "./documents-routing.module";
import { DocumentsComponent } from "./documents.component";
import { DocumentCommentsComponent } from "./document-comments/document-comments.component";
import { SelectedFileContentComponent } from "./selected-file-content/selected-file-content.component";
import { SidebarDocumentsListComponent } from "./sidebar-documents-list/sidebar-documents-list.component";
import { UploadDocumentDialogComponent } from "./upload-document-dialog/upload-document-dialog.component";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseSidebarModule } from "@fuse/components";
import {
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule
} from "@angular/material";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { DocumentAttachmentsComponent } from "./document-attachments/document-attachments.component";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        DocumentsComponent,
        DocumentCommentsComponent,
        SelectedFileContentComponent,
        SidebarDocumentsListComponent,
        UploadDocumentDialogComponent,
        DocumentAttachmentsComponent
    ],
    imports: [
        CommonModule,

        DocumentsRoutingModule,
        FormsModule,

        FuseSharedModule,
        FuseSidebarModule,
        FuseProgressBarModule,

        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatDividerModule,
        MatDialogModule,
        MatCardModule,
        MatTooltipModule,

        PdfViewerModule
    ],
    exports: [
        DocumentsComponent,
        DocumentCommentsComponent,
        SelectedFileContentComponent,
        SidebarDocumentsListComponent,
        UploadDocumentDialogComponent,
        DocumentAttachmentsComponent
    ]
})
export class DocumentsModule {}
