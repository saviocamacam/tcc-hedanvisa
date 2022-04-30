import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import {
    MatIconModule,
    MatListModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatToolbarModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatButtonModule,
    MatGridListModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatCardModule,
    MatLineModule,
    MatDividerModule,
    MatStepperModule
} from "@angular/material";
import { MatSortModule } from "@angular/material/sort";
import {
    FuseSidebarModule,
    FuseConfirmDialogModule
} from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";

import { SettingsComponent } from "./settings.component";
import {
    AccountComponent,
    ConfirmEmailDialog
} from "./account/account.component";
import { PersonalComponent } from "./personal/personal.component";
import { AddressComponent } from "./address/address.component";
import { CdkTableModule } from "@angular/cdk/table";
import { MainSidebarComponent } from "./_sidebars/main-sidebar/main-sidebar.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { ProfilesModule } from "./profiles/profiles.module";
import { SignatureComponent } from "./signature/signature.component";
import { BrMaskerModule } from "br-mask";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";
import { AlertsModule } from "../alerts/alerts.module";

const settingsRoutes: Routes = [
    {
        path: "usuario",
        component: SettingsComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(settingsRoutes),

        ProfilesModule,

        FuseSidebarModule,
        FuseSharedModule,

        MatIconModule,
        MatListModule,
        MatOptionModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        CdkTableModule,
        MatMenuModule,
        MatToolbarModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatSortModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatButtonModule,
        MatGridListModule,
        MatDatepickerModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatCardModule,
        MatLineModule,
        MatDividerModule,
        MatStepperModule,
        FuseSharedModule,
        FuseProgressBarModule,

        BrMaskerModule,

        AlertsModule
    ],
    declarations: [
        SettingsComponent,
        AccountComponent,
        PersonalComponent,
        AddressComponent,
        MainSidebarComponent,
        SignatureComponent,

        ConfirmEmailDialog
    ],
    exports: [],
    entryComponents: [ConfirmEmailDialog],
    providers: []
})
export class SettingsModule {}
