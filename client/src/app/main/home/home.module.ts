import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent, HomeChildrenOptionsComponent } from "./home.component";
import {
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatGridListModule,
    MatBottomSheetModule,
    MatListModule
} from "@angular/material";
import { FuseSharedModule } from "@fuse/shared.module";

@NgModule({
    declarations: [HomeComponent, HomeChildrenOptionsComponent],
    imports: [
        CommonModule,

        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatDividerModule,
        MatCardModule,
        MatGridListModule,
        MatDividerModule,
        MatBottomSheetModule,
        MatListModule,
        MatDividerModule,
        FuseSharedModule,
    ],
    exports: [HomeComponent],
    entryComponents: [HomeChildrenOptionsComponent]
})
export class HomeModule {}
