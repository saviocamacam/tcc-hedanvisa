import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AuthorizationComponent } from "./authorization.component";
import { AuthorizationModule } from "./authorization.module";

const authorizationRoutes: Routes = [
    {
        path: "",
        component: AuthorizationComponent
    },
    {
        path: "**",
        loadChildren: "../errors/error404/error404.module#Error404Module"
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(authorizationRoutes),
        AuthorizationModule
    ],
    exports: [RouterModule]
})
export class AuthorizationRoutingModule {}
