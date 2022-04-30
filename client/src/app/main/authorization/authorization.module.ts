import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthorizationComponent } from "./authorization.component";
import { AuthorizationSidebarComponent } from "./authorization-sidebar/authorization-sidebar.component";
import {
    AuthorizationListComponent,
    ConfirmRequestDialog
} from "./authorization-list/authorization-list.component";
import {
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatTableModule,
    MatGridListModule,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorIntl,
    MatTooltipModule
} from "@angular/material";
import { FuseSidebarModule } from "@fuse/components";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AlertsModule } from "../alerts/alerts.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { InternationalizationModule } from "app/internationalization/internationalization.module";
import { MatPaginatorIntlPtbrComponent } from "app/internationalization/mat-paginator-intl-ptbr/mat-paginator-intl-ptbr.component";

@NgModule({
    imports: [
        CommonModule,

        MatTabsModule,
        MatListModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatRippleModule,
        MatButtonModule,
        MatGridListModule,
        MatDialogModule,
        MatCardModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        FormsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatSortModule,
        FuseProgressBarModule,
        MatProgressSpinnerModule,
        FuseSidebarModule,
        FlexLayoutModule,

        AlertsModule
    ],

    declarations: [
        AuthorizationComponent,
        AuthorizationSidebarComponent,
        AuthorizationListComponent,

        ConfirmRequestDialog
    ],

    exports: [
        AuthorizationComponent,
        AuthorizationSidebarComponent,
        AuthorizationListComponent
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtbrComponent }
    ],
    entryComponents: [ConfirmRequestDialog]
})
export class AuthorizationModule {}
