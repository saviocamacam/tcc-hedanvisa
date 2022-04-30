import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfessorRoutingModule } from "./professor-routing.module";
import { ProfessorProfileViewComponent } from "./professor-profile-view/professor-profile-view.component";
import { ProfilePhotosVideosComponent } from "app/main/professor/professor-profile-view/tabs/photos-videos/photos-videos.component";
import { ProfileAboutComponent } from "app/main/professor/professor-profile-view/tabs/about/about.component";
import { ProfileTimelineComponent } from "app/main/professor/professor-profile-view/tabs/timeline/timeline.component";
import {
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatButtonModule
} from "@angular/material";
import { FuseSharedModule } from "@fuse/shared.module";

@NgModule({
    declarations: [
        ProfessorProfileViewComponent,
        ProfileTimelineComponent,
        ProfileAboutComponent,
        ProfilePhotosVideosComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,

        FuseSharedModule
    ]
})
export class ProfessorModule {}
