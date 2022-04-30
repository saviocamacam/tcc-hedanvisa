import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { Routes, RouterModule } from "@angular/router";
import { HomeModule } from "./home.module";

const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    }
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes), HomeModule]
})
export class HomeRoutingModule {}
