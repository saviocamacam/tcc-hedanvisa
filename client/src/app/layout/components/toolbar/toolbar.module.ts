import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSelectModule,
    MatTooltipModule
} from "@angular/material";

import { FuseSearchBarModule, FuseShortcutsModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";

import { ToolbarComponent } from "./toolbar.component";
import { AuthService } from "../../../services/authentication.service";

@NgModule({
    declarations: [ToolbarComponent],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatSelectModule,
        MatTooltipModule,

        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports: [ToolbarComponent],
    providers: [AuthService]
})
export class ToolbarModule {}
