import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AgreementsRoutingModule } from "./agreements-routing.module";
import { CreatingRestrictionsComponent } from "./creating-restrictions/creating-restrictions.component";
import { MatCheckboxModule, MatIconModule } from "@angular/material";
import { ContentBlockedComponent } from "./content-blocked/content-blocked.component";
import { RouterModule } from "@angular/router";
import { FuseSharedModule } from "@fuse/shared.module";

@NgModule({
    declarations: [CreatingRestrictionsComponent, ContentBlockedComponent],
    imports: [
        CommonModule,
        MatCheckboxModule,
        MatIconModule,
        RouterModule,
        FuseSharedModule
    ],
    exports: [CreatingRestrictionsComponent, ContentBlockedComponent]
})
export class AgreementsModule {}
