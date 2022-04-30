import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Error404Component } from "./error404.component";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material";
import { FuseSharedModule } from "@fuse/shared.module";

const routes = [
    {
        path: "",
        component: Error404Component
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ],
    declarations: [Error404Component]
})
export class Error404Module {}
