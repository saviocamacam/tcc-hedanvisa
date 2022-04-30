import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FuseSharedModule } from "@fuse/shared.module";

import { ContentComponent } from "./content.component";

@NgModule({
    declarations: [ContentComponent],
    imports: [RouterModule, FuseSharedModule],
    exports: [ContentComponent],
    providers: []
})
export class ContentModule {}
