import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FaqComponent } from "app/main/help-center/faq/faq.component";
import { MatExpansionModule, MatIconModule } from "@angular/material";
import { FuseSharedModule } from "@fuse/shared.module";

@NgModule({
    declarations: [FaqComponent],
    imports: [CommonModule, MatExpansionModule, MatIconModule, FuseSharedModule]
})
export class HelpCenterModule {}
