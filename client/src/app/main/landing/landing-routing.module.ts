import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { LandingModule } from "./landing.module";

const routes: Routes = [
    {
        path: "",
        loadChildren: "./views/home/home.module#HomeModule"
        // component: LandingPageComponent
    }
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes), LandingModule],
    exports: [RouterModule]
})
export class LandingRoutingModule {}
