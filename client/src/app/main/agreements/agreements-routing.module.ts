import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgreementsModule } from "app/main/agreements/agreements.module";

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild(routes), AgreementsModule],
    exports: [RouterModule]
})
export class AgreementsRoutingModule {}
