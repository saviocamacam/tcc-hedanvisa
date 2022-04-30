import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DocumentsComponent } from "./documents/documents.component";
import { UploadDocumentDialogComponent } from "./documents/upload-document-dialog/upload-document-dialog.component";
import { SelectedFileContentComponent } from "./documents/selected-file-content/selected-file-content.component";
import { SidebarDocumentsListComponent } from "./documents/sidebar-documents-list/sidebar-documents-list.component";
import { FuseSidebarModule } from "@fuse/components";
import { MatExpansionModule } from "@angular/material";
import {
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatGridListModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule
} from "@angular/material";
import { TextEditorComponent } from "./text-editor/text-editor.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { DocumentCommentsComponent } from "./document-comments/document-comments.component";
import { DocumentAttachmentsComponent } from "./document-attachments/document-attachments.component";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { ConfirmDeleteDialogComponent } from "app/main/shared-private/confirm-delete-dialog/confirm-delete-dialog.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FuseSidebarModule,
        FuseProgressBarModule,

        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatSelectModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatInputModule,
        MatDialogModule,
        MatGridListModule,
        MatTooltipModule,
        MatCardModule,
        MatDividerModule,

        PdfViewerModule,
        EditorModule
    ],
    declarations: [
        DocumentsComponent,
        UploadDocumentDialogComponent,
        SelectedFileContentComponent,
        SidebarDocumentsListComponent,
        TextEditorComponent,
        DocumentCommentsComponent,
        DocumentAttachmentsComponent,
        ConfirmDeleteDialogComponent
    ],
    exports: [
        TextEditorComponent,
        DocumentCommentsComponent,
        DocumentAttachmentsComponent,
        DocumentsComponent,
        ConfirmDeleteDialogComponent
    ],
    entryComponents: [
        UploadDocumentDialogComponent,
        ConfirmDeleteDialogComponent
    ]
})
export class SharedModule {}
